export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export const TokenCookieName = 'token-lgn';

export const NOTIFICATION_STYLES = ['success', 'error', 'info', 'warning'] as const;
export type NotificationStyle = typeof NOTIFICATION_STYLES[number];

export const REPO_STATE = {
    invited: 0,
    collabo: 1,
    not_invited: 2,
} as const;

export type RepoState = typeof REPO_STATE[keyof typeof REPO_STATE];
