declare module '#auth-utils' {
    interface User {
        logon: Date;
        userId: number;
        isUser: boolean; // True = is User that is using the program | False = is User that uses a token
    }

    interface SecureSessionData {
        githubId: number;
        userId: number;
    }
}

export {};
