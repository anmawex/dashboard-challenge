/**
 * @fileoverview Componente de indicador de carga (spinner)
 *
 * Muestra un indicador visual de carga (spinner circular) con:
 * - Animación de progreso circular
 * - Mensaje de carga personalizable
 * - Opción de modo pantalla completa
 * - Estilos responsivos
 *
 * @module shared/components/LoadingSpinner
 * @requires react
 * @requires @mui/material
 */

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * Componente LoadingSpinner - Indicador visual de carga
 *
 * Renderiza un spinner circular con mensaje opcional para indicar
 * que una operación está en progreso. Puede mostrarse en modo
 * pantalla completa o inline según la configuración.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.message='Cargando...'] - Mensaje a mostrar debajo del spinner.
 *                                                  Por defecto es 'Cargando...'
 * @param {boolean} [props.fullScreen=false] - Si es true, el spinner ocupa toda la altura
 *                                              de la ventana (100vh). Si es false, utiliza
 *                                              padding vertical predefinido
 *
 * @returns {React.ReactElement} Componente de spinner renderizado
 *
 * @example
 * // Spinner inline con mensaje personalizado
 * <LoadingSpinner message="Cargando productos..." />
 *
 * @example
 * // Spinner a pantalla completa
 * <LoadingSpinner
 *   message="Por favor espera..."
 *   fullScreen={true}
 * />
 *
 * @example
 * // Spinner con mensaje por defecto
 * <LoadingSpinner />
 */
const LoadingSpinner = ({ message = "Cargando...", fullScreen = false }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
				py: fullScreen ? 0 : 8,
				height: fullScreen ? "100vh" : "auto",
				width: "100%",
			}}>
			<CircularProgress size={48} thickness={4} />
			<Typography variant="body1" color="text.secondary">
				{message}
			</Typography>
		</Box>
	);
};

export default LoadingSpinner;
