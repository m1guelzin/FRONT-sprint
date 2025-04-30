// ModalReserva.jsx
import { Box, Typography, Modal, Button } from "@mui/material";
import styles from "./styles"; // Importe os estilos

function ModalReserva({
  open,
  onClose,
  salaSelecionada,
  horarioSelecionadoInicio,
  dataSelecionada,
  onConfirmarReserva,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles.modalStyle}>
        <Typography id="modal-modal-title" fontSize={30} variant="h5" component="h2" mb={2}>
          ESPECIFICAÇÕES GERAIS DA SALA
        </Typography>
        {salaSelecionada && horarioSelecionadoInicio && dataSelecionada && (
          <>
            <Typography id="modal-modal-description" fontSize={24} sx={{ mt: 2 }}>
              Nome da sala: <strong>{salaSelecionada?.nome_da_sala}</strong>
            </Typography>
            {salaSelecionada?.capacidade && (
              <Typography id="modal-modal-description" fontSize={20} sx={{ mt: 2 }}>
                Capacidade: <strong>{salaSelecionada.capacidade}</strong>
              </Typography>
            )}
            {salaSelecionada?.localizacao && (
              <Typography id="modal-modal-description" fontSize={20} sx={{ mt: 0 }}>
                Localização: <strong>{salaSelecionada.localizacao}</strong>
              </Typography>
            )}
            {salaSelecionada?.equipamentos && (
              <Typography id="modal-modal-description" fontSize={20} sx={{ mt: 0 }}>
                Equipamentos: <strong>{salaSelecionada.equipamentos}</strong>
              </Typography>
            )}
            <Typography id="modal-modal-description" fontSize={20} sx={{ mt: 2 }}>
              Data da Reserva: <strong>{dataSelecionada}</strong>
            </Typography>
            <Typography id="modal-modal-description" fontSize={20} sx={{ mt: 0 }}>
              Horário de Início: <strong>{horarioSelecionadoInicio}</strong>
            </Typography>
            {horarioSelecionadoInicio && (
              <Typography id="modal-modal-description" fontSize={20} sx={{ mt: 0 }}>
                Horário de Fim: <strong>{`${parseInt(horarioSelecionadoInicio.split(':')[0]) + 1}:00`}</strong>
              </Typography>
            )}
          </>
        )}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <Button sx={styles.modalCloseButton} onClick={onClose} color="error">
            Fechar
          </Button>
          <Button sx={styles.modalConfirmButton} onClick={onConfirmarReserva} variant="contained" color="success">
            Confirmar Reserva?
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalReserva;

const styles = {
    modalStyle: {
        backgroundColor: "#808080",
        color:"#808080", 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        padding: 16, // Aumentei o padding para mais espaço interno
        borderRadius: "8px",
      },
      modalConfirmButton:{
        display: "flex"
      },
      modalCloseButton:{
        backgroundColor: "red",
        color: "white"
      }
}