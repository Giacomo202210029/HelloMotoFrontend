import axios from 'axios';

let axiosRequester = axios.create({
    baseURL: 'https://jypsac.dyndns.org:3000/api/v1/',
});

export default axiosRequester;