import {Router} from 'express';

import authentication from './authentication';
import scanlog from './scanlog';

const router: Router = Router();

router.use('/authentication', authentication);
router.use('/scanlog', scanlog);

export default router;
