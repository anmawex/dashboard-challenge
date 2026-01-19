/**
 * @fileoverview Componente de tabla de productos
 *
 * Tabla interactiva para visualizar productos con:
 * - Diseño responsivo y encabezado fijo (sticky header)
 * - Paginación configurable
 * - Imágenes de productos con fallback
 * - Acciones (ver, editar, eliminar) con tooltips
 * - Formato de precios y fechas
 *
 * @module app/inventory/components/ProductsTable
 * @requires react
 * @requires @mui/material
 * @requires @mui/icons-material
 * @requires @/shared/utils/formatters
 */

import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Avatar,
	IconButton,
	Chip,
	Box,
	Typography,
	TablePagination,
	Tooltip,
} from "@mui/material";
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
	formatCurrency,
	formatDate,
	getPlaceholderImage,
	truncateText,
} from "@/shared/utils/formatters";

/**
 * Componente ProductsTable - Tabla de productos con paginación y acciones
 *
 * Renderiza un listado de productos en una tabla interactiva con:
 * - Encabezado fijo para fácil visualización
 * - Paginación con opciones configurables
 * - Imágenes de productos con manejo de errores
 * - Acciones CRUD mediante botones con iconos
 * - Información formateada (precios, fechas, categorías)
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.products - Array de productos a mostrar
 * @param {number} props.products[].id - Identificador único del producto
 * @param {string} props.products[].title - Título del producto
 * @param {number} props.products[].price - Precio del producto
 * @param {string} props.products[].creationAt - Fecha de creación
 * @param {Array<string>} props.products[].images - URLs de imágenes del producto
 * @param {Object} props.products[].category - Categoría del producto
 * @param {string} props.products[].category.name - Nombre de la categoría
 * @param {number} props.totalCount - Cantidad total de productos (para paginación)
 * @param {number} props.page - Página actual (base 0)
 * @param {number} props.rowsPerPage - Cantidad de filas por página
 * @param {Function} props.onPageChange - Callback cuando cambia la página. Recibe el nuevo número de página
 * @param {Function} props.onRowsPerPageChange - Callback cuando cambia el número de filas. Recibe la nueva cantidad
 * @param {Function} props.onEdit - Callback para editar. Recibe el objeto product
 * @param {Function} props.onDelete - Callback para eliminar. Recibe el objeto product
 * @param {Function} [props.onView] - Callback opcional para ver detalles. Recibe el objeto product
 *
 * @returns {React.ReactElement} Tabla renderizada con productos y controles de paginación
 *
 * @example
 * const handleEdit = (product) => console.log('Editar:', product.id);
 * const handleDelete = (product) => console.log('Eliminar:', product.id);
 * const handleView = (product) => console.log('Ver:', product.id);
 *
 * <ProductsTable
 *   products={products}
 *   totalCount={100}
 *   page={0}
 *   rowsPerPage={10}
 *   onPageChange={(newPage) => setPage(newPage)}
 *   onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onView={handleView}
 * />
 */
const ProductsTable = ({
	products,
	totalCount,
	page,
	rowsPerPage,
	onPageChange,
	onRowsPerPageChange,
	onEdit,
	onDelete,
	onView,
}) => {
	/**
	 * Maneja errores de carga de imágenes del producto
	 *
	 * Cuando una imagen no se carga correctamente, reemplaza su src
	 * con una imagen de placeholder predeterminada.
	 *
	 * @function
	 * @param {React.SyntheticEvent} e - Evento de error de carga de imagen
	 * @param {HTMLImageElement} e.currentTarget - Elemento img que generó el error
	 * @returns {void}
	 */
	const handleImageError = (e) => {
		e.currentTarget.src = getPlaceholderImage();
	};

	return (
		<Paper sx={{ width: "100%", overflow: "hidden" }}>
			<TableContainer sx={{ maxHeight: 600 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Producto</TableCell>
							<TableCell>Categoría</TableCell>
							<TableCell align="right">Precio</TableCell>
							<TableCell>Fecha Creación</TableCell>
							<TableCell align="center">Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} align="center" sx={{ py: 8 }}>
									<Typography color="text.secondary">
										No se encontraron productos
									</Typography>
								</TableCell>
							</TableRow>
						) : (
							products.map((product) => (
								<TableRow
									key={product.id}
									hover
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell>
										<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
											<Avatar
												variant="rounded"
												src={product.images?.[0] || getPlaceholderImage()}
												alt={product.title}
												onError={handleImageError}
												sx={{ width: 50, height: 50 }}
											/>
											<Box>
												<Typography variant="body2" sx={{ fontWeight: 600 }}>
													{truncateText(product.title, 40)}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													ID: {product.id}
												</Typography>
											</Box>
										</Box>
									</TableCell>
									<TableCell>
										<Chip
											label={product.category?.name || "Sin categoría"}
											size="small"
											sx={{
												backgroundColor: "primary.main",
												color: "white",
												fontWeight: 500,
											}}
										/>
									</TableCell>
									<TableCell align="right">
										<Typography
											variant="body2"
											sx={{ fontWeight: 700, color: "secondary.main" }}>
											{formatCurrency(product.price)}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{formatDate(product.creationAt, "DD/MM/YYYY HH:mm")}
										</Typography>
									</TableCell>
									<TableCell align="center">
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												gap: 0.5,
											}}>
											{onView && (
												<Tooltip title="Ver detalles">
													<IconButton
														size="small"
														onClick={() => onView(product)}
														sx={{ color: "info.main" }}>
														<VisibilityIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											)}
											<Tooltip title="Editar">
												<IconButton
													size="small"
													onClick={() => onEdit(product)}
													sx={{ color: "primary.main" }}>
													<EditIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Eliminar">
												<IconButton
													size="small"
													onClick={() => onDelete(product)}
													sx={{ color: "error.main" }}>
													<DeleteIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										</Box>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={totalCount}
				page={page}
				onPageChange={(_, newPage) => onPageChange(newPage)}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={(e) =>
					onRowsPerPageChange(parseInt(e.target.value, 10))
				}
				rowsPerPageOptions={[5, 10, 25, 50]}
				labelRowsPerPage="Filas por página:"
				labelDisplayedRows={({ from, to, count }) =>
					`${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
				}
			/>
		</Paper>
	);
};

export default ProductsTable;
