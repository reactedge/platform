export interface KeystoneUser {
    id: string;
    email: string;
    name: string;
}

export interface KeystoneCheckUserParams {
    email: string

}

export interface KeystoneRegisterUserParams {
    data: {
        name: string;
        email: string;
        password: string;
        venue: {
            connect: {
                id: string;
            };
        };
    };
}

export interface RegisterUserParams {
    name: string;
    email: string;
    password: string;
}