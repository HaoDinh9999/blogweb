const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: "String",
      required: [true, "Email must have"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide valid email"],
    },
    password: {
      type: "String",
      required: [true, "Provide password"],
      minlength: 8,
      //select: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
// UserSchema.pre("save", async function (next) {
//   //phai la function
//   //only runif pswas actually modifields
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 8);
//   //delete password confirm field
//   this.passwordConfirm = undefined;
//   next();
// });
module.exports = mongoose.model("User", UserSchema);
