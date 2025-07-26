const mongoose = require ("mongoose");


const userSchema = new mongoose.Schema({

    name: {
        type: String, 
        required: true, 
        trim:true, 
        minlength:2,
        maxlength:50},

    email: {
        type:String, 
        required:true,
        unique:true, 
        trim:true,
        lowercase:true,
        validate: {
            validator: function(valor){
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor);
            }
        }

    },

    password: {type:String, required: true},

    image: {type:String},

    role: {
        type: String,
        enum:["client","employee","admin"],
        default:"client"
    },

    createAt: {
        type:Date,
        default:Date.now
    },
})

module.exports=mongoose.model("User",userSchema)