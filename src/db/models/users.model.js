import mongoose from "mongoose"

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isGithub: {
    type: Boolean,
    default: false,
  },
  isGoogle: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "PREMIUM", "CLIENT"],
    default: "CLIENT",
  },
  cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts"
    },
});

export const UsersModel = mongoose.model('Users', usersSchema)