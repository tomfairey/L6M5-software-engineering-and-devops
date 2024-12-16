import {UserKey, type FullUser, type SecurityUser} from '@/types/user';
import database from '@modules/database';
import argon2 from 'argon2';
import {type PoolClient} from 'pg';
import crypto, {hash} from 'crypto';

const GLOBAL_PEPPERCORN = Buffer.from(process?.env?.SECRET_B64 || '', 'base64');

if (!GLOBAL_PEPPERCORN || !GLOBAL_PEPPERCORN.length)
	throw new Error(
		'Could not initialise secret, please ensure $SECRET_B64 is set...',
	);

if (GLOBAL_PEPPERCORN.length < 32)
	throw new Error(
		'Could not initialise secret, $SECRET_B64 must be at least 32 bytes...',
	);

export const performLogin = async (
	email: string,
	password: string,
): Promise<SecurityUser> => {
	try {
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
		'SELECT $1, $2, $3, $4, $5, $6 FROM users WHERE email = $7',
		[
			UserKey.UUID,
			UserKey.EMAIL,
			UserKey.FIRST_NAME,
			UserKey.LAST_NAME,
			UserKey.PASSWORD_HASH,
			UserKey.SECRET_B64,
			email,
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
		};
	}

	throw new Error('User not found');
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
		'SELECT $1, $2, $3 FROM users WHERE email = $4',
		[UserKey.EMAIL, UserKey.PASSWORD_HASH, UserKey.SECRET_B64, email],
	);

	if (managedClient) {
		client.release();
	}

	if (rows.length === 1) {
		return {
			[UserKey.UUID]: rows[0][UserKey.UUID],
			[UserKey.PASSWORD_HASH]: rows[0]?.[UserKey.PASSWORD_HASH],
			[UserKey.SECRET_B64]: rows[0]?.[UserKey.SECRET_B64],
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
