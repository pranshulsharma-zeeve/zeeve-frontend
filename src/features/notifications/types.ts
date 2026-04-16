export type NotificationCategory = "info" | "success" | "warning" | "error";

export interface NotificationPayload {
  id?: number;
  type?: string;
  category: NotificationCategory;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
  action_url?: string;
  is_read: boolean;
  read_at: string | false;
  created_at: string | false;
  expires_at: string | false;
  reference_model?: string;
  reference_id?: number | false;
}

export interface NotificationEntity extends NotificationPayload {
  storeKey: string;
  receivedAt: string;
}

export interface NotificationsBootstrapData {
  websocket_url: string;
  websocket_worker_version?: string;
  last_bus_id?: number;
  subscribe_payload: {
    event_name: string;
    data: {
      channels: unknown[];
      last: number;
    };
  };
  session_authenticated: boolean;
}

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface FetchNotificationsParams {
  unread_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface FetchNotificationsData {
  notifications: NotificationPayload[];
  unread_count: number;
  last_bus_id?: number;
}

export interface MarkReadData {
  updated_ids: number[];
  unread_count: number;
}

export interface BusEnvelopeItem {
  message?: {
    type?: string;
    payload?: NotificationPayload;
  };
}

export interface NotificationsProviderContextValue {
  bootstrapAndConnect: (options?: { resetState?: boolean }) => Promise<void>;
  refreshUnread: (options?: { silent?: boolean }) => Promise<void>;
  markNotificationRead: (notificationId: number, options?: { closeDrawer?: boolean }) => Promise<void>;
  markNotificationsRead: (notificationIds: number[]) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}
