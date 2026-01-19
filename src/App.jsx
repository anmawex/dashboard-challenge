import { Routes, Route } from "react-router-dom";
import Layout from "./app/shell/Layout";
import Dashboard from "./app/dashboard/Dashboard";
import Inventory from "./app/inventory/views/Inventory";
import NewProduct from "./app/products/new/NewProduct";
import ProductEdit from "./app/products/edit/EditProduct";
import "./App.css";

/**
 * @module App
 * @description Componente raíz de la aplicación que define la estructura de rutas principales.
 * Utiliza React Router para gestionar la navegación entre features.
 */

/**
 * Componente App
 *
 * @component
 * @description Componente principal que configura todas las rutas de la aplicación.
 * - Ruta principal: Dashboard
 * - Ruta /inventory: Inventario
 * - Ruta /products/new: Crear nuevo producto
 * - Ruta /products/edit/:id: Editar producto existente
 *
 * @returns {React.ReactElement} Estructura de rutas con Layout como wrapper
 */
function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Dashboard />} />
				<Route path="/inventory" element={<Inventory />} />
				<Route path="/products/new" element={<NewProduct />} />
				<Route path="/products/edit/:id" element={<ProductEdit />} />
			</Route>
		</Routes>
	);
}

export default App;
