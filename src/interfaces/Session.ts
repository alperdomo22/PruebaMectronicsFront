export interface IUserSession {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: IRoleSession;
}

export interface IRoleSession {
    id: number;
    name: string;
}