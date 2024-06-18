import axios from "axios";

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

const setAuthToken = (token: string) => {
    axiosInstance.interceptors.request.use(
        config => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        },
    );
};

export default axiosInstance;
export { setAuthToken };