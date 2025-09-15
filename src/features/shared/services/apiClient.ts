import axios, { type AxiosInstance } from "axios";
import type { PaginatedResponse } from "../types";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = "") {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(error.message || "Request failed");
      }
    );
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  // Generic paginated fetch
  async getPaginated<T>(
    endpoint: string,
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      [key: string]: string | number | undefined;
    } = {}
  ): Promise<PaginatedResponse<T>> {
    // Filter out undefined values
    const filteredParams: Record<string, string | number> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        filteredParams[key] = value;
      }
    });
    return this.get<PaginatedResponse<T>>(endpoint, filteredParams);
  }
}

export const apiClient = new ApiClient();
