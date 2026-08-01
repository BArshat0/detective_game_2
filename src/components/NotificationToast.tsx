import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type NotificationKind = 'success' | 'info' | 'warning' | 'error';

export interface NotificationState {
  kind: NotificationKind;
  title: string;
  message: string;
}

interface NotificationToastProps {
  notification: NotificationState;
  onDismiss: () => void;
}

const styles: Record<NotificationKind, { icon: typeof Info; border: string; iconColor: string }> = {
  success: { icon: CheckCircle2, border: 'border-emerald-400/40', iconColor: 'text-emerald-300' },
  info: { icon: Info, border: 'border-[#ff8533]/40', iconColor: 'text-[#ffb829]' },
  warning: { icon: AlertTriangle, border: 'border-[#ffb829]/40', iconColor: 'text-[#ffb829]' },
  error: { icon: AlertTriangle, border: 'border-rose-400/40', iconColor: 'text-rose-300' },
};

export default function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const style = styles[notification.kind];
  const Icon = style.icon;

  return (
    <div
      role={notification.kind === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[80] flex w-[min(92vw,430px)] -translate-x-1/2 items-start gap-3 rounded-2xl border ${style.border} bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:left-auto sm:right-6 sm:translate-x-0`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconColor}`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold">{notification.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{notification.message}</p>
      </div>
      <button type="button" onClick={onDismiss} className="rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white" aria-label="Dismiss notification">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
