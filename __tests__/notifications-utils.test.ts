import {
  buildNotificationStoreKey,
  formatNotificationDateTime,
  normalizeNotification,
  resolveNotificationHref,
  sortNotificationEntities,
} from "@/features/notifications/utils";
import { NotificationEntity, NotificationPayload } from "@/features/notifications/types";

describe("notifications utils", () => {
  describe("buildNotificationStoreKey", () => {
    it("uses numeric id when present", () => {
      expect(buildNotificationStoreKey({ id: 42, title: "Hello" })).toBe("id:42");
    });

    it("builds fallback key with sanitized text for missing id", () => {
      const key = buildNotificationStoreKey({
        type: " ALERT ",
        title: "  Node Down  ",
        message: "  Check logs  ",
        reference_model: " Validator ",
        reference_id: 11,
        created_at: "2025-01-01T00:00:00.000Z",
        action_url: "alerts",
      });

      expect(key).toBe(
        "fallback::alert::node down::check logs::validator::11::2025-01-01T00:00:00.000Z::alerts",
      );
    });
  });

  describe("normalizeNotification", () => {
    it("coerces defaults and created_at fallback when values are absent", () => {
      const receivedAt = "2026-01-01T10:00:00.000Z";
      const payload = {
        category: "info",
        title: "",
        message: "",
        is_read: false,
        read_at: false,
        created_at: false,
        expires_at: false,
      } as unknown as NotificationPayload;

      const normalized = normalizeNotification(payload, { receivedAt });

      expect(normalized.is_read).toBe(false);
      expect(normalized.category).toBe("info");
      expect(normalized.payload).toEqual({});
      expect(normalized.title).toBe("Notification");
      expect(normalized.created_at).toBe(receivedAt);
      expect(normalized.receivedAt).toBe(receivedAt);
      expect(normalized.storeKey.startsWith("fallback::")).toBe(true);
    });
  });

  describe("sortNotificationEntities", () => {
    it("sorts by created_at desc, then id desc, then receivedAt desc", () => {
      const base = {
        category: "info",
        title: "a",
        message: "m",
        is_read: false,
        read_at: false,
        expires_at: false,
        payload: {},
      } as const;

      const notifications = [
        {
          ...base,
          id: 10,
          created_at: "2026-01-01T12:00:00.000Z",
          receivedAt: "2026-01-01T12:01:00.000Z",
          storeKey: "id:10",
        },
        {
          ...base,
          id: 11,
          created_at: "2026-01-01T12:00:00.000Z",
          receivedAt: "2026-01-01T12:00:30.000Z",
          storeKey: "id:11",
        },
        {
          ...base,
          id: 9,
          created_at: "2026-01-01T11:59:59.000Z",
          receivedAt: "2026-01-01T12:02:00.000Z",
          storeKey: "id:9",
        },
      ] as NotificationEntity[];

      expect(sortNotificationEntities(notifications).map((item) => item.storeKey)).toEqual([
        "id:11",
        "id:10",
        "id:9",
      ]);
    });
  });

  describe("formatNotificationDateTime", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-01-10T12:00:00.000Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("returns just now for false and invalid values", () => {
      expect(formatNotificationDateTime(false)).toBe("Just now");
      expect(formatNotificationDateTime("not-a-date")).toBe("Just now");
    });

    it("returns relative minutes, hours, days, and absolute format for older values", () => {
      expect(formatNotificationDateTime("2026-01-10T11:57:00.000Z")).toContain("minute");
      expect(formatNotificationDateTime("2026-01-10T10:00:00.000Z")).toContain("hour");
      expect(formatNotificationDateTime("2026-01-08T12:00:00.000Z")).toContain("day");
      expect(formatNotificationDateTime("2025-12-20T12:00:00.000Z")).toContain("2025");
    });
  });

  describe("resolveNotificationHref", () => {
    it("handles absolute, relative, and empty urls", () => {
      expect(resolveNotificationHref(undefined)).toBeNull();
      expect(resolveNotificationHref("https://example.com/x")).toBe("https://example.com/x");
      expect(resolveNotificationHref("settings/profile")).toBe("/settings/profile");
      expect(resolveNotificationHref("/dashboard")).toBe("/dashboard");
    });
  });
});
