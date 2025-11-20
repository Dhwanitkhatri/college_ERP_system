import axios from 'axios';
const api = axios.create({
    baseURL:'http://192.168.31.128:5000/',
    withCreddentials:false,
});
export default api;