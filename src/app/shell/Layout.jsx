/**
 * @module components/shell/Layout
 *
 * @description Componente de disposición principal que proporciona estructura de navegación
 * para la aplicación de gestión de inventario.
 *
 * Implementa un diseño receptivo con barra lateral persistente en escritorio y cajón plegable
 * en dispositivos móviles.
 */

import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
	AppBar,
	Box,
	CssBaseline,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import {
	Menu as MenuIcon,
	Dashboard as DashboardIcon,
	Inventory as InventoryIcon,
	AddBox as AddBoxIcon,
} from "@mui/icons-material";

/** @constant {number} drawerWidth - Ancho del cajón de la barra lateral en píxeles */
const drawerWidth = 260;

/**
 * Array de configuración de elementos de navegación
 * @constant {Array<Object>} navItems
 * @property {string} text - Nombre mostrado del elemento de navegación
 * @property {React.ReactElement} icon - Componente de icono MUI para el elemento de navegación
 * @property {string} path - Ruta a navegar cuando se hace clic
 */
const navItems = [
	{ text: "Dashboard", icon: <DashboardIcon />, path: "/" },
	{ text: "Inventario", icon: <InventoryIcon />, path: "/inventory" },
	{ text: "Nuevo Producto", icon: <AddBoxIcon />, path: "/products/new" },
];

/**
 * Componente Layout
 *
 * @component
 * @description Disposición principal de la aplicación con navegación receptiva en la barra
 * lateral.
 *
 * Características:
 * - AppBar fija con alternancia de menú para dispositivos móviles
 * - Cajón receptivo (temporal en móvil, permanente en escritorio)
 * - Navegación con resaltado de ruta activa
 * - Título de página dinámico basado en la ruta actual
 *
 * @returns {React.ReactElement} Envoltura de Layout con AppBar, Drawer y salida de contenido
 *
 * @example
 * <Routes>
 *   <Route element={<Layout />}>
 *     <Route path="/" element={<Dashboard />} />
 *     <Route path="/inventory" element={<Inventory />} />
 *   </Route>
 * </Routes>
 */
const Layout = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	/**
	 * Alterna el estado abierto/cerrado del cajón móvil
	 * @function handleDrawerToggle
	 * @returns {void}
	 */
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	/**
	 * Maneja la navegación a una ruta especificada y cierra el cajón móvil si está abierto
	 * @function handleNavigation
	 * @param {string} path - La ruta a navegar
	 * @returns {void}
	 */
	const handleNavigation = (path) => {
		navigate(path);
		if (isMobile) {
			setMobileOpen(false);
		}
	};

	/**
	 * Componente de contenido del cajón con marca y menú de navegación
	 * @type {React.ReactElement}
	 */
	const drawer = (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<Box
				sx={{
					p: 3,
					borderBottom: "1px solid",
					borderColor: "divider",
					background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
				}}>
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: "white",
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}>
					<InventoryIcon /> StockPro
				</Typography>
				<Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
					Gestión de Inventario
				</Typography>
			</Box>

			<List sx={{ flex: 1, pt: 2 }}>
				{navItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ px: 2, mb: 0.5 }}>
						<ListItemButton
							onClick={() => handleNavigation(item.path)}
							sx={{
								borderRadius: 2,
								backgroundColor:
									location.pathname === item.path
										? "primary.main"
										: "transparent",
								color:
									location.pathname === item.path ? "white" : "text.primary",
								"&:hover": {
									backgroundColor:
										location.pathname === item.path
											? "primary.dark"
											: "action.hover",
								},
							}}>
							<ListItemIcon
								sx={{
									color:
										location.pathname === item.path ? "white" : "primary.main",
									minWidth: 40,
								}}>
								{item.icon}
							</ListItemIcon>
							<ListItemText
								primary={item.text}
								primaryTypographyProps={{ fontWeight: 500 }}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		/**
		 * Contenedor de disposición principal con diseño flexbox
		 * Estructura:
		 * - CssBaseline: Normaliza estilos en navegadores
		 * - AppBar: Encabezado fijo con título y alternancia de menú móvil
		 * - nav: Cajón de navegación (receptivo)
		 * - main: Área de contenido con Outlet para rutas anidadas
		 */
		<Box sx={{ display: "flex", minHeight: "100vh" }}>
			<CssBaseline />

			{/**
			 * Barra de encabezado de aplicación
			 * - Posición fija ocupando el ancho completo en móvil, ajustada en escritorio
			 * - Contiene alternancia de menú hamburguesa para móvil y título de página actual
			 * - Usa color background.paper para combinarse con la disposición principal
			 */}
			<AppBar
				position="fixed"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
					backgroundColor: "background.paper",
					color: "text.primary",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
				}}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { md: "none" } }}>
						<MenuIcon />
					</IconButton>

					<Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
						{navItems.find((item) => item.path === location.pathname)?.text ||
							"StockPro"}
					</Typography>
				</Toolbar>
			</AppBar>

			{/**
			 * Contenedor de navegación
			 * Sistema de cajón receptivo con dos variantes:
			 * 1. Cajón temporal para móvil (plegable)
			 * 2. Cajón permanente para escritorio (siempre visible)
			 */}
			<Box
				component="nav"
				sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}>
					{drawer}
				</Drawer>

				<Drawer
					variant="permanent"
					open
					sx={{
						display: { xs: "none", md: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							borderRight: "1px solid",
							borderColor: "divider",
						},
					}}>
					{drawer}
				</Drawer>
			</Box>

			{/**
			 * Área de contenido principal
			 * - Se flexiona para llenar el espacio restante
			 * - Contiene el Outlet para componentes de ruta anidados
			 * - Tiene en cuenta la altura de AppBar con mt: "64px"
			 * - Usa color de fondo predeterminado del tema
			 */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { md: `calc(100% - ${drawerWidth}px)` },
					backgroundColor: "background.default",
					minHeight: "100vh",
					mt: "64px",
				}}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
