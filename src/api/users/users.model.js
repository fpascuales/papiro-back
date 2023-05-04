const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true, trim: true},
        email: {type: String, required: true, unique: true, trim: true},
        image: {type: String},
        password: {type: String, required: true, trim: true},
        rol: {type: String, default: "user", enum: ["admin", "user"], required: true}        
    },
    {
        timestamps: true,
        collection: 'users'
    }
)
userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})

const User = mongoose.model('users', userSchema);
module.exports = User;