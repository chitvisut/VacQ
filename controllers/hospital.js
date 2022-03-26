const Hospital = require("../models/Hospital");
const vacCenter = require("../models/VacCenter")

//@desc     GET vaccine centers
//@route    GET /api/v1/hospitals/vacCenters/
//@access   Public
exports.getVacCenters = (req, res, next) => {
    vacCenter.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.mesage || "Some error occured while retrieving Vaccine Centers"
            })
        } else {
            res.send(data)
        }
    })
}



//@desc Get all hospotals
//@route GET /api/v1/hospitals
//@access Public
exports.getHospitals = async (req,res, next) => {
    let query;

    console.log(req.query);
    const reqQuery = {...req.query} //for not inplace
    console.log(reqQuery)
    const removeField = ["select","sort","page","limit"]
    removeField.forEach(param=>delete reqQuery[param])
    console.log(reqQuery)

    //let queryStr = JSON.stringify(req.query);
    let queryStr = JSON.stringify(reqQuery);
    console.log(queryStr);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //console.log(queryStr);
    //console.log(JSON.parse(queryStr))
    query = Hospital.find(JSON.parse(queryStr)).populate("appointments");

    if (req.query.select) {
        console.log(req.query.select)
        const fields = req.query.select.split(",").join(" ")
        query = query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.select.split(",").join(" ")
        query = query.sort(sortBy)
    } else {
        query = query.sort("-createdAt")
    }

    const page = parseInt(req.query.page,10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page-1)*limit
    const endIndex = page*limit
    query = query.skip(startIndex).limit(limit)

    try {
        const total = await Hospital.countDocuments()
        //const hospitals = await Hospital.find(req.query);
        const hospitals = await query;
        const pagination = {};
        if (endIndex<total) {
            pagination.next = {
                page: page+1,
                limit 
            }
        }
        if (startIndex>0) {
            pagination.previous = {
                page:page-1,
                limit
            }
        }

        res.status(200).json({success: true, count: hospitals.length, pagination, data: hospitals});
    } catch(err) {
        res.status(400).json({success: false});
    }
};

//@desc Get a single hospital
//@route GET /api/v1/hospitals/:id
//@access Public
exports.getHospital = async (req,res, next) => {
    //console.log(req.params.id);
    try {
        const hospital = await Hospital.findById(req.params.id);
        //console.log(hospital)
        if (!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: hospital});
    } catch(err) {
        res.status(400).json({success: false});
    }
};

//@desc Create new hospitals
//@route POST /api/v1/hospitals
//@access Private
exports.createHospital = async (req,res,next) => {
    //console.log(req.body);
    try {
    const hospital = await Hospital.create(req.body);
    res.status(200).json({success: true, data: hospital});
    } catch(err) {
        console.log(err);
    }
};

//@desc Update hospital
//@route PUT /api/v1/hospitals/:id
//@access Private
exports.updateHospital = async (req,res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: hospital});
    } catch (err) {
        res.status(400).json({success: false});
    }
};

//@desc Delete hospital
//@route DELETE /api/v1/hospitals/:id
//@access Private
exports.deleteHospital = async (req,res, next) => {
    try {
        //const hospital = await Hospital.findByIdAndDelete(req.params.id);
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(400).json({success: false, message: `Boothcamp not found with id of ${req.params.id}`});
        }

        hospital.remove();
        res.status(200).json({success: true, data: hospital});
    } catch(err) {
        res.status(400).json({success: false});
    }
};
