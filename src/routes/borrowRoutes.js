const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/overdue', authMiddleware, borrowController.getOverdueBorrows);
router.post('/:bookId', authMiddleware, borrowController.borrowBook);
router.put('/return/:borrowId', authMiddleware, borrowController.returnBook);

module.exports = router; 