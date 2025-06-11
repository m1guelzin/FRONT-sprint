import React, { useEffect, useState } from "react";
import api from "../axios/axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Modal,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import SuccessSnackbar from '../components/SuccessSnackbar'; 
import ErrorSnackbar from '../components/ErrorSnackbar'; 
import { useNavigate } from 'react-router-dom'; 

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [reservas, setReservas] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [openReservasListModal, setOpenReservasListModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); 
  const [snackbarMessageError, setsnackbarMessageError] = useState(""); 
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)

  const navigate = useNavigate(); 

  const handleOpenReservasListModal = () => {
    setOpenReservasListModal(true);
  };

  const handleCloseReservasListModal = () => {
    setOpenReservasListModal(false);
  };

  const formatarData = (dataStr) => {
    if (!dataStr || !dataStr.includes('-')) {
        return dataStr;
    }
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const fetchUserReservas = async (id_usuario) => {
    try {
      const response = await api.getReservasDoUsuario(id_usuario);
      setReservas(response.data.reservas);
    } catch (error) {
      console.log("Erro ao buscar reservas do usuário:", error);
      setReservas([]); 
    }
  };

  const handleDeleteReserva = async (id_reserva) => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      setReservas(prevReservas => prevReservas.filter(reserva => reserva.id_reserva !== id_reserva));
      handleCloseReservasListModal(); 

      try {
        await api.deleteReserva(id_reserva); 
        setSnackbarMessage("Reserva cancelada com sucesso!");
        setSnackbarOpen(true);
        const id_usuario = localStorage.getItem("id_usuario");
        if (id_usuario) {
          fetchUserReservas(id_usuario); 
        }
      } catch (error) {
        setsnackbarMessageError("Erro ao cancelar reserva. Faça Login novamente");
        setErrorSnackbarOpen(true);
        setTimeout(() => {
          localStorage.clear(); 
          navigate('/login');
        }, 2000);
        
        if (id_usuario) {
          fetchUserReservas(id_usuario);
        }
      }
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
  }, []);

  useEffect(() => {
    const id_usuario = localStorage.getItem("id_usuario");

    if (!id_usuario) {
      console.log("ID do usuário não encontrado no localStorage. Redirecionando ou exibindo erro.");
      navigate('/login'); 
      return;
    }

    const getUserInfo = async () => {
      try {
        const response = await api.getUsuario(id_usuario);
        setUserData(response.data.user);
        setUserData(prevData => ({
          ...prevData,
          senha: "",
          senhaarmazenada: response.data.user.senha
        }));
      } catch (error) {
        console.log("Erro ao buscar informações do usuário:", error);
        setsnackbarMessageError("Erro ao carregar seu perfil. Por favor, faça login novamente.");
        setErrorSnackbarOpen(true);
        setTimeout(() => {
          localStorage.clear(); 
          navigate('/login');
        }, 2000);
      }
    };

    getUserInfo();
    fetchUserReservas(id_usuario);
  }, [navigate]); // Adicionado 'navigate' às dependências do useEffect

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSalvar = async () => {
    const id_usuario_str = localStorage.getItem("id_usuario");
    const id_usuario = parseInt(id_usuario_str, 10);

    if (isNaN(id_usuario)) {
      setsnackbarMessageError("ID do usuário inválido. Faça login novamente.");
      setSnackbarOpen(true);
      return;
    }

    const senhaParaEnviar = userData.senha.trim() !== "" ? userData.senha : userData.senhaarmazenada;

    const dataToUpdate = {
      id_usuario: id_usuario,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      senha: senhaParaEnviar,
      cpf: userData.cpf,
    };

    console.log("Dados que serão enviados para a API:", dataToUpdate);

    try {
      await api.updateUser(dataToUpdate);
      setEditMode(false);
      setSnackbarMessage("Perfil atualizado com sucesso!");
      setSnackbarOpen(true);
      setUserData(prev => ({ ...prev, senha: "" }));
      const updatedUserData = await api.getUsuario(id_usuario);
      setUserData(prevData => ({
        ...prevData,
        senhaarmazenada: updatedUserData.data.user.senha
      }));

    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
      setsnackbarMessageError(
        "Erro ao atualizar perfil: " +
        (error.response?.data?.error || "Verifique os dados e tente novamente.")
      );
      setErrorSnackbarOpen(true);
      setTimeout(() => {
        navigate('/login'); 
      }, 2000); 
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Tem certeza que deseja excluir seu perfil? Esta ação é irreversível.")) {
      const id_usuario = localStorage.getItem("id_usuario");
      if (!id_usuario) {
        setsnackbarMessageError("ID do usuário não encontrado. Não foi possível excluir o perfil.");
        setSnackbarOpen(true);
        return;
      }

      try {
        const response = await api.deleteUsuario(id_usuario); // Chame a API
        localStorage.clear(); // Limpa os dados do usuário do localStorage
        setSnackbarMessage(response.data.message || "Perfil excluído com sucesso!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/login'); 
        }, 2000); 
      } catch (error) {
        console.log("Erro ao excluir perfil:", error);
        setsnackbarMessageError(error.response?.data?.error || "Erro ao excluir perfil. Tente novamente.");
        setErrorSnackbarOpen(true);
      }
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h5" sx={styles.title}>
        PERFIL DE USUÁRIO
      </Typography>
      <Box sx={styles.boxWrapper}>
        <TextField
          name="nome"
          sx={{ backgroundColor: "#D9D9D9" }}
          fullWidth
          margin="normal"
          label="Nome Completo do Usuário"
          value={userData.nome || ""}
          onChange={handleInputChange}
          inputProps={{ readOnly: !editMode }}
        />
        <TextField
          name="email"
          sx={{ backgroundColor: "#D9D9D9" }}
          fullWidth
          margin="normal"
          label="Email do Usuário"
          value={userData.email || ""}
          onChange={handleInputChange}
          inputProps={{ readOnly: !editMode }}
        />
        <Box sx={styles.fieldsRow}>
          <TextField
            name="telefone"
            style={styles.campoTelefone}
            sx={{ backgroundColor: "#D9D9D9" }}
            fullWidth
            margin="normal"
            label="Telefone do Usuário"
            value={userData.telefone || ""}
            onChange={handleInputChange}
            inputProps={{ readOnly: !editMode }}
          />
          {/* Botão MINHAS RESERVAS */}
          <Box sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              onClick={handleOpenReservasListModal}
              sx={styles.dropdownButton}
              endIcon={<ArrowDropDownIcon />}
            >
              MINHAS RESERVAS
            </Button>
          </Box>
        </Box>
        <TextField
          name="senha"
          type="password"
          sx={ styles.campoCPF}
          fullWidth
          margin="normal"
          label="Nova Senha (deixe em branco para não alterar)"
          value={userData.senha || ""}
          onChange={handleInputChange}
          inputProps={{ readOnly: !editMode }}
        />
        <br></br>
        <TextField
          name="cpf"
          sx={styles.campoCPF}
          fullWidth
          margin="normal"
          label="CPF do Usuário"
          value={userData.cpf || ""}
          inputProps={{ readOnly: true }}
        />

        <Box sx={{ display: "flex", gap: 2, marginTop: -10, justifyContent: "flex-end", marginRight: 24 }}>
          {!editMode ? (
            <Button
              sx={styles.ButtonAtualizar}
              color="primary"
              variant="contained"
              onClick={() => {
                setEditMode(true);
                setUserData(prev => ({ ...prev, senha: "" }));
              }}
            >
              Atualizar Perfil
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleSalvar}
              >
                Salvar
              </Button>
              <Button
                sx={styles.ButtonCancelar}
                variant="contained"
                onClick={async () => {
                  setEditMode(false);
                  const id_usuario = localStorage.getItem("id_usuario");
                  if (id_usuario) {
                      try {
                          const response = await api.getUsuario(id_usuario);
                          setUserData(response.data.user);
                          setUserData(prev => ({ ...prev, senha: "" }));
                      } catch (error) {
                          console.log("Erro ao buscar informações do usuário ao cancelar:", error);
                      }
                  }
                }}
              >
                Cancelar
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, marginRight: 24 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProfile}
            sx={styles.ButtonExcluirPerfil}
          >
            Excluir Perfil
          </Button>
        </Box>

      </Box>

      <Modal
        open={openReservasListModal}
        onClose={handleCloseReservasListModal}
        aria-labelledby="reservas-list-modal-title"
      >
        <Box sx={styles.reservasModalStyle}>
          <Typography id="reservas-list-modal-title" variant="h5" component="h2" gutterBottom>
            Minhas Reservas
          </Typography>
          {reservas.length > 0 ? (
            <Box>
              {reservas.map((reserva, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    padding: '10px 0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Sala: {reserva.nome_da_sala}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data: {formatarData(reserva.data_reserva)} | {reserva.horario_inicio} - {reserva.horario_fim}
                    </Typography>
                  </Box>
                  <IconButton
                    color="error"
                    aria-label="Deletar Reserva"
                    onClick={() => handleDeleteReserva(reserva.id_reserva)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>Nenhuma reserva encontrada.</Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleCloseReservasListModal} sx={styles.ButtonCancelar}>Fechar</Button>
          </Box>
        </Box>
      </Modal>

   
      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
      <ErrorSnackbar
      open={errorSnackbarOpen}
      message={snackbarMessageError}
      onClose={() => setErrorSnackbarOpen(false)}/>
    </Box>
  );
};

export default Perfil;

const styles = {
  container: {
    overflowX: "hidden",
    overflowY: "hidden",
    boxSizing: "border-box",
    margin: 0,
    backgroundColor: "red",
    width: "100%",
    padding: "30px",
    display: 1, 
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Centraliza verticalmente
  },
  boxWrapper: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "20px",
    maxWidth: "96%",
    height: "408px",
  },
  title: {
    backgroundColor: "white",
    padding: "10px 20px",
    borderRadius: "10px",
    display: "flex",
    width: "20%",
    justifyContent: "center",
    marginBottom: 3,
    fontWeight: "bold",
  },
  fieldsRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  dropdownButton: {
    backgroundColor: "red",
    width: "200%",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    padding: "10px 20px",
    right: "400px",

  },
  campoCPF: {
    width: "30%",
    backgroundColor: "#D9D9D9",
  },
  campoTelefone: {
    width: "30%",
    backgroundColor: "#D9D9D9",
  },
  ButtonAtualizar: {
    backgroundColor: "red",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    width: "415px"
  },
  reservasModalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600, 
    maxWidth: '90%', // Garante que não ultrapasse 90% da largura da tela
    maxHeight: '80%', 
    overflowY: 'auto', // Adiciona scroll se o conteúdo for grande
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  },
  ButtonCancelar: {
    backgroundColor: "red",
    color: "white"
  },
  ButtonExcluirPerfil: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'none',
    width: '150px',
  },
  };