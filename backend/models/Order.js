const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      id: { type: String },
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, default: "+91 98765 01234" },
      address: { type: String, default: "123, Green Meadows" },
      city: { type: String, default: "Coimbatore" },
      pincode: { type: String, default: "641001" },
    },
    items: [
      {
        id: String,
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unit: { type: String, default: "kg" },
        image: { type: String },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "UPI / Online Payment"],
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending (COD)", "Paid Successfully"],
      default: "Pending (COD)",
    },
    status: {
      type: String,
      enum: [
        "Placed",
        "Accepted",
        "Packed",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    deliveryTimeSlot: {
      type: String,
      default: "04:00 PM - 07:00 PM",
    },
    deliveryDuration: {
      type: String,
      default: "Within 24 - 48 Hours",
    },
    farmerContact: {
      type: String,
      default: "+91 98765 43210 (Green Farm Direct)",
    },
    farmerName: {
      type: String,
      default: "Ramesh Organic Farm",
    },
    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
