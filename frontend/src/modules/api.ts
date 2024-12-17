import { User } from "@/types/user";
import axios, { AxiosBasicCredentials, AxiosError } from "axios";

const credentialDict: {
	active: boolean;
	username?: string;
	password?: string;
} = {
	active: false,
};

const storeCredentials = (email: string, password: string) => {
	credentialDict.username = email;
	credentialDict.password = password;
	credentialDict.active = true;
};

export const clearCredentials = () => {
	credentialDict.username = undefined;
	credentialDict.password = undefined;
	credentialDict.active = false;
};

const canUseCredentials = (): boolean => {
	const { active, username, password } = credentialDict;

	return !!(active && username && password);
};

const useCredentials = (): AxiosBasicCredentials | undefined => {
	const { active, username, password } = credentialDict;

	if (active && username && password) {
		return { username, password };
	}

	return undefined;
};

const handleError = (e: AxiosError | any) => {
	if (e?.response?.status === 401) {
		clearCredentials();
	}
};

export const instance = axios.create({
	baseURL: import.meta.env.DEV ? "/api/" : "https://api.example.com",
});

instance.interceptors.request.use((config) => {
	config.auth = useCredentials();

	return config;
});

export const login = async (email: string, password: string): Promise<User> => {
	return instance
		.post("/v1/authentication/login", { email, password })
		.then((res) => {
			storeCredentials(email, password);
			return res.data;
		})
		.catch((e) => {
			handleError(e);
			throw new Error(e?.response?.data?.message);
		});
};

export const getSelf = async (): Promise<User> => {
	if (!canUseCredentials()) throw new Error("No credentials available");

	return instance
		.get("/v1/authentication/self")
		.then((res) => {
			return res.data;
		})
		.catch((e) => {
			handleError(e);
			throw new Error(e?.response?.data?.message);
		});
};

export const getUsers = async (): Promise<User[]> => {
	if (!canUseCredentials()) throw new Error("No credentials available");

	return instance
		.get("/v1/authentication/user")
		.then((res) => {
			return res.data;
		})
		.catch((e) => {
			handleError(e);
			throw new Error(e?.response?.data?.message);
		});
};

export const validatePasswordStrength = (password: string): boolean => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,}$/.test(password);
};

export const validateEmail = (email: string): boolean =>
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
		email
	);

export const registerUser = async ({
	email,
	password,
	first_name,
	last_name,
	is_admin,
}: { password: string } & Omit<User, "uuid">): Promise<User[]> => {
	if (!canUseCredentials()) throw new Error("No credentials available");

	return instance
		.put("/v1/authentication/user", {
			email,
			password,
			first_name,
			last_name,
			is_admin,
		})
		.then((res) => {
			return res.data;
		})
		.catch((e) => {
			handleError(e);
			throw new Error(e?.response?.data?.message);
		});
};

export const editUser = async ({
	uuid,
	email,
	password,
	first_name,
	last_name,
	is_admin,
}: { uuid: string; password?: string } & Partial<User>): Promise<User> => {
	if (!canUseCredentials()) throw new Error("No credentials available");

	return instance
		.patch(`/v1/authentication/user/${uuid}`, {
			email,
			password,
			first_name,
			last_name,
			is_admin,
		})
		.then((res) => {
			return res.data;
		})
		.catch((e) => {
			handleError(e);
			throw new Error(e?.response?.data?.message);
		});
};

export const deleteUser = async (uuid: string): Promise<void> => {
	if (!canUseCredentials()) throw new Error("No credentials available");

	return instance
		.delete(`/v1/authentication/user/${uuid}`)
		.then((res) => {
			return;
		})
		.catch((e) => {
			handleError(e);
			throw new Error(e?.response?.data?.message);
		});
};
