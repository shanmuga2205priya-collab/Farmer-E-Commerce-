const express = require("express");
const router = express.Router();

let Order, Notification;
try {
  Order = require("../models/Order");
} catch (e) {
  try {
    Order = require("../Order");
  } catch (err) {
    console.error("Could not load Order model:", err);
  }
}

try {
  Notification = require("../models/Notification");
} catch (e) {
  try {
    Notification = require("../Notification");
  } catch (err) {
    console.error("Could not load Notification model:", err);
  }
}

// Helper to calculate delivery date (e.g. 2 days from now)
function getEstimatedDeliveryInfo() {
  const targetDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  const deliveryDate = targetDate.toLocaleDateString("en-IN", options);
  return {
    deliveryDate,
    deliveryTimeSlot: "04:00 PM - 07:00 PM",
    deliveryDuration: "Within 24 - 48 Hours",
    farmerContact: "+91 98765 43210 (Green Farm Fresh Hub)",
    farmerName: "Ramesh Organic Farm",
  };
}

// 1. PLACE ORDER (Customer)
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      items,
      totalAmount,
      paymentMethod,
    } = req.body;

    const timestampNum = Date.now().toString().slice(-6);
    const orderId = `ORD-${timestampNum}`;
    const trackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const deliveryInfo = getEstimatedDeliveryInfo();

    const isCod =
      !paymentMethod ||
      paymentMethod.toLowerCase().includes("cash") ||
      paymentMethod.toLowerCase().includes("cod");

    const normalizedPaymentMethod = isCod
      ? "Cash on Delivery"
      : "UPI / Online Payment";

    const paymentStatus = isCod ? "Pending (COD)" : "Paid Successfully";

    const order = await Order.create({
      orderId,
      trackingId,
      customer: customer || {
        name: "Valued Customer",
        phone: "+91 98765 01234",
        address: "123, Green Meadows",
        city: "Coimbatore",
        pincode: "641001",
      },
      items: items || [],
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus,
      status: "Placed",
      deliveryDate: deliveryInfo.deliveryDate,
      deliveryTimeSlot: deliveryInfo.deliveryTimeSlot,
      deliveryDuration: deliveryInfo.deliveryDuration,
      farmerContact: deliveryInfo.farmerContact,
      farmerName: deliveryInfo.farmerName,
    });

    // Create Notification for FARMER
    await Notification.create({
      recipientRole: "farmer",
      recipientEmail: "",
      orderId: order.orderId,
      trackingId: order.trackingId,
      title: "🔔 New Customer Order Received!",
      message: `New order #${order.orderId} placed by ${order.customer?.name || "Customer"} for ₹${order.totalAmount}. Payment: ${order.paymentMethod}. Please review and accept.`,
      type: "order_placed",
      details: {
        deliveryDate: order.deliveryDate,
        deliveryTimeSlot: order.deliveryTimeSlot,
        deliveryDuration: order.deliveryDuration,
        farmerContact: order.farmerContact,
        farmerName: order.farmerName,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
      },
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// 2. GET ALL ORDERS (Supports customer filter or farmer view)
router.get("/", async (req, res) => {
  try {
    const { role, email } = req.query;
    let query = {};
    if (role === "customer" && email) {
      query["customer.email"] = email;
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// 3. FARMER ACCEPTS ORDER / UPDATES STATUS
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // "Accepted", "Packed", "Out for Delivery", "Delivered"
    const orderIdentifier = req.params.id;

    // Search by orderId or MongoDB _id
    const order = await Order.findOne({
      $or: [
        { orderId: orderIdentifier },
        ...(orderIdentifier.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: orderIdentifier }] : []),
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status || "Accepted";
    if (order.status === "Accepted") {
      order.acceptedAt = new Date();
    }
    await order.save();

    // Create Notification for the CUSTOMER
    let notifTitle = "";
    let notifMsg = "";
    let notifType = "order_accepted";

    if (order.status === "Accepted") {
      notifTitle = "🎉 Order Accepted by Farmer!";
      notifMsg = `Your order #${order.orderId} has been accepted by farmer ${order.farmerName}! Tracking ID: ${order.trackingId}. Expected delivery: ${order.deliveryDate} (${order.deliveryTimeSlot}, ${order.deliveryDuration}). Contact: ${order.farmerContact}. Payment mode: ${order.paymentMethod}.`;
      notifType = "order_accepted";
    } else if (order.status === "Packed") {
      notifTitle = "📦 Order Packed!";
      notifMsg = `Your order #${order.orderId} has been freshly packed and is ready for dispatch. Tracking ID: ${order.trackingId}.`;
      notifType = "order_packed";
    } else if (order.status === "Out for Delivery") {
      notifTitle = "🚚 Order Out for Delivery!";
      notifMsg = `Your order #${order.orderId} is out for delivery! Expected today by ${order.deliveryTimeSlot}. Delivery contact: ${order.farmerContact}.`;
      notifType = "order_shipped";
    } else if (order.status === "Delivered") {
      notifTitle = "🏁 Order Delivered!";
      notifMsg = `Your order #${order.orderId} has been successfully delivered. Thank you for supporting our local farmers!`;
      notifType = "order_delivered";
    }

    if (notifTitle) {
      await Notification.create({
        recipientRole: "customer",
        recipientEmail: order.customer?.email || "",
        orderId: order.orderId,
        trackingId: order.trackingId,
        title: notifTitle,
        message: notifMsg,
        type: notifType,
        details: {
          deliveryDate: order.deliveryDate,
          deliveryTimeSlot: order.deliveryTimeSlot,
          deliveryDuration: order.deliveryDuration,
          farmerContact: order.farmerContact,
          farmerName: order.farmerName,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
        },
      });
    }

    res.json({
      message: `Order status updated to ${order.status}`,
      order,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
});

// 4. GET NOTIFICATIONS (for farmer or customer)
router.get("/notifications", async (req, res) => {
  try {
    const { role, email } = req.query;
    let query = {};
    if (role === "farmer") {
      query = { recipientRole: "farmer" };
    } else if (role === "customer") {
      query = {
        recipientRole: "customer",
        ...(email ? { $or: [{ recipientEmail: email }, { recipientEmail: "" }] } : {}),
      };
    }
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(40);
    res.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
});

// 5. MARK SINGLE NOTIFICATION AS READ
router.patch("/notifications/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark read", error: error.message });
  }
});

// 6. MARK ALL AS READ
router.patch("/notifications/mark-all/read", async (req, res) => {
  try {
    const { role } = req.body;
    const query = role ? { recipientRole: role } : {};
    await Notification.updateMany(query, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark all as read", error: error.message });
  }
});

module.exports = router;
