import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface RegisterData {
  username: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword?: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  phoneNumber: string;
  accessToken: string;
}

interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  role: string;

  accessToken?: string;
}

class Api {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // REQUEST INTERCEPTOR
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // RESPONSE INTERCEPTOR
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle unauthorized request globally
        if (error.response?.status === 401) {
          console.log('Unauthorized! Redirecting to login...');
          // Optionally, you can clear tokens or user data here
          // localStorage.removeItem('accessToken')
          // Redirect to login page
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string; error?: string }>;

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'An error occurred';
      throw new Error(message);
    }
  }

  // AUTH METHODS

  async register(userData: RegisterData): Promise<RegisterResponse> {
    return this.request<RegisterResponse>({
      url: '/users/register',
      method: 'POST',
      data: userData,
    });
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    return this.request<LoginResponse>({
      url: '/users/login',
      method: 'POST',
      data: loginData,
    });
  }

  async logout() {
    return this.request({
      url: '/users/logout',
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request({
      url: '/users/auth/me',
      method: 'GET',
    });
  }

  async updateProfile(profileData: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }) {
    return this.request({
      url: '/users/profile',
      method: 'PATCH',
      data: profileData,
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request({
      url: '/users/profile/password',
      method: 'PATCH',
      data: { currentPassword, newPassword },
    });
  }

  async forgotPassword(email: string) {
    return this.request({
      url: '/auth/forgot-password',
      method: 'POST',
      data: { email },
    });
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    return this.request({
      url: '/auth/reset-password',
      method: 'POST',
      data: { email, token, newPassword },
    });
  }

  async getProduct(): Promise<any> {
    return this.request({
      url: '/products/',
      method: 'GET',
    });
  }

  async deleteProduct(url: string, config?: AxiosRequestConfig) {
    return this.request({
      url,
      method: 'DELETE',
      ...config,
    });
  }

  async refreshToken() {
    return this.request({
      url: '/auth/refresh-token',
      method: 'POST',
    });
  }

  async updateUserRole(userId: string, role: string) {
    return this.request({
      url: `/users/${userId}/role`,
      method: 'PATCH',
      data: { role },
    });
  }
}

export const api = new Api();
