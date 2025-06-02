import { useEffect, useState, useRef } from "react";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";
import api from "../axios/axios";

// NOVO: Importe o SuccessSnackbar
import SuccessSnackbar from '../components/SuccessSnackbar';

function TelaSala() {
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [horariosDisponiveisPorSala, setHorariosDisponiveisPorSala] = useState(
    {}
  );
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  // NOVO: Estados para o Snackbar (open e message)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const horariosPanelRef = useRef(null);

  // NOVO: Função para fechar o Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.boxSizing = "border-box";
  }, []);

  useEffect(() => {
    async function buscarSalasDisponiveis() {
      if (dataSelecionada) {
        try {
          const response = await api.getSalasDisponiveisPorData(
            dataSelecionada
          );
          setSalasDisponiveis(response.data.salas_disponiveis);
          if (salaSelecionada && !response.data.salas_disponiveis.some(s => s.id_salas === salaSelecionada.id_salas)) {
              setSalaSelecionada(null);
          }
        } catch (error) {
          console.error("Erro ao buscar salas disponíveis:", error);
          setSalasDisponiveis([]);
          setSnackbarMessage("Erro ao buscar salas disponíveis.");
          setSnackbarOpen(true);
        }
      } else {
        setSalasDisponiveis([]);
        setSalaSelecionada(null);
      }
      setHorariosSelecionados([]);
    }

    buscarSalasDisponiveis();
  }, [dataSelecionada]);

  useEffect(() => {
    async function buscarHorariosDisponiveis() {
      if (dataSelecionada) {
        try {
          const response = await api.getSalasHorariosDisponiveis(
            dataSelecionada
          );
          const horariosOrganizados = {};
          response.data.salas.forEach((sala) => {
            horariosOrganizados[sala.id_sala] = sala.horarios_disponiveis;
          });
          setHorariosDisponiveisPorSala(horariosOrganizados);
        } catch (error) {
          console.error("Erro ao buscar horários disponíveis:", error);
          // NOVO: Usar Snackbar em caso de erro na busca (opcional)
          setSnackbarMessage("Erro ao buscar horários disponíveis.");
          setSnackbarOpen(true);
        }
      } else {
        setHorariosDisponiveisPorSala({});
        setHorariosSelecionados([]);
      }
    }

    buscarHorariosDisponiveis();
  }, [dataSelecionada]);

  function handleDataSelectionChange(event) {
    const selectedDate = event.target.value;
    const dataAtual = new Date().toISOString().split("T")[0];

    if (selectedDate < dataAtual) {
      // NOVO: Usar Snackbar em vez de alert
      setSnackbarMessage("A reserva não pode ser feita para uma data no passado.");
      setSnackbarOpen(true);
      setDataSelecionada("");
    } else {
      setDataSelecionada(selectedDate);
    }
  }

  function selecionarSala(sala) {
    setSalaSelecionada(sala);
    setHorariosSelecionados([]);

    if (horariosPanelRef.current) {
      horariosPanelRef.current.scrollIntoView({
        behavior: "smooth", // Para um scroll suave
        block: "start",      // Alinha o topo do elemento com o topo da janela/viewport
      });
    }
  }

  function toggleHorario(horarioCompleto) {
    setHorariosSelecionados((prevHorarios) => {
      const jaSelecionado = prevHorarios.some(h => h.inicio === horarioCompleto.inicio);

      if (jaSelecionado) {
        return prevHorarios.filter((h) => h.inicio !== horarioCompleto.inicio);
      } else {
        return [...prevHorarios, horarioCompleto];
      }
    });
  }

  function handleOpenModal() {
    if (horariosSelecionados.length > 0 && salaSelecionada && dataSelecionada) {
      setModalAberto(true);
    } else {
      // NOVO: Usar Snackbar em vez de alert
      setSnackbarMessage("Por favor, selecione pelo menos um horário, uma sala e uma data.");
      setSnackbarOpen(true);
    }
  }

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  const handleConfirmarReservas = async () => {
    if (!salaSelecionada || !dataSelecionada || horariosSelecionados.length === 0) {
      // NOVO: Usar Snackbar em vez de alert
      setSnackbarMessage("Por favor, selecione a sala, data e pelo menos um horário.");
      setSnackbarOpen(true);
      return;
    }

    const userId = localStorage.getItem("id_usuario");
    if (!userId) {
        // NOVO: Usar Snackbar em vez de alert
        setSnackbarMessage("ID do usuário não encontrado. Faça login novamente.");
        setSnackbarOpen(true);
        return;
    }

    const reservasParaCriar = horariosSelecionados.map(horario => {
        return {
          fkid_salas: salaSelecionada.id_salas,
          data_reserva: dataSelecionada,
          horario_inicio: `${horario.inicio}:00`,
          horario_fim: `${horario.fim}:00`,
          id_usuario: userId,
        };
    });

    console.log("Dados das reservas a serem enviados:", reservasParaCriar);

    let reservasComSucesso = 0;
    let reservasComErro = 0;
    let mensagensErro = [];

    for (const reserva of reservasParaCriar) {
      try {
        const response = await api.criarReserva(reserva);
        console.log("Reserva criada com sucesso:", response.data);
        reservasComSucesso++;
      } catch (error) {
        console.error("Erro ao criar reserva:", error);
        reservasComErro++;
        mensagensErro.push(`Conflito para ${reserva.horario_inicio}-${reserva.horario_fim} na sala ${salaSelecionada.nome_da_sala}: ${error.response?.data?.error || "Erro desconhecido."}`);
      }
    }

    setModalAberto(false);

    // NOVO: Lógica de exibição do Snackbar de SUCESSO (ou erro genérico)
    if (reservasComSucesso > 0 && reservasComErro === 0) {
        setSnackbarMessage(`${reservasComSucesso} reserva(s) criada com sucesso!`);
        setSnackbarOpen(true);
    } else if (reservasComSucesso > 0 && reservasComErro > 0) {
        setSnackbarMessage(`Algumas reservas foram criadas (${reservasComSucesso}), mas houveram erros em outras (${reservasComErro}).`);
        setSnackbarOpen(true);
        console.warn("Detalhes dos erros de reserva:", mensagensErro.join("\n"));
    } else {
        setSnackbarMessage(`Nenhuma reserva foi criada. Erros: ${mensagensErro.join("\n")}`);
        setSnackbarOpen(true);
    }

    setSalaSelecionada(null);
    setHorariosSelecionados([]);
    setDataSelecionada("");
  };

  const horariosDisponiveisParaEstaSala = salaSelecionada
    ? horariosDisponiveisPorSala[salaSelecionada.id_salas] || []
    : [];

  return (
    <Box sx={styles.container}>
      <Box sx={styles.boxWrapper}>
        {/* Painel Esquerdo: Salas Disponíveis */}
        <Box sx={styles.leftPanel}>
          <Box sx={styles.leftPanelTop}>
            <Box sx={styles.title}>
              <Typography variant="h6" color="black">
                SALAS DA INSTITUIÇÃO
              </Typography>
            </Box>
            <TextField
              type="date"
              variant="outlined"
              value={dataSelecionada}
              onChange={handleDataSelectionChange}
              sx={styles.dateInput}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {dataSelecionada === "" ? (
            <Typography color="white">
              Selecione uma data para ver as salas disponíveis.
            </Typography>
          ) : salasDisponiveis.length === 0 ? (
            <Typography color="white">
              Nenhuma sala disponível para esta data.
            </Typography>
          ) : (
            salasDisponiveis.map((sala) => (
              <Box
                key={sala.id_salas}
                sx={{
                  ...styles.salaCard,
                  backgroundColor:
                    salaSelecionada?.id_salas === sala.id_salas
                      ? "#90caf9"
                      : "#eee",
                  cursor: "pointer",
                }}
                onClick={() => selecionarSala(sala)}
              >
                <Typography variant="h6">Nome da Sala: {sala.nome_da_sala}</Typography>
                <Typography variant="h6">{sala.localizacao}</Typography>
                <Typography variant="h6">Capacidade máx: {sala.capacidade}</Typography>
              </Box>
            ))
          )}
        </Box>
        <Box sx={styles.rightPanel} ref={horariosPanelRef}>
          <Typography variant="h4" color="black" mb={2}>
            HORÁRIOS DISPONÍVEIS
          </Typography>
          {salaSelecionada ? (
            <>
              <Typography color="black" mb={2}>
                Sala selecionada:{" "}
                <strong>{salaSelecionada.nome_da_sala}</strong>
              </Typography>
              <Box sx={styles.horariosGrid}>
                {horariosDisponiveisParaEstaSala.length === 0 ? (
                  <Typography color="black">
                    Não há horários disponíveis para esta sala na data
                    selecionada.
                  </Typography>
                ) : (
                  horariosDisponiveisParaEstaSala.map((horario) => (
                    <Button
                      key={`${salaSelecionada.id_salas}-${horario.inicio}`}
                      sx={{
                        ...styles.horarioButton,
                        backgroundColor: horariosSelecionados.some(h => h.inicio === horario.inicio)
                          ? "#64b5f6"
                          : "#ccc",
                      }}
                      onClick={() => toggleHorario(horario)}
                    >
                      {horario.inicio} - {horario.fim}
                    </Button>
                  ))
                )}
              </Box>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenModal}
                sx={{ mt: 3, p: 2 }}
                disabled={horariosSelecionados.length === 0}
              >
                Reservar Horários Selecionados
              </Button>
            </>
          ) : (
            <Typography color="black">
              Selecione uma sala para ver os horários disponíveis.
            </Typography>
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
          <Typography
            id="modal-modal-title"
            fontSize={30}
            variant="h5"
            component="h2"
            mb={2}
          >
            ESPECIFICAÇÕES GERAIS DA SALA
          </Typography>
          {salaSelecionada && dataSelecionada && (
            <>
              <Typography
                id="modal-modal-description"
                fontSize={24}
                sx={{ mt: 2 }}
              >
                Nome da sala: <strong>{salaSelecionada.nome_da_sala}</strong>
              </Typography>

              <Typography
                id="modal-modal-description"
                fontSize={20}
                sx={{ mt: 2 }}
              >
                Capacidade: <strong>{salaSelecionada.capacidade}</strong>
              </Typography>

              <Typography
                id="modal-modal-description"
                fontSize={20}
                sx={{ mt: 0 }}
              >
                Localização: <strong>{salaSelecionada.localizacao}</strong>
              </Typography>

              <Typography
                id="modal-modal-description"
                fontSize={20}
                sx={{ mt: 0 }}
              >
                Equipamentos: <strong>{salaSelecionada.equipamentos}</strong>
              </Typography>

              <Typography
                id="modal-modal-description"
                fontSize={20}
                sx={{ mt: 2 }}
              >
                Data da Reserva: <strong>{dataSelecionada}</strong>
              </Typography>

              <Typography
                id="modal-modal-description"
                fontSize={20}
                sx={{ mt: 0 }}
              >
                Horários Selecionados:{" "}
                <strong>
                  {horariosSelecionados.length > 0
                    ? horariosSelecionados.map(h => `${h.inicio}-${h.fim}`).join(", ")
                    : "Nenhum horário selecionado"}
                </strong>
              </Typography>
            </>
          )}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: "20px",
            }}
          >
            <Button
              sx={styles.modalCloseButton}
              onClick={handleFecharModal}
              color="error"
            >
              Fechar
            </Button>
            <Button
              sx={styles.modalConfirmButton}
              onClick={handleConfirmarReservas}
              variant="contained"
              color="success"
            >
              Confirmar Reservas
            </Button>
          </Box>
        </Box>
      </Modal>
      
      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar} // Use a função criada para fechar
      />
    </Box>
  );
}

export default TelaSala;

// --- Estilos CSS (mantidos os relevantes) ---
const styles = {
  container: {
    backgroundColor: "red",
    minHeight: "100vh",
    padding: "20px",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  boxWrapper: {
    display: "flex",
    gap: "20px",
    maxWidth: "1800px",
    width: "100%",
  },
  leftPanel: {
    flex: 1,
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
  },
  leftPanelTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    width: "100%",
  },
  dateInput: {
    width: "25%",
    marginBottom: "20px",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "10px",
    boxSizing: "border-box",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    backgroundColor: "white",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "center",
  },
  salaCard: {
    backgroundColor: "#dcdcdc",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#c0c0c0",
    },
  },
  horariosGrid: {
    flexDirection: "row",
    fleWrap: "wrap",
    justifyContent: "space-between",
  },
  horarioButton: {
    color: "black",
    padding: 2,
    borderRadius: 5,
    backgroundColor: "#e1f5fe",
    marginBottom: 1,
    margin: 1,
    cursor: "pointer",
    fontSize: "0.9rem",
    "&:hover": {
      backgroundColor: "#b0b0b0",
    },
  },
  modalStyle: {
    color: "#808080",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    padding: 6,
    borderRadius: "8px",
  },
  modalConfirmButton: {
    display: "flex",
  },
  modalCloseButton: {
    backgroundColor: "red",
    color: "white",
  },
};