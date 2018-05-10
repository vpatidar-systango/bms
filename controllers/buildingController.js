var BuildingModel = require('../models/buildingModel')

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.BuildingDetail = async function (req, res) {
    if (req.method == 'GET') {
        let building = await BuildingModel.findOne({ owner_id: req._passport.session.user })
        if (building) {
            res.render('building-details', { building: building })
        } else {
            res.render('building-details')
        }

    }
    if (req.method == 'POST') {
        try {
            let buildingName = req.body.bname
            let buildingAddress = req.body.baddress
            let NoOfFloors = req.body.bfloornumber

            let newBuilding = new BuildingModel({
                name: buildingName,
                address: buildingAddress,
                no_of_floors: NoOfFloors,
                owner_id: req._passport.session.user
            })
            var building = await newBuilding.save()
            if (building) {
                req.flash('success_msg', 'Buidling Details has been added successfully!')
                res.redirect('/')
            }
        } catch (err) {
            res.send(err.message);
        }
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.editBuilding = async function (req, res) {
    try {
        let buildingName = req.body.bname
        let buildingAddress = req.body.baddress
        let NoOfFloors = req.body.bfloornumber
        let buildingId = req.params.id

        let newBuilding = {
            name: buildingName,
            address: buildingAddress,
            no_of_floors: NoOfFloors,
        }
        var building = await BuildingModel.findByIdAndUpdate(buildingId, newBuilding);
        if (building) {
            req.flash('success_msg', 'Buidling Details has been updated successfully!')
            res.redirect('/')
        }
    } catch (err) {
        res.send(err.message);
    }
}
