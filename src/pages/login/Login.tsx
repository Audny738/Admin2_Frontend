import { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useInitSession } from "../../api";
import { User } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { setSession } from "../../helpers";
import {
	Alert,
	Box,
	Container,
	InputLabel,
	FormControl,
	Input,
	InputAdornment,
	IconButton,
	Button,
	ButtonProps,
	AlertColor,
} from "@mui/material";

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
	color: theme.palette.getContrastText("#CB8B2A"),
	backgroundColor: "#CB8B2A",
	"&:hover": {
		backgroundColor: "#C7882A",
	},
}));

interface AlertData {
	show: boolean;
	type: AlertColor;
	message: string;
}

export const Login = () => {
	const navigate = useNavigate();
	const initSession = useInitSession();
	const [showPassword, setShowPassword] = useState(false);
	
	//Codigo inicio de variables utiles para el contador de intentos y de tiempo
	const [loginAttempts, setLoginAttempts] = useState(1);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const [seconds, setSeconds] = useState(10);
 	const [isTimerRunning, setIsTimerRunning] = useState(false);

	const [showMessage, setShowMessage] = useState<AlertData>({
		show: false,
		type: "info",
		message: "",
	});
	const [user, setUser] = useState<User>({
		email: "",
		password: "",
	});

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	useEffect(() => { //Funcion que ayuda en el conteo de segundos para volver a intentar acceder
		let interval;
	
		if (isTimerRunning) {
		  interval = setInterval(() => {
			setSeconds((prevSeconds) => prevSeconds - 1);
		  }, 1000);
		}
	
		if (seconds === 0) {
		  setIsTimerRunning(false);
		  
		  setIsButtonDisabled(false);
		}
	
		return () => clearInterval(interval);
	  }, [isTimerRunning, seconds]);

	const requestInitSession = () => {
		initSession.mutate(user, {
			onSuccess: (data) => {
				if (data.status) {
					setSession(data.user);

					if (data.user.userType == "controlled") {
						navigate("/users/schedule");
					} else {
						navigate("/admin/jobs");
					}
				} else { //Condicionales modificadas a conveniencia
					setLoginAttempts(loginAttempts + 1);
					setShowMessage({
						show: true,
						type: "warning",
						message: "Los datos proporcionados no son correctos. Usted lleva: " + loginAttempts + " intentos",
					});
					if (loginAttempts === 3) { //Condicional, si hay 3 intentos, el acceso se bloquea por 30 segundos
						setSeconds(30);
						setIsButtonDisabled(true);
						setIsTimerRunning(true);
						setShowMessage({
							show: true,
							type: "warning",
							message: "Usted lleva: " + loginAttempts + " intentos. Espere un tiempo para vovler a intentarlo",
						});	
						
							
					}else if(loginAttempts === 6){ //Condicional, si hay 6 intentos, el acceso se bloquea por 60 segundos
						setSeconds(60);
						setShowMessage({
							show: true,
							type: "warning",
							message: "Los datos proporcionados no son correctos. Usted lleva: " + loginAttempts + " intentos",
						});
						setIsButtonDisabled(true);
						setIsTimerRunning(true);
						setShowMessage({
							show: true,
							type: "warning",
							message: "Usted lleva: " + loginAttempts + " intentos. Espere un tiempo para vovler a intentarlo",
						});	

					}else if(loginAttempts === 9){ //Condicional, si hay 9 intentos, el acceso se bloquea por 120 segundos
						setSeconds(120);
						setShowMessage({
							show: true,
							type: "warning",
							message: "Los datos proporcionados no son correctos. Usted lleva: " + loginAttempts + " intentos",
						});
						setIsButtonDisabled(true);
						setIsTimerRunning(true);
						setShowMessage({
							show: true,
							type: "warning",
							message: "Usted lleva: " + loginAttempts + " intentos. Espere un tiempo para vovler a intentarlo",
						});
					} else if(loginAttempts > 10){ //Condicional, si hay más de 10 intentos, el acceso se bloquea indefinidamente, sin importar los segundos que se muestren
						setSeconds(999999);
						setIsButtonDisabled(true);
						
						setShowMessage({
							show: true,
							type: "warning",
							message: "Demasiados intentos, contacte con el administrador",
						});

					}
				}
			},
			onError: () => {
				setShowMessage({
					show: true,
					type: "error",
					message: "Ocurrió un error al intentar iniciar sesión",
				});
			},
		});
	};

	return (
		<>
			<Container
				maxWidth="md"
				sx={{
					minHeight: "80vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Box sx={{ minWidth: "70%", bgcolor: "#F0EFEF", padding: "4rem 1.5rem" }}>
					<div>
						<h2>Bienvenido al sistema AMS</h2>
					</div>

					<Box
						component="form"
						sx={{
							"& .MuiTextField-root": { m: 3, width: "25ch" },
						}}
						noValidate
						autoComplete="off"
					>
						{showMessage.show ? (
							<Alert severity={showMessage.type}>{showMessage.message}</Alert>
						) : null}

						<div className="div-input-form">
							<FormControl sx={{ m: 4, width: "90%" }} variant="standard">
								<InputLabel htmlFor="standard-adornment-correo">Correo</InputLabel>
								<Input
									id="standard-adornment-amount"
									onChange={(e) => setUser({ ...user, email: e.target.value })}
								/>
							</FormControl>
						</div>
						<div className="div-input-form">
							<FormControl sx={{ m: 4, width: "90%" }} variant="standard">
								<InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
								<Input
									id="filled-adornment-password"
									type={showPassword ? "text" : "password"}
									onChange={(e) => setUser({ ...user, password: e.target.value })}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
					</Box>

					<div className="div-button">
						<ColorButton variant="contained" onClick={requestInitSession} disabled={isButtonDisabled}>
							Iniciar Sesión
						</ColorButton>
						
					</div>
					<div>
						<h4>Tiempo para  vovler a iniciar sesión: {seconds} segundos</h4>

					</div>
				</Box>
			</Container>
		</>
	);
};
