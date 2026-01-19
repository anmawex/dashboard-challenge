/**
 * Bar chart component for top expensive products
 * @module components/dashboard/TopProductsChart
 */
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { formatCurrency } from "@/shared/utils/formatters";

/**
 * @typedef {Object} ProductData
 * @property {string} title - Nombre del producto (se usa como etiqueta en el eje Y).
 * @property {number} price - Precio del producto (se usa como valor en el eje X).
 */

/**
 * @typedef {Object} TopProductsChartProps
 * @property {ProductData[]} data - Lista de los productos más costosos a graficar.
 */

const COLORS = ["#1976d2", "#42a5f5", "#64b5f6", "#90caf9", "#bbdefb"];

/**
 * Muestra los 5 productos más caros en un gráfico de barras horizontales.
 * * @component
 * @param {TopProductsChartProps} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const TopProductsChart = ({ data }) => {
	return (
		<Card sx={{ height: "100%" }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Top 5 Productos Más Caros
				</Typography>
				<Box sx={{ height: 300 }}>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							layout="vertical"
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid
								strokeDasharray="3 3"
								horizontal={true}
								vertical={false}
							/>
							<XAxis
								type="number"
								tickFormatter={(value) => `$${value}`}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								type="category"
								dataKey="title"
								width={100}
								tick={{ fontSize: 12 }}
								axisLine={false}
								tickLine={false}
								// Recorta nombres largos para que no rompan el layout
								tickFormatter={(value) =>
									value.length > 12 ? `${value.substring(0, 12)}...` : value
								}
							/>
							<Tooltip
								formatter={(value) => [formatCurrency(value), "Precio"]}
								contentStyle={{
									borderRadius: 8,
									border: "none",
									boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
								}}
								cursor={{ fill: "rgba(25, 118, 210, 0.1)" }}
							/>
							<Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={24}>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</Box>
			</CardContent>
		</Card>
	);
};

export default TopProductsChart;
