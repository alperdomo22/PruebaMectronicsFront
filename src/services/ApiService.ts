import axios from 'axios';
import type { IGeneralAxiosReponse } from '../interfaces/HttpRequest';

type AxiosRequestConfig = Parameters<typeof axios.request>[0];
type HttpMethod = NonNullable<AxiosRequestConfig["method"]>;

export async function apiRequest<T>(
    endpoint: string,
    method: HttpMethod = "get",
    data?: any,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
): Promise<IGeneralAxiosReponse<T>> {
    try {
        const response = await axios.request<T>({
            baseURL: 'https://localhost:7097',
            url: endpoint,
            method,
            data,
            params,
            ...config,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.description || error.message,
            data: error.response.data
        };
    }
}