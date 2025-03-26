import * as React from "react";
import TextFields from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import api from "../axios/axios";
import { useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";

function Login({mensagem}) {
  const styles = getStyles();

  const navigate = useNavigate();

  useEffect(() => {
    console.log({mensagem})
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
  }, []);

  const [user, setUser] = useState({
    cpf: "",
    senha: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
    // alert("Email:"+user.email+" "+"Senha:"+user.password)
  };

  async function login() {
    await api.postLogin(user).then(
      (response) => {
        alert(response.data.message);
        localStorage.setItem("authenticated", true);
        navigate("/inicial");
      },
      (error) => {
        console.log(error);
        alert(error.response.data.error);
      }
    );
  }

  return (
      <Box sx={styles.body}>
        <Box sx={styles.centerBox}>
          {/* <Avatar sx={{ margin: 1, backgroundColor: "red" }}>
          </Avatar> */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1200px-SENAI_S%C3%A3o_Paulo_logo.png"
            alt="Logo"
            style={styles.logo}
          />
          <Box
            component="form"
            sx={{ marginTop: 1 }}
            onSubmit={handleSubmit}
            noValidate
          >
            <TextFields
              required
              fullWidth
              id="cpf"
              label="Cpf"
              name="cpf"
              margin="normal"
              sx={{ mt: "50px", background: "#D9D9D9" }}
              value={user.cpf}
              onChange={onChange}
            />
            <TextFields
              required
              fullWidth
              id="senha"
              label="Senha"
              name="senha"
              margin="normal"
              type="password"
              sx={{ mb: "15px", background: "#D9D9D9" }}
              value={user.senha}
              onChange={onChange}
            />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={styles.centerText}>Não tem conta?</Typography>
              <Typography
                component={Link}
                to={"/user"}
                sx={styles.centerTextClick}
              >
                Cadastra-se!
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={styles.buttonToCadastro}
              >
                Entrar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
  );
}
export default Login;

function getStyles() {
  return {
    buttonToCadastro: {
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 130,
      height: 45,
      mt: "25px",
      fontWeight: 600,
      fontSize: 15,
      borderRadius: 15,
      textTransform: "none",
    },
    body: {
      width: "100vw", // Ocupa 100% da largura
      height: "83vh", // Ocupa 100% da altura
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
      width: "300px",
      height: "auto",
    },
    centerBox: {
      width: "32vw", // Largura do retângulo
      height: "60vh", // Altura do retângulo
      backgroundColor: "#F5F5F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      borderRadius: "10px", // Bordas arredondadas opcionais
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
