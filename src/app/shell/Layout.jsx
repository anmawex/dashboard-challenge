/**
 * Main layout component with navigation
 * @module components/layout/Layout
 */
import React, { useState } from "react";
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

const drawerWidth = 260;

const navItems = [
	{ text: "Dashboard", icon: <DashboardIcon />, path: "/" },
	{ text: "Inventario", icon: <InventoryIcon />, path: "/inventory" },
	{ text: "Nuevo Producto", icon: <AddBoxIcon />, path: "/products/new" },
];

const Layout = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleNavigation = (path) => {
		navigate(path);
		if (isMobile) {
			setMobileOpen(false);
		}
	};

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
		<Box sx={{ display: "flex", minHeight: "100vh" }}>
			<CssBaseline />

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
