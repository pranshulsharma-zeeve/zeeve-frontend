"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Heading,
  SideDrawer,
  SideDrawerBody,
  SideDrawerCloseButton,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerOverlay,
  SideDrawerTitle,
  Spinner,
  tx,
} from "@zeeve-platform/ui";
import {
  IconCheckCircle,
  IconExclamationTriangle,
  IconInfoCircle,
  IconXMarkCircle,
} from "@zeeve-platform/icons/essential/outline";
import { NotificationEntity } from "./types";
import { formatNotificationDateTime } from "./utils";
import { useNotifications } from "./useNotifications";

const categoryIconMap = {
  info: <IconInfoCircle className="text-lg text-brand-primary" />,
  success: <IconCheckCircle className="text-lg text-brand-green" />,
  warning: <IconExclamationTriangle className="text-lg text-brand-yellow" />,
  error: <IconXMarkCircle className="text-lg text-brand-red" />,
} as const;

const NotificationCard = ({
  notification,
  onClick,
  isLoading,
}: {
  notification: NotificationEntity;
  onClick: (notification: NotificationEntity) => void;
  isLoading: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={tx(
        "flex w-full items-start gap-3 border-b border-slate-200 px-5 py-4 text-left transition hover:bg-slate-50",
        !notification.is_read ? "bg-brand-primary/[0.04]" : "bg-white",
        isLoading ? "cursor-wait opacity-75" : "",
      )}
      disabled={isLoading}
    >
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        {categoryIconMap[notification.category]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Heading as="h6" className="truncate text-sm font-semibold text-slate-900">
                {notification.title}
              </Heading>
              {!notification.is_read ? <span className="size-2.5 shrink-0 rounded-full bg-brand-primary" /> : null}
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-600">
              {notification.message}
            </p>
          </div>
          <p className="shrink-0 text-xs font-medium text-slate-400">
            {formatNotificationDateTime(notification.created_at)}
          </p>
        </div>
      </div>
    </button>
  );
};

const NotificationDrawer = () => {
  const {
    notifications,
    isDrawerOpen,
    closeDrawer,
    markAllNotificationsRead,
    markNotificationRead,
    isRefreshing,
    lastError,
  } = useNotifications();
  const [isMarkAllLoading, setIsMarkAllLoading] = useState(false);
  const [pendingNotificationId, setPendingNotificationId] = useState<number | null>(null);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications]);
  const shouldShowSyncWarning = Boolean(lastError && notifications.length > 0);

  const handleNotificationClick = async (notification: NotificationEntity) => {
    try {
      if (typeof notification.id === "number" && !notification.is_read) {
        setPendingNotificationId(notification.id);
        await markNotificationRead(notification.id);
      }
    } finally {
      setPendingNotificationId(null);
    }
  };

  const handleMarkAll = async () => {
    try {
      setIsMarkAllLoading(true);
      await markAllNotificationsRead();
    } finally {
      setIsMarkAllLoading(false);
    }
  };

  return (
    <SideDrawer isOpen={isDrawerOpen} handleClose={closeDrawer} placement="right">
      <SideDrawerOverlay className="z-[140] bg-slate-950/20 backdrop-blur-[1px]" />
      <SideDrawerContent
        sideDrawerContainerProps={{
          className: "z-[150]",
        }}
        className="z-[150] w-full max-w-full overflow-hidden border-l border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:max-w-[440px]"
        focusLockProps={{
          disabled: true,
        }}
      >
        <SideDrawerHeader className="border-b  border-slate-200 bg-transparent px-4 pb-5 pt-7 sm:px-5 sm:pt-8">
          <div className="flex min-w-0  flex-1 flex-col gap-4">
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="min-w-0">
                <SideDrawerTitle className="text-xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-[22px]">
                  Notifications
                </SideDrawerTitle>
              </div>
              <SideDrawerCloseButton
                className="rounded-full border border-slate-200 bg-white/90 text-xl shadow-sm transition hover:border-slate-600 hover:bg-slate-100"
                onClick={closeDrawer}
              />
            </div>
          </div>
        </SideDrawerHeader>
        <SideDrawerBody className="flex min-h-0 flex-col bg-transparent p-0">
          {shouldShowSyncWarning ? (
            <div className="border-b border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-800 backdrop-blur sm:px-5">
              Live sync is temporarily degraded. Existing notifications remain available.
            </div>
          ) : (
            <div className="flex items-center justify-end pt-1">
              <Button
                variant="ghost"
                colorScheme="dark"
                size="small"
                onClick={handleMarkAll}
                isDisabled={unreadCount === 0 || isMarkAllLoading}
                className="h-9 shrink-0 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                {isMarkAllLoading ? "Marking..." : "Mark All Read"}
              </Button>
            </div>
          )}
          {isRefreshing && notifications.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Spinner />
            </div>
          ) : notifications.length ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.storeKey}
                notification={notification}
                onClick={handleNotificationClick}
                isLoading={pendingNotificationId === notification.id}
              />
            ))
          ) : (
            <div className="flex min-h-[calc(100vh-160px)] flex-1 items-center justify-center px-4 py-10 sm:min-h-[320px] sm:px-6">
              <div className="w-full max-w-sm rounded-[28px] border border-white/70 bg-white/85 px-6 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(79,70,229,0.14),rgba(14,165,233,0.12))] text-brand-primary shadow-inner sm:size-[72px]">
                  <IconInfoCircle className="text-xl sm:text-2xl" />
                </div>
                <div className="mx-auto mt-4 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Inbox Clear
                </div>
                <Heading as="h6" className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-slate-900">
                  No Notifications Yet
                </Heading>
                <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-slate-500">
                  New Updates from your Services, Deployments, and Account Activity will show up here in real time.
                </p>
              </div>
            </div>
          )}
        </SideDrawerBody>
      </SideDrawerContent>
    </SideDrawer>
  );
};

export default NotificationDrawer;
