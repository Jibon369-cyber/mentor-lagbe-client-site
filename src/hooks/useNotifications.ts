"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";

export type Notification = {
  _id: string;
  recipientId: string;
  recipientRole: "admin" | "tutor" | "student";
  title: string;
  message: string;
  actionUrl?: string;
  referenceId?: string;
  referenceType?: "tuition" | "application" | "user";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const [data, unread] = await Promise.all([
        api<Notification[]>("/notifications"),
        api<{ count: number }>("/notifications/count"),
      ]);
      setNotifications(data);
      setUnreadCount(unread.count);
      setError(null);
    } catch (err) {
      const message = errorMessage(err);
      console.error("Failed to fetch notifications", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await api(`/notifications/${id}/read`, { method: "PATCH" });
        const wasUnread = notifications.some(
          (notification) => notification._id === id && !notification.isRead,
        );
        setNotifications((current) =>
          current.map((item) =>
            item._id === id ? { ...item, isRead: true } : item,
          ),
        );
        if (wasUnread) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
      } catch (err) {
        console.error("Failed to mark notification as read", err);
        setError(errorMessage(err));
      }
    },
    [notifications],
  );

  useEffect(() => {
    // Load external notification data after mount, then refresh while visible.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotifications();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchNotifications();
      }
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    refetch: fetchNotifications,
  };
}
