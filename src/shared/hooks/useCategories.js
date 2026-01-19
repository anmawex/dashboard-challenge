/**
 * Custom hook for fetching categories
 * @module hooks/useCategories
 */
import { useState, useEffect } from "react";
import { getCategories } from "@/app/api/productsApi";

/**
 * @typedef {Object} Category
 * @property {string|number} id - Identificador único de la categoría.
 * @property {string} name - Nombre de la categoría.
 */

/**
 * @typedef {Object} UseCategoriesReturn
 * @property {Category[]} categories - Lista de categorías obtenidas.
 * @property {boolean} loading - Estado de carga de la petición.
 * @property {string|null} error - Mensaje de error en caso de fallo.
 */

/**
 * Hook para obtener y gestionar el estado de las categorías.
 * * @returns {UseCategoriesReturn} Estado de las categorías, carga y error.
 */
export const useCategories = () => {
	/** @type {[Category[], function]} */
	const [categories, setCategories] = useState([]);

	/** @type {[boolean, function]} */
	const [loading, setLoading] = useState(true);

	/** @type {[string|null, function]} */
	const [error, setError] = useState(null);

	useEffect(() => {
		/**
		 * Función asíncrona interna para llamar a la API.
		 */
		const fetchCategories = async () => {
			try {
				const data = await getCategories();
				setCategories(data);
			} catch (err) {
				setError("Error al cargar las categorías");
				console.error("Error fetching categories:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	return { categories, loading, error };
};
