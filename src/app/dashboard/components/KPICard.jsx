/**
 * KPI Card component for displaying key metrics
 * @module components/dashboard/KPICard
 */
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

/**
 * @typedef {Object} KPICardProps
 * @property {string} title - El título o etiqueta de la métrica (ej. "Total Ventas").
 * @property {string|number} value - El valor principal a mostrar.
 * @property {string} [subtitle] - Texto secundario opcional en la base de la tarjeta.
 * @property {import('react').ReactNode} icon - El icono decorativo que se muestra en el bloque elevado.
 * @property {string} color - Color base en formato HEX, RGB o nombre para el degradado del icono.
 */

/**
 * Muestra una métrica clave (KPI) dentro de una tarjeta estilizada con un icono elevado.
 * * @component
 * @param {KPICardProps} props - Propiedades para configurar la tarjeta.
 * @returns {JSX.Element}
 */
const KPICard = ({ title, value, subtitle, icon, color }) => {
	return (
		<Card
			sx={{
				height: "100%",
				position: "relative",
				overflow: "visible",
				transition: "transform 0.2s, box-shadow 0.2s",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
				},
			}}>
			{/* Contenedor del Icono Elevado */}
			<Box
				sx={{
					position: "absolute",
					top: -20,
					left: 20,
					width: 56,
					height: 56,
					borderRadius: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
					boxShadow: `0 4px 20px ${color}44`,
					color: "white",
				}}>
				{icon}
			</Box>

			<CardContent sx={{ pt: 5, pb: 2 }}>
				<Box sx={{ textAlign: "right", mb: 1 }}>
					<Typography variant="body2" color="text.secondary">
						{title}
					</Typography>
					<Typography
						variant="h4"
						sx={{ fontWeight: 700, color: "text.primary" }}>
						{value}
					</Typography>
				</Box>

				{subtitle && (
					<Box
						sx={{
							borderTop: "1px solid",
							borderColor: "divider",
							pt: 1,
							mt: 1,
						}}>
						<Typography variant="caption" color="text.secondary">
							{subtitle}
						</Typography>
					</Box>
				)}
			</CardContent>
		</Card>
	);
};

export default KPICard;
