import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { appConfig } from "@/config";

const baseRequest: AxiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10000,
});

baseRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("app.auth.token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseRequest.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("app.auth.token");
    }
    return Promise.reject(error);
  }
);

export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return baseRequest.get(url, config).then((res) => res.data);
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return baseRequest.post(url, data, config).then((res) => res.data);
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return baseRequest.put(url, data, config).then((res) => res.data);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return baseRequest.delete(url, config).then((res) => res.data);
  },
};
