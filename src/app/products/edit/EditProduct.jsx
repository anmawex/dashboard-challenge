/**
 * Product edit view
 * @module views/ProductEdit
 */
import React, { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "@/shared/components/ProductForm";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { getProductById, updateProduct } from "@/app/api/productsApi";

/**
 * @typedef {Object} Product
 * @property {number} id - ID único del producto.
 * @property {string} name - Nombre del producto.
 * @property {number} price - Precio unitario.
 * @property {string} [description] - Descripción opcional.
 * @property {number} stock - Cantidad disponible.
 */

/**
 * Vista para editar productos existentes.
 * Obtiene el ID de los parámetros de la URL y carga los datos iniciales.
 * * @component
 * @returns {JSX.Element}
 */
const ProductEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	/** @type {[Product|null, function]} */
	const [product, setProduct] = useState(null);

	/** @type {[boolean, function]} */
	const [loading, setLoading] = useState(true);

	/** @type {[string|null, function]} */
	const [error, setError] = useState(null);

	/** @type {[boolean, function]} */
	const [isSubmitting, setIsSubmitting] = useState(false);

	/** @type {[{open: boolean, message: string, severity: 'success' | 'error'}, function]} */
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	useEffect(() => {
		/**
		 * Carga los datos del producto al montar el componente.
		 */
		const fetchProduct = async () => {
			if (!id) return;
			try {
				const data = await getProductById(parseInt(id, 10));
				setProduct(data);
			} catch (err) {
				console.error("Error fetching product:", err);
				setError("No se pudo cargar el producto");
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	/**
	 * Maneja la actualización del producto.
	 * * @param {Object} data - Datos actualizados del formulario.
	 * @async
	 */
	const handleSubmit = async (data) => {
		if (!id) return;
		setIsSubmitting(true);
		try {
			await updateProduct(parseInt(id, 10), data);
			setSnackbar({
				open: true,
				message: "Producto actualizado correctamente",
				severity: "success",
			});
			setTimeout(() => {
				navigate("/inventory");
			}, 1500);
		} catch (error) {
			console.error("Error updating product:", error);
			setSnackbar({
				open: true,
				message: "Error al actualizar el producto",
				severity: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	/** Cierra el aviso de notificación */
	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	if (loading) {
		return <LoadingSpinner message="Cargando producto..." />;
	}

	if (error || !product) {
		return (
			<ErrorMessage
				message={error || "Producto no encontrado"}
				onRetry={() => navigate("/inventory")}
			/>
		);
	}

	return (
		<Box>
			<Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
				Editar Producto
			</Typography>

			<ProductForm
				initialData={product}
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

export default ProductEdit;
