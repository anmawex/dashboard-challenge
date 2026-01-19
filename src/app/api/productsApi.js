/**
 * @fileoverview Cliente de API para gestión de productos
 *
 * Proporciona funciones para interactuar con la API de productos incluyendo:
 * - Obtener todos los productos o paginados
 * - Obtener un producto por ID
 * - Crear, actualizar y eliminar productos
 * - Obtener categorías de productos
 *
 * La API utiliza la URL base: https://api.escuelajs.co/api/v1
 *
 * @module app/api/productsApi
 * @requires axios
 */

import axios from "axios";

const API_BASE_URL = "https://api.escuelajs.co/api/v1";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Obtiene todos los productos de la API
 *
 * Realiza una solicitud GET al endpoint /products para obtener
 * el listado completo de todos los productos disponibles.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} Promise que se resuelve con un array de objetos producto
 * @throws {Error} Si la solicitud falla (error de red, servidor, etc.)
 *
 * @example
 * try {
 *   const products = await getAllProducts();
 *   console.log(products);
 * } catch (error) {
 *   console.error('Error al obtener productos:', error);
 * }
 */
export const getAllProducts = async () => {
	const response = await api.get("/products");
	return response.data;
};

/**
 * Obtiene productos con paginación
 *
 * Realiza una solicitud GET al endpoint /products con parámetros
 * de paginación (offset y limit) para obtener un subconjunto de productos.
 *
 * @async
 * @function
 * @param {Object} params - Parámetros de paginación
 * @param {number} params.offset - Cantidad de productos a saltar desde el inicio (posición inicial)
 * @param {number} params.limit - Cantidad máxima de productos a retornar
 * @returns {Promise<Array<Object>>} Promise que se resuelve con un array de productos paginados
 * @throws {Error} Si la solicitud falla
 *
 * @example
 * const products = await getProductsPaginated({ offset: 0, limit: 10 });
 * // Obtiene los primeros 10 productos
 *
 * @example
 * const products = await getProductsPaginated({ offset: 20, limit: 10 });
 * // Obtiene los productos del 21 al 30
 */
export const getProductsPaginated = async (params) => {
	const response = await api.get("/products", {
		params: {
			offset: params.offset,
			limit: params.limit,
		},
	});
	return response.data;
};

/**
 * Obtiene un producto por su ID
 *
 * Realiza una solicitud GET al endpoint /products/{id} para obtener
 * los detalles completos de un producto específico.
 *
 * @async
 * @function
 * @param {number} id - Identificador único del producto
 * @returns {Promise<Object>} Promise que se resuelve con el objeto producto
 * @throws {Error} Si la solicitud falla o el producto no existe
 *
 * @example
 * const product = await getProductById(1);
 * console.log(product.title, product.price);
 */
export const getProductById = async (id) => {
	const response = await api.get(`/products/${id}`);
	return response.data;
};

/**
 * Crea un nuevo producto
 *
 * Realiza una solicitud POST al endpoint /products para crear
 * un nuevo producto. La función convierte el campo imageUrl
 * en un array de imágenes como espera la API.
 *
 * @async
 * @function
 * @param {Object} productData - Datos del producto a crear
 * @param {string} productData.title - Título del producto
 * @param {string} productData.description - Descripción del producto
 * @param {number} productData.price - Precio del producto
 * @param {string} productData.imageUrl - URL de la imagen del producto (se convierte a array)
 * @param {number} [productData.categoryId] - ID de la categoría del producto
 * @returns {Promise<Object>} Promise que se resuelve con el producto creado (incluyendo ID)
 * @throws {Error} Si la solicitud falla o los datos son inválidos
 *
 * @example
 * const newProduct = await createProduct({
 *   title: "Nuevo Producto",
 *   description: "Descripción del producto",
 *   price: 99.99,
 *   imageUrl: "https://example.com/image.jpg",
 *   categoryId: 1
 * });
 * console.log('Producto creado con ID:', newProduct.id);
 */
export const createProduct = async (productData) => {
	const response = await api.post("/products", {
		...productData,
		images: [productData.imageUrl],
	});
	return response.data;
};

/**
 * Actualiza un producto existente
 *
 * Realiza una solicitud PUT al endpoint /products/{id} para actualizar
 * los datos de un producto. Si se proporciona imageUrl, se convierte
 * a un array de imágenes y se elimina el campo imageUrl original.
 *
 * @async
 * @function
 * @param {number} id - Identificador único del producto a actualizar
 * @param {Object} productData - Datos del producto a actualizar
 * @param {string} [productData.title] - Título del producto
 * @param {string} [productData.description] - Descripción del producto
 * @param {number} [productData.price] - Precio del producto
 * @param {string} [productData.imageUrl] - URL de la imagen (se convierte a array)
 * @param {number} [productData.categoryId] - ID de la categoría
 * @returns {Promise<Object>} Promise que se resuelve con el producto actualizado
 * @throws {Error} Si la solicitud falla o el producto no existe
 *
 * @example
 * const updated = await updateProduct(5, {
 *   title: "Producto Actualizado",
 *   price: 149.99
 * });
 *
 * @example
 * const updated = await updateProduct(5, {
 *   imageUrl: "https://example.com/new-image.jpg"
 * });
 */
export const updateProduct = async (id, productData) => {
	const payload = { ...productData };
	if (productData.imageUrl) {
		payload.images = [productData.imageUrl];
		delete payload.imageUrl;
	}
	const response = await api.put(`/products/${id}`, payload);
	return response.data;
};

/**
 * Elimina un producto por su ID
 *
 * Realiza una solicitud DELETE al endpoint /products/{id} para eliminar
 * un producto de la base de datos. Esta acción es permanente y no se puede deshacer.
 *
 * @async
 * @function
 * @param {number} id - Identificador único del producto a eliminar
 * @returns {Promise<Object>} Promise que se resuelve con el resultado de la eliminación
 * @throws {Error} Si la solicitud falla o el producto no existe
 *
 * @example
 * try {
 *   const result = await deleteProduct(5);
 *   console.log('Producto eliminado correctamente');
 * } catch (error) {
 *   console.error('Error al eliminar:', error);
 * }
 */
export const deleteProduct = async (id) => {
	const response = await api.delete(`/products/${id}`);
	return response.data;
};

/**
 * Obtiene todas las categorías disponibles
 *
 * Realiza una solicitud GET al endpoint /categories para obtener
 * el listado completo de todas las categorías de productos.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} Promise que se resuelve con un array de objetos categoría
 * @throws {Error} Si la solicitud falla
 *
 * @example
 * const categories = await getCategories();
 * console.log(categories);
 * // [
 * //   { id: 1, name: "Electrónica", image: "..." },
 * //   { id: 2, name: "Ropa", image: "..." },
 * //   ...
 * // ]
 */
export const getCategories = async () => {
	const response = await api.get("/categories");
	return response.data;
};
