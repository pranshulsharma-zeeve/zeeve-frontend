"use client";

import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useToast } from "@zeeve-platform/ui";
import NotificationDrawer from "./NotificationDrawer";
import { useNotificationStore } from "./store";
import {
  BusEnvelopeItem,
  NotificationPayload,
  NotificationsBootstrapData,
  NotificationsProviderContextValue,
} from "./types";
import { normalizeNotification } from "./utils";
import {
  fetchNotifications,
  fetchNotificationsBootstrap,
  markAllNotificationsRead,
  markNotificationsRead,
} from "./api";
import useAxios from "@/hooks/use-axios";
import { getStoredAccessToken, onAccessTokenChange } from "@/utils/auth-token";

const RECONNECT_BASE_DELAY_MS = 1_000;
const RECONNECT_MAX_DELAY_MS = 30_000;
const UNREAD_FETCH_LIMIT = 50;

export const NotificationsProviderContext = createContext<NotificationsProviderContextValue | null>(null);

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
};

const parseLiveNotificationPayloads = (rawMessage: string): NotificationPayload[] => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawMessage);
  } catch {
    return [];
  }

  const candidateEntries = (() => {
    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (!parsed || typeof parsed !== "object") {
      return [parsed];
    }

    const record = parsed as Record<string, unknown>;

    if (Array.isArray(record.result)) {
      return record.result;
    }

    if (Array.isArray(record.data)) {
      return record.data;
    }

    if (Array.isArray(record.payload)) {
      return record.payload;
    }

    return [parsed];
  })();

  return candidateEntries
    .flatMap((entry) => {
      if (!entry || typeof entry !== "object") {
        return [];
      }

      const item = entry as BusEnvelopeItem & {
        type?: string;
        payload?: unknown;
        data?: unknown;
      };

      if (item.message?.type === "zeeve.notification" && item.message.payload) {
        return [item.message.payload];
      }

      if (item.type === "zeeve.notification" && item.payload && typeof item.payload === "object") {
        return [item.payload as NotificationPayload];
      }

      if (item.type === "notification" && Array.isArray(item.data)) {
        return item.data.flatMap((nestedEntry) => {
          if (!nestedEntry || typeof nestedEntry !== "object") {
            return [];
          }

          const nestedItem = nestedEntry as BusEnvelopeItem;
          if (nestedItem.message?.type === "zeeve.notification" && nestedItem.message.payload) {
            return [nestedItem.message.payload];
          }

          return [];
        });
      }

      if ("title" in item && "message" in item) {
        return [item as NotificationPayload];
      }

      return [];
    })
    .filter((notification): notification is NotificationPayload => Boolean(notification?.title));
};

const NotificationProvider = ({ children }: React.PropsWithChildren) => {
  const { backendAxiosInstance } = useAxios();
  const toast = useToast();

  const reset = useNotificationStore((state) => state.reset);
  const setBootstrapping = useNotificationStore((state) => state.setBootstrapping);
  const setRefreshing = useNotificationStore((state) => state.setRefreshing);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const setLastBusId = useNotificationStore((state) => state.setLastBusId);
  const setConnectionStatus = useNotificationStore((state) => state.setConnectionStatus);
  const setLastError = useNotificationStore((state) => state.setLastError);
  const upsertNotifications = useNotificationStore((state) => state.upsertNotifications);
  const markReadLocally = useNotificationStore((state) => state.markReadLocally);
  const markUnreadLocally = useNotificationStore((state) => state.markUnreadLocally);
  const setDrawerOpen = useNotificationStore((state) => state.setDrawerOpen);

  const [token, setToken] = useState<string | null>(() => getStoredAccessToken());
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const destroyedRef = useRef(false);
  const connectingRef = useRef(false);
  const bootstrapAndConnectRef = useRef<(options?: { resetState?: boolean }) => Promise<void>>(async () => {});

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const closeSocket = useCallback(() => {
    const current = socketRef.current;
    socketRef.current = null;

    if (current) {
      current.onopen = null;
      current.onmessage = null;
      current.onerror = null;
      current.onclose = null;
      current.close();
    }
  }, []);

  const refreshUnread = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      if (!token) {
        return;
      }

      if (!silent) {
        setRefreshing(true);
      }

      try {
        const response = await fetchNotifications(backendAxiosInstance, {
          unread_only: true,
          limit: UNREAD_FETCH_LIMIT,
          offset: 0,
        });

        if (!response.success) {
          throw new Error("Unread notifications fetch failed");
        }

        const notifications = response.data.notifications.map((item) => normalizeNotification(item));
        upsertNotifications(notifications);
        setUnreadCount(response.data.unread_count ?? notifications.filter((item) => !item.is_read).length);
        if (typeof response.data.last_bus_id === "number") {
          setLastBusId(response.data.last_bus_id);
        }
        setLastError(null);
      } catch (error) {
        setLastError(getErrorMessage(error));
      } finally {
        if (!silent) {
          setRefreshing(false);
        }
      }
    },
    [backendAxiosInstance, setLastBusId, setLastError, setRefreshing, setUnreadCount, token, upsertNotifications],
  );

  const bootstrapSocket = useCallback(async () => {
    const response = await fetchNotificationsBootstrap(backendAxiosInstance);

    if (!response.success || !response.data.websocket_url || !response.data.subscribe_payload) {
      throw new Error("Notifications websocket bootstrap returned an invalid response");
    }

    if (typeof response.data.last_bus_id === "number") {
      setLastBusId(response.data.last_bus_id);
    }
    return response.data;
  }, [backendAxiosInstance, setLastBusId]);

  const scheduleReconnect = useCallback(() => {
    if (!token || destroyedRef.current) {
      return;
    }

    clearReconnectTimer();
    reconnectAttemptRef.current += 1;
    const delay = Math.min(RECONNECT_BASE_DELAY_MS * 2 ** (reconnectAttemptRef.current - 1), RECONNECT_MAX_DELAY_MS);
    reconnectTimeoutRef.current = setTimeout(() => {
      void bootstrapAndConnectRef.current({ resetState: false });
    }, delay);
  }, [clearReconnectTimer, token]);

  const handleLiveNotification = useCallback(
    (notification: NotificationPayload) => {
      const existing = (() => {
        const normalized = normalizeNotification(notification);
        return useNotificationStore.getState().notificationsByKey[normalized.storeKey];
      })();

      const normalized = normalizeNotification(notification);
      upsertNotifications([normalized]);

      if (!normalized.is_read) {
        const nextUnreadCount =
          typeof normalized.id === "number" && existing && !existing.is_read
            ? useNotificationStore.getState().unreadCount
            : useNotificationStore.getState().unreadCount + (existing && !existing.is_read ? 0 : 1);

        setUnreadCount(nextUnreadCount);
      }

      if (!existing) {
        toast(normalized.title, {
          status: normalized.category,
          message: normalized.message,
        });
      }
    },
    [setUnreadCount, toast, upsertNotifications],
  );

  const connectSocket = useCallback(
    async (bootstrapData: NotificationsBootstrapData) => {
      if (destroyedRef.current || !token) {
        return;
      }

      closeSocket();
      setConnectionStatus("connecting");

      const socket = new WebSocket(bootstrapData.websocket_url);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptRef.current = 0;
        setConnectionStatus("connected");
        setLastError(null);
        socket.send(JSON.stringify(bootstrapData.subscribe_payload));
      };

      socket.onmessage = (event) => {
        const liveNotifications = parseLiveNotificationPayloads(event.data);
        if (!liveNotifications.length) {
          return;
        }

        for (const notification of liveNotifications) {
          handleLiveNotification(notification);
        }
      };

      socket.onerror = () => {
        setConnectionStatus("error");
        setLastError("Notifications websocket connection failed");
      };

      socket.onclose = () => {
        if (destroyedRef.current) {
          return;
        }

        setConnectionStatus("disconnected");
        void refreshUnread({ silent: true });
        scheduleReconnect();
      };
    },
    [closeSocket, handleLiveNotification, refreshUnread, scheduleReconnect, setConnectionStatus, setLastError, token],
  );

  const bootstrapAndConnect = useCallback(
    async (options?: { resetState?: boolean }) => {
      if (!token || connectingRef.current) {
        return;
      }

      connectingRef.current = true;
      clearReconnectTimer();

      if (options?.resetState) {
        reset();
      }

      setBootstrapping(true);
      setConnectionStatus("connecting");

      try {
        const bootstrapData = await bootstrapSocket();
        await refreshUnread({ silent: false });
        await connectSocket(bootstrapData);
      } catch (error) {
        setConnectionStatus("error");
        setLastError(getErrorMessage(error));
        scheduleReconnect();
      } finally {
        setBootstrapping(false);
        connectingRef.current = false;
      }
    },
    [
      bootstrapSocket,
      clearReconnectTimer,
      connectSocket,
      refreshUnread,
      reset,
      scheduleReconnect,
      setBootstrapping,
      setConnectionStatus,
      setLastError,
      token,
    ],
  );

  const markNotificationRead = useCallback(
    async (notificationId: number, options?: { closeDrawer?: boolean }) => {
      const notificationsByKey = useNotificationStore.getState().notificationsByKey;
      const target = Object.values(notificationsByKey).find((item) => item.id === notificationId);
      if (!target) {
        return;
      }

      const targetKey = target.storeKey;
      markReadLocally([targetKey]);
      if (options?.closeDrawer) {
        setDrawerOpen(false);
      }

      try {
        const response = await markNotificationsRead(backendAxiosInstance, [notificationId]);
        if (!response.success) {
          throw new Error("Mark read failed");
        }
        setUnreadCount(response.data.unread_count);
        setLastError(null);
      } catch (error) {
        markUnreadLocally([targetKey]);
        setLastError(getErrorMessage(error));
      }
    },
    [backendAxiosInstance, markReadLocally, markUnreadLocally, setDrawerOpen, setLastError, setUnreadCount],
  );

  const markNotificationsReadBatch = useCallback(
    async (notificationIds: number[]) => {
      if (!notificationIds.length) {
        return;
      }

      const currentNotifications = useNotificationStore.getState().notificationsByKey;
      const targetKeys = Object.values(currentNotifications)
        .filter((item) => typeof item.id === "number" && notificationIds.includes(item.id))
        .map((item) => item.storeKey);

      markReadLocally(targetKeys);

      try {
        const response = await markNotificationsRead(backendAxiosInstance, notificationIds);
        if (!response.success) {
          throw new Error("Mark read failed");
        }
        setUnreadCount(response.data.unread_count);
        setLastError(null);
      } catch (error) {
        markUnreadLocally(targetKeys);
        setLastError(getErrorMessage(error));
      }
    },
    [backendAxiosInstance, markReadLocally, markUnreadLocally, setLastError, setUnreadCount],
  );

  const markAllRead = useCallback(async () => {
    const previousUnreadKeys = useNotificationStore.getState().markAllReadLocally();

    try {
      const response = await markAllNotificationsRead(backendAxiosInstance);
      if (!response.success) {
        throw new Error("Mark all notifications read failed");
      }
      setUnreadCount(response.data.unread_count);
      setLastError(null);
    } catch (error) {
      markUnreadLocally(previousUnreadKeys);
      setLastError(getErrorMessage(error));
    }
  }, [backendAxiosInstance, markUnreadLocally, setLastError, setUnreadCount]);

  useEffect(() => {
    bootstrapAndConnectRef.current = bootstrapAndConnect;
  }, [bootstrapAndConnect]);

  useEffect(() => {
    destroyedRef.current = false;
    const unsubscribe = onAccessTokenChange((nextToken) => {
      setToken(nextToken);
    });

    return () => {
      destroyedRef.current = true;
      unsubscribe();
      clearReconnectTimer();
      closeSocket();
    };
  }, [clearReconnectTimer, closeSocket]);

  useEffect(() => {
    if (!token) {
      clearReconnectTimer();
      closeSocket();
      reconnectAttemptRef.current = 0;
      reset();
      return;
    }

    void bootstrapAndConnect({ resetState: true });
  }, [bootstrapAndConnect, clearReconnectTimer, closeSocket, reset, token]);

  const contextValue = useMemo<NotificationsProviderContextValue>(() => {
    return {
      bootstrapAndConnect,
      refreshUnread,
      markNotificationRead,
      markNotificationsRead: markNotificationsReadBatch,
      markAllNotificationsRead: markAllRead,
    };
  }, [bootstrapAndConnect, markAllRead, markNotificationRead, markNotificationsReadBatch, refreshUnread]);

  return (
    <NotificationsProviderContext.Provider value={contextValue}>
      {children}
      <NotificationDrawer />
    </NotificationsProviderContext.Provider>
  );
};

export default NotificationProvider;
