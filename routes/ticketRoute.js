const router = require('express').Router()
var ticketController = require('../controllers/ticketController')

router.get('/tickets')
router.post('/tickets')

router.get('/tickets/:ticketId')
router.put('/tickets/:ticketId')
router.delete('/tickets/:ticketId')