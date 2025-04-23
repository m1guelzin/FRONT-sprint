import React, { useEffect, useState } from "react";
import api from "../axios/axios";
import {
  Box,
  Typography,
  TextField,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [reservas, setReservas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();


  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    const id_usuario = localStorage.getItem("id_usuario");

    if (!id_usuario) return;

    const getUserInfo = async () => {
      try {
        const response = await api.getUsuario(id_usuario);
        console.log("Dados do usuário retornados da API:", response.data);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    const getUserReservas = async () => {
      try {
        const response = await api.getReservasDoUsuario(id_usuario);
        setReservas(response.data.reservas);
        console.log(
          "Dados das Reservas retornadas da API:",
          response.data.reservas
        );
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };

    getUserInfo();
    getUserReservas();
  }, []);

  return (
    <Box sx={styles.container}>
      <Typography variant="h5" sx={styles.title}>
        PERFIL DE USUÁRIO
      </Typography>
      <Box sx={styles.boxWrapper}>
        <TextField
          sx={{ backgroundColor: "#D9D9D9" }}
          fullWidth
          margin="normal"
          label="Nome Completo do Usuário"
          value={userData.nome || ""}
          InputProps={{ readOnly: true }}
        />
        <TextField
          sx={{ backgroundColor: "#D9D9D9" }}
          fullWidth
          margin="normal"
          label="Email do Usuário"
          value={userData.email || ""}
          InputProps={{ readOnly: true }}
        />
        <Box sx={styles.fieldsRow}>
          <TextField
            style={styles.campoTelefone}
            sx={{ backgroundColor: "#D9D9D9" }}
            fullWidth
            margin="normal"
            label="Telefone do Usuário"
            value={userData.telefone || ""}
            InputProps={{ readOnly: true }}
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
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseDropdown}
            PaperProps={{
                sx: {
                  width: "410px", // ou qualquer valor que combine com o botão
                  maxWidth: "90vw", // segurança pra responsividade
                },
              }}>
              {reservas.map((reserva, index) => (
                <MenuItem key={index}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {reserva.nome_da_sala}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatarData(reserva.data_reserva)} às{" "}
                      {reserva.horario_inicio}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
        <TextField
          sx={styles.campoCPF}
          fullWidth
          margin="normal"
          label="CPF do Usuário"
          value={userData.cpf || ""}
          InputProps={{ readOnly: true }}
        />
      </Box>
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
