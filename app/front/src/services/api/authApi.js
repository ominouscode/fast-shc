import { token } from "../../stores";


export const login = async (username, password) => {
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)
    try {
        const result = await fetch("../login", {
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData
        })
        if(!result.ok) return "Incorrect username or password"
        const json = await result.json()
        token.set(json.access_token)
    }catch(error) {
        return "Error: Connection error."
    }
}
