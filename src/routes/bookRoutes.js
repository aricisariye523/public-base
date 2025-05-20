const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/isAdminMiddleware');

router.get('/', bookController.getAllBooks);
router.post('/', authMiddleware, isAdminMiddleware, bookController.createBook);
router.put('/:id', authMiddleware, isAdminMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, isAdminMiddleware, bookController.deleteBook);

module.exports = router; 