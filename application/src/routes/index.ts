import {Router} from 'express';

import database from '@/modules/database';
import v1 from '@routes/v1';

const router: Router = Router();

router.get('/health', async (req, res) => {
	try {
		(await database.connect()).release();
		res.send('OK');
	} catch (e) {
		console.error(e);
		res.status(500).send('Not healthy');
	}
});

router.use('/v1', v1);

export default router;
