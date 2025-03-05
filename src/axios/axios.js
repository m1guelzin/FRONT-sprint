import axios from "axios"

const api = axios.create({
    baseURL:"http://10.89.240.73:3000/project-senai/api/v1/",
    headers:{"accept":"application/json"}
})

const sheets = {
    postLogin:(user) => api.post("login/", user),
    postCadastro:(user) => api.post("user/", user)
}

export default sheets;