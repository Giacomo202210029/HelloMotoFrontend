import axios from "../utils/http.js";
export default async function getWorkerService(id){
    try {
        let response = await axios.get(`worker/${id}`);
        return response.data
    } catch (e) {
        console.log(e)
        return {}
    }
}