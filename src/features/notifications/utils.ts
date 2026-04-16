import { NotificationEntity, NotificationPayload } from "./types";

const FALLBACK_SEPARATOR = "::";

const sanitizeText = (value: string | undefined | null) => {
  return (value ?? "").trim().toLowerCase();
};

const coerceCreatedAt = (value: string | false | undefined, fallback: string) => {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};

export const buildNotificationStoreKey = (notification: Partial<NotificationPayload>) => {
  if (typeof notification.id === "number") {
    return `id:${notification.id}`;
  }

  return [
    "fallback",
    sanitizeText(notification.type),
    sanitizeText(notification.title),
    sanitizeText(notification.message),
    sanitizeText(notification.reference_model),
    notification.reference_id ?? "",
    notification.created_at || "",
    notification.action_url || "",
  ].join(FALLBACK_SEPARATOR);
};

export const normalizeNotification = (
  notification: NotificationPayload,
  options?: { receivedAt?: string },
): NotificationEntity => {
  const receivedAt = options?.receivedAt ?? new Date().toISOString();

  return {
    ...notification,
    is_read: Boolean(notification.is_read),
    category: notification.category ?? "info",
    payload: notification.payload ?? {},
    title: notification.title ?? "Notification",
    message: notification.message ?? "",
    storeKey: buildNotificationStoreKey(notification),
    created_at: coerceCreatedAt(notification.created_at, receivedAt),
    receivedAt,
  };
};

export const sortNotificationEntities = (notifications: NotificationEntity[]) => {
  return [...notifications].sort((left, right) => {
    const rightTime = Date.parse(right.created_at || right.receivedAt) || 0;
    const leftTime = Date.parse(left.created_at || left.receivedAt) || 0;

    if (rightTime !== leftTime) {
      return rightTime - leftTime;
    }

    if (typeof left.id === "number" && typeof right.id === "number" && right.id !== left.id) {
      return right.id - left.id;
    }

    return right.receivedAt.localeCompare(left.receivedAt);
  });
};

export const formatNotificationDateTime = (timestamp: string | false) => {
  if (!timestamp) {
    return "Just now";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60_000);

  if (Math.abs(diffMinutes) < 1) {
    return "Just now";
  }

  if (Math.abs(diffMinutes) < 60) {
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return formatter.format(-diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return formatter.format(-diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) {
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return formatter.format(-diffDays, "day");
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const resolveNotificationHref = (actionUrl?: string) => {
  if (!actionUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(actionUrl)) {
    return actionUrl;
  }

  if (!actionUrl.startsWith("/")) {
    return `/${actionUrl}`;
  }

  return actionUrl;
};
