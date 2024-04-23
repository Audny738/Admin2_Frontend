export interface User {
	email: string;
	password: string;
}

export interface PaginationData {
	page: number;
	perPage: number;
}

export interface SessionUser {
	id: number;
	userType: string;
}

export interface ControlledUser {
	id: number;
	name: string;
	email: string;
	password: string;
	salary: number;
}

export interface ListedEmployee extends ControlledUser {
	jobDescription: string;
	present: boolean;
	schedules: string[];
	scheduleObjs: Schedule[] | undefined;
}

export interface FullEmployee extends ControlledUser {
	job: Job;
	active: boolean;
}

export interface Job {
	id: number;
	name: string;
	area: string;
}

export interface Schedule {
	id: number;
	entryDay: Day;
	entryTime: string;
	exitDay: Day;
	exitTime: string;
}

export interface Day {
	id: number;
	name: string;
}

export interface AttendanceRecord {
	dayName: string;
	entryDatetime: string | undefined;
	exitDatetime: string | undefined;
}
