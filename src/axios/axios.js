// axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.85:3000/project-senai/api/v1/",
  headers: { accept: "application/json" },
});

// Rotas da API
const sheets = {
  postLogin: (user) => api.post("login/", user),
  postCadastro: (user) => api.post("user/", user),
  getSalasDisponiveisPorData: (data) => api.get(`salas/disponiveis/${data}`),
  getSalasHorariosDisponiveis: (data) =>
    api.get(`salas/horarios-disponiveis/${data}`),
  criarReserva: (reservaData) => api.post("reservas/", reservaData),
  getUsuario: (id_usuario) => api.get(`user/${id_usuario}`),
  getReservasDoUsuario: (id_usuario) => api.get(`reservas/user/${id_usuario}`),
  updateUser: (userData) => api.put(`user/`, userData),
  deleteReserva: (id_reserva) => api.delete(`reservas/${id_reserva}`),
  deleteUsuario: (id_usuario) => api.delete(`user/${id_usuario}`),
};

// Interceptador para incluir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default sheets;