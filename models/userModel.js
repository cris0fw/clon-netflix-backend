import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash de contraseña
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    console.log("Algo fallo" + err);
    next();
  }
});

// Comparo las contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
