import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../../helpers";
import { ListedEmployee, PaginationData, Schedule, Job, Day } from "../../interfaces";

export const useGetJobs = () => {
	return useMutation({
		mutationKey: ["Jobs"],
		mutationFn: async () => {
			const { data } = await httpClient.get<Job[]>("/jobs/");
			return data;
		},
	});
};

export const useCreateJob = () => {
	return useMutation({
		mutationKey: ["Jobs"],
		mutationFn: async (job: Job) => {
			const { data } = await httpClient.post<Job>("/jobs/", {
				...job,
			});
			return data;
		},
	});
};

export const useUpdateJob = () => {
	return useMutation({
		mutationKey: ["Jobs"],
		mutationFn: async (job: Job) => {
			const { data } = await httpClient.put<Job>("/jobs/" + job.id, {
				...job,
			});
			return data;
		},
	});
};

export const useDeleteJob = () => {
	return useMutation({
		mutationKey: ["Jobs"],
		mutationFn: async (job: Job) => {
			await httpClient.delete<Job>("/jobs/" + job.id);
		},
	});
};

interface EmployeesWrapper {
	controlled_users: ListedEmployee[];
}

export const useGetAllEmployees = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async ({ page, perPage }: PaginationData) => {
			const { data } = await httpClient.get<EmployeesWrapper>(
				`/user/?page=${page}&per_page=${perPage}`
			);
			return data.controlled_users;
		},
	});
};

export const useGetSchedulesOfEmployee = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async (employee_id: number) => {
			const { data } = await httpClient.get<Schedule[]>(`/user/${employee_id}/schedules`);
			return data;
		},
	});
};

interface NewEmployee {
	name: string;
	email: string;
	password: string;
	active: boolean;
	salary: number;
	jobId: number;
}

export const useCreateEmployee = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async (employee: NewEmployee) => {
			const { data } = await httpClient.post<any>("/user/", {
				...employee,
			});
			return data.body.id;
		},
	});
};

interface ScheduleCreationStructure {
	id: number;
	entryDayId: number;
	entryTime: string;
	exitDayId: number;
	exitTime: string;
}

interface UpdatableUser {
	id: number;
	name: string;
	email: string;
	password: string;
	salary: number;
	jobId: number;
	active: boolean;
	schedules: ScheduleCreationStructure[];
	deletableSchedules: number[];
}

export const useUpdateEmployee = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async (user: Omit<UpdatableUser, "password">) => {
			const { data } = await httpClient.put<string>(`/user/${user.id}`, {
				...user,
			});
			return data;
		},
	});
};

export const useDeactivateEmployee = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async (employee_id: number) => {
			const { data } = await httpClient.delete<unknown>(`/user/${employee_id}`);
			return data;
		},
	});
};

interface NewSchedule {
	entryDayId: number;
	entryTime: string;
	exitDayId: number;
	exitTime: string;
	controlledUserId: number;
}

export const useCreateSchedule = () => {
	return useMutation({
		mutationKey: ["Schedules"],
		mutationFn: async (schedule: NewSchedule) => {
			const { data } = await httpClient.post<{}>("/schedules/", {
				...schedule,
			});
			return data;
		},
	});
};

export const useGetDays = () => {
	return useMutation({
		mutationKey: ["Days"],
		mutationFn: async () => {
			const { data } = await httpClient.get<Day[]>("/days/");
			return data;
		},
	});
};

interface InoutRecord {
	employee_id: number;
	arriving: boolean;
	dateTimeRecord: string;
}

export const useRegisterInout = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async ({ employee_id, arriving, dateTimeRecord }: InoutRecord) => {
			const { data } = await httpClient.post<unknown>(`/user/user/${employee_id}/register_inout`, {
				arriving,
				dateTimeRecord,
			});
			return data;
		},
	});
};

export const useDownloadUsersReport = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async () => {
			const { data } = await httpClient.get<Blob>("/reports/users", {
				responseType: "blob",
			});
			return data;
		},
	});
};

interface StartEndRecord {
	startDate: string;
	endDate: string;
}

export const useDownloadPaymentsReport = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async ({ startDate, endDate }: StartEndRecord) => {
			const { data } = await httpClient.get<Blob>(
				`/reports/payroll?startDate=${startDate}&endDate=${endDate}`,
				{
					responseType: "blob",
				}
			);
			return data;
		},
	});
};

export const useDownloadHistoryReport = () => {
	return useMutation({
		mutationKey: ["Employees"],
		mutationFn: async (date: string) => {
			const { data } = await httpClient.get<Blob>(`/reports/registration?date=${date}`, {
				responseType: "blob",
			});
			return data;
		},
	});
};
