/**
 * @fileoverview Componente de filtros para inventario
 *
 * Proporciona controles de filtrado para la lista de productos incluyendo:
 * - Búsqueda por título
 * - Filtrado por rango de fechas (desde/hasta)
 * - Botón para limpiar todos los filtros
 * - Validación de fechas (la fecha "hasta" no puede ser menor que "desde")
 *
 * @module app/inventory/components/ProductFilters
 * @requires react
 * @requires @mui/material
 * @requires @mui/icons-material
 * @requires dayjs
 */

import React from "react";
import {
	Box,
	TextField,
	InputAdornment,
	Button,
	Paper,
	Grid,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import dayjs from "dayjs";

/**
 * Componente ProductFilters - Controles de filtrado para inventario de productos
 *
 * Proporciona una interfaz para filtrar productos por:
 * - Término de búsqueda (título del producto)
 * - Rango de fechas de creación (desde/hasta)
 *
 * El componente valida automáticamente que:
 * - La fecha "hasta" no sea anterior a la fecha "desde"
 * - Las fechas no excedan la fecha actual
 * - Los cambios se reflejen en tiempo real
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} props.searchTerm - Término de búsqueda actual
 * @param {Function} props.onSearchChange - Callback cuando cambia la búsqueda. Recibe el nuevo término
 * @param {Object} props.dateRange - Objeto con el rango de fechas
 * @param {string|null} props.dateRange.start - Fecha inicial en formato 'YYYY-MM-DD' o null
 * @param {string|null} props.dateRange.end - Fecha final en formato 'YYYY-MM-DD' o null
 * @param {Function} props.onDateRangeChange - Callback cuando cambia el rango de fechas. Recibe objeto con {start, end}
 *
 * @returns {React.ReactElement} Componente de filtros renderizado
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const [dateRange, setDateRange] = useState({ start: null, end: null });
 *
 * <ProductFilters
 *   searchTerm={searchTerm}
 *   onSearchChange={setSearchTerm}
 *   dateRange={dateRange}
 *   onDateRangeChange={setDateRange}
 * />
 */
const ProductFilters = ({
	searchTerm,
	onSearchChange,
	dateRange,
	onDateRangeChange,
}) => {
	/**
	 * Limpia todos los filtros aplicados
	 *
	 * Restablece el término de búsqueda a una cadena vacía
	 * y elimina el rango de fechas (ambas a null).
	 *
	 * @function
	 * @returns {void}
	 */
	const handleClearFilters = () => {
		onSearchChange("");
		onDateRangeChange({ start: null, end: null });
	};

	/**
	 * @type {boolean}
	 * Indica si hay filtros activos (búsqueda o rango de fechas)
	 * Se utiliza para mostrar/ocultar el botón de limpiar filtros
	 */
	const hasFilters = searchTerm || dateRange.start || dateRange.end;

	return (
		<Paper sx={{ p: 2, mb: 3 }}>
			<Grid container spacing={2} alignItems="center">
				<Grid size={{ xs: 12, md: 4 }}>
					<TextField
						fullWidth
						size="small"
						placeholder="Buscar por título..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon color="action" />
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<TextField
						fullWidth
						size="small"
						type="date"
						label="Fecha desde"
						value={dateRange.start || ""}
						onChange={(e) =>
							onDateRangeChange({ ...dateRange, start: e.target.value || null })
						}
						InputLabelProps={{ shrink: true }}
						inputProps={{
							max: dateRange.end || dayjs().format("YYYY-MM-DD"),
						}}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<TextField
						fullWidth
						size="small"
						type="date"
						label="Fecha hasta"
						value={dateRange.end || ""}
						onChange={(e) =>
							onDateRangeChange({ ...dateRange, end: e.target.value || null })
						}
						InputLabelProps={{ shrink: true }}
						inputProps={{
							min: dateRange.start || undefined,
							max: dayjs().format("YYYY-MM-DD"),
						}}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 2 }}>
					{hasFilters && (
						<Button
							fullWidth
							variant="outlined"
							startIcon={<ClearIcon />}
							onClick={handleClearFilters}
							size="small">
							Limpiar
						</Button>
					)}
				</Grid>
			</Grid>
		</Paper>
	);
};

export default ProductFilters;
