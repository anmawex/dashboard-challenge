/**
 * Dashboard view - Main analytics page
 * @module views/Dashboard
 */
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
	Inventory as InventoryIcon,
	AttachMoney as MoneyIcon,
	Category as CategoryIcon,
} from "@mui/icons-material";
import { useProducts } from "@/shared/hooks/useProducts";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import KPICard from "../components/KPICard";
import CategoryPieChart from "../components/CategoryPieChart";
import TopProductsChart from "../components/TopProductsChart";
import RecentProductsTable from "../components/RecentProductsTable";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { formatCurrency } from "@/shared/utils/formatters";

/**
 * @typedef {Object} CategoryMetric
 * @property {string} name - Nombre de la categoría.
 * @property {number} count - Cantidad de productos.
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {number} totalProducts - Cantidad total de productos.
 * @property {number} totalInventoryValue - Valor monetario total del inventario.
 * @property {CategoryMetric} topCategory - La categoría con más productos.
 * @property {Array} categoryDistribution - Datos formateados para el gráfico de pastel.
 * @property {Array} topExpensiveProducts - Lista de los productos más costosos.
 * @property {Array} recentProducts - Últimos productos añadidos.
 */

/**
 * Vista principal del Dashboard con indicadores clave (KPIs), gráficos y productos recientes.
 * @component
 * @returns {JSX.Element} El componente renderizado del Dashboard.
 */
const Dashboard = () => {
	// Obtenemos los productos usando el hook personalizado
	const { allProducts, loading, error, refreshProducts } = useProducts({
		paginated: false,
	});

	/** @type {DashboardMetrics}
	 * Calculamos las métricas a partir de los productos obtenidos
	 */
	const metrics = useDashboardMetrics(allProducts);

	if (loading) {
		return <LoadingSpinner message="Cargando métricas del dashboard..." />;
	}

	if (error) {
		return <ErrorMessage message={error} onRetry={refreshProducts} />;
	}

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
				Dashboard Gerencial
			</Typography>

			{/* Fila de Tarjetas KPI */}
			<Grid container spacing={4} sx={{ mb: 4 }}>
				<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
					<Box sx={{ pt: 3 }}>
						<KPICard
							title="Total Productos"
							value={metrics.totalProducts.toLocaleString()}
							subtitle="Productos en inventario"
							icon={<InventoryIcon />}
							color="#1976d2"
						/>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
					<Box sx={{ pt: 3 }}>
						<KPICard
							title="Valor del Inventario"
							value={formatCurrency(metrics.totalInventoryValue)}
							subtitle="Suma total de precios"
							icon={<MoneyIcon />}
							color="#2e7d32"
						/>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, sm: 6, lg: 4 }}>
					<Box sx={{ pt: 3 }}>
						<KPICard
							title="Categoría Top"
							value={metrics.topCategory?.name || "N/A"}
							subtitle={`${metrics.topCategory?.count || 0} productos`}
							icon={<CategoryIcon />}
							color="#ed6c02"
						/>
					</Box>
				</Grid>
			</Grid>

			{/* Fila de Gráficos */}
			<Grid container spacing={4} sx={{ mb: 4 }}>
				<Grid size={{ xs: 12, lg: 6 }}>
					<CategoryPieChart data={metrics.categoryDistribution} />
				</Grid>
				<Grid size={{ xs: 12, lg: 6 }}>
					<TopProductsChart data={metrics.topExpensiveProducts} />
				</Grid>
			</Grid>

			{/* Tabla de Productos Recientes */}
			<RecentProductsTable products={metrics.recentProducts} />
		</Box>
	);
};

export default Dashboard;
