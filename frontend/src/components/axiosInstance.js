import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Asegúrate de que esta baseURL sea correcta
    withCredentials: true,
});


// Interceptor para agregar el CSRF token
axiosInstance.interceptors.request.use(async (config) => {
    if (config.url === '/csrf-token') {
        return config;
    }

    if (!config.headers['X-CSRF-Token']) {
        console.log('Solicitando token CSRF desde:', '/csrf-token');
        const response = await axiosInstance.get('/csrf-token');
        config.headers['X-CSRF-Token'] = response.data.csrfToken;
    }
    return config;
});


export default axiosInstance;
