import {expect, describe, test} from 'vitest';

import {userPasswordHash, userPasswordVerify} from './authentication';
import {UserKey} from '@/types/user';

import crypto from 'crypto';

describe('Test password hashing and verification', async () => {
	// Generate a password for testing
	const password = ['Password', 'vitest', Date.now()].join('-');

	test('Can hash a fresh password', async () => {
		const user = await userPasswordHash(password);
		expect(user).toBeDefined();
		expect(user).toHaveProperty(UserKey.PASSWORD_HASH);
		expect(user).toHaveProperty(UserKey.SECRET_B64);
	});

	test('Can verify a hashed password', async () => {
		const user = await userPasswordHash(password);
		expect(user).toBeDefined();
		expect(user).toHaveProperty(UserKey.PASSWORD_HASH);
		expect(user).toHaveProperty(UserKey.SECRET_B64);

		const verify = await userPasswordVerify(user, password);
		expect(verify).toBeTruthy();
	});

	test("Can't verify an incorrect password", async () => {
		const user = await userPasswordHash(password);
		expect(user).toBeDefined();
		expect(user).toHaveProperty(UserKey.PASSWORD_HASH);
		expect(user).toHaveProperty(UserKey.SECRET_B64);

		const verify = await userPasswordVerify(user, "I'm not the password");
		expect(verify).toBeFalsy();
	});

	test("Can't hash a blank password", async () => {
		expect(userPasswordHash('')).rejects.toThrowError();
	});

	test("Can't verify a user's password with no/blank unique pepper", async () => {
		const {[UserKey?.PASSWORD_HASH]: hash} =
			await userPasswordHash(password);

		expect(
			userPasswordVerify({[UserKey?.PASSWORD_HASH]: hash}, password),
		).resolves.toBeFalsy();
	});

	test("Can't verify a user's password with incorrect pepper", async () => {
		const {[UserKey?.PASSWORD_HASH]: hash} =
			await userPasswordHash(password);

		expect(
			userPasswordVerify(
				{
					[UserKey?.PASSWORD_HASH]: hash,
					[UserKey?.SECRET_B64]: crypto
						.randomBytes(32)
						.toString('base64'),
				},
				password,
			),
		).resolves.toBeFalsy();
	});

	test("Can't hash a password less than length of 8", async () => {
		expect(userPasswordHash('P@ss1')).rejects.toThrowError();
	});

	test("Can't hash a password with no uppercase letter", async () => {
		expect(userPasswordHash('p@ssword1')).rejects.toThrowError();
	});

	test("Can't hash a password with no lowercase letter", async () => {
		expect(userPasswordHash('P@SSWORD1')).rejects.toThrowError();
	});

	test("Can't hash a password with no number", async () => {
		expect(userPasswordHash('P@ssword')).rejects.toThrowError();
	});

	test("Can't hash a password with no special character", async () => {
		expect(userPasswordHash('Password1')).rejects.toThrowError();
	});
});
