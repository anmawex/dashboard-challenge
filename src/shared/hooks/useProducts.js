/**
 * @fileoverview Hook personalizado para gestión de productos
 *
 * Proporciona funcionalidades para:
 * - Obtener listado de productos desde la API
 * - Filtrar productos por término de búsqueda
 * - Filtrar productos por rango de fechas
 * - Paginar los resultados
 * - Eliminar productos
 * - Gestionar estados de carga y error
 *
 * @module shared/hooks/useProducts
 * @requires react
 * @requires @/app/api/productsApi
 * @requires dayjs
 */

import { useState, useEffect, useCallback } from "react";
import { getAllProducts, deleteProduct } from "@/app/api/productsApi";
import dayjs from "dayjs";

/**
 * Hook personalizado useProducts - Gestión completa de productos
 *
 * Obtiene productos desde la API y proporciona funcionalidades de filtrado,
 * paginación y eliminación. Gestiona automáticamente los estados de carga y error.
 *
 * @function
 * @param {Object} [options={}] - Opciones de configuración del hook
 * @param {boolean} [options.paginated=true] - Si es true, devuelve productos paginados.
 *                                              Si es false, devuelve todos los filtrados
 * @param {number} [options.pageSize=10] - Cantidad de productos por página cuando paginated es true
 *
 * @returns {Object} Objeto con el estado y funciones de gestión de productos
 * @returns {Array<Object>} return.products - Array de productos (paginado o completo según config)
 * @returns {Array<Object>} return.allProducts - Todos los productos filtrados (sin paginar)
 * @returns {boolean} return.loading - Indicador de estado de carga
 * @returns {string|null} return.error - Mensaje de error, si existe
 * @returns {number} return.page - Número de página actual (base 0)
 * @returns {number} return.totalPages - Total de páginas disponibles
 * @returns {string} return.searchTerm - Término de búsqueda actual
 * @returns {Object} return.dateRange - Rango de fechas actual
 * @returns {string|null} return.dateRange.start - Fecha inicial en formato 'YYYY-MM-DD'
 * @returns {string|null} return.dateRange.end - Fecha final en formato 'YYYY-MM-DD'
 * @returns {Function} return.setPage - Función para cambiar la página
 * @returns {Function} return.setSearchTerm - Función para actualizar el término de búsqueda
 * @returns {Function} return.setDateRange - Función para actualizar el rango de fechas
 * @returns {Function} return.refreshProducts - Función para recargar productos desde la API
 * @returns {Function} return.handleDeleteProduct - Función para eliminar un producto. Recibe el ID del producto
 *
 * @example
 * // Uso básico con paginación por defecto
 * const {
 *   products,
 *   loading,
 *   error,
 *   page,
 *   setPage,
 *   searchTerm,
 *   setSearchTerm
 * } = useProducts();
 *
 * @example
 * // Con configuración personalizada
 * const {
 *   products,
 *   allProducts,
 *   loading,
 *   page,
 *   setPage,
 *   setSearchTerm,
 *   setDateRange,
 *   handleDeleteProduct
 * } = useProducts({
 *   paginated: true,
 *   pageSize: 25
 * });
 *
 * @example
 * // Sin paginación (todos los productos filtrados)
 * const { products, loading } = useProducts({ paginated: false });
 */
export const useProducts = (options = {}) => {
	const { paginated = true, pageSize = 10 } = options;

	/**
	 * @type {[Array<Object>, Function]}
	 * Almacena todos los productos obtenidos de la API
	 */
	const [allProducts, setAllProducts] = useState([]);

	/**
	 * @type {[boolean, Function]}
	 * Indica si se están cargando los datos de la API
	 */
	const [loading, setLoading] = useState(true);

	/**
	 * @type {[string|null, Function]}
	 * Almacena el mensaje de error si ocurre algo durante la obtención de datos
	 */
	const [error, setError] = useState(null);

	/**
	 * @type {[number, Function]}
	 * Número de página actual (base 0) para la paginación
	 */
	const [page, setPage] = useState(0);

	/**
	 * @type {[string, Function]}
	 * Término de búsqueda para filtrar productos por título
	 */
	const [searchTerm, setSearchTerm] = useState("");

	/**
	 * @type {[Object, Function]}
	 * Rango de fechas para filtrar productos por fecha de creación
	 */
	const [dateRange, setDateRange] = useState({
		start: null,
		end: null,
	});

	/**
	 * Obtiene todos los productos desde la API
	 *
	 * Realiza una llamada a la API para obtener el listado completo de productos.
	 * Gestiona automáticamente los estados de carga y error.
	 *
	 * @async
	 * @function
	 * @returns {Promise<void>}
	 */
	const fetchProducts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getAllProducts();
			setAllProducts(data);
		} catch (err) {
			setError("Error al cargar los productos. Por favor, intente nuevamente.");
			console.error("Error fetching products:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	/**
	 * @type {Array<Object>}
	 * Productos filtrados según el término de búsqueda y rango de fechas.
	 * Incluye solo los productos que coinciden con todos los filtros activos
	 */
	const filteredProducts = allProducts.filter((product) => {
		// Filter by search term
		const matchesSearch = product.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		// Filter by date range
		let matchesDate = true;
		if (dateRange.start || dateRange.end) {
			const productDate = dayjs(product.creationAt);
			if (dateRange.start && productDate.isBefore(dayjs(dateRange.start))) {
				matchesDate = false;
			}
			if (
				dateRange.end &&
				productDate.isAfter(dayjs(dateRange.end).endOf("day"))
			) {
				matchesDate = false;
			}
		}

		return matchesSearch && matchesDate;
	});

	/**
	 * @type {Array<Object>}
	 * Productos paginados o completos según la configuración del hook.
	 * Si paginated=true, contiene solo los productos de la página actual.
	 * Si paginated=false, contiene todos los productos filtrados
	 */
	const paginatedProducts = paginated
		? filteredProducts.slice(page * pageSize, (page + 1) * pageSize)
		: filteredProducts;

	/**
	 * @type {number}
	 * Total de páginas disponibles basado en la cantidad de productos filtrados
	 * y el tamaño de página configurado
	 */
	const totalPages = Math.ceil(filteredProducts.length / pageSize);

	/**
	 * Elimina un producto de la lista y desde la API
	 *
	 * Realiza la llamada a la API para eliminar el producto y,
	 * si es exitosa, lo remueve del estado local. Si ocurre un error,
	 * mantiene el producto en la lista.
	 *
	 * @async
	 * @function
	 * @param {number} id - Identificador único del producto a eliminar
	 * @returns {Promise<boolean>} true si la eliminación fue exitosa, false en caso de error
	 */
	const handleDeleteProduct = async (id) => {
		try {
			await deleteProduct(id);
			setAllProducts((prev) => prev.filter((p) => p.id !== id));
			return true;
		} catch (err) {
			console.error("Error deleting product:", err);
			return false;
		}
	};

	return {
		products: paginatedProducts,
		allProducts: filteredProducts,
		loading,
		error,
		page,
		totalPages,
		searchTerm,
		dateRange,
		setPage,
		setSearchTerm,
		setDateRange,
		refreshProducts: fetchProducts,
		handleDeleteProduct,
	};
};
