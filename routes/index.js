import { Router } from 'express';
const router = Router();

import policy from './policy/policy.js';

router.use('/policy', policy);

export default router;