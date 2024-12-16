import {performLogin} from '@/modules/authentication';
import {UserKey, type User} from '@/types/user';
import {Router} from 'express';

const router: Router = Router();

const allowedUserKeys = [UserKey.EMAIL, UserKey.FIRST_NAME, UserKey.LAST_NAME];

const filterUserTypes = (user: User): {[key: string]: any} => {
	Object.keys(user)
		.filter(key => !allowedUserKeys.includes(key as UserKey))
		.forEach((key: string) => {
			delete (user as any)[key];
		});

	return user;
};

router.get('/', async (req, res) => {
	try {
		const {email, password} = req.query;

		if (email && password) {
			const user = await performLogin(
				email.toString(),
				password.toString(),
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

export default router;
