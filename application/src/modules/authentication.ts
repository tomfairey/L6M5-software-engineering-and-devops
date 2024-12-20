import {
	UserKey,
	type FullUser,
	type SecurityUser,
	type User,
} from '@/types/user';
import database from '@modules/database';
import argon2 from 'argon2';
import {type PoolClient} from 'pg';
import crypto from 'crypto';
import {NextFunction, Request, Response} from 'express';

declare global {
	namespace Express {
		export interface Request {
			user?: SecurityUser;
		}
	}
}

const GLOBAL_PEPPERCORN = Buffer.from(process?.env?.SECRET_B64 || '', 'base64');

if (!GLOBAL_PEPPERCORN || !GLOBAL_PEPPERCORN.length)
	throw new Error(
		'Could not initialise secret, please ensure $SECRET_B64 is set...',
	);

if (GLOBAL_PEPPERCORN.length < 32)
	throw new Error(
		'Could not initialise secret, $SECRET_B64 must be at least 32 bytes...',
	);

const allowedUserKeys = [
	UserKey.UUID,
	UserKey.EMAIL,
	UserKey.FIRST_NAME,
	UserKey.LAST_NAME,
	UserKey.IS_ADMIN,
];

export const filterUserTypes = (user: User): {[key: string]: any} => {
	Object.keys(user)
		.filter(key => !allowedUserKeys.includes(key as UserKey))
		.forEach((key: string) => {
			delete (user as any)[key];
		});

	return user;
};

export const validateEmail = (email: string): boolean =>
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
		email,
	);

export const basicAuthMiddleware = async (
	req: {user?: SecurityUser} & Request,
	res: Response,
	next: NextFunction,
) => {
	const auth = req.headers.authorization;

	if (!auth || !auth.startsWith('Basic ')) {
		req.user = undefined;
		next();
		return;
	}

	const base64Credentials = auth.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString(
		'utf-8',
	);
	const [email, password] = credentials.split(':');

	try {
		const user = await performLogin(email, password);

		if (user) {
			req.user = user;
			next();
		}
	} catch (e) {
		res.status(401).send('Unauthenticated');
	}
};

export const enforceLoginMiddleware = async (
	req: {user?: SecurityUser} & Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		res.status(401).send('Unauthenticated');
		return;
	}

	next();
};

export const enforceAdminMiddleware = async (
	req: {user?: SecurityUser} & Request,
	res: Response,
	next: NextFunction,
) => {
	if (req.user && req.user?.[UserKey.IS_ADMIN]) {
		next();
		return;
	}

	res.status(403).send('Unauthorised');
};

export const enforceSelfOrAdminMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (req?.user?.[UserKey.IS_ADMIN]) {
		next();
		return;
	}

	if (req?.user?.[UserKey.UUID] == req.params.uuid) {
		next();
		return;
	}

	res.status(403).send('Unauthorised');
};

export const performLogin = async (
	email: string,
	password: string,
): Promise<SecurityUser> => {
	try {
		if (!validateEmail(email)) throw new Error('Invalid email');

		const user = await getSecurityUserByEmail(email);

		if (user) {
			if (await userPasswordVerify(user, password)) {
				return user;
			}
		}
	} catch (e) {
		console.error(e);
	}

	throw new Error('Invalid email or password');
};

export const performGetUsers = async (): Promise<FullUser[]> => {
	try {
		return await getAllUsers();
	} catch (e) {
		console.error(e);
	}

	throw new Error('Unexpected error!');
};

export const performRegistration = async (
	email: string,
	password: string,
	first_name?: string,
	last_name?: string,
	is_admin?: boolean,
): Promise<SecurityUser> => {
	try {
		if (!validateEmail(email)) throw new Error('Invalid email');

		const user = await getDoesUserExistByEmail(email);

		if (user) {
			throw new Error('User already exists');
		}

		return createUser({
			email,
			password,
			first_name,
			last_name,
			is_admin,
		});
	} catch (e) {
		console.error(e);
	}

	throw new Error('Unexpected error');
};

export const performEdit = async (
	uuid: string,
	email?: string,
	password?: string,
	first_name?: string,
	last_name?: string,
	is_admin?: boolean,
): Promise<SecurityUser> => {
	try {
		const user = await getUserByUuid(uuid);

		if (!user) {
			throw new Error("User doesn't exist");
		}

		return editUser({
			uuid,
			email,
			password,
			first_name,
			last_name,
			is_admin,
		});
	} catch (e) {
		console.error(e);
	}

	throw new Error('Invalid edit');
};

export const performDelete = async (uuid: string): Promise<void> => {
	try {
		return deleteUser(uuid);
	} catch (e) {
		console.error(e);
	}

	throw new Error('Unexpected error');
};

const getAllUsers = async (client?: PoolClient): Promise<FullUser[]> => {
	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`SELECT ${UserKey.UUID}, ${UserKey.EMAIL}, ${UserKey.FIRST_NAME}, ${UserKey.LAST_NAME}, ${UserKey.PASSWORD_HASH}, ${UserKey.SECRET_B64}, ${UserKey.IS_ADMIN} FROM users`,
	);

	if (managedClient) {
		client.release();
	}

	return rows.map(row => ({
		[UserKey.UUID]: row[UserKey.UUID],
		[UserKey.EMAIL]: row[UserKey.EMAIL],
		[UserKey.FIRST_NAME]: row?.[UserKey.FIRST_NAME],
		[UserKey.LAST_NAME]: row?.[UserKey.LAST_NAME],
		[UserKey.PASSWORD_HASH]: row?.[UserKey.PASSWORD_HASH],
		[UserKey.SECRET_B64]: row?.[UserKey.SECRET_B64],
		[UserKey.IS_ADMIN]: row?.[UserKey.IS_ADMIN],
	}));
};

const deleteUser = async (uuid: string, client?: PoolClient): Promise<void> => {
	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`DELETE FROM users WHERE ${UserKey.UUID} = $1 RETURNING uuid`,
		[uuid],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return;
	}

	throw new Error('User not deleted');
};

const editUser = async (
	{
		uuid,
		email,
		password,
		first_name,
		last_name,
		is_admin,
	}: {
		uuid: string;
		email?: string;
		password?: string;
		first_name?: string;
		last_name?: string;
		is_admin?: boolean;
	},
	client?: PoolClient,
): Promise<FullUser> => {
	let managedClient = false;

	const changes: {[key in UserKey]?: any} = {};

	if (email) {
		changes[UserKey.EMAIL] = email;
	}

	if (first_name) {
		changes[UserKey.FIRST_NAME] = first_name;
	}

	if (last_name) {
		changes[UserKey.LAST_NAME] = last_name;
	}

	if (password) {
		const {
			[UserKey.PASSWORD_HASH]: passwordHash,
			[UserKey.SECRET_B64]: secretB64,
		} = await userPasswordHash(password);

		changes[UserKey.PASSWORD_HASH] = passwordHash;
		changes[UserKey.SECRET_B64] = secretB64;
	}

	if (is_admin !== undefined) {
		changes[UserKey.IS_ADMIN] = is_admin;
	}

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`UPDATE users
			SET ${Object.keys(changes)
				.map((x, i) => {
					return `${x} = $${i + 1}`;
				})
				.join(', ')}
		WHERE ${UserKey.UUID} = $${Object.keys(changes).length + 1} RETURNING *`,
		[...Object.values(changes), uuid],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return {
			[UserKey.UUID]: rows[0][UserKey.UUID],
			[UserKey.EMAIL]: rows[0][UserKey.EMAIL],
			[UserKey.FIRST_NAME]: rows[0]?.[UserKey.FIRST_NAME],
			[UserKey.LAST_NAME]: rows[0]?.[UserKey.LAST_NAME],
			[UserKey.PASSWORD_HASH]: rows[0]?.[UserKey.PASSWORD_HASH],
			[UserKey.SECRET_B64]: rows[0]?.[UserKey.SECRET_B64],
			[UserKey.IS_ADMIN]: rows[0]?.[UserKey.IS_ADMIN],
		};
	}

	throw new Error('User not edited');
};

const createUser = async (
	{
		email,
		password,
		first_name,
		last_name,
		is_admin,
	}: {
		email: string;
		password: string;
		first_name?: string;
		last_name?: string;
		is_admin?: boolean;
	},
	client?: PoolClient,
): Promise<FullUser> => {
	const {
		[UserKey.PASSWORD_HASH]: passwordHash,
		[UserKey.SECRET_B64]: secretB64,
	} = await userPasswordHash(password);

	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`INSERT INTO users (${UserKey.EMAIL}, ${UserKey.FIRST_NAME}, ${UserKey.LAST_NAME}, ${UserKey.PASSWORD_HASH}, ${UserKey.SECRET_B64}, ${UserKey.IS_ADMIN}) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
		[
			email.toLowerCase(),
			first_name || null,
			last_name || null,
			passwordHash,
			secretB64,
			is_admin || false,
		],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return {
			[UserKey.UUID]: rows[0][UserKey.UUID],
			[UserKey.EMAIL]: rows[0][UserKey.EMAIL],
			[UserKey.FIRST_NAME]: rows[0]?.[UserKey.FIRST_NAME],
			[UserKey.LAST_NAME]: rows[0]?.[UserKey.LAST_NAME],
			[UserKey.PASSWORD_HASH]: rows[0]?.[UserKey.PASSWORD_HASH],
			[UserKey.SECRET_B64]: rows[0]?.[UserKey.SECRET_B64],
			[UserKey.IS_ADMIN]: rows[0]?.[UserKey.IS_ADMIN],
		};
	}

	throw new Error('User not created');
};

export const getUser = async ({
	email,
	uuid,
}: {
	email?: string;
	uuid?: string;
}): Promise<FullUser> => {
	if (email) {
		return getUserByEmail(email);
	} else if (uuid) {
		return getUserByUuid(uuid);
	}

	throw new Error('User not found');
};

const getUserByEmail = async (
	email: string,
	client?: PoolClient,
): Promise<FullUser> => {
	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`SELECT ${UserKey.UUID}, ${UserKey.EMAIL}, ${UserKey.FIRST_NAME}, ${UserKey.LAST_NAME}, ${UserKey.PASSWORD_HASH}, ${UserKey.SECRET_B64}, ${UserKey.IS_ADMIN} FROM users WHERE email = $1`,
		[email.toLowerCase()],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return {
			[UserKey.UUID]: rows[0][UserKey.UUID],
			[UserKey.EMAIL]: rows[0][UserKey.EMAIL],
			[UserKey.FIRST_NAME]: rows[0]?.[UserKey.FIRST_NAME],
			[UserKey.LAST_NAME]: rows[0]?.[UserKey.LAST_NAME],
			[UserKey.PASSWORD_HASH]: rows[0]?.[UserKey.PASSWORD_HASH],
			[UserKey.SECRET_B64]: rows[0]?.[UserKey.SECRET_B64],
			[UserKey.IS_ADMIN]: rows[0]?.[UserKey.IS_ADMIN],
		};
	}

	throw new Error('User not found');
};

const getUserByUuid = async (
	uuid: string,
	client?: PoolClient,
): Promise<FullUser> => {
	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`SELECT ${UserKey.UUID}, ${UserKey.EMAIL}, ${UserKey.FIRST_NAME}, ${UserKey.LAST_NAME}, ${UserKey.PASSWORD_HASH}, ${UserKey.SECRET_B64}, ${UserKey.IS_ADMIN} FROM users WHERE uuid = $1`,
		[uuid.toLowerCase()],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return {
			[UserKey.UUID]: rows[0][UserKey.UUID],
			[UserKey.EMAIL]: rows[0][UserKey.EMAIL],
			[UserKey.FIRST_NAME]: rows[0]?.[UserKey.FIRST_NAME],
			[UserKey.LAST_NAME]: rows[0]?.[UserKey.LAST_NAME],
			[UserKey.PASSWORD_HASH]: rows[0]?.[UserKey.PASSWORD_HASH],
			[UserKey.SECRET_B64]: rows[0]?.[UserKey.SECRET_B64],
			[UserKey.IS_ADMIN]: rows[0]?.[UserKey.IS_ADMIN],
		};
	}

	throw new Error('User not found');
};

const getDoesUserExistByEmail = async (email: string) => {
	return getSecurityUserByEmail(email)
		.then(() => true)
		.catch(() => false);
};

const getSecurityUserByEmail = async (
	email: string,
	client?: PoolClient,
): Promise<SecurityUser> => {
	let managedClient = false;

	if (!client) {
		client = await database.connect();
		managedClient = true;
	}

	const {rows} = await client.query(
		`SELECT ${UserKey.UUID}, ${UserKey.PASSWORD_HASH}, ${UserKey.SECRET_B64}, ${UserKey.IS_ADMIN} FROM users WHERE email = $1`,
		[email.toLowerCase()],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return {
			[UserKey.UUID]: rows[0][UserKey.UUID],
			[UserKey.PASSWORD_HASH]: rows[0]?.[UserKey.PASSWORD_HASH],
			[UserKey.SECRET_B64]: rows[0]?.[UserKey.SECRET_B64],
			[UserKey.IS_ADMIN]: rows[0]?.[UserKey.IS_ADMIN],
		};
	}

	throw new Error('User not found');
};

export const userPasswordHash = async (
	password: string,
): Promise<{[UserKey.PASSWORD_HASH]: string; [UserKey.SECRET_B64]: string}> => {
	if (!validatePasswordStrength(password))
		throw new Error('Password does not meet the minimum requirements');

	const pepper = generatePepper(),
		combinedPepper = xorBuffer(GLOBAL_PEPPERCORN, pepper),
		hash = await hashPassword(password, combinedPepper);

	return {
		[UserKey.PASSWORD_HASH]: hash,
		[UserKey.SECRET_B64]: pepper.toString('base64'),
	};
};

export const userPasswordVerify = async (
	user:
		| {[UserKey.PASSWORD_HASH]: string; [UserKey.SECRET_B64]?: string}
		| SecurityUser,
	password: string,
): Promise<boolean> => {
	if (
		!password ||
		!user?.[UserKey.PASSWORD_HASH] ||
		!user?.[UserKey.SECRET_B64]
	)
		return false;

	const pepper = Buffer.from(user?.[UserKey.SECRET_B64], 'base64'),
		combinedPepper = xorBuffer(GLOBAL_PEPPERCORN, pepper);

	return verifyPassword(
		user?.[UserKey.PASSWORD_HASH],
		password,
		combinedPepper,
	);
};

const validatePasswordStrength = (password: string): boolean => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,}$/.test(password);
};

const generatePepper = (int: number = 32): Buffer => crypto.randomBytes(int);

const xorBuffer = (buffer1: Buffer, buffer2: Buffer): Buffer => {
	return Buffer.from(
		buffer1.map((b, i) => {
			return b ^ buffer2[i];
		}).buffer,
	);
};

const hashPassword = async (password: string, pepper?: Buffer) => {
	if (!password) throw new Error('Password is required');
	return argon2.hash(password, pepper ? {secret: pepper} : undefined);
};

const verifyPassword = async (
	hash: string,
	password: string,
	pepper?: Buffer,
) => {
	if (!hash || !password) return false;
	return argon2.verify(hash, password, pepper ? {secret: pepper} : undefined);
};
