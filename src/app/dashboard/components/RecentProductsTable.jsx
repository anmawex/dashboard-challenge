/**
 * Table component for recent products
 * @module components/dashboard/RecentProductsTable
 */
import React from "react";
import {
	Card,
	CardContent,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	Chip,
	Box,
} from "@mui/material";
import {
	formatCurrency,
	formatDate,
	getPlaceholderImage,
} from "@/shared/utils/formatters";

/**
 * @typedef {Object} Product
 * @property {number|string} id - Identificador único.
 * @property {string} title - Nombre o título del producto.
 * @property {number} price - Precio unitario.
 * @property {string[]} [images] - Array de URLs de imágenes.
 * @property {Object} [category] - Objeto de la categoría.
 * @property {string} category.name - Nombre de la categoría.
 * @property {string} creationAt - Fecha de creación en formato ISO string.
 */

/**
 * @typedef {Object} RecentProductsTableProps
 * @property {Product[]} products - Lista de los productos más recientes a mostrar.
 */

/**
 * Muestra los últimos 5 productos creados en una tabla compacta.
 * * @component
 * @param {RecentProductsTableProps} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
const RecentProductsTable = ({ products }) => {
	/**
	 * Maneja el error de carga de imagen sustituyéndola por un placeholder.
	 * @param {React.SyntheticEvent<HTMLImageElement>} e - Evento de error de la imagen.
	 */
	const handleImageError = (e) => {
		e.currentTarget.src = getPlaceholderImage();
	};

	return (
		<Card>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Últimos Productos Creados
				</Typography>
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Producto</TableCell>
								<TableCell>Categoría</TableCell>
								<TableCell align="right">Precio</TableCell>
								<TableCell align="right">Fecha</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{products.map((product) => (
								<TableRow
									key={product.id}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell>
										<Box
											sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
											<Avatar
												variant="rounded"
												src={product.images?.[0] || getPlaceholderImage()}
												alt={product.title}
												onError={handleImageError}
												sx={{ width: 40, height: 40 }}
											/>
											<Typography variant="body2" sx={{ fontWeight: 500 }}>
												{product.title.length > 30
													? `${product.title.substring(0, 30)}...`
													: product.title}
											</Typography>
										</Box>
									</TableCell>
									<TableCell>
										<Chip
											label={product.category?.name || "Sin categoría"}
											size="small"
											sx={{
												backgroundColor: "primary.light",
												color: "white",
												fontWeight: 500,
											}}
										/>
									</TableCell>
									<TableCell align="right">
										<Typography
											variant="body2"
											sx={{ fontWeight: 600, color: "secondary.main" }}>
											{formatCurrency(product.price)}
										</Typography>
									</TableCell>
									<TableCell align="right">
										<Typography variant="body2" color="text.secondary">
											{formatDate(product.creationAt)}
										</Typography>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</CardContent>
		</Card>
	);
};

export default RecentProductsTable;
