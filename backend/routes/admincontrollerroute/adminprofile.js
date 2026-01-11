// In your admin routes file
const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../../middleware/auth');
const {
  getPendingJobs,
  getApprovedJobs,
  sendJobToStudents,
  getAllStudents,
  revokeJobFromStudents,
} = require('../../controllers/admincontroller/adminjob');
const { getAdminProfile } = require('../../controllers/admincontroller/adminprofile');

router.get('/profile', requireAuth, requireRole('admin'), getAdminProfile);
router.get('/jobs/pending', requireAuth, requireRole('admin'), getPendingJobs);
router.get('/jobs/approved', requireAuth, requireRole('admin'), getApprovedJobs);
router.post('/jobs/send', requireAuth, requireRole('admin'), sendJobToStudents);
router.get('/students', requireAuth, requireRole('admin'), getAllStudents);
router.put('/jobs/:jobId/revoke', requireAuth, requireRole('admin'), revokeJobFromStudents);

module.exports = router;