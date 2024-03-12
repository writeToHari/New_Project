import { Router } from 'express';
const router = Router();

import * as controllers from "../../controllers/index.js"

// Create API to upload the attached XLSX/CSV data into MongoDB. (Please accomplish this using worker threads)
router.post('/upload', controllers.readData);

// Search API to find policy info with the help of the username.
// API to provide aggregated policy by each user.
router.get('/policy_info', controllers.getPolicyInfo);

// Create a post-service that takes the message, day, and time in body parameters and it inserts that message into DB at that particular day and time.
router.post('/message', controllers.setFileData)

export default router;