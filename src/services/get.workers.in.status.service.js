import axios from "../utils/http.js";
export default async function getWorkersInStatusService(status){
    try {
        let response = await axios.get(`workers/${status}`);
        return response.data
    } catch (e) {
        console.log(e)
        return {}
    }
}