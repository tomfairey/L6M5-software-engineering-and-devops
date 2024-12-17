import {Router} from 'express';

import {
	enforceLoginMiddleware,
	getUser,
	performLogin,
	performRegistration,
	filterUserTypes,
	enforceAdminMiddleware,
	enforceSelfOrAdminMiddleware,
	performGetUsers,
	performEdit,
	performDelete,
} from '@modules/authentication';

const router: Router = Router();

router.get('/self', enforceLoginMiddleware, async (req, res) => {
	try {
		const user = await getUser({uuid: req.user?.uuid});

		res.send({
			...filterUserTypes(user),
		});
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

router.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body;

		if (email && password) {
			const {uuid} = await performLogin(
				email.toString(),
				password.toString(),
			);

			if (uuid) {
				const user = await getUser({uuid});
				res.send({
					...filterUserTypes(user),
				});
			}
		} else {
			throw new Error('Must provide both email and password');
		}
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

router.get('/user', enforceAdminMiddleware, async (req, res) => {
	try {
		const users = await performGetUsers();

		if (users) {
			res.send(users.map(user => filterUserTypes(user)));
		}
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

router.put('/user', enforceAdminMiddleware, async (req, res) => {
	try {
		const {email, password, first_name, last_name, is_admin} = req.body;

		if (email && password) {
			const user = await performRegistration(
				email.toString(),
				password.toString(),
				first_name?.toString(),
				last_name?.toString(),
				is_admin,
			);

			if (user) {
				res.send({
					...filterUserTypes(user),
				});
			}
		} else {
			throw new Error('Must provide both email and password');
		}
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

router.get('/user/:uuid', enforceSelfOrAdminMiddleware, async (req, res) => {
	try {
		const {uuid} = req.params;

		if (uuid) {
			const user = await getUser({uuid});

			if (user) {
				res.send({
					...filterUserTypes(user),
				});
			}
		} else {
			throw new Error('Must provide user UUID');
		}
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

router.patch('/user/:uuid', enforceAdminMiddleware, async (req, res) => {
	try {
		const {uuid} = req.params;
		const {email, password, first_name, last_name, is_admin} = req.body;

		if (
			uuid &&
			(email ||
				password ||
				first_name ||
				last_name ||
				is_admin !== undefined)
		) {
			const user = await performEdit(
				uuid,
				email && email.toString(),
				password && password.toString(),
				first_name && first_name?.toString(),
				last_name && last_name?.toString(),
				is_admin,
			);

			if (user) {
				res.send({
					...filterUserTypes(user),
				});
			}
		} else {
			throw new Error('Must provide a modification');
		}
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

router.delete('/user/:uuid', enforceAdminMiddleware, async (req, res) => {
	try {
		const {uuid} = req.params;

		if (uuid) {
			await performDelete(uuid);

			res.status(204).send();
		} else {
			throw new Error('User must be provided');
		}
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

export default router;
