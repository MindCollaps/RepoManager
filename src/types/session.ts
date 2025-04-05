declare module '#auth-utils' {
    interface User {
        id: number;
        username: string;
        email: string;
        loggedIn: Date;
    }

}

export {};
