"use client";

import React from "react";
import { IconNotificationBell2 } from "@zeeve-platform/icons/notification/outline";
import { IconButton, tx } from "@zeeve-platform/ui";
import { useNotifications } from "./useNotifications";

interface NotificationBellProps {
  className?: string;
}

const NotificationBell = ({ className }: NotificationBellProps) => {
  const { unreadCount, openDrawer } = useNotifications();
  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <IconButton
      variant="text"
      colorScheme="dark"
      className={tx("relative h-10 w-10 rounded-full text-slate-700 hover:bg-slate-100", className)}
      onClick={openDrawer}
      isRounded
      aria-label="Open notifications"
      title="Notifications"
    >
      <IconNotificationBell2 className="text-2xl" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1.5 text-[10px] font-semibold leading-none text-white shadow-sm">
          {badgeLabel}
        </span>
      ) : null}
    </IconButton>
  );
};

export default NotificationBell;
