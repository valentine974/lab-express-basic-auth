const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Your email is required'],
    unique:true, 
    lowercase: true, 
    trim: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: String
});

const User = model("User", userSchema);

module.exports = User;
