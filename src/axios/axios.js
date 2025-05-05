import axios from "axios"

const api = axios.create({
    baseURL:"http://10.89.240.76:3000/project-senai/api/v1/",
    headers:{"accept":"application/json"}
})

const sheets = {
    postLogin: (user) => api.post("login/", user),
    postCadastro: (user) => api.post("user/", user),
    // 1. Listar salas disponíveis por data
    getSalasDisponiveisPorData: (data) => api.get(`salas/disponiveis/${data}`),
    // 2. Listar horários disponíveis de todas as salas por data
    getSalasHorariosDisponiveis: (data) => api.get(`salas/horarios-disponiveis/${data}`),
    // 3. Criar reserva
    criarReserva: (reservaData) => api.post("reservas/", reservaData),
    getUsuario: (id_usuario) => api.get(`user/${id_usuario}`),
    getReservasDoUsuario: (id_usuario) => api.get(`reservas/user/${id_usuario}`),
  };
  

export default sheets;