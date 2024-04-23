import { dayTimes } from "../../components";
import {
	Autocomplete,
	Box,
	Button,
	ButtonProps,
	Container,
	FormControl,
	Input,
	InputLabel,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	styled,
	tableCellClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Day, Job } from "../../interfaces";
import { useCreateEmployee, useGetDays, useGetJobs } from "../../api";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
	color: theme.palette.getContrastText("#CB8B2A"),
	backgroundColor: "#CB8B2A",
	"&:hover": {
		backgroundColor: "#C7882A",
	},
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#CB8B2A",
		color: theme.palette.common.black,
		fontSize: 14,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 12,
		fontweigth: "bold",
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

interface Column {
	id: string;
	label: string;
	minWidth: number;
}

export const AdminUsersCreateEmployee = () => {
	const getDays = useGetDays();
	const getJobs = useGetJobs();
	const createEmployee = useCreateEmployee();
	const navigate = useNavigate();
	const [openAdd, setOpenAdd] = React.useState(false);
	const handleOpenAdd = () => setOpenAdd(true);
	const handleCloseAdd = () => setOpenAdd(false);

	useEffect(() => {
		requestDays();
		requestJobs();
	}, []);

	const [dayLabels, setDayLabels] = useState<{ label: string }[]>([]);
	const [daysArray, setDaysArray] = useState<Day[]>([]);
	const [jobLabels, setJobLabels] = useState<{ label: string }[]>([]);
	const [jobsArray, setJobsArray] = useState<Job[]>([]);
	const columns: Column[] = [
		{ id: "entry", label: "Entrada", minWidth: 120 },
		{ id: "deparure", label: "Salida", minWidth: 120 },
	];
	const [schedules, setSchedules] = useState<ScheduleCreationStructure[]>([]);
	const [newSchedule, setNewSchedule] = useState<ScheduleCreationStructure>({
		entryDayId: 0,
		entryTime: "",
		exitDayId: 0,
		exitTime: "",
	});
	const [employee, setEmployee] = useState<{
		name: string;
		email: string;
		password: string;
		active: boolean;
		salary: number;
		jobId: number;
		schedules: ScheduleCreationStructure[];
	}>({
		name: "",
		email: "",
		password: "",
		salary: 0,
		active: true,
		jobId: 0,
		schedules: [],
	});

	interface ScheduleCreationStructure {
		entryDayId: number;
		entryTime: string;
		exitDayId: number;
		exitTime: string;
	}

	function transformDaysArray(days: Day[]): { label: string }[] {
		return days.map((day) => ({ label: day.name }));
	}

	function transformJobsArray(jobs: Job[]): { label: string }[] {
		return jobs.map((job) => ({ label: job.name }));
	}

	const requestDays = () => {
		getDays.mutate(undefined, {
			onSuccess: (data) => {
				setDaysArray(data);
				var transformedDays = transformDaysArray(data);
				setDayLabels(transformedDays);
			},
			onError: () => {
				console.log("Error al cargar los días");
			},
		});
	};

	const requestJobs = () => {
		getJobs.mutate(undefined, {
			onSuccess: (data) => {
				setJobsArray(data);
				var transformedJobs = transformJobsArray(data);
				setJobLabels(transformedJobs);
			},
		});
	};

	const handleAddSchedule = (newS: ScheduleCreationStructure) => {
		if (newS) {
			setSchedules([...schedules, newS]);
			employee.schedules.push(newS);
			handleCloseAdd();
		} else {
			console.log("Error al agregar el nuevo horario");
		}
	};

	const requestCreateEmployee = () => {
		createEmployee.mutate(employee, {
			onSuccess: () => {
				console.log("Empleado creado con éxito");
				navigate("/admin/employees");
			},
			onError: () => {
				console.log("Error al crear el empleado");
			},
		});
	};

	const setEmployeeSalary = (salary: string) => {
		const salaryNum = Number(salary);
		setEmployee({ ...employee, salary: salaryNum });
	};

	const setEmployeeJob = (jobName: string | null) => {
		const foundJob = jobsArray.find((jobObject) => jobObject.name === jobName);
		if (foundJob) {
			setEmployee({ ...employee, jobId: foundJob.id });
		}
	};

	const setScheduleEntryDay = (entry: string | null) => {
		const foundDay = daysArray.find((day) => day.name === entry);
		if (foundDay) {
			setNewSchedule({ ...newSchedule, entryDayId: foundDay.id });
		}
	};

	const setScheduleExitDay = (exit: string | null) => {
		const foundDay = daysArray.find((day) => day.name === exit);
		if (foundDay) {
			setNewSchedule({ ...newSchedule, exitDayId: foundDay.id });
		}
	};

	const getDayName = (dayId: number) => {
		const foundDay = daysArray.find((day) => day.id === dayId);
		if (foundDay) {
			return foundDay.name;
		} else {
			return "";
		}
	};

	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 450,
		bgcolor: "#D9D9D9",
		boxShadow: 24,
		p: 2,
	};

	return (
		<>
			<Container
				maxWidth="lg"
				sx={{
					minHeight: "80vh",
					display: "flex",
					alignItems: "start",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						minWidth: "70%",
						bgcolor: "#F0EFEF",
						padding: "1rem 2rem",
						minHeight: "70vh",
					}}
				>
					<h3 style={{ marginTop: "0", fontSize: 24 }}>Nuevo Empleado</h3>
					<div style={{ display: "table-row-group" }}>
						<div style={{ display: "table-cell", width: "50%" }}>
							<FormControl variant="standard" sx={{ width: "95%" }}>
								<InputLabel htmlFor="standard-adornment-correo" color="warning">
									Nombre Completo
								</InputLabel>
								<Input
									id="standard-adornment-amount"
									color="warning"
									onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
								/>
							</FormControl>
							<FormControl variant="standard" sx={{ width: "95%", marginTop: "7%" }}>
								<InputLabel htmlFor="standard-adornment-correo" color="warning">
									Correo electrónico
								</InputLabel>
								<Input
									id="standard-adornment-amount"
									color="warning"
									onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
								/>
							</FormControl>
							<FormControl variant="standard" sx={{ width: "95%", marginTop: "7%" }}>
								<InputLabel htmlFor="standard-adornment-correo" color="warning">
									Contraseña
								</InputLabel>
								<Input
									id="standard-adornment-amount"
									color="warning"
									onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
								/>
							</FormControl>
							<Autocomplete
								disablePortal
								id="combo-box-demo"
								options={jobLabels}
								sx={{ width: "95%", marginTop: "10%" }}
								color="warning"
								onInputChange={(_event: any, newValue: string | null) => setEmployeeJob(newValue)}
								renderInput={(params) => (
									<TextField {...params} label="Puesto de Trabajo" color="warning" />
								)}
							/>
							<FormControl variant="standard" sx={{ width: "95%", marginTop: "5%" }}>
								<InputLabel htmlFor="standard-adornment-correo" color="warning">
									Salario
								</InputLabel>
								<Input
									id="standard-adornment-amount"
									color="warning"
									onChange={(e) => setEmployeeSalary(e.target.value)}
								/>
							</FormControl>
						</div>
						<div style={{ display: "table-cell" }}>
							<h4>Horarios</h4>
							<Table>
								<TableHead>
									<TableRow>
										{columns.map((column) => (
											<StyledTableCell key={column.id} align="center" style={{}}>
												{column.label}
											</StyledTableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{schedules && schedules.length > 0 ? (
										schedules.map((row) => (
											<StyledTableRow
												key={row.entryDayId}
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
													"&:nth-of-type(odd) .MuiTableCell-body": {
														color: "#CB8B2A",
													},
												}}
											>
												<StyledTableCell component="th" scope="row" align="center">
													{getDayName(row.entryDayId)} {row.entryTime}
												</StyledTableCell>
												<StyledTableCell component="th" scope="row" align="center">
													{getDayName(row.exitDayId)} {row.exitTime}
												</StyledTableCell>
											</StyledTableRow>
										))
									) : (
										<StyledTableRow
											key={0}
											sx={{
												"&:last-child td, &:last-child th": { border: 0 },
												"&:nth-of-type(odd) .MuiTableCell-body": {
													color: "#CB8B2A",
												},
											}}
										>
											<StyledTableCell scope="row" align="center" colSpan={5}>
												No hay horarios agregados
											</StyledTableCell>
										</StyledTableRow>
									)}
								</TableBody>
							</Table>
							<Button
								variant="contained"
								sx={{
									backgroundColor: "#ABABAB",
									color: "black",
									"&:hover": {
										backgroundColor: "#C7882A",
									},
									marginTop: "15px",
									marginLeft: "55%",
								}}
								onClick={handleOpenAdd}
							>
								Añadir Horario+
							</Button>
						</div>
					</div>
					<ColorButton
						variant="contained"
						style={{ marginTop: "5%" }}
						onClick={requestCreateEmployee}
					>
						Crear Empleado
					</ColorButton>
					<Modal
						open={openAdd}
						onClose={handleCloseAdd}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style}>
							<Typography id="modal-modal-title" variant="h6" component="h3">
								Nuevo Horario:
							</Typography>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography>Entrada</Typography>
										</TableCell>
										<TableCell>
											<Autocomplete
												disablePortal
												id="combo-box-demo"
												options={dayLabels}
												sx={{ width: "100%" }}
												color="warning"
												onInputChange={(_event: any, newValue: string | null) =>
													setScheduleEntryDay(newValue)
												}
												renderInput={(params) => (
													<TextField {...params} label="Día" color="warning" />
												)}
											/>
										</TableCell>
										<TableCell>
											<Autocomplete
												disablePortal
												id="combo-box-demo"
												options={dayTimes}
												sx={{ width: "100%" }}
												color="warning"
												onInputChange={(_event: any, newValue: string) =>
													setNewSchedule({ ...newSchedule, entryTime: newValue + ":00" })
												}
												renderInput={(params) => (
													<TextField {...params} label="Horario" color="warning" />
												)}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography>Salida </Typography>
										</TableCell>
										<TableCell>
											<Autocomplete
												disablePortal
												id="combo-box-demo"
												options={dayLabels}
												sx={{ width: "100%" }}
												color="warning"
												onInputChange={(_event: any, newValue: string | null) =>
													setScheduleExitDay(newValue)
												}
												renderInput={(params) => (
													<TextField {...params} label="Día" color="warning" />
												)}
											/>
										</TableCell>
										<TableCell>
											<Autocomplete
												disablePortal
												id="combo-box-demo"
												options={dayTimes}
												sx={{ width: "100%" }}
												color="warning"
												onInputChange={(_event: any, newValue: string) =>
													setNewSchedule({ ...newSchedule, exitTime: newValue + ":00" })
												}
												renderInput={(params) => (
													<TextField {...params} label="Horario" color="warning" />
												)}
											/>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<Button
								variant="contained"
								sx={{
									backgroundColor: "#ABABAB",
									color: "black",
									"&:hover": {
										backgroundColor: "#C7882A",
									},
									marginTop: "20px",
									marginLeft: "65%",
								}}
								onClick={() => handleAddSchedule(newSchedule)}
							>
								Añadir Horario
							</Button>
						</Box>
					</Modal>
				</Box>
			</Container>
		</>
	);
};
