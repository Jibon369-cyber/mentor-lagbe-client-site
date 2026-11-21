"use client";

import Link from "next/link";
import { Bell, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifications, loading, error, markAsRead, unreadCount, refetch } =
    useNotifications();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title="Notifications"
        description={`View your notifications${unreadCount ? ` (${unreadCount} unread)` : ""}.`}
        action={
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            <Bell className="mr-2 h-4 w-4" /> Refresh
          </Button>
        }
      />

      {error && (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-3 font-semibold">No notifications</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Notifications about your account and activity will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {notifications.map((notification) => (
            <Link
              key={notification._id}
              href={notification.actionUrl || "/dashboard/notifications"}
              onClick={() => {
                if (!notification.isRead) {
                  void markAsRead(notification._id);
                }
              }}
              className={`block rounded-xl border p-4 transition-colors hover:bg-accent ${
                !notification.isRead
                  ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  {notification.referenceType === "user" ? (
                    <User className="h-5 w-5 text-primary" />
                  ) : (
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
