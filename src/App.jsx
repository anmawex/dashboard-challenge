import { Routes, Route } from "react-router-dom";
import Layout from "@/app/shell/Layout";
import "./App.css";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<div>Dashboard</div>} />
				<Route path="/inventory" element={<div>Inventario</div>} />
				<Route path="/products/new" element={<div>Nuevo Producto</div>} />
			</Route>
		</Routes>
	);
}

export default App;
