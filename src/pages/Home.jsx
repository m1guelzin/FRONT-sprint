import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";

function Home() {
  const styles = getStyles();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
  }, []);

  return (
    <Container sx={styles.container}>
      <Box sx={styles.header}>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography sx={styles.headerText}>Pagina Home</Typography>
        </Box>
        <Button
          component={Link}
          to="/user"
          sx={styles.buttonToCadastro}
          variant="text"
        >
          Cadastre-se
        </Button>
        <Button
          component={Link}
          to="/login"
          sx={styles.buttonToLogin}
          variant="text"
        >
          Login
        </Button>
      </Box>
      <Box sx={styles.body}>
        <Box sx={styles.welcomeBox}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1200px-SENAI_S%C3%A3o_Paulo_logo.png" alt="Logo" style={styles.logo}/>
          <Typography sx={styles.bodyText}>Seja Bem-vindo</Typography>
        </Box>
      </Box>
      <Box sx={styles.footer}>
        <Typography sx={styles.footerText}>&copy; SENAI Franca SP</Typography>
      </Box>
    </Container>
  );
}

function getStyles() {
  return {
    container: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    header: {
      backgroundColor: "#C5C2C2",
      width: "100vw", // Define a largura total da tela
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      position: "fixed", // Fixar no topo
      top: 0,
      left: 0,
    },
    headerText: {
      ml: "40vh",
      color: "#292929",
      fontSize: 30,
    },
    buttonToCadastro: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 130,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    buttonToLogin: {
      "&.MuiButton-root": {
        border: "none",
        boxShadow: "none",
        "&:hover": {
          border: "none",
          backgroundColor: "rgba(255, 0, 0, 0.55)",
        },
      },
      mr: 4,
      ml: 3,
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 80,
      height: 45,
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    body: {
      width: "100vw", // Ocupa 100% da largura
      height: "100vh", // Ocupa 100% da altura
      backgroundColor: "#F60000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    bodyText: {
      color: "#292929",
      fontSize: 50,
      mt:'15px',
    },
    logo: {
      width: "300px",
      height: "auto",
    },
    welcomeBox: {
      width: "40vw", // Largura do retângulo
      height: "30vh", // Altura do retângulo
      backgroundColor: "#C5C2C2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection:'column',
      borderRadius: "10px", // Bordas arredondadas opcionais
    },
    footer: {
      backgroundColor: "#C5C2C2",
      width: "100vw",
      height: "7vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed", // Fixa no final da tela
      bottom: 0, // Cola o footer na parte inferior
      left: 0,
    },
    footerText: {
      fontSize: 18,
    },
  };
}

export default Home;
