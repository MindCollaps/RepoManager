declare module '#auth-utils' {
    interface User {
        id: number;
        username: string;
        loggedIn: Date;
    }

    interface UserSession {
        email: string;
        avatar_url?: string;
    }

}

export {};
