import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import DefaultLayout from "./components/DefaultLayout";
import Header from "./components/Header";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import TelaSalas from "./pages/TelaSalas";
import Perfil from "./pages/Perfil";
import TelaInicial from "./pages/TelaInicial";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <DefaultLayout headerRender={1} mensagem={"Pagina de Login"}>
                <Login />
              </DefaultLayout>
            }
          />

          <Route
            path="/user"
            element={
              <DefaultLayout headerRender={1} mensagem={"Pagina de Cadastro"}>
                <Cadastro />
              </DefaultLayout>
            }
          />

          <Route
            path="/inicial"
            element={
              <DefaultLayout headerRender={1} mensagem={"Pagina Inicial"}>
                <TelaInicial />
              </DefaultLayout>
            }
          />

          <Route
            path="/salas"
            element={
              <ProtectedRoute>
                <TelaSalas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
