import API from "./api";
import { deviceStore } from "../../stores";

export const loadDevices = async () => {
    const devices = await API.get("../devices")
    if(devices && Array.isArray(devices)) deviceStore.set(devices)
    else deviceStore.set([])
}

export const addDevice = async (device) => {
    const result = await API.post("../devices", device)
    if(result) return loadDevices()
    else return false
}

export const updateDevice = async (device) => {
    const result = await API.put("../devices", device)
    if(result) return loadDevices()
    else return false
}

export const removeDevice = async (device) => {
    const result = await API.delete("../devices", device)
    if(result) loadDevices()
    else return false
}