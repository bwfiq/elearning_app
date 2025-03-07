import axios from 'axios';
import { useEffect } from 'react';

const useAxios = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const axiosInstance = axios.create({
        baseURL: apiUrl
    });

    useEffect(() => {
        axiosInstance.interceptors.request.use(
            config => {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            error => Promise.reject(error),
        );

        axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const refreshToken = localStorage.getItem('refresh_token');

                    if (refreshToken) {
                        try {
                            const response = await axios.post(`${apiUrl}/api/token/refresh/`, {
                                refresh: refreshToken
                            });
                            const { access } = response.data;
                            localStorage.setItem('access_token', access);
                            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                            return axiosInstance(originalRequest);
                        } catch (refreshError) {
                            console.error("Failed to refresh token:", refreshError);
                            // Redirect to login or handle logout
                        }
                    } else {
                        // Redirect to login or handle logout
                    }
                }

                return Promise.reject(error);
            }
        );
    }, [apiUrl, axiosInstance]);

    return axiosInstance;
};

export default useAxios;
