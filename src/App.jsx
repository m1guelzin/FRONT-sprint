import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import TelaSalas from "./pages/TelaSalas";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/user" element={<Cadastro />} />

          <Route path="/inicial" element={
            <ProtectedRoute>
              <TelaSalas/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
