const express = require('express')
const router = express.Router()
var buildingController = require('../controllers/buildingController')
var middleware = require('../middlewares/index')

router.get('/building-details', middleware.ensureAuthenticated, buildingController.BuildingDetail)
router.post('/building-details',middleware.ensureAuthenticated, buildingController.BuildingDetail)

router.post('/building-details/:id', middleware.ensureAuthenticated, buildingController.editBuilding )



module.exports = router;