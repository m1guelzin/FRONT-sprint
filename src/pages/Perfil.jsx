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


const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [reservas, setReservas] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [openReservasListModal, setOpenReservasListModal] = useState(false);

  const handleOpenReservasListModal = () => {
    setOpenReservasListModal(true);
  };

  const handleCloseReservasListModal = () => {
    setOpenReservasListModal(false);
  };

  const handleOpenDetailModal = (reserva) => {
    setSelectedReserva(reserva);
    setOpenDetailModal(true);
  };

  // Função para fechar o modal de detalhes
  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedReserva(null);
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
      console.error("Erro ao buscar reservas do usuário:", error);
    }
  };

  const handleDeleteReserva = async (id_reserva) => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      // Remove a reserva da UI imediatamente
      setReservas(prevReservas => prevReservas.filter(reserva => reserva.id_reserva !== id_reserva));
      handleCloseDetailModal(); // Fecha o modal de detalhes

      try {
        await api.deleteReserva(id_reserva); // Chama a API para deletar
        alert("Reserva cancelada com sucesso!");
      } catch (error) {
        alert("Erro ao cancelar reserva. Tentando reverter ou sincronizar...");
        // Em caso de erro, recarrega para garantir a sincronização
        const id_usuario = localStorage.getItem("id_usuario");
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
      return;
    }

    const getUserInfo = async () => {
      try {
        const response = await api.getUsuario(id_usuario);
        setUserData(response.data.user);
        // Garante que o campo senha do estado esteja vazio ao carregar,
        // já que não queremos exibir a senha original.
        setUserData(prevData => ({ ...prevData, senha: "" }));
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      }
    };

    getUserInfo();
    fetchUserReservas(id_usuario);
  }, []);

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
      alert("ID do usuário inválido. Faça login novamente.");
      return;
    }

    // A MUDANÇA PRINCIPAL AQUI:
    // Se userData.senha estiver vazio, envie um espaço em branco ou um valor específico
    // que o backend entenda como "não alterar a senha".
    // Se o backend do mobile funciona sem preencher, talvez ele envie algo como ' ' ou um valor mágico.
    const senhaParaEnviar = userData.senha.trim() === "" ? " " : userData.senha; // Enviando um espaço se estiver vazio

    const dataToUpdate = {
      id_usuario: id_usuario,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      senha: senhaParaEnviar, // Agora usamos a senha tratada
      cpf: userData.cpf,
    };

    console.log("Dados que serão enviados para a API:", dataToUpdate);

    try {
      await api.updateUser(dataToUpdate);
      setEditMode(false);
      alert("Perfil atualizado com sucesso!");
      // Limpa o campo de senha após o salvamento bem-sucedido
      setUserData(prev => ({ ...prev, senha: "" }));
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(
        "Erro ao atualizar perfil: " +
          (error.response?.data?.error || "Verifique os dados e tente novamente.")
      );
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

        <Box sx={{ display: "flex", gap: 2, marginTop: -10,justifyContent: "flex-end", marginRight: 24 }}>
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
                          console.error("Erro ao buscar informações do usuário ao cancelar:", error);
                      }
                  }
                }}
              >
                Cancelar
              </Button>
            </>
          )}
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
                  <Box onClick={() => handleOpenDetailModal(reserva)} sx={{ cursor: 'pointer', flexGrow: 1 }}>
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
            <Button onClick={handleCloseReservasListModal}>Fechar</Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={styles.modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Detalhes da Reserva
          </Typography>
          {selectedReserva && (
            <Box>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Sala:</span> {selectedReserva.nome_da_sala}
              </Typography>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Data:</span> {formatarData(selectedReserva.data_reserva)}
              </Typography>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Horário de Início:</span> {selectedReserva.horario_inicio}
              </Typography>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Horário de Término:</span> {selectedReserva.horario_fim}
              </Typography>
              <Typography variant="body1">
                <span style={{ fontWeight: 'bold' }}>Descrição:</span> {selectedReserva.descricao || 'N/A'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <IconButton
                  color="error"
                  aria-label="Deletar Reserva"
                  onClick={() => handleDeleteReserva(selectedReserva.id_reserva)}
                >
                  <DeleteIcon />
                </IconButton>
                <Button onClick={handleCloseDetailModal} sx={{ ml: 2 }}>Fechar</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
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
    width: 600, // Largura maior para a lista
    maxWidth: '90%', // Garante que não ultrapasse 90% da largura da tela
    maxHeight: '80%', // Altura máxima para evitar que fique muito grande
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
  }
};