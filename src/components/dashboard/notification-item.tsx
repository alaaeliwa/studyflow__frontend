"use client";

import { Notification } from "@/types/notifications";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  BookOpen, 
  CalendarClock,
  CheckCircle2, 
  Clock, 
  Info,
  TriangleAlert,
  Flame,
  GraduationCap,
  LucideIcon 
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/date-utils";

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

const typeIcons: Record<string, LucideIcon> = {
  task: CheckCircle2,
  course: BookOpen,
  exam: Clock,
  assignment: BookOpen,
  reflection: Info,
  system: Info,
  reminder: Bell,
  encouragement: Flame,
  graduation: GraduationCap,
};

const severityColors: Record<string, string> = {
  critical: "text-red-600 bg-red-50 dark:bg-red-500/10",
  warning: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
  info: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
  success: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
};

const severityBadgeStyles: Record<string, string> = {
  critical:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-500/10 dark:text-red-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-500/10 dark:text-amber-300",
  info:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-500/10 dark:text-blue-300",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/10 dark:text-emerald-300",
};

const severityLabels: Record<string, string> = {
  critical: "Critical",
  warning: "Soon",
  info: "Update",
  success: "Done",
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon =
    notification.severity === "critical"
      ? TriangleAlert
      : typeIcons[notification.type] || Info;

  const isEncouragement = notification.type === "encouragement";
  const isGraduation = notification.type === "graduation";
  
  const colorClass = isEncouragement
    ? "text-orange-600 bg-orange-100 dark:bg-orange-900/50"
    : isGraduation
      ? "text-purple-600 bg-purple-100 dark:bg-purple-900/50"
      : severityColors[notification.severity] || "text-slate-500 bg-slate-50";

  return (
    <div 
      onClick={() => onClick(notification.id)}
      className={cn(
        "group relative flex gap-4 p-4 hover:bg-muted/50 transition-all cursor-pointer rounded-xl border border-transparent hover:border-border",
        !notification.read && !isEncouragement && !isGraduation && "bg-primary/5 dark:bg-primary/10",
        isEncouragement && "bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 border-orange-100 dark:border-orange-900/30",
        isGraduation && "bg-purple-50/80 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800/50 shadow-sm"
      )}
    >
      {!notification.read && !isEncouragement && !isGraduation && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_4px_rgba(59,130,246,0.12)]" />
        </div>
      )}

      <div
        className={cn(
          "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-black/5",
          colorClass,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <h4 className={cn(
                "text-sm font-semibold transition-colors group-hover:text-primary",
                !notification.read ? "text-foreground" : "text-foreground/80",
                isEncouragement && "text-orange-700 dark:text-orange-400 group-hover:text-orange-800 dark:group-hover:text-orange-300",
                isGraduation && "text-purple-700 dark:text-purple-400 group-hover:text-purple-800 text-base"
              )}>
                {notification.title}
              </h4>
              
              {notification.severity && !isEncouragement && !isGraduation && (
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide",
                    severityBadgeStyles[notification.severity],
                  )}
                >
                  {severityLabels[notification.severity]}
                </Badge>
              )}
            </div>

            <p className={cn(
              "text-sm mt-1.5 leading-relaxed",
              !notification.read ? "text-muted-foreground font-medium" : "text-muted-foreground/80",
              isEncouragement && "text-orange-600/90 dark:text-orange-300/80",
              isGraduation && "text-purple-600 dark:text-purple-300/90 font-medium"
            )}>
              {notification.message}
            </p>

            <span className="whitespace-nowrap pt-0.5 text-[10px] text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>

          {notification.eventDate && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <span
                className={cn(
                  notification.severity === "critical"
                    ? "text-red-600 dark:text-red-300"
                    : notification.severity === "warning"
                      ? "text-amber-600 dark:text-amber-300"
                      : "text-muted-foreground",
                )}
              >
                Due{" "}
                {new Date(notification.eventDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {!notification.read && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_4px_rgba(59,130,246,0.12)]" />
        </div>
      )}
      {notification.severity === "critical" && (
        <div className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-red-500/90" />
      )}
    </div>
  );
}
