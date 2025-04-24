declare module '#auth-utils' {
    interface User {
        username: string;
        logon: Date;
        userId: number;
        isUser: boolean; // True = is User that is using the program | False = is User that uses a token
    }

    interface UserSession {
        avatar_url?: string;
    }

    interface SecureSessionData {
        email: string;
    }
}

export {};
