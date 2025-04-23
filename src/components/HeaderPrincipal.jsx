import React from "react";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";

const HeaderPrincpal = () => {
  const styles = getStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("authenticated");
    navigate("/");
  };

  return (
    <Box sx={styles.header}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1200px-SENAI_S%C3%A3o_Paulo_logo.png"
        alt="Logo"
        style={styles.logo}
      />

      <Box sx={styles.rightSection}>
        {location.pathname === "/perfil" && (
          <>
            <Button
              variant="contained"
              onClick={logout}
              sx={styles.buttonToExit}
            >
              Sair
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/inicial")}
              sx={styles.buttonToBack}
            >
              Voltar
            </Button>
          </>
        )}

        {location.pathname !== "/perfil" && (
          <IconButton onClick={() => navigate("/perfil")} sx={{ marginLeft: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 60, borderRadius: 6 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

function getStyles() {
  return {
    header: {
      backgroundColor: "#C5C2C2",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
    },
    logo: {
      width: "250px",
      height: "auto",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    buttonToBack: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        backgroundColor: "red",
        borderRadius: 15,
        color: "#fff",
        fontWeight: "bold",
        textTransform: "none",
        padding: "8px 20px",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
    },
    buttonToExit: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        backgroundColor: "red",
        borderRadius: 15,
        color: "#fff",
        fontWeight: "bold",
        textTransform: "none",
        padding: "8px 20px",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(85, 85, 85, 0.7)",
        },
      },
    },
  };
}

export default HeaderPrincpal;
