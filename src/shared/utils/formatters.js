/**
 * @fileoverview Funciones de utilidad para formateo de datos
 *
 * Proporciona funciones para:
 * - Formatear números como moneda
 * - Formatear fechas con localización en español
 * - Truncar textos largos
 * - Obtener imágenes de respaldo (placeholders)
 * - Validar URLs de imágenes
 *
 * @module shared/utils/formatters
 * @requires dayjs
 */

import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

/**
 * Formatea un número como moneda
 *
 * Convierte un número a formato de moneda USD con localización
 * de México (es-MX). Acepta tanto números como strings numéricos.
 *
 * @function
 * @param {number|string} value - Número a formatear como moneda
 * @param {string} [currency='USD'] - Código ISO de la moneda (actualmente solo soporta USD)
 * @returns {string} Cadena formateada como moneda (ej: "$1,234.56")
 *
 * @example
 * formatCurrency(1234.56);
 * // Retorna: "$1,234.56"
 *
 * @example
 * formatCurrency("1234.56");
 * // Retorna: "$1,234.56"
 */
export const formatCurrency = (value) => {
	const numValue = typeof value === "string" ? parseFloat(value) : value;
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(numValue);
};

/**
 * Formatea una cadena de fecha
 *
 * Convierte una fecha ISO a un formato personalizable utilizando dayjs
 * con localización en español. Soporta cualquier formato válido de dayjs.
 *
 * @function
 * @param {string} dateString - Cadena de fecha en formato ISO (ej: "2024-01-19T10:30:00")
 * @param {string} [format='DD/MM/YYYY'] - Formato de salida deseado
 * @returns {string} Fecha formateada en el formato especificado
 *
 * @example
 * formatDate("2024-01-19T10:30:00");
 * // Retorna: "19/01/2024"
 *
 * @example
 * formatDate("2024-01-19T10:30:00", "DD/MM/YYYY HH:mm");
 * // Retorna: "19/01/2024 10:30"
 *
 * @example
 * formatDate("2024-01-19T10:30:00", "dddd, D MMMM YYYY");
 * // Retorna: "viernes, 19 enero 2024" (en español)
 */
export const formatDate = (dateString, format = "DD/MM/YYYY") => {
	return dayjs(dateString).format(format);
};

/**
 * Trunca un texto a una longitud máxima especificada
 *
 * Si el texto excede la longitud máxima, lo corta y añade puntos suspensivos (...)
 * al final. Si el texto es igual o menor que la longitud máxima, se retorna sin cambios.
 *
 * @function
 * @param {string} text - Texto a truncar
 * @param {number} [maxLength=50] - Longitud máxima permitida antes de truncar
 * @returns {string} Texto truncado con "..." al final si fue necesario truncar
 *
 * @example
 * truncateText("Este es un texto muy largo que necesita ser truncado", 20);
 * // Retorna: "Este es un texto mu..."
 *
 * @example
 * truncateText("Texto corto", 20);
 * // Retorna: "Texto corto"
 */
export const truncateText = (text, maxLength = 50) => {
	if (text.length <= maxLength) return text;
	return `${text.substring(0, maxLength)}...`;
};

/**
 * Obtiene la URL de una imagen de respaldo (placeholder)
 *
 * Retorna una URL de imagen genérica que se utiliza como fallback
 * cuando no hay imagen disponible para un producto o elemento.
 *
 * @function
 * @returns {string} URL de la imagen placeholder
 *
 * @example
 * const placeholderUrl = getPlaceholderImage();
 * // Retorna: "https://via.placeholder.com/300x200?text=Sin+Imagen"
 *
 * @example
 * // Uso en componentes
 * <img src={product.image || getPlaceholderImage()} alt="Producto" />
 */
export const getPlaceholderImage = () => {
	return new URL("@/assets/no_image.png", import.meta.url).href;
};

/**
 * Valida si una URL es una URL de imagen válida
 *
 * Verifica que la URL proporcionada sea una URL válida utilizando
 * el constructor de URL del navegador. No valida el tipo de contenido,
 * solo que sea una URL bien formada.
 *
 * @function
 * @param {string|null|undefined} url - URL a validar
 * @returns {boolean} true si es una URL válida, false en caso contrario o si está vacía
 *
 * @example
 * isValidImageUrl("https://example.com/image.jpg");
 * // Retorna: true
 *
 * @example
 * isValidImageUrl("no-es-una-url");
 * // Retorna: false
 *
 * @example
 * isValidImageUrl(null);
 * // Retorna: false
 *
 * @example
 * isValidImageUrl("");
 * // Retorna: false
 */
export const isValidImageUrl = (url) => {
	if (!url) return false;
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};
