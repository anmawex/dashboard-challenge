/**
 * @fileoverview Componente de mensaje de error
 *
 * Muestra un mensaje de error formateado con:
 * - Alerta visual con icono de error
 * - Título descriptivo
 * - Mensaje de error personalizado
 * - Botón de reintento opcional
 *
 * @module shared/components/ErrorMessage
 * @requires react
 * @requires @mui/material
 * @requires @mui/icons-material
 */

import React from "react";
import { Alert, AlertTitle, Button, Box } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

/**
 * Componente ErrorMessage - Muestra mensajes de error con opción de reintento
 *
 * Proporciona una interfaz de error consistente y accesible que incluye:
 * - Alerta visual con estilo de error
 * - Título fijo "Error"
 * - Mensaje de error personalizable
 * - Botón de reintento opcional
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Texto del mensaje de error a mostrar
 * @param {Function} [props.onRetry] - Callback opcional para el botón de reintento.
 *                                      Si se proporciona, mostrará el botón "Reintentar"
 *
 * @returns {React.ReactElement} Componente de alerta de error renderizado
 *
 * @example
 * // Sin botón de reintento
 * <ErrorMessage message="Ocurrió un error al cargar los datos" />
 *
 * @example
 * // Con botón de reintento
 * <ErrorMessage
 *   message="Fallo la conexión con el servidor"
 *   onRetry={() => fetchData()}
 * />
 */
const ErrorMessage = ({ message, onRetry }) => {
	return (
		<Box sx={{ py: 4 }}>
			<Alert
				severity="error"
				sx={{
					borderRadius: 2,
					"& .MuiAlert-message": { width: "100%" },
				}}>
				<AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
				{message}
				{onRetry && (
					<Box sx={{ mt: 2 }}>
						<Button
							variant="outlined"
							color="error"
							size="small"
							startIcon={<RefreshIcon />}
							onClick={onRetry}>
							Reintentar
						</Button>
					</Box>
				)}
			</Alert>
		</Box>
	);
};

export default ErrorMessage;
