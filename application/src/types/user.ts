export enum UserKey {
	UUID = 'uuid',
	EMAIL = 'email',
	FIRST_NAME = 'first_name',
	LAST_NAME = 'last_name',
	PASSWORD_HASH = 'password_hash',
	SECRET_B64 = 'secret_b64',
}

export type User = BaseUser | SecurityUser | FullUser;

export interface BaseUser {
	[UserKey.UUID]: string;
}

export interface SecurityUser extends BaseUser {
	[UserKey.PASSWORD_HASH]: string;
	[UserKey.SECRET_B64]: string | null;
}

export interface FullUser extends SecurityUser {
	[UserKey.EMAIL]: string;
	[UserKey.FIRST_NAME]: string;
	[UserKey.LAST_NAME]: string;
}
