import React from "react";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useLocation } from "react-router-dom";

const HeaderPrincpal = () => {
  const styles = getStyles();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={styles.header}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1200px-SENAI_S%C3%A3o_Paulo_logo.png"
        alt="Logo"
        style={styles.logo}
      />

      {location.pathname !== "/perfil" && (
        <IconButton onClick={() => navigate("/perfil")} sx={{ margin: 2 }}>
          <AccountCircleIcon sx={{ fontSize: 60, borderRadius: 6 }} />
        </IconButton>
      )}
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
    },
    headerText: {
      color: "#292929",
      fontSize: 30,
    },
    logo: {
      width: "250px",
      height: "auto",
      padding: "30px",
    },
  };
}

export default HeaderPrincpal;
