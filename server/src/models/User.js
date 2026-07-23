import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from 'validator';
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
   password: {
  type: String,
  select: false,
  validate: {
    validator: function (value) {
      // Only validate if a password is being set (OAuth users won't have one)
      if (!value) return true;
      return validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0, 
      });
    },
    message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number',
  },
},
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: "" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isProtected: { type: Boolean, default: false },

  },
  { timestamps: true },
);



// Hash password before save (only for local auth)
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
