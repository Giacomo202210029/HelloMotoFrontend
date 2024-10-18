import axios from 'axios';

let axiosRequester = axios.create({
    baseURL: 'http://localhost:3000/api/v1/',
});

export default axiosRequester;