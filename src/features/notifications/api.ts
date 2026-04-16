"use client";

import { AxiosInstance } from "axios";
import {
  FetchNotificationsData,
  FetchNotificationsParams,
  MarkReadData,
  NotificationsBootstrapData,
  SuccessResponse,
} from "./types";
import { withApiBasePath } from "@/constants/api";

export const fetchNotificationsBootstrap = async (backendAxiosInstance: AxiosInstance) => {
  const response = await backendAxiosInstance.get<SuccessResponse<NotificationsBootstrapData>>(
    withApiBasePath("/notifications/websocket-bootstrap"),
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const fetchNotifications = async (backendAxiosInstance: AxiosInstance, params?: FetchNotificationsParams) => {
  const searchParams = new URLSearchParams();

  if (typeof params?.unread_only === "boolean") {
    searchParams.set("unread_only", String(params.unread_only));
  }
  if (typeof params?.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }
  if (typeof params?.offset === "number") {
    searchParams.set("offset", String(params.offset));
  }

  const query = searchParams.toString();
  const url = query ? `${withApiBasePath("/notifications")}?${query}` : withApiBasePath("/notifications");

  const response = await backendAxiosInstance.get<SuccessResponse<FetchNotificationsData>>(url);
  return response.data;
};

export const markNotificationsRead = async (backendAxiosInstance: AxiosInstance, notificationIds: number[]) => {
  const response = await backendAxiosInstance.post<SuccessResponse<MarkReadData>>(
    withApiBasePath("/notifications/mark-read"),
    notificationIds.length === 1 ? { notification_id: notificationIds[0] } : { notification_ids: notificationIds },
  );

  return response.data;
};

export const markAllNotificationsRead = async (backendAxiosInstance: AxiosInstance) => {
  const response = await backendAxiosInstance.post<SuccessResponse<MarkReadData>>(
    withApiBasePath("/notifications/mark-all-read"),
  );

  return response.data;
};
