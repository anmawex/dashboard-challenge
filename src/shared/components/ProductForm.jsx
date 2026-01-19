import React, { useState, useEffect } from "react";
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Grid,
	MenuItem,
	Typography,
	Avatar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
	Save as SaveIcon,
	ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useCategories } from "@/shared/hooks/useCategories";
import {
	getPlaceholderImage,
	isValidImageUrl,
} from "@/shared/utils/formatters";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Formulario reutilizable para crear y editar productos
 *
 * @component
 * @description Componente que proporciona un formulario completo para la gestión de productos
 * con validación de campos, vista previa de imagen y carga de categorías.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} [props.initialData] - Datos iniciales para edición de producto
 * @param {string} [props.initialData.title] - Título del producto
 * @param {number} [props.initialData.price] - Precio del producto
 * @param {string} [props.initialData.description] - Descripción del producto
 * @param {Object} [props.initialData.category] - Categoría del producto
 * @param {number} [props.initialData.category.id] - ID de la categoría
 * @param {string[]} [props.initialData.images] - Array de URLs de imágenes
 * @param {Function} props.onSubmit - Callback ejecutado al enviar el formulario
 * @param {Function} props.onCancel - Callback ejecutado al cancelar el formulario
 * @param {boolean} props.isSubmitting - Indica si se está enviando el formulario
 *
 * @returns {React.ReactElement} Elemento React con el formulario del producto
 *
 * @example
 * <ProductForm
 *   initialData={productData}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   isSubmitting={false}
 * />
 */
const ProductForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
	/**
	 * Hook personalizado para obtener las categorías disponibles
	 * @type {Object}
	 * @property {Array} categories - Lista de categorías
	 * @property {boolean} loading - Estado de carga de categorías
	 */
	const { categories, loading: categoriesLoading } = useCategories();

	/**
	 * Estado para la vista previa de la imagen del producto
	 * @type {[string, Function]}
	 */
	const [imagePreview, setImagePreview] = useState(getPlaceholderImage());

	/**
	 * Estado para indicar si hay error en la carga de la imagen
	 * @type {[boolean, Function]}
	 */
	const [imageError, setImageError] = useState(false);

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: initialData?.title || "",
			price: initialData?.price || 0,
			description: initialData?.description || "",
			categoryId: initialData?.category?.id || 0,
			imageUrl: initialData?.images?.[0] || "",
		},
	});

	const watchedImageUrl = watch("imageUrl");

	/**
	 * Efecto que actualiza la vista previa cuando cambia la URL de imagen
	 * Valida que la URL sea válida antes de establecerla como vista previa
	 */
	useEffect(() => {
		if (watchedImageUrl && isValidImageUrl(watchedImageUrl)) {
			setImagePreview(watchedImageUrl);
			setImageError(false);
		} else {
			setImagePreview(getPlaceholderImage());
		}
	}, [watchedImageUrl]);

	/**
	 * Maneja errores al cargar la imagen
	 * Establece la imagen de marcador de posición y marca el error
	 *
	 * @function
	 */
	const handleImageError = () => {
		setImageError(true);
		setImagePreview(getPlaceholderImage());
	};

	/**
	 * Maneja el envío del formulario
	 * Valida los datos y ejecuta el callback onSubmit
	 *
	 * @function
	 * @param {Object} data - Datos validados del formulario
	 * @param {string} data.title - Título del producto
	 * @param {number} data.price - Precio del producto
	 * @param {string} data.description - Descripción del producto
	 * @param {number} data.categoryId - ID de la categoría
	 * @param {string} data.imageUrl - URL de la imagen del producto
	 */
	const handleFormSubmit = (data) => {
		onSubmit(data);
	};

	if (categoriesLoading) {
		return <LoadingSpinner message="Cargando formulario..." />;
	}

	return (
		<Card>
			<CardContent sx={{ p: 4 }}>
				<Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
					<Grid container spacing={4}>
						{/* Image Preview Section */}
						<Grid size={{ xs: 12, md: 4 }}>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 2,
								}}>
								<Typography variant="subtitle2" color="text.secondary">
									Vista Previa
								</Typography>
								<Avatar
									variant="rounded"
									src={imagePreview}
									alt="Preview"
									onError={handleImageError}
									sx={{
										width: 200,
										height: 200,
										border: "2px solid",
										borderColor: "divider",
									}}
								/>
								{imageError && (
									<Typography variant="caption" color="error">
										Error al cargar la imagen
									</Typography>
								)}
							</Box>
						</Grid>

						{/* Form Fields Section */}
						<Grid size={{ xs: 12, md: 8 }}>
							<Grid container spacing={3}>
								<Grid size={{ xs: 12 }}>
									<Controller
										name="title"
										control={control}
										rules={{
											required: "El título es requerido",
											minLength: { value: 3, message: "Mínimo 3 caracteres" },
											maxLength: {
												value: 100,
												message: "Máximo 100 caracteres",
											},
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Título"
												fullWidth
												error={!!errors.title}
												helperText={errors.title?.message}
											/>
										)}
									/>
								</Grid>

								<Grid size={{ xs: 12, sm: 6 }}>
									<Controller
										name="price"
										control={control}
										rules={{
											required: "El precio es requerido",
											min: {
												value: 0.01,
												message: "El precio debe ser mayor a 0",
											},
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Precio"
												type="number"
												fullWidth
												InputProps={{
													startAdornment: (
														<Typography sx={{ mr: 1 }}>$</Typography>
													),
												}}
												error={!!errors.price}
												helperText={errors.price?.message}
												onChange={(e) =>
													field.onChange(parseFloat(e.target.value) || 0)
												}
											/>
										)}
									/>
								</Grid>

								<Grid size={{ xs: 12, sm: 6 }}>
									<Controller
										name="categoryId"
										control={control}
										rules={{ required: "La categoría es requerida" }}
										render={({ field }) => (
											<TextField
												{...field}
												select
												label="Categoría"
												fullWidth
												error={!!errors.categoryId}
												helperText={errors.categoryId?.message}>
												<MenuItem value={0} disabled>
													Seleccionar categoría
												</MenuItem>
												{categories.map((category) => (
													<MenuItem key={category.id} value={category.id}>
														{category.name}
													</MenuItem>
												))}
											</TextField>
										)}
									/>
								</Grid>

								<Grid size={{ xs: 12 }}>
									<Controller
										name="imageUrl"
										control={control}
										rules={{
											required: "La URL de imagen es requerida",
											validate: (value) =>
												isValidImageUrl(value) || "Ingrese una URL válida",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="URL de Imagen"
												fullWidth
												placeholder="https://ejemplo.com/imagen.jpg"
												error={!!errors.imageUrl}
												helperText={errors.imageUrl?.message}
											/>
										)}
									/>
								</Grid>

								<Grid size={{ xs: 12 }}>
									<Controller
										name="description"
										control={control}
										rules={{
											required: "La descripción es requerida",
											minLength: { value: 10, message: "Mínimo 10 caracteres" },
											maxLength: {
												value: 500,
												message: "Máximo 500 caracteres",
											},
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Descripción"
												fullWidth
												multiline
												rows={4}
												error={!!errors.description}
												helperText={errors.description?.message}
											/>
										)}
									/>
								</Grid>
							</Grid>
						</Grid>

						{/* Action Buttons */}
						<Grid size={{ xs: 12 }}>
							<Box
								sx={{
									display: "flex",
									gap: 2,
									justifyContent: "flex-end",
									mt: 2,
								}}>
								<Button
									variant="outlined"
									startIcon={<ArrowBackIcon />}
									onClick={onCancel}
									disabled={isSubmitting}>
									Cancelar
								</Button>
								<Button
									type="submit"
									variant="contained"
									startIcon={<SaveIcon />}
									disabled={isSubmitting}>
									{isSubmitting
										? "Guardando..."
										: initialData
											? "Actualizar"
											: "Crear Producto"}
								</Button>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
};

export default ProductForm;
