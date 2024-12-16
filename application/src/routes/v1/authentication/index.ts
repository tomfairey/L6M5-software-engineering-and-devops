import {Router} from 'express';

import login from './login';

const router: Router = Router();

router.use('/login', login);
// router.use('/logout');
// router.use('/grant');
// router.use('/revoke');

export default router;
