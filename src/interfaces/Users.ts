import type { IRoleResponse } from './Role';

export interface IUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    changePasswordRequired: boolean;
    roleId?: number;
}

export interface IUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    changePasswordRequired: boolean;
    registerDate: string;
    role?: IRoleResponse;
}

export interface IUserModalComponent {
    open: boolean;
    updateUser?: IUserRequest;
    roles: IRoleResponse[];
    idUser?: number;
    onHandleModal: () => void;
    registerUpdateUser: (idUser: number|undefined, objectUser: IUserRequest) => void;
}