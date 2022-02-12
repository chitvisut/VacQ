const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true, //trim whitespace in the front or back of input 
        maxlength: [50, "Name can not be more than 50 characters"]
    },
    address: {
        type: String,
        required: [true, "please add an address"]
    },
    district: {
        type: String,
        required: [true, "Please add a district"]
    },
    province: {
        type: String,
        required: [true, "Please add a province"]
    },
    postalcode: {
        type: String,
        required: [true, "Please add a postalcode"],
        maxlength: [5, "postalcode can not be more than 5 digits"]
    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, "Please add a region"]
    }
});

module.exports=mongoose.model("Hospital", hospitalSchema);