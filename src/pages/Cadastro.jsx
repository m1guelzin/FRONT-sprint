import * as React from "react";
import TextFields from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import api from "../axios/axios";
import { Link , useNavigate} from "react-router-dom";
import { useEffect } from "react";
import SuccessSnackbar from '../components/SuccessSnackbar'; 
import ErrorSnackbar from '../components/ErrorSnackbar'; 

function Cadastro() {
  const styles = getStyles();
  const navigate = useNavigate();
  const [snackbarMessageError, setsnackbarMessageError] = useState(""); 
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
  }, []);

  const [user, setUser] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    telefone: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    cadastro();
  };

  async function cadastro() {
    await api.postCadastro(user).then(
      (response) => {
        setSnackbarMessage(response.data.message || "Usuário criado com sucesso!");
        setSnackbarOpen(true);
        
        // Atrasar a navegação para que o snackbar seja visível por um tempo
        setTimeout(() => {
          navigate("/login");
        }, 1000); 
      },
      (error) => {
        console.log(error);
        setsnackbarMessageError(error.response?.data?.error || "Erro ao criar usuário. Tente novamente.");
        setErrorSnackbarOpen(true);
      }
    );
  }

  return (
    <Box sx={styles.body}>
      <Box sx={styles.centerBox}>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <TextFields
              required
              fullWidth
              id="nome"
              label="Nome"
              name="nome"
              sx={styles.input}
              value={user.nome}
              onChange={onChange}
            />
            <TextFields
              required
              fullWidth
              id="cpf"
              label="Cpf"
              name="cpf"
              type="number"
              sx={styles.input}
              value={user.cpf}
              onChange={onChange}
            />
            <TextFields
              required
              fullWidth
              id="telefone"
              label="Telefone"
              name="telefone"
              type="number"
              sx={styles.input}
              value={user.telefone}
              onChange={onChange}
            />

            <TextFields
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              sx={styles.input}
              value={user.email}
              onChange={onChange}
            />

            <TextFields
              required
              fullWidth
              id="senha"
              label="Senha"
              name="senha"
              type="password"
              sx={styles.input}
              value={user.senha}
              onChange={onChange}
            />
          </Box>
          <Box sx={{display:"flex", justifyContent:'center'}}>
            <Typography sx={styles.centerText}>Já tem um Login?</Typography>
            <Typography component={Link} to={"/login"} sx={styles.centerTextClick}>Clique aqui!</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={styles.buttonToCadastro}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Box>
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
}
export default Cadastro;

function getStyles() {
  return {
    buttonToCadastro: {
      color: "white",
      backgroundColor: "rgba(255, 0, 0, 1)",
      width: 130,
      height: 45,
      mt: "15px",
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
      width: "250px",
      height: "auto",
    },
    centerBox: {
      width: "25vw", // Largura do retângulo
      height: "73vh", // Altura do retângulo
      backgroundColor: "#F5F5F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      borderRadius: "10px", // Bordas arredondadas opcionais
    },
    input: {
      margin: "5px",
      background: "#D9D9D9",
    },
    centerText:{
      mt:'5px',
      fontSize: 15,
    },
    centerTextClick:{
      mt:'5px',
      fontSize: 15,
      color:'red',
    }
  };
}