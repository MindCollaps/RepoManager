declare module '#auth-utils' {
    interface User {
        username: string;
        email: string;
        loggedIn: Date;
    }

}

export {};
