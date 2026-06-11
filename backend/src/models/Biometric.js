const biometricSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,          // 1 biometric doc per user
  },
  biometricEnabled: {
    type: Boolean,
    default: false,
  },
  devicePublicKey: {
    type: String,          // for WebAuthn / FIDO style keys, optional
  },
}, { timestamps: true });

const Biometric = mongoose.model("Biometric", biometricSchema);