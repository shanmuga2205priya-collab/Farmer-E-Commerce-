const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientRole: {
      type: String,
      enum: ["farmer", "customer", "all"],
      required: true,
    },
    recipientEmail: {
      type: String,
      default: "",
    },
    recipientId: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "order_placed",
        "order_accepted",
        "order_packed",
        "order_shipped",
        "order_delivered",
      ],
      default: "order_placed",
    },
    details: {
      deliveryDate: String,
      deliveryTimeSlot: String,
      deliveryDuration: String,
      farmerContact: String,
      farmerName: String,
      paymentMethod: String,
      paymentStatus: String,
      totalAmount: Number,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
