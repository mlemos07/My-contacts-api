const { Router } = require('express');
const contactController = require('./app/controllers/ContactController');
const categoryController = require('./app/controllers/CategoryController');

const router = Router();

router.get('/contacts', contactController.index);
router.get('/contacts/:id', contactController.show);
router.delete('/contacts/:id', contactController.delete);
router.post('/contacts', contactController.store);
router.put('/contacts/:id', contactController.update);

router.get('/categories', categoryController.index);
router.post('/categories', categoryController.store);
router.get('/categories/:id', categoryController.show);

module.exports = router;
