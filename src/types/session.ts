declare module '#auth-utils' {
    interface User {
        username: string;
        logon: Date;
        userId: number;
    }

    interface UserSession {
        avatar_url?: string;
    }

    interface SecureSessionData {
        email: string;
    }
}

export {};
