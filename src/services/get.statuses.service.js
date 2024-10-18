import axios from "../utils/http.js";
export default async function getStatusesService(){
    try {
        let response = await axios.get(`statuses/`);
        return response.data
    } catch (e) {
        console.log(e)
        return {}
    }
}