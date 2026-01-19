/**
 * Custom hook for calculating dashboard metrics
 * @module hooks/useDashboardMetrics
 */
import { useMemo } from "react";
import Decimal from "decimal.js";
import dayjs from "dayjs";

/**
 * @typedef {Object} CategoryMetric
 * @property {string} name - Nombre de la categoría.
 * @property {number} count - Cantidad de productos en esa categoría.
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {number} totalProducts - Conteo total de productos.
 * @property {string} totalInventoryValue - Valor total del inventario formateado a 2 decimales.
 * @property {CategoryMetric} topCategory - La categoría con más presencia.
 * @property {Array<{name: string, value: number}>} categoryDistribution - Datos para el gráfico circular.
 * @property {Array<{title: string, price: number}>} topExpensiveProducts - Los 5 productos con mayor precio.
 * @property {Array<Object>} recentProducts - Los últimos 5 productos creados.
 */

/**
 * Hook que calcula las métricas del dashboard a partir de un array de productos.
 * Utiliza memoización para evitar recalcular a menos que la lista de productos cambie.
 * * @param {Array<Object>} products - Array de productos provenientes de la API.
 * @returns {DashboardMetrics} Objeto con todas las métricas procesadas.
 */
export const useDashboardMetrics = (products) => {
	return useMemo(() => {
		// Caso base: Si no hay productos, devolvemos un estado inicial vacío.
		if (!products || !products.length) {
			return {
				totalProducts: 0,
				totalInventoryValue: "0.00",
				topCategory: { name: "N/A", count: 0 },
				categoryDistribution: [],
				topExpensiveProducts: [],
				recentProducts: [],
			};
		}

		// 1. Total de productos
		const totalProducts = products.length;

		// 2. Valor total del inventario usando decimal.js para evitar errores de precisión de punto flotante.
		const totalInventoryValue = products
			.reduce(
				(acc, product) => acc.plus(new Decimal(product.price || 0)),
				new Decimal(0),
			)
			.toFixed(2);

		// 3. Distribución por categorías usando un objeto acumulador.
		const categoryCount = products.reduce((acc, product) => {
			const categoryName = product.category?.name || "Sin categoría";
			acc[categoryName] = (acc[categoryName] || 0) + 1;
			return acc;
		}, {});

		// 4. Identificar la categoría con mayor cantidad de productos.
		const topCategory = Object.entries(categoryCount).reduce(
			(max, [name, count]) => (count > max.count ? { name, count } : max),
			{ name: "N/A", count: 0 },
		);

		// 5. Formatear la distribución para el componente Recharts (PieChart).
		const categoryDistribution = Object.entries(categoryCount).map(
			([name, value]) => ({
				name,
				value,
			}),
		);

		// 6. Obtener los 5 productos más caros.
		const topExpensiveProducts = [...products]
			.sort((a, b) => b.price - a.price)
			.slice(0, 5)
			.map((p) => ({
				title: p.title.length > 30 ? `${p.title.substring(0, 30)}...` : p.title,
				price: p.price,
			}));

		// 7. Últimos 5 productos creados (ordenados por fecha de creación).
		const recentProducts = [...products]
			.sort(
				(a, b) => dayjs(b.creationAt).valueOf() - dayjs(a.creationAt).valueOf(),
			)
			.slice(0, 5);

		return {
			totalProducts,
			totalInventoryValue,
			topCategory,
			categoryDistribution,
			topExpensiveProducts,
			recentProducts,
		};
	}, [products]);
};
