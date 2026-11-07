const express = require('express');
const router = express.Router();
const { getMenu, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, managerOnly } = require('../middleware/auth');

router.get('/', getMenu);
router.get('/:id', getMenuItem);
router.post('/', protect, managerOnly, createMenuItem);
router.put('/:id', protect, managerOnly, updateMenuItem);
router.delete('/:id', protect, managerOnly, deleteMenuItem);

module.exports = router;