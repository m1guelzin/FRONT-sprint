import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import TelaSalas from "./pages/TelaSalas";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
                <Home />
            }
          />

          <Route path="/login" element={<Login mensagem={'LOGIN'} />} />

          <Route path="/user" element={<Cadastro />} />

          <Route
            path="/inicial"
            element={
              <ProtectedRoute  mensagem={'Tela salas'}>
                <TelaSalas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Footer /> 
    </div>
  );
}

export default App;
