import React, { useEffect, useState } from "react";
import api from "../axios/axios";
import {
  Box,
  Typography,
  TextField,
  Menu,
  MenuItem,
  Button,
  // ✅ Adicionado: Import do IconButton e Modal
  IconButton,
  Modal,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// ✅ Adicionado: Import do ícone de lixeira
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ NOVO: Estilo para o modal (posição e tamanho)
// Este estilo é específico para o modal e não faz parte do seu objeto 'styles' principal.
// Ele controla a aparência do popup de detalhes da reserva.
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4, // Padding
  borderRadius: '8px',
};

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [reservas, setReservas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  // ✅ NOVO: Estados para o modal de detalhes/deleção
  const [openModal, setOpenModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const open = Boolean(anchorEl);

  const handleClickDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  // ✅ NOVO: Função para abrir o modal de detalhes da reserva
  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva);
    setOpenModal(true);
    handleCloseDropdown(); // Fecha o dropdown ao abrir o modal
  };

  // ✅ NOVO: Função para fechar o modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReserva(null);
  };

  const formatarData = (dataStr) => {
    // Garante que a data tem o formato 'YYYY-MM-DD' antes de dividir
    if (!dataStr || !dataStr.includes('-')) {
        return dataStr; // Retorna a data original se não estiver no formato esperado
    }
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // ✅ NOVO: Função para carregar as reservas (reutilizável após deleção)
  const fetchUserReservas = async (id_usuario) => {
    try {
      const response = await api.getReservasDoUsuario(id_usuario);
      setReservas(response.data.reservas);
    } catch (error) {
      console.error("Erro ao buscar reservas do usuário:", error);
      alert("Erro ao carregar suas reservas.");
    }
  };

  // ✅ NOVO: Função para deletar uma reserva
  const handleDeleteReserva = async (id_reserva) => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      try {
        await api.deleteReserva(id_reserva); // Chama a API para deletar
        alert("Reserva cancelada com sucesso!");
        handleCloseModal(); // Fecha o modal após deletar
        const id_usuario = localStorage.getItem("id_usuario");
        if (id_usuario) {
          fetchUserReservas(id_usuario); // Recarrega as reservas para atualizar a lista
        }
      } catch (error) {
        console.error("Erro ao cancelar reserva:", error);
        alert("Erro ao cancelar reserva: " + (error.response?.data?.error || "Erro desconhecido."));
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
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      }
    };

    getUserInfo();
    fetchUserReservas(id_usuario); // Garante que as reservas sejam carregadas ao montar
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

    console.log("Dados que serão enviados para a API:", {
      id_usuario: id_usuario,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      senha: userData.senha || "",
      cpf: userData.cpf,
    });

    try {
      await api.updateUser({
        id_usuario: id_usuario,
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        senha: userData.senha || "",
        cpf: userData.cpf,
      });
      setEditMode(false);
      alert("Perfil atualizado com sucesso!");
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
              onClick={handleClickDropdown}
              sx={styles.dropdownButton}
              endIcon={<ArrowDropDownIcon />}
            >
              MINHAS RESERVAS
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseDropdown}
              slotProps={{
                paper: {
                  sx: {
                    width: "410px",
                    maxWidth: "90vw",
                  },
                },
              }}
            >
              {reservas.length > 0 ? (
                reservas.map((reserva, index) => (
                  // ✅ Modificado: Ao clicar no MenuItem, abre o modal com os detalhes da reserva
                  <MenuItem key={index} onClick={() => handleOpenModal(reserva)}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          Sala: {reserva.nome_da_sala}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data: {formatarData(reserva.data_reserva)} às{" "}
                          {reserva.horario_inicio}
                        </Typography>
                      </Box>
                      {/* ✅ Adicionado: Ícone de lixeira para deletar diretamente aqui se preferir, ou apenas no modal */}
                      {/* Por simplicidade e para seguir o fluxo anterior, o delete está no modal */}
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Nenhuma reserva encontrada</MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
        <TextField
          name="senha"
          type="password"
          sx={ styles.campoCPF}
          fullWidth
          margin="normal"
          label="Nova Senha "
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

        {/* Botões de ação (mantidos como você forneceu) */}
        <Box sx={{ display: "flex", gap: 2, marginTop: -10,justifyContent: "flex-end", marginRight: 24 }}>
          {!editMode ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setEditMode(true)}
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
                variant="outlined"
                color="error"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* ✅ NOVO: Componente Modal de Detalhes da Reserva (com opção de deletar) */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
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
              {/* Botões de ação dentro do modal */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {/* ✅ Adicionado: Botão/Ícone de Lixeira para deletar */}
                <IconButton
                  color="error" // Cor vermelha padrão do Material-UI
                  aria-label="Deletar Reserva"
                  onClick={() => handleDeleteReserva(selectedReserva.id_reserva)}
                >
                  <DeleteIcon />
                </IconButton>
                <Button onClick={handleCloseModal} sx={{ ml: 2 }}>Fechar</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Perfil;

// --- Estilos CSS (mantidos EXATAMENTE como você forneceu) ---
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
    backgroundColor: "#e0e0e0",
    width: "200%",
    color: "black",
    fontWeight: "bold",
    textTransform: "none",
    padding: "10px 20px",
    right: "400px",
    "&:hover": {
      backgroundColor: "#ccc",
    },
  },
  campoCPF: {
    width: "30%",
    backgroundColor: "#D9D9D9",
  },
  campoTelefone: {
    width: "30%",
    backgroundColor: "#D9D9D9",
  },
};