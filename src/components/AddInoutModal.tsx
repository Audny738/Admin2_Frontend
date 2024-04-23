import {
	Modal,
	Box,
	Typography,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Switch,
	FormControlLabel,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	handleClose: (data: UserInput) => void;
}

interface UserInput {
	time: Dayjs | null;
	arriving: boolean;
}

export const AddInoutModal = ({ isOpen, onClose, handleClose }: Props) => {
	const [userInput, setUserInput] = useState<UserInput>({
		time: dayjs().startOf("day").add(7, "hours"),
		arriving: true,
	});
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 650,
		bgcolor: "#D9D9D9",
		boxShadow: 24,
		p: 2,
	};

	return (
		<>
			<Modal open={isOpen} onClose={onClose}>
				<Box sx={style}>
					<Typography variant="h6" component="h3">
						Registrar entrada/salida:
					</Typography>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell sx={{ width: "30%" }}>
									<Typography>Momento de registro</Typography>
								</TableCell>
								<TableCell sx={{ width: "70%" }}>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<DemoContainer components={["DateTimePicker"]}>
											<DateTimePicker
												sx={{ width: "100%" }}
												label="Selecciona un día y una hora"
												value={userInput.time}
												onChange={(newValue) => setUserInput({ ...userInput, time: newValue })}
											/>
										</DemoContainer>
									</LocalizationProvider>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={2}>
									<FormControlLabel
										control={
											<Switch
												checked={userInput.arriving}
												onChange={(e) => setUserInput({ ...userInput, arriving: e.target.checked })}
											/>
										}
										label={"El usuario está llegando"}
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
							display: "block",
							margin: "20px auto 0",
						}}
						onClick={() => handleClose(userInput)}
					>
						Guardar
					</Button>
				</Box>
			</Modal>
		</>
	);
};
