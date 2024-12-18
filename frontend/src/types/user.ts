export interface User {
	uuid: string;
	email: string;
	first_name?: string;
	last_name?: string;
	is_admin?: boolean;
}

export interface EmptyUser {
	uuid?: "";
	email?: "";
	first_name?: "";
	last_name?: "";
	is_admin?: false;
}
