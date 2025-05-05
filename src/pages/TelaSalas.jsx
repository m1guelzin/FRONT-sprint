import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";
import api from "../axios/axios"; // Importe o seu objeto axios configurado

function TelaSala() {
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [horariosDisponiveisPorSala, setHorariosDisponiveisPorSala] = useState(
    {}
  );
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [horarioSelecionadoInicio, setHorarioSelecionadoInicio] =
    useState(null);
  const [modalAberto, setModalAberto] = useState(false);

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
          console.log("salas disponiveis", response.data.salas_disponiveis);
        } catch (error) {
          console.error("Erro ao buscar salas disponíveis:", error);
          setSalasDisponiveis([]);
        }
      } else {
        setSalasDisponiveis([]);
        setSalaSelecionada("");
      }

      setHorarioSelecionadoInicio(null);
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
        }
      } else {
        setHorariosDisponiveisPorSala({});
        setHorarioSelecionadoInicio(null);
      }
    }

    buscarHorariosDisponiveis();
  }, [dataSelecionada]);

  function handleDataChange(event) { // Atualizar o estado da data selecionada
    setDataSelecionada(event.target.value);
  }

  function selecionarSala(sala) { // 	Definir a sala e limpar o horário anterior
    setSalaSelecionada(sala);
    setHorarioSelecionadoInicio(null);
  }

  function selecionarHorario(horaInicio) { // Definir o horário e abrir o modal de reserva
    setHorarioSelecionadoInicio(horaInicio);
    setModalAberto(true);
  }

  function handleDataChange(event) {
    const selectedDate = event.target.value;
    const dataAtual = new Date().toISOString().split("T")[0];

    if (selectedDate < dataAtual) {
      alert("A reserva não pode estar no Passado");
    } else {
      setDataSelecionada(selectedDate);
    }
  }

  const handleFecharModal = () => {
    setModalAberto(false);
    setHorarioSelecionadoInicio(null);
  };

  const handleConfirmarReserva = async () => {
    if (salaSelecionada && horarioSelecionadoInicio && dataSelecionada) { // Coleta tudo
      const horarioInicioAPI = `${horarioSelecionadoInicio}:00`; // Adiciona os segundos
      const horaFim = parseInt(horarioSelecionadoInicio.split(":")[0]) + 1;
      const horarioFimAPI = `${horaFim < 10 ? "0" + horaFim : horaFim}:00:00`; 
      // Adiciona os segundos e formata a hora com zero à esquerda se necessário

      const userId = localStorage.getItem("id_usuario");

      const reservaData = {
        fkid_salas: salaSelecionada.id_salas,
        data_reserva: dataSelecionada,
        horario_inicio: horarioInicioAPI,
        horario_fim: horarioFimAPI,
        id_usuario: userId,
      };

      console.log("Dados da reserva a serem enviados:", reservaData);

      try {
        const response = await api.criarReserva(reservaData);
        console.log("Reserva criada com sucesso:", response.data);
        setModalAberto(false);
        alert(response.data.message);
        setSalaSelecionada("");
        setHorarioSelecionadoInicio(null);
        setDataSelecionada("");
      } catch (error) {
        console.error("Erro ao criar reserva:", error);
        alert(error.response.data.error);
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
              onChange={handleDataChange}
              sx={styles.dateInput}
              slotProps={{
                inputLabel: { shrink: true },
              }}
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
                      ? "#90caf9" //azul p/ selecionado
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

        {/* Painel Direito: Horários Disponíveis */}
        <Box sx={styles.rightPanel}>
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
                {horariosDisponiveisParaEstaSala.map((horario) => (
                  <Button
                    key={`${salaSelecionada.id_salas}-${horario.inicio}`}
                    sx={{
                      ...styles.horarioButton,
                      backgroundColor:
                        horarioSelecionadoInicio === horario.inicio
                          ? "#64b5f6" //azul p/ selecionado
                          : "#ccc", //cinza
                    }}
                    onClick={() => selecionarHorario(horario.inicio)}
                  >
                    {horario.inicio} - {horario.fim}
                  </Button>
                ))}
                {horariosDisponiveisParaEstaSala.length === 0 && (
                  <Typography color="black">
                    Não há horários disponíveis para esta sala na data
                    selecionada.
                  </Typography>
                )}
              </Box>
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
          {salaSelecionada && horarioSelecionadoInicio && dataSelecionada && (
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
                Horário de Início: <strong>{horarioSelecionadoInicio}</strong>
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
              onClick={handleConfirmarReserva}
              variant="contained"
              color="success"
            >
              Confirmar Reserva
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
    backgroundColor: "red", // Cor de fundo vermelha do protótipo
    minHeight: "100vh",
    padding: "20px",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centralizar conteúdo horizontalmente
  },
  boxWrapper: {
    display: "flex",
    gap: "20px",
    maxWidth: "1800px", // Largura máxima para evitar que os painéis fiquem muito largos
    width: "100%",
  },
  leftPanel: {
    flex: 1,
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    flexDirection: "column", // Organizar título, seletor de data e lista de salas verticalmente
  },
  leftPanelTop: {
    // Novo estilo para agrupar título e seletor de data
    display: "flex",
    justifyContent: "space-between", // Espaçar os elementos horizontalmente
    alignItems: "center", // Alinhar verticalmente ao centro
    marginBottom: "15px", // Espaço abaixo desta linha
    width: "100%", // Ocupar toda a largura do painel esquerdo
  },
  dateInput: {
    width: "25%",
    marginBottom: "20px",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "10px",
    boxSizing: "border-box", // Ajustar a largura para o conteúdo
  },
  // ... restante dos seus estilos ...
  rightPanel: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centralizar os botões de horário
  },
  title: {
    backgroundColor: "white",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "center",
  },
  salaCard: {
    backgroundColor: "#dcdcdc", // Tom de cinza mais escuro para os cards de sala
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#c0c0c0", // Feedback visual ao passar o mouse
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
    padding: 16, // Aumentei o padding para mais espaço interno
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
