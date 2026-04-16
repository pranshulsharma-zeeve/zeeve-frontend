import { useNotificationStore } from "@/features/notifications/store";
import { NotificationEntity } from "@/features/notifications/types";

const buildNotification = (overrides: Partial<NotificationEntity> = {}): NotificationEntity => ({
  id: 1,
  type: "alert",
  category: "warning",
  title: "Node alert",
  message: "Latency high",
  payload: {},
  action_url: "/alerts",
  is_read: false,
  read_at: false,
  created_at: "2026-01-10T12:00:00.000Z",
  expires_at: false,
  reference_model: "node",
  reference_id: 8,
  storeKey: "id:1",
  receivedAt: "2026-01-10T12:00:05.000Z",
  ...overrides,
});

describe("notification store", () => {
  beforeEach(() => {
    useNotificationStore.getState().reset();
  });

  it("upserts notifications and keeps payload from existing entry when incoming payload is undefined", () => {
    const first = buildNotification({ payload: { region: "us-east" } });
    useNotificationStore.getState().upsertNotifications([first]);

    const updated = buildNotification({
      message: "Latency resolved",
      payload: undefined,
      created_at: "2026-01-10T12:05:00.000Z",
    });
    useNotificationStore.getState().upsertNotifications([updated]);

    const state = useNotificationStore.getState();
    expect(state.orderedKeys).toEqual(["id:1"]);
    expect(state.notificationsByKey["id:1"].message).toBe("Latency resolved");
    expect(state.notificationsByKey["id:1"].payload).toEqual({ region: "us-east" });
  });

  it("marks notifications read/unread locally with bounded unread count", () => {
    useNotificationStore.getState().setUnreadCount(1);
    useNotificationStore.getState().upsertNotifications([
      buildNotification({ storeKey: "id:1", is_read: false }),
      buildNotification({ id: 2, storeKey: "id:2", is_read: true }),
    ]);

    useNotificationStore.getState().markReadLocally(["id:1", "id:2", "missing"]);
    expect(useNotificationStore.getState().notificationsByKey["id:1"].is_read).toBe(true);
    expect(useNotificationStore.getState().unreadCount).toBe(0);

    useNotificationStore.getState().markUnreadLocally(["id:2", "missing"]);
    expect(useNotificationStore.getState().notificationsByKey["id:2"].is_read).toBe(false);
    expect(useNotificationStore.getState().unreadCount).toBe(1);
  });

  it("marks all unread notifications as read and returns affected keys", () => {
    useNotificationStore.getState().setUnreadCount(2);
    useNotificationStore.getState().upsertNotifications([
      buildNotification({ id: 5, storeKey: "id:5", is_read: false }),
      buildNotification({ id: 6, storeKey: "id:6", is_read: false }),
      buildNotification({ id: 7, storeKey: "id:7", is_read: true }),
    ]);

    const updatedKeys = useNotificationStore.getState().markAllReadLocally();

    expect(updatedKeys.sort()).toEqual(["id:5", "id:6"]);
    expect(useNotificationStore.getState().unreadCount).toBe(0);
    expect(useNotificationStore.getState().notificationsByKey["id:5"].is_read).toBe(true);
    expect(useNotificationStore.getState().notificationsByKey["id:6"].is_read).toBe(true);
  });

  it("ignores empty operations to avoid unintended state changes", () => {
    useNotificationStore.getState().setConnectionStatus("connected");
    useNotificationStore.getState().setLastError("timeout");
    const before = useNotificationStore.getState();

    useNotificationStore.getState().upsertNotifications([]);
    useNotificationStore.getState().markReadLocally([]);
    useNotificationStore.getState().markUnreadLocally([]);

    const after = useNotificationStore.getState();
    expect(after.connectionStatus).toBe(before.connectionStatus);
    expect(after.lastError).toBe(before.lastError);
  });
});
