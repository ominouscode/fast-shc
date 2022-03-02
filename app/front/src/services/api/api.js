import { get as getStore } from 'svelte/store';
import { token } from "../../stores";

const apiRequest = async(method, url, request) => {
    try {
        const response = await fetch(url, {
            method: method,
            cache: 'no-cache',
            headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + getStore(token)},
            body: JSON.stringify(request)
            });
        const json = await response.json()
        if(json.detail == "Could not validate credentials") token.set("")
        return json
    } catch(error) {
        return false
    }
}

const get = (url, request) => apiRequest("get", url, request)
const post = (url, request) => apiRequest("post", url, request)
const put = (url, request) => apiRequest("put", url, request)
const deleteRequest = (url, request) =>  apiRequest("delete", url, request)

const API ={
    get,
    post,
    put,
    delete: deleteRequest
}

export default API