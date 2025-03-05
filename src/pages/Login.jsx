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

function Login() {
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
      },
      (error) => {
        console.log(error);
        alert(error.response.data.error);
      }
    );
  }

  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ margin: 1, backgroundColor: "red" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Vio
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
            sx={{ mt: 3, mb: 2, backgroundColor: "red" }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
export default Login;
