import { Button, AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface PageOptions {
	[key: string]: PageOption[];
}

interface PageOption {
	label: string;
	link: string;
	active: boolean;
}

export const Navbar = () => {
	const SCHEDULE = { label: "Mi horario", link: "/users/schedule" };
	const HISTORY = { label: "Mi historial", link: "/users/history" };
	const CLOSURE = { label: "Cerrar Sesión", link: "/" };
	const JOBS = { label: "Puestos de Trabajo", link: "/admin/jobs" };
	const EMPLOYEES = { label: "Empleados", link: "/admin/employees" };

	const location = useLocation();
	const page_options: PageOptions = {
		"/": [],
		"/users/schedule": [
			{ ...SCHEDULE, active: true },
			{ ...HISTORY, active: false },
			{ ...CLOSURE, active: false },
		],
		"/users/history": [
			{ ...SCHEDULE, active: false },
			{ ...HISTORY, active: true },
			{ ...CLOSURE, active: false },
		],
		"/admin/jobs": [
			{ ...JOBS, active: true },
			{ ...EMPLOYEES, active: false },
			{ ...CLOSURE, active: false },
		],
		"/admin/employees": [
			{ ...JOBS, active: false },
			{ ...EMPLOYEES, active: true },
			{ ...CLOSURE, active: false },
		],
		"/admin/employees/new": [
			{ ...JOBS, active: false },
			{ ...EMPLOYEES, active: true },
			{ ...CLOSURE, active: false },
		],
		"/admin/employees/edit": [
			{ ...JOBS, active: false },
			{ ...EMPLOYEES, active: true },
			{ ...CLOSURE, active: false },
		],
	};

	/*MAntenimiento MR-5: Se ajustó la distancia dentre el logo y los botones, además los botónes tienen margen*/
	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="static" style={{ backgroundColor: "#DC7A20", padding: "0.3rem 1rem" }}>
				<Toolbar variant="dense">
					<Typography
						variant="h4"
						color="black"
						component="div"
						sx={{ flexGrow: 1, fontWeight: "bold", fontStyle: "italic", marginRight: '50px'}}
					>
						AMS
					</Typography>
					<Box sx={{ paddingLeft: '50px'}}>
						{page_options[location.pathname].map((option, index) => (
							<Link to={option.link} key={index}>
								{option.active ? (
									<Button
										sx={{
											color: "black",
											backgroundColor: "#CB8B2A",
											"&:hover": { backgroundColor: "#C7882A" },
											margin: 0.5
										}}
										variant="contained"
									>
										{option.label}
									</Button>
								) : (
									<Button sx={{ color: "black", backgroundColor: "#DC7A20"}}>
										{option.label}
									</Button>
								)}
							</Link>
						))}
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
