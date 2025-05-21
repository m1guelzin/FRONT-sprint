import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.76:3000/project-senai/api/v1/",
  headers: { accept: "application/json" },
});

// Rotas da API
const sheets = {
  postLogin: (user) => api.post("login/", user),
  postCadastro: (user) => api.post("user/", user),
  getSalasDisponiveisPorData: (data) => api.get(`salas/disponiveis/${data}`),
  getSalasHorariosDisponiveis: (data) => api.get(`salas/horarios-disponiveis/${data}`),
  criarReserva: (reservaData) => api.post("reservas/", reservaData),
  getUsuario: (id_usuario) => api.get(`user/${id_usuario}`),
  getReservasDoUsuario: (id_usuario) => api.get(`reservas/user/${id_usuario}`),

  // ✅ NOVA ROTA: Atualizar usuário
  atualizarUsuario: (formData) => api.put("user/update", formData), // PUT para atualizar o usuário autenticado =>
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
