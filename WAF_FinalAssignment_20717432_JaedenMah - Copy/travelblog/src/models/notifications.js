const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // ✅ Reference to recipient user
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true }, // ✅ Reference to the related post
    seen: { type: Boolean, default: false }, // ✅ Track whether the notification has been seen
    createdAt: { type: Date, default: Date.now } // ✅ Timestamp when notification was created
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
