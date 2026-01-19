/**
 * @fileoverview Vista de Inventario - Gestión completa de productos
 *
 * Proporciona una interfaz integral para la administración de inventario con:
 * - Listado de productos con paginación
 * - Filtrado por búsqueda y rango de fechas
 * - Operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * - Notificaciones en tiempo real mediante Snackbar
 *
 * @module app/inventory/views/Inventory
 * @requires react
 * @requires @mui/material
 * @requires @mui/icons-material
 * @requires react-router-dom
 * @requires sweetalert2
 */

import React, { useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useProducts } from "@/shared/hooks/useProducts";
import ProductsTable from "../components/ProductsTable";
import ProductFilters from "../components/ProductFilters";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import ErrorMessage from "@/shared/components/ErrorMessage";

/**
 * Componente Inventory - Vista principal de gestión de inventario
 *
 * Gestiona el flujo completo del inventario de productos incluyendo:
 * - Visualización de productos con paginación y filtrado
 * - Creación, edición y eliminación de productos
 * - Retroalimentación al usuario mediante notificaciones
 * - Estados de carga y error
 *
 * @component
 * @returns {React.ReactElement} La vista renderizada del inventario
 *
 * @example
 * import Inventory from '@/app/inventory/views/Inventory';
 *
 * export default function App() {
 *   return <Inventory />;
 * }
 */
const Inventory = () => {
	const navigate = useNavigate();

	/**
	 * @type {[number, Function]}
	 * Controla la cantidad de filas mostradas por página en la tabla de productos
	 */
	const [rowsPerPage, setRowsPerPage] = useState(10);

	/**
	 * @type {[Object, Function]}
	 * @property {boolean} open - Controla la visibilidad de la notificación
	 * @property {string} message - Contenido del mensaje a mostrar
	 * @property {('success'|'error'|'warning'|'info')} severity - Nivel de severidad de la alerta
	 */
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	/**
	 * Hook personalizado para gestionar datos, filtrado y paginación de productos
	 *
	 * @type {Object}
	 * @property {Array<Object>} products - Array de productos de la página actual
	 * @property {Array<Object>} allProducts - Todos los productos sin filtrar
	 * @property {boolean} loading - Indicador del estado de carga
	 * @property {string|null} error - Mensaje de error, si existe
	 * @property {number} page - Número de página actual (base 0)
	 * @property {Function} setPage - Actualiza el número de página
	 * @property {string} searchTerm - Término de búsqueda actual
	 * @property {Function} setSearchTerm - Actualiza el término de búsqueda
	 * @property {Object} dateRange - Objeto con el rango de fechas del filtro
	 * @property {Function} setDateRange - Actualiza el rango de fechas
	 * @property {Function} refreshProducts - Recarga los datos de productos
	 * @property {Function} handleDeleteProduct - Elimina un producto por ID
	 */
	const {
		products,
		allProducts,
		loading,
		error,
		page,
		setPage,
		searchTerm,
		setSearchTerm,
		dateRange,
		setDateRange,
		refreshProducts,
		handleDeleteProduct,
	} = useProducts({ paginated: true, pageSize: rowsPerPage });

	/**
	 * Navega a la página de edición del producto
	 *
	 * @function
	 * @param {Object} product - Objeto del producto a editar
	 * @param {number} product.id - Identificador único del producto
	 * @returns {void}
	 */
	const handleEdit = (product) => {
		navigate(`/products/edit/${product.id}`);
	};

	/**
	 * Elimina un producto con confirmación del usuario
	 *
	 * Muestra un diálogo de confirmación SweetAlert2 y, si el usuario confirma,
	 * procede a eliminar el producto. Muestra una notificación del resultado.
	 *
	 * @async
	 * @function
	 * @param {Object} product - Objeto del producto a eliminar
	 * @param {number} product.id - Identificador único del producto
	 * @param {string} product.title - Título del producto (para mostrar en el diálogo)
	 * @returns {Promise<void>}
	 */
	const handleDelete = async (product) => {
		const result = await Swal.fire({
			title: "¿Eliminar producto?",
			text: `Estás a punto de eliminar "${product.title}". Esta acción no se puede deshacer.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d32f2f",
			cancelButtonColor: "#64748b",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		});

		if (result.isConfirmed) {
			const success = await handleDeleteProduct(product.id);
			if (success) {
				setSnackbar({
					open: true,
					message: "Producto eliminado correctamente",
					severity: "success",
				});
			} else {
				setSnackbar({
					open: true,
					message: "Error al eliminar el producto",
					severity: "error",
				});
			}
		}
	};

	/**
	 * Maneja el cambio de página
	 *
	 * @function
	 * @param {number} newPage - El número de nueva página (base 0)
	 * @returns {void}
	 */
	const handlePageChange = (newPage) => {
		setPage(newPage);
	};

	/**
	 * Maneja el cambio en la cantidad de filas por página
	 *
	 * Actualiza el tamaño de página y reinicia la paginación a la primera página.
	 *
	 * @function
	 * @param {number} newRowsPerPage - Nueva cantidad de filas a mostrar por página
	 * @returns {void}
	 */
	const handleRowsPerPageChange = (newRowsPerPage) => {
		setRowsPerPage(newRowsPerPage);
		setPage(0);
	};

	if (loading) {
		return <LoadingSpinner message="Cargando inventario..." />;
	}

	if (error) {
		return <ErrorMessage message={error} onRetry={refreshProducts} />;
	}

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}>
				<Typography variant="h4" sx={{ fontWeight: 700 }}>
					Inventario
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => navigate("/products/new")}>
					Nuevo Producto
				</Button>
			</Box>

			<ProductFilters
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				dateRange={dateRange}
				onDateRangeChange={setDateRange}
			/>

			<ProductsTable
				products={products}
				totalCount={allProducts.length}
				page={page}
				rowsPerPage={rowsPerPage}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handleRowsPerPageChange}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<Alert
					onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default Inventory;
