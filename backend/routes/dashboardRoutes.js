const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Validation rules
const validateCreateAssignment = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('due_date').notEmpty().withMessage('Due date is required').isISO8601().withMessage('Due date must be a valid date'),
    body('class_name').notEmpty().withMessage('Class name is required'),
    body('total_points').optional().isNumeric().withMessage('Total points must be a number')
];

// Middleware to handle validation results
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.get('/dashboard', dashboardController.getDashboard);
router.post('/create-assignment', validateCreateAssignment, handleValidationErrors, dashboardController.createAssignment);

module.exports = router;