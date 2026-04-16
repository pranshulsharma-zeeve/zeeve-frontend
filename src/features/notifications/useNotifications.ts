"use client";

import { useContext, useMemo } from "react";
import { useNotificationStore } from "./store";
import { NotificationsProviderContext } from "./NotificationProvider";

export const useNotifications = () => {
  const providerContext = useContext(NotificationsProviderContext);

  if (!providerContext) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  const notificationsByKey = useNotificationStore((state) => state.notificationsByKey);
  const orderedKeys = useNotificationStore((state) => state.orderedKeys);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const isDrawerOpen = useNotificationStore((state) => state.isDrawerOpen);
  const isBootstrapping = useNotificationStore((state) => state.isBootstrapping);
  const isRefreshing = useNotificationStore((state) => state.isRefreshing);
  const connectionStatus = useNotificationStore((state) => state.connectionStatus);
  const lastError = useNotificationStore((state) => state.lastError);
  const setDrawerOpen = useNotificationStore((state) => state.setDrawerOpen);

  const notifications = useMemo(() => {
    return orderedKeys.map((key) => notificationsByKey[key]).filter(Boolean);
  }, [notificationsByKey, orderedKeys]);

  return {
    notifications,
    unreadCount,
    isDrawerOpen,
    isBootstrapping,
    isRefreshing,
    connectionStatus,
    lastError,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    ...providerContext,
  };
};
