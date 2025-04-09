declare module '#auth-utils' {
    interface User {
        username: string;
        logon: Date;
    }

    interface UserSession {
        avatar_url?: string;
    }

    interface SecureSessionData {
        userId: number;
        email: string;
    }
}

export {};
