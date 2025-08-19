const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
