import * as React from "react";
import TextFields from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import api from "../axios/axios";

function Cadastro() {
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
    // alert("Nome:"+user.name+" "+"Idade:"+user.name+" "+"Email:" + user.email + " " + "Senha:" + user.password);
  };

  async function cadastro() {
    await api.postCadastro(user).then(
      (response) => {
        alert(response.data.message);
      },
      (error) => {
        console.log(error);
        alert(error.response.data.error);
      }
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ margin: 1, backgroundColor: "#00A8FF" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cadastro
        </Typography>
        <Box
          component="form"
          sx={{ marginTop: 1 }}
          onSubmit={handleSubmit}
          noValidate
        >
          <TextFields
            required
            fullWidth
            id="nome"
            label="Nome"
            name="nome"
            margin="normal"
            value={user.nome}
            onChange={onChange}
          />
          <TextFields
            required
            fullWidth
            id="cpf"
            label="Cpf"
            name="cpf"
            margin="normal"
            value={user.cpf}
            onChange={onChange}
          />
          <TextFields
            required
            fullWidth
            id="telefone"
            label="Telefone"
            name="telefone"
            margin="normal"
            type="number"
            value={user.telefone}
            onChange={onChange}
          />

          <TextFields
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            margin="normal"
            value={user.email}
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
            value={user.senha}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#00A8FF" }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
export default Cadastro;
