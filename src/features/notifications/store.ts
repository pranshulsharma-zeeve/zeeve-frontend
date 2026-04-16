import { create } from "zustand";
import { NotificationEntity } from "./types";
import { sortNotificationEntities } from "./utils";

type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface NotificationsState {
  notificationsByKey: Record<string, NotificationEntity>;
  orderedKeys: string[];
  unreadCount: number;
  isDrawerOpen: boolean;
  isBootstrapping: boolean;
  isRefreshing: boolean;
  lastBusId: number | null;
  connectionStatus: ConnectionStatus;
  lastError: string | null;
}

interface NotificationsActions {
  reset: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setUnreadCount: (count: number) => void;
  setBootstrapping: (value: boolean) => void;
  setRefreshing: (value: boolean) => void;
  setLastBusId: (lastBusId: number | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setLastError: (message: string | null) => void;
  upsertNotifications: (notifications: NotificationEntity[]) => void;
  markReadLocally: (notificationKeys: string[]) => void;
  markUnreadLocally: (notificationKeys: string[]) => void;
  markAllReadLocally: () => string[];
}

const initialState: NotificationsState = {
  notificationsByKey: {},
  orderedKeys: [],
  unreadCount: 0,
  isDrawerOpen: false,
  isBootstrapping: false,
  isRefreshing: false,
  lastBusId: null,
  connectionStatus: "idle",
  lastError: null,
};

const orderNotifications = (notificationsByKey: Record<string, NotificationEntity>) => {
  return sortNotificationEntities(Object.values(notificationsByKey)).map((item) => item.storeKey);
};

export const useNotificationStore = create<NotificationsState & NotificationsActions>((set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  setUnreadCount: (unreadCount) => set({ unreadCount: Math.max(unreadCount, 0) }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
  setLastBusId: (lastBusId) => set({ lastBusId }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setLastError: (lastError) => set({ lastError }),
  upsertNotifications: (notifications) =>
    set((state) => {
      if (!notifications.length) {
        return state;
      }

      const notificationsByKey = { ...state.notificationsByKey };

      for (const notification of notifications) {
        const existing = notificationsByKey[notification.storeKey];
        notificationsByKey[notification.storeKey] = {
          ...existing,
          ...notification,
          payload: notification.payload ?? existing?.payload ?? {},
          is_read: notification.is_read,
          receivedAt: existing?.receivedAt ?? notification.receivedAt,
        };
      }

      return {
        notificationsByKey,
        orderedKeys: orderNotifications(notificationsByKey),
      };
    }),
  markReadLocally: (notificationKeys) =>
    set((state) => {
      if (!notificationKeys.length) {
        return state;
      }

      let unreadDelta = 0;
      const notificationsByKey = { ...state.notificationsByKey };

      for (const key of notificationKeys) {
        const current = notificationsByKey[key];
        if (!current || current.is_read) {
          continue;
        }

        unreadDelta += 1;
        notificationsByKey[key] = {
          ...current,
          is_read: true,
          read_at: current.read_at || new Date().toISOString(),
        };
      }

      return {
        notificationsByKey,
        unreadCount: Math.max(state.unreadCount - unreadDelta, 0),
      };
    }),
  markUnreadLocally: (notificationKeys) =>
    set((state) => {
      if (!notificationKeys.length) {
        return state;
      }

      let unreadDelta = 0;
      const notificationsByKey = { ...state.notificationsByKey };

      for (const key of notificationKeys) {
        const current = notificationsByKey[key];
        if (!current || !current.is_read) {
          continue;
        }

        unreadDelta += 1;
        notificationsByKey[key] = {
          ...current,
          is_read: false,
          read_at: false,
        };
      }

      return {
        notificationsByKey,
        unreadCount: state.unreadCount + unreadDelta,
      };
    }),
  markAllReadLocally: () => {
    const state = get();
    const unreadKeys = state.orderedKeys.filter((key) => !state.notificationsByKey[key]?.is_read);
    set((currentState) => {
      const notificationsByKey = { ...currentState.notificationsByKey };

      for (const key of unreadKeys) {
        const current = notificationsByKey[key];
        if (!current) {
          continue;
        }
        notificationsByKey[key] = {
          ...current,
          is_read: true,
          read_at: current.read_at || new Date().toISOString(),
        };
      }

      return {
        notificationsByKey,
        unreadCount: 0,
      };
    });

    return unreadKeys;
  },
}));
