import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import sheets from "../axios/axios"; // Importe o seu objeto axios configurado

function TelaSala() {
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [horariosDisponiveisPorSala, setHorariosDisponiveisPorSala] = useState({});
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [horarioSelecionadoInicio, setHorarioSelecionadoInicio] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const horasPossiveis = Array.from({ length: 16 }, (_, index) => 7 + index); // 7h às 22h

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
  }, []);

  useEffect(() => {
    async function buscarSalasDisponiveis() {
      if (dataSelecionada) {
        try {
          const response = await sheets.getSalasDisponiveisPorData(dataSelecionada);
          setSalasDisponiveis(response.data.salas_disponiveis);
        } catch (error) {
          console.error("Erro ao buscar salas disponíveis:", error);
          setSalasDisponiveis([]);
        }
      } else {
        setSalasDisponiveis([]);
        setSalaSelecionada(null);
      }
      setHorariosDisponiveisPorSala({}); // Limpa os horários ao mudar a data
      setHorarioSelecionadoInicio(null);
    }

    buscarSalasDisponiveis();
  }, [dataSelecionada]);

  useEffect(() => {
    async function buscarHorariosDisponiveis() {
      if (dataSelecionada) {
        try {
          const response = await sheets.getSalasHorariosDisponiveis(dataSelecionada);
          const horariosOrganizados = {};
          response.data.salas.forEach((sala) => {
            horariosOrganizados[sala.id_sala] = sala.horarios_disponiveis;
          });
          setHorariosDisponiveisPorSala(horariosOrganizados);
        } catch (error) {
          console.error("Erro ao buscar horários disponíveis:", error);
          setHorariosDisponiveisPorSala({});
        }
      } else {
        setHorariosDisponiveisPorSala({});
        setHorarioSelecionadoInicio(null);
      }
    }

    buscarHorariosDisponiveis();
  }, [dataSelecionada]);

  function handleDataChange(event) {
    setDataSelecionada(event.target.value);
  }

  function selecionarSala(sala) {
    setSalaSelecionada(sala);
    setHorarioSelecionadoInicio(null);
  }

  function selecionarHorario(horaInicio) {
    setHorarioSelecionadoInicio(horaInicio);
    setModalAberto(true);
  }

  const handleFecharModal = () => {
    setModalAberto(false);
    setHorarioSelecionadoInicio(null);
  };

  const handleConfirmarReserva = async () => {
    if (salaSelecionada && horarioSelecionadoInicio && dataSelecionada) {
      const horarioFim = `${parseInt(horarioSelecionadoInicio.split(':')[0]) + 1}:00`;
      const reservaData = {
        fkid_salas: salaSelecionada.id_salas,
        data_reserva: dataSelecionada,
        horario_inicio: horarioSelecionadoInicio,
        horario_fim: horarioFim,
        id_usuario: 1, // Substituir pelo ID do usuário logado
      };

      try {
        const response = await sheets.criarReserva(reservaData);
        console.log("Reserva criada com sucesso:", response.data);
        setModalAberto(false);
        // Adicionar feedback de sucesso ao usuário
        alert("Reserva realizada com sucesso!");
        // Limpar seleção após a reserva
        setSalaSelecionada(null);
        setHorarioSelecionadoInicio(null);
        setDataSelecionada("");
      } catch (error) {
        console.error("Erro ao criar reserva:", error);
        // Adicionar feedback de erro ao usuário
        alert("Erro ao realizar a reserva. Tente novamente.");
      }
    } else {
      alert("Por favor, selecione a sala, data e horário.");
    }
  };

  const horariosDisponiveisParaEstaSala = salaSelecionada
    ? horariosDisponiveisPorSala[salaSelecionada.id_salas] || []
    : [];

  return (
    <Box sx={styles.container}>
      <Box sx={styles.boxWrapper}>
        {/* Painel Esquerdo: Salas Disponíveis */}
        <Box sx={styles.leftPanel}>
          <Box sx={styles.title}>
            <Typography variant="h6" color="black" mb={2}>
              SALAS DISPONÍVEIS
            </Typography>
          </Box>
          <TextField
            type="date"
            variant="outlined"
            value={dataSelecionada}
            onChange={handleDataChange}
            sx={styles.dateInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {dataSelecionada === "" ? (
            <Typography color="white">Selecione uma data para ver as salas disponíveis.</Typography>
          ) : salasDisponiveis.length === 0 ? (
            <Typography color="white">Nenhuma sala disponível para esta data.</Typography>
          ) : (
            salasDisponiveis.map((sala) => (
              <Box
                key={sala.id_salas}
                sx={{
                  ...styles.salaCard,
                  backgroundColor: salaSelecionada?.id_salas === sala.id_salas ? "#90caf9" : "#eee",
                  cursor: "pointer",
                }}
                onClick={() => selecionarSala(sala)}
              >
                <Typography variant="h6">{sala.nome_da_sala}</Typography>
              </Box>
            ))
          )}
        </Box>

        {/* Painel Direito: Horários Disponíveis */}
        <Box sx={styles.rightPanel}>
          <Typography variant="h4" color="white" mb={2}>
            HORÁRIOS DISPONÍVEIS
          </Typography>
          {salaSelecionada ? (
            <>
              <Typography color="white" mb={2}>
                Sala selecionada: <strong>{salaSelecionada.nome_da_sala}</strong>
              </Typography>
              <Box sx={styles.horariosGrid}>
                {horariosDisponiveisParaEstaSala.map((horario) => (
                  <Button
                    key={`${salaSelecionada.id_salas}-${horario.inicio}`}
                    sx={{
                      ...styles.horarioButton,
                      backgroundColor: horarioSelecionadoInicio === horario.inicio ? "#64b5f6" : "#ccc",
                    }}
                    onClick={() => selecionarHorario(horario.inicio)}
                  >
                    {horario.inicio} - {horario.fim}
                  </Button>
                ))}
                {horariosDisponiveisParaEstaSala.length === 0 && (
                  <Typography color="white">Não há horários disponíveis para esta sala na data selecionada.</Typography>
                )}
              </Box>
              {horarioSelecionadoInicio && (
                <Typography mt={2} color="white">
                  Horário selecionado: {horarioSelecionadoInicio} -{" "}
                  {`${parseInt(horarioSelecionadoInicio.split(':')[0]) + 1}:00`}
                </Typography>
              )}
            </>
          ) : (
            <Typography color="white">Selecione uma sala para ver os horários disponíveis.</Typography>
          )}
        </Box>
      </Box>

      {/* Modal de Confirmação */}
      <Modal
        open={modalAberto}
        onClose={handleFecharModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Confirmar Reserva
          </Typography>
          {salaSelecionada && horarioSelecionadoInicio && dataSelecionada && (
            <>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>{salaSelecionada.nome_da_sala}</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                Data da Reserva: <strong>{dataSelecionada}</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                Horário de Início: <strong>{horarioSelecionadoInicio}</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                Horário de Fim: <strong>{`${parseInt(horarioSelecionadoInicio.split(':')[0]) + 1}:00`}</strong>
              </Typography>
            </>
          )}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button onClick={handleFecharModal} color="primary">
              Fechar
            </Button>
            <Button onClick={handleConfirmarReserva} variant="contained" color="primary">
              Reservar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default TelaSala;

// ---------------------------

const styles = {
  container: {
    backgroundColor: "red",
    minHeight: "100vh",
    padding: "20px",
    width: "100vw",
  },
  boxWrapper: {
    display: "flex",
    gap: "20px",
  },
  leftPanel: {
    flex: 1,
  },
  rightPanel: {
    flex: 1,
  },
  dateInput: {
    width: "100%",
    marginBottom: "20px",
    backgroundColor: "white",
    borderRadius: "5px",
  },
  salaCard: {
    backgroundColor: "#eee",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  horariosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
    marginTop: "20px",
  },
  horarioButton: {
    backgroundColor: "#ccc",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  title: {
    backgroundColor: "white",
    width: "33vh",
    minHeight: "6vh",
    margin: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    padding: 4,
  },
};