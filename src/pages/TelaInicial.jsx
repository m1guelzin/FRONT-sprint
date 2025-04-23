import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";

const TelaInicial = () => {
  const navigate = useNavigate();

  const styles = getStyles();

  return (
    <Box sx={styles.page}>
      <Box sx={styles.main}>
        <Box sx={styles.buttonGroup}>
          <Button sx={styles.menuButton} onClick={() => navigate("/salas")}>
            <MeetingRoomIcon sx={styles.icon} />
            <Typography variant="h6">Salas</Typography>
          </Button>
          <Button sx={styles.menuButton} onClick={() => navigate("/perfil")}>
            <PersonIcon sx={styles.icon} />
            <Typography variant="h6" align="center">
              Minhas<br />Reservas
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const getStyles = () => ({
  page: {
    minHeight: "83vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    width: "100vw", // Ocupa 100% da largura
    height: "83vh", // Ocupa 100% da altura
    backgroundColor: "#F60000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: 14,
  },
  menuButton: {
    backgroundColor: "#C5C2C2",
    color: "black",
    width: 180,
    height: 180,
    borderRadius: 4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    fontSize: "1.2rem",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#a9a9a9",
    },
  },
  icon: {
    fontSize: 80,
    marginBottom: 1,
  },
});

export default TelaInicial;
