import axios from 'axios';
const api = axios.create({
    baseURL:'http://10.85.207.41:5000/',
    withCreddentials:false,
});
export default api;