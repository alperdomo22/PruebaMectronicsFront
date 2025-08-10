export interface IApiService {
    endPoint: string;
    method: methodType;
    data: any;
}

export interface IGeneralAxiosReponse<T> {
    success: boolean;
    message?: string;
    data?: T
}

export interface IGeneralReponse<T> {
    success: boolean;
    description: string;
    data: T
}

export type methodType = 'GET' | 'POST' | 'PUT' | 'DELETE';