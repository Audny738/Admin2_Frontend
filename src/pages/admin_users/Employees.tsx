import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import {
	Box,
	Button,
	ButtonProps,
	Container,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	styled,
	tableCellClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	useDeactivateEmployee,
	useGetAllEmployees,
	useGetSchedulesOfEmployee,
	useRegisterInout,
	useDownloadHistoryReport,
	useDownloadPaymentsReport,
	useDownloadUsersReport,
} from "../../api";
import { ListedEmployee, PaginationData } from "../../interfaces";
import { SchedulesModal } from "../../components/SchedulesModal";
import { useToggle } from "../../hooks";
import { AddInoutModal, DeleteAlertDialog } from "../../components";
import { GenerateReportModal } from "../../components/GenerateReportModal";
import { ReportType } from "../../constants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#CB8B2A",
		color: theme.palette.common.black,
		fontSize: 16,
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

const ColorButton = styled(Button)<ButtonProps>(() => ({
	color: "black",
	backgroundColor: "#CB8B2A",
	"&:hover": {
		backgroundColor: "#C7882A",
	},
}));

interface Column {
	id: string;
	label: string;
	minWidth: number;
}

export const AdminUsersEmployees = () => {
	const navigate = useNavigate();
	const getAllEmployees = useGetAllEmployees();
	const getSchedulesOfEmployee = useGetSchedulesOfEmployee();
	const deactivateEmployee = useDeactivateEmployee();
	const registerInout = useRegisterInout();
	const downloadUsersReport = useDownloadUsersReport();
	const downloadPaymentsReport = useDownloadPaymentsReport();
	const downloadHistoryReport = useDownloadHistoryReport();
	const [employees, setEmployees] = useState<ListedEmployee[]>([]);
	const [isOpenDeleteEmployee, toggleDeleteEmployee] = useToggle();
	const [isOpenSchedules, toggleSchedules] = useToggle();
	const [isOpenInout, toggleInout] = useToggle();
	const [isOpenReports, toggleReports] = useToggle();
	const [currentEmployee, setCurrentEmployee] = useState<ListedEmployee>({
		id: 0,
		name: "",
		email: "",
		password: "",
		salary: 0,
		jobDescription: "",
		present: false,
		schedules: [],
		scheduleObjs: undefined,
	});

	const columns: Column[] = [
		{ id: "name", label: "Nombre", minWidth: 120 },
		{ id: "job", label: "Puesto", minWidth: 120 },
		{ id: "schedules", label: "Horario", minWidth: 120 },
		{ id: "presence", label: "Presencia", minWidth: 120 },
		{ id: "operations", label: "Operaciones", minWidth: 120 },
	];

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	useEffect(() => {
		loadEmployees();
	}, [page, rowsPerPage]);

	const loadEmployees = () => {
		const pagination: PaginationData = { page: page, perPage: rowsPerPage };
		getAllEmployees.mutate(pagination, {
			onSuccess(data) {
				setEmployees(data);
			},
		});
	};

	const handleNewEmployee = () => {
		navigate("/admin/employees/new");
	};

	const handleEditEmployee = (id: number) => {
		navigate("/admin/employees/edit", { state: { employee_id: id } });
	};

	const handleRemoveEmployee = (employee: ListedEmployee) => {
		setCurrentEmployee(employee);
		toggleDeleteEmployee();
	};

	const removeEmployee = (id: number) => {
		deactivateEmployee.mutate(id, {
			onSuccess() {
				loadEmployees();
			},
		});
	};

	const handleShowSchedulesOfEmployee = (employee: ListedEmployee) => {
		setCurrentEmployee(employee);
		if (!employee.scheduleObjs) loadSchedulesOfEmployee(employee);
		toggleSchedules();
	};

	const loadSchedulesOfEmployee = (employee: ListedEmployee) => {
		getSchedulesOfEmployee.mutate(employee.id, {
			onSuccess(data) {
				employee.scheduleObjs = data;
				setCurrentEmployee(employee);
			},
		});
	};

	const handleRegisterInout = (employee: ListedEmployee) => {
		setCurrentEmployee(employee);
		toggleInout();
	};

	const addInout = (dateTimeRecord: string, arriving: boolean) => {
		registerInout.mutate(
			{ employee_id: currentEmployee.id, arriving, dateTimeRecord },
			{
				onSuccess() {
					loadEmployees();
				},
			}
		);
	};

	const requestUsersReport = () => {
		return downloadUsersReport.mutate(undefined, {
			onSuccess(data) {
				handleDownloadExcel(data);
			},
		});
	};

	const requestPaymentsReport = (startDate: string, endDate: string) => {
		return downloadPaymentsReport.mutate(
			{ startDate: startDate, endDate: endDate },
			{
				onSuccess(data) {
					handleDownloadExcel(data);
				},
			}
		);
	};

	const requestHistoryReport = (date: string) => {
		return downloadHistoryReport.mutate(date, {
			onSuccess(data) {
				handleDownloadExcel(data);
			},
		});
	};

	const handleDownloadExcel = (originalData: Blob) => {
		const data = new Blob([originalData], { type: "application/vnd.ms-excel" });
		const href = URL.createObjectURL(data);
		const link = document.createElement("a");
		link.href = href;
		link.setAttribute("download", "file.xls");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	return (
		<>
			<GenerateReportModal
				isOpen={isOpenReports}
				onClose={toggleReports}
				handleClose={(reportTypeId, data) => {
					if (reportTypeId == ReportType.Users) {
						requestUsersReport();
					} else if (reportTypeId == ReportType.Payments) {
						if (
							data.startDate &&
							data.endDate &&
							(data.startDate.isSame(data.endDate) || data.startDate.isBefore(data.endDate))
						) {
							requestPaymentsReport(
								data.startDate.format("YYYY-MM-DD"),
								data.endDate.format("YYYY-MM-DD")
							);
						}
					} else if (reportTypeId == ReportType.History) {
						if (data.startDate) {
							requestHistoryReport(data.startDate.format("YYYY-MM-DD"));
						}
					}
				}}
			></GenerateReportModal>
			<AddInoutModal
				isOpen={isOpenInout}
				onClose={toggleInout}
				handleClose={(data) => {
					if (data.time) {
						addInout(data.time.format("YYYY-MM-DD HH:mm:ss"), data.arriving);
						toggleInout();
					}
				}}
			/>
			<SchedulesModal
				isOpen={isOpenSchedules}
				onClose={toggleSchedules}
				employee={currentEmployee}
			/>
			<DeleteAlertDialog
				isOpen={isOpenDeleteEmployee}
				onClose={toggleDeleteEmployee}
				handleClose={() => {
					removeEmployee(currentEmployee.id);
					toggleDeleteEmployee();
				}}
			/>

			<Container
				maxWidth="md"
				sx={{
					minHeight: "80vh",
					display: "flex",
					alignItems: "start",
					justifyContent: "center",
				}}
			>
				<Box sx={{ minWidth: "70%", bgcolor: "#F0EFEF", padding: "2.5rem 1.5rem" }}>
					<h2 style={{ marginTop: "0" }}>Tabla de empleados</h2>

					<Box
						sx={{
							display: "flex",
							justifyContent: "end",
							alignItems: "center",
							marginBottom: "1rem",
						}}
					>
						<Button
							variant="contained"
							sx={{
								backgroundColor: "#ABABAB",
								color: "black",
								"&:hover": { backgroundColor: "#858585" },
							}}
							onClick={toggleReports}
						>
							Generar Reporte
						</Button>
					</Box>

					<Paper sx={{ width: "100%", overflow: "hidden" }}>
						<TableContainer sx={{ maxHeight: 440 }}>
							<Table stickyHeader aria-label="sticky table">
								<TableHead>
									<TableRow>
										{columns.map((column) => (
											<StyledTableCell
												key={column.id}
												align="center"
												style={{ minWidth: column.minWidth }}
											>
												{column.label}
											</StyledTableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{employees && employees.length > 0 ? (
										employees.map((employee) => (
											<StyledTableRow
												key={employee.id}
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
													"&:nth-of-type(odd) .MuiTableCell-body": {
														color: "#CB8B2A",
													},
												}}
											>
												<StyledTableCell scope="row" align="center">
													{employee.name}
												</StyledTableCell>
												<StyledTableCell scope="row" align="center">
													{employee.jobDescription}
												</StyledTableCell>
												<StyledTableCell scope="row" align="center">
													<List style={{ padding: "0" }}>
														{employee.schedules?.map((schedule, index) => (
															<ListItem key={index} style={{ padding: "0", textAlign: "center" }}>
																<ListItemText primary={schedule} />
															</ListItem>
														))}
													</List>
												</StyledTableCell>
												<StyledTableCell scope="row" align="center">
													{employee.present ? "Presente" : "Ausente"}
												</StyledTableCell>
												<StyledTableCell scope="row" align="center">
													<IconButton onClick={() => handleEditEmployee(employee.id)}>
														<EditIcon />
													</IconButton>
													<IconButton onClick={() => handleRemoveEmployee(employee)}>
														<DeleteIcon />
													</IconButton>
													<IconButton onClick={() => handleShowSchedulesOfEmployee(employee)}>
														<AccessTimeIcon />
													</IconButton>
													<IconButton onClick={() => handleRegisterInout(employee)}>
														<PendingActionsIcon />
													</IconButton>
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
											<StyledTableCell scope="row" align="center" colSpan={columns.length}>
												No hay empleados para mostrar
											</StyledTableCell>
										</StyledTableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={employees.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Paper>

					<Box
						sx={{
							display: "flex",
							justifyContent: "end",
							alignItems: "center",
							marginBottom: "1rem",
						}}
					>
						<ColorButton style={{ marginTop: "1rem" }} onClick={() => handleNewEmployee()}>
							Añadir +
						</ColorButton>
					</Box>
				</Box>
			</Container>
		</>
	);
};
