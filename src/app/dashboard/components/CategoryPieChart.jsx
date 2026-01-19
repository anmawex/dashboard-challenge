/**
 * Pie chart component for category distribution
 * @module components/dashboard/CategoryPieChart
 */
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";

/**
 * @typedef {Object} CategoryData
 * @property {string} name - Nombre de la categoría que aparecerá en la leyenda.
 * @property {number} value - Valor numérico (conteo de productos) para el gráfico.
 */

/**
 * @typedef {Object} CategoryPieChartProps
 * @property {CategoryData[]} data - Array de objetos con los datos de las categorías.
 */

const COLORS = [
	"#1976d2",
	"#2e7d32",
	"#ed6c02",
	"#9c27b0",
	"#00bcd4",
	"#ff5722",
	"#607d8b",
];

/**
 * Muestra la distribución de categorías mediante un gráfico de tipo dona (pie/doughnut).
 * * @component
 * @param {CategoryPieChartProps} props - Propiedades del componente.
 * @returns {JSX.Element} El gráfico renderizado dentro de un Card de Material UI.
 */
const CategoryPieChart = ({ data }) => {
	return (
		<Card sx={{ height: "100%" }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Distribución por Categoría
				</Typography>
				<Box sx={{ height: 300 }}>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={20}
								outerRadius={50}
								paddingAngle={3}
								dataKey="value"
								// Formateo de la etiqueta que sale del gráfico
								label={({ name, percent }) =>
									`${name.substring(0, 10)}${name.length > 10 ? "..." : ""} (${(percent * 100).toFixed(0)}%)`
								}
								labelLine={{ stroke: "#64748b", strokeWidth: 1 }}>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
										style={{ outline: "none" }}
									/>
								))}
							</Pie>
							<Tooltip
								// Formateador del Tooltip que aparece al pasar el mouse
								formatter={(value, name) => [`${value} productos`, name]}
								contentStyle={{
									borderRadius: 8,
									border: "none",
									boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
								}}
							/>
							<Legend
								layout="horizontal"
								verticalAlign="bottom"
								align="center"
								wrapperStyle={{ paddingTop: 20 }}
							/>
						</PieChart>
					</ResponsiveContainer>
				</Box>
			</CardContent>
		</Card>
	);
};

export default CategoryPieChart;
