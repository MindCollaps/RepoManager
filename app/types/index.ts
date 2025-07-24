export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export const TokenCookieName = 'token-lgn';

export const NOTIFICATION_STYLES = ['success', 'error', 'info', 'warning'] as const;
export type NotificationStyle = typeof NOTIFICATION_STYLES[number];
