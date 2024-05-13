import {
	Box,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	Button,
	TextField,
} from "@mui/material";
import { Job } from "../interfaces";
import React, { Dispatch } from "react";
import { useCreateJob } from "../api";
import { useGetJobs } from "../api";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	setJobs: Dispatch<React.SetStateAction<Job[]>>;
}

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

export const AddJobsModal = ({ isOpen, onClose, setJobs }: Props) => {
	const createJob = useCreateJob();
	const getJobs = useGetJobs();
	const [job, setJob] = React.useState<Job>({
		id: 0,
		name: "",
		area: "",
	});

	const requestCreateJob = () => {
		createJob.mutate(job, {
			onSuccess: () => {
				console.log("Puesto de trabajo creado con éxito");
				setNewJob()
				onClose();
			},
			onError: () => {
				console.log("Error al crear puesto de trabajo");
			},
		});
	};

	const setNewJob = () => {
		getJobs.mutate(undefined, {
			onSuccess: (data) => {
				console.log(data[data.length-1])
				setJobs((previous) => [...previous, data[data.length-1]]);
			},
			onError: () => {
				console.log("Error al cargar puestos de trabajo");
			},
		});
	};

	return (
		<>
			<Modal
				open={isOpen}
				onClose={onClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h3">
						Nuevo Puesto:
					</Typography>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<Typography>Nombre: </Typography>
								</TableCell>
								<TableCell>
									<TextField
										id="outlined-size-small"
										size="small"
										className="input-name"
										color="warning"
										onChange={(e) => setJob({ ...job, name: e.target.value })}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography>Área: </Typography>
								</TableCell>
								<TableCell>
									<TextField
										id="outlined-size-small"
										size="small"
										className="input-area"
										color="warning"
										onChange={(e) => setJob({ ...job, area: e.target.value })}
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
						onClick={requestCreateJob}
					>
						Añadir Puesto
					</Button>
				</Box>
			</Modal>
		</>
	);
};
