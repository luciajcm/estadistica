import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
    type RawAxiosRequestHeaders,
} from "axios";

export default class Api {
    private static _instance: Api | null = null;
    private _basePath: string;
    private _apiKey: string | null;

    public set apiKey(value: string | null) {
        this._apiKey = value;
    }

    private constructor(basePath: string, apiKey: string | null) {
        this._basePath = basePath;
        this._apiKey = apiKey;
    }

    public static async getInstance() {
        if (!this._instance) {
            const basePath = import.meta.env.VITE_BASE_URL;
            this._instance = new Api(basePath, null);
        }
        return this._instance;
    }

    public async request<RequestType, ResponseType>(config: AxiosRequestConfig) {
    const headers: RawAxiosRequestHeaders = {
        "Content-Type": "application/json",
    };
    // Añadir el token JWT si existe
    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (this._apiKey) {
        headers["x-api-key"] = this._apiKey; // Cambia la key a x-api-key
    }

    const configOptions: AxiosRequestConfig = {
        ...config,
        baseURL: this._basePath,
        headers: headers,
    };

    const path = (config.url && config.url.startsWith('/')) ? this._basePath + config.url : `${this._basePath}/${config.url}`;
    if (!config.url) {
        return axios<RequestType, AxiosResponse<ResponseType>>(this._basePath, configOptions);
    }

    return axios<RequestType, AxiosResponse<ResponseType>>(path, configOptions);
}

    public get<RequestType, ResponseType>(config: AxiosRequestConfig) {
        const configOptions: AxiosRequestConfig = { ...config, method: "GET" };
        return this.request<RequestType, ResponseType>(configOptions);
    }

    public post<RequestBodyType, ResponseBodyType>(data: RequestBodyType, options: AxiosRequestConfig) {
        const configOptions: AxiosRequestConfig = { ...options, method: "POST", data };
        return this.request<RequestBodyType, ResponseBodyType>(configOptions);
    }

    public delete(options: AxiosRequestConfig) {
        const configOptions: AxiosRequestConfig = { ...options, method: "DELETE" };
        return this.request<void, void>(configOptions);
    }

    public put<RequestBodyType, ResponseBodyType>(data: RequestBodyType, options: AxiosRequestConfig) {
        const configOptions: AxiosRequestConfig = { ...options, method: "PUT", data: data };
        return this.request<RequestBodyType, ResponseBodyType>(configOptions);
    }

    public patch<RequestBodyType, ResponseBodyType>(data: RequestBodyType, options: AxiosRequestConfig) {
        const configOptions: AxiosRequestConfig = { ...options, method: "PATCH", data: data };
        return this.request<RequestBodyType, ResponseBodyType>(configOptions);
    }
}