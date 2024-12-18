import {enforceLoginMiddleware} from '@/modules/authentication';
import {filterScanlogTypes} from '@/modules/scanlog';
import {Router} from 'express';

import {getAllScanlogs, performAddScanlog} from '@modules/scanlog';
import {ScanlogKey} from '@/types/scanlog';

const router: Router = Router();

router.get('/', enforceLoginMiddleware, async (req, res) => {
	try {
		const {allUsers, limit, offset} = req.query;

		// Check if the user is an admin and if they want to see all users
		const dontFilterUsers = req.user?.is_admin && allUsers;

		const scanlogs = await getAllScanlogs(
			!dontFilterUsers ? req.user?.uuid : undefined,
			limit ? parseInt(limit.toString()) : undefined,
			offset ? parseInt(offset.toString()) : undefined,
		);

		res.send([
			...scanlogs.map(x =>
				filterScanlogTypes(
					x,
					dontFilterUsers ? [ScanlogKey.USER_UUID] : [],
				),
			),
		]);
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

router.post('/', enforceLoginMiddleware, async (req, res) => {
	try {
		const {scan_value, valid, scan_time, message, format} = req.body;

		const user_uuid = req.user?.uuid;

		if (!user_uuid) {
			throw new Error('Must be logged in to create a scanlog');
		}

		if (scan_time && scan_value != undefined && valid != undefined) {
			const scanlog = await performAddScanlog(
				scan_value?.toString(),
				!!valid,
				new Date(scan_time),
				message?.toString(),
				format?.toString(),
				user_uuid?.toString(),
			);

			res.send(filterScanlogTypes(scanlog));
		} else {
			throw new Error('Must provide all fields');
		}
	} catch (e: Error | any) {
		res.status(406).send({
			status: res.statusCode,
			message: e.message,
		});
	}
});

export default router;
