/**
 * Product create view
 * @module views/ProductCreate
 */
import React, { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/shared/components/ProductForm";
import { createProduct } from "@/app/api/productsApi";

/**
 * Vista para la creación de nuevos productos.
 * Utiliza Material UI para el diseño y gestiona el estado de envío y notificaciones.
 * * @component
 * @returns {JSX.Element} El componente de la vista de creación.
 */
const ProductCreate = () => {
	const navigate = useNavigate();

	/** @type {[boolean, function]} Estado de carga durante el envío */
	const [isSubmitting, setIsSubmitting] = useState(false);

	/** * Estado para el manejo de notificaciones (Snackbar)
	 * @type {[{open: boolean, message: string, severity: 'success' | 'error'}, function]}
	 */
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	/**
	 * Maneja el envío del formulario para crear un producto.
	 * * @param {Object} data - Los datos del formulario del producto.
	 * @param {string} data.name - Nombre del producto.
	 * @param {number} data.price - Precio del producto.
	 * @param {string} [data.description] - Descripción opcional.
	 * @async
	 * @returns {Promise<void>}
	 */
	const handleSubmit = async (data) => {
		setIsSubmitting(true);
		try {
			await createProduct(data);
			setSnackbar({
				open: true,
				message: "Producto creado correctamente",
				severity: "success",
			});

			// Redirección tras éxito
			setTimeout(() => {
				navigate("/inventory");
			}, 1500);
		} catch (error) {
			console.error("Error creating product:", error);
			setSnackbar({
				open: true,
				message: "Error al crear el producto",
				severity: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	/**
	 * Cierra la notificación de Snackbar.
	 */
	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
				Crear Nuevo Producto
			</Typography>

			<ProductForm
				onSubmit={handleSubmit}
				onCancel={() => navigate("/inventory")}
				isSubmitting={isSubmitting}
			/>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default ProductCreate;
