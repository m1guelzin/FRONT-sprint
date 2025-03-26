import { useState, useEffect } from "react";
// Imports para criação de tabela
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
// TableHead é onde colocamos os titulos
import TableHead from "@mui/material/TableHead";
// TableBody é onde colocamos o conteúdo
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import api from "../axios/axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function TelaSalas() {
  const [salas, setSalas] = useState([]);
  const styles = getStyles();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("authenticated");
    navigate("/");
  }

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
  }, []);

  async function getAllSalas() {
    //chamada da api
    await api.getAllSalas().then(
      (response) => {
        console.log(response.data.salas);
        setSalas(response.data.salas);
      },
      (error) => {
        console.log("Erro ", error);
      }
    );
  }

  const listSalas = salas.map((sala) => {
    return (
      <TableRow key={sala.id_salas}>
        <TableCell align="center">{sala.nome_da_sala}</TableCell>
        <TableCell align="center">{sala.capacidade}</TableCell>
        <TableCell align="center">{sala.localizacao}</TableCell>
        <TableCell align="center">{sala.equipamentos}</TableCell>
      </TableRow>
    );
  });

  useEffect(() => {
    //aq devemos criar ou chamar uma função
    getAllSalas();
  }, []);

  return (
    <Container sx={styles.container}>
      <Box sx={styles.header}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1200px-SENAI_S%C3%A3o_Paulo_logo.png"
          alt="Logo"
          style={styles.logo}
        />
        <Avatar
          sx={{
            margin:3,
            backgroundColor: "#9C9494",
          }}
        />
      </Box>
      <Box sx={styles.body}>
        <Box sx={styles.centerBox}>
          {salas.length === 0 ? (
            <Typography>Carregando Lista de salas....</Typography>
          ) : (
            <div style={styles.centerBox}>
              <Typography sx={styles.centerBoxText}>Salas Da Instituição</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead style={{ backgroundColor: "#c50000" }}>
                    <TableRow>
                      <TableCell align="center">Nome</TableCell>
                      <TableCell align="center">Capacidade</TableCell>
                      <TableCell align="center">Localização</TableCell>
                      <TableCell align="center">Equipamentos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{listSalas}</TableBody>
                </Table>
              </TableContainer>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                to="/"
                onClick={logout}
                sx={styles.buttonToCadastro}
              >
                Sair
              </Button>
            </div>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default TelaSalas;

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
      position: "fixed", // Fixar no topo
      justifyContent: "space-between",
      top: 0,
      left: 0,
    },
    headerText: {
      color: "#292929",
      fontSize: 30,
    },
    buttonToCadastro: {
      color: "white",
      backgroundColor: "#c50000",
      fontWeight: 600,
      fontSize: 15,
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
      mt: "15px",
    },
    logo: {
      width: "250px",
      height: "auto",
      padding: "30px",
    },
    centerBox: {
      width: "60vw", // Largura do retângulo
      height: "60vh", // Altura do retângulo
      backgroundColor: "#dcdcdc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      borderRadius: "10px", // Bordas arredondadas opcionais
    },
    centerBoxText: {
      color: "#292929",
      fontSize: 25,
      backgroundColor: "#dcdcdc",
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
    centerText: {
      mt: "5px",
      fontSize: 15,
    },
    centerTextClick: {
      mt: "5px",
      fontSize: 15,
      color: "red",
    },
  };
}
