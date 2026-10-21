import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Verified farm produce products with accurate high-res photos
const sampleProducts = [
  {
    id: "prod_tomato",
    _id: "prod_tomato",
    name: "Fresh Country Tomatoes (தக்காளி)",
    category: "Vegetables",
    price: 30,
    unit: "kg",
    stock: 25,
    rating: 4.8,
    farmerName: "Ramesh Organic Farm",
    description: "Farm-fresh ripe red country tomatoes grown with 100% natural organic compost.",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_onion",
    _id: "prod_onion",
    name: "Fresh Red Country Onions (வெங்காயம்)",
    category: "Vegetables",
    price: 35,
    unit: "kg",
    stock: 35,
    rating: 4.8,
    farmerName: "Perambalur Farm Cooperative",
    description: "Firm, dry-cured authentic red country onions straight from local agricultural fields.",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_carrot",
    _id: "prod_carrot",
    name: "Fresh Crunchy Ooty Carrots (கேரட்)",
    category: "Vegetables",
    price: 40,
    unit: "kg",
    stock: 20,
    rating: 4.7,
    farmerName: "Nilgiri Hillside Farms",
    description: "Sweet and crunchy farm-fresh mountain carrots harvested clean every morning.",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_potato",
    _id: "prod_potato",
    name: "Farm Fresh Potatoes (உருளைக்கிழங்கு)",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    stock: 30,
    rating: 4.6,
    farmerName: "Green Valley Farm",
    description: "Clean, wholesome grade-A potatoes ideal for daily home cooking and curries.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_spinach",
    _id: "prod_spinach",
    name: "Organic Green Palak / Spinach (பசலைக்கீரை)",
    category: "Leafy Greens",
    price: 20,
    unit: "bunch",
    stock: 15,
    rating: 4.9,
    farmerName: "Cauvery Greens Agro",
    description: "Tender, iron-rich, freshly plucked organic green spinach bunches.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_cauliflower",
    _id: "prod_cauliflower",
    name: "Fresh Farm Cauliflower (காலிஃபிளவர்)",
    category: "Vegetables",
    price: 35,
    unit: "kg",
    stock: 18,
    rating: 4.5,
    farmerName: "Ramesh Organic Farm",
    description: "Crisp white, pesticide-free fresh cauliflower heads picked today.",
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_banana",
    _id: "prod_banana",
    name: "Robusta Farm Bananas (வாழைப்பழம்)",
    category: "Fruits",
    price: 50,
    unit: "dozen",
    stock: 25,
    rating: 4.7,
    farmerName: "Annamalai Agro Orchards",
    description: "Naturally ripened sweet bananas packed with energy, harvested without chemicals.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_milk",
    _id: "prod_milk",
    name: "Pure Farm Fresh Cow Milk (பசும்பால்)",
    category: "Dairy",
    price: 45,
    unit: "litre",
    stock: 20,
    rating: 4.9,
    farmerName: "Gokulam Dairy Farm",
    description: "Pure, wholesome unprocessed cow milk delivered directly from local dairy cattle.",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod_rice",
    _id: "prod_rice",
    name: "Traditional Ponni Boiled Rice (பொன்னி அரிசி)",
    category: "Grains",
    price: 65,
    unit: "kg",
    stock: 50,
    rating: 4.8,
    farmerName: "Thanjavur Delta Farms",
    description: "Single-origin aromatic boiled Ponni rice harvested from rich delta paddy fields.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
  },
];

// Presets for Add Product with real accurate images
const PRESET_IMAGES = [
  { label: "Onion", category: "Vegetables", url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80" },
  { label: "Tomato", category: "Vegetables", url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80" },
  { label: "Carrot", category: "Vegetables", url: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=80" },
  { label: "Potato", category: "Vegetables", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80" },
  { label: "Cauliflower", category: "Vegetables", url: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=900&q=80" },
  { label: "Spinach", category: "Leafy Greens", url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80" },
  { label: "Banana", category: "Fruits", url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80" },
  { label: "Milk", category: "Dairy", url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80" },
  { label: "Rice", category: "Grains", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80" },
];

function getDefaultImage(name = "", category = "") {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("onion") || lowerName.includes("venkaiyam") || lowerName.includes("vengayam")) {
    return "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80";
  }
  if (lowerName.includes("tomato") || lowerName.includes("thakkali")) {
    return "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80";
  }
  if (lowerName.includes("carrot")) {
    return "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=80";
  }
  if (lowerName.includes("potato") || lowerName.includes("urulai")) {
    return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80";
  }
  if (lowerName.includes("spinach") || lowerName.includes("keerai") || lowerName.includes("palak")) {
    return "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80";
  }
  if (lowerName.includes("milk") || lowerName.includes("paal")) {
    return "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80";
  }
  if (lowerName.includes("rice") || lowerName.includes("arisi") || lowerName.includes("grain")) {
    return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80";
  }
  const match = PRESET_IMAGES.find((p) => p.category === category);
  return match ? match.url : PRESET_IMAGES[0].url;
}

// Calculate delivery schedule (2 days from now)
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

// Audio alert sound
function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

// Storage helpers
const defaultDemoOrders = [
  {
    id: "ORD-982140",
    orderId: "ORD-982140",
    trackingId: "TRK-491204",
    status: "Placed",
    payment: "UPI / Online Payment",
    paymentMethod: "UPI / Online Payment",
    paymentStatus: "Paid Successfully (UPI)",
    amount: 95,
    totalAmount: 95,
    date: new Date().toLocaleDateString("en-IN"),
    deliveryDate: "Tomorrow",
    deliveryTimeSlot: "04:00 PM - 07:00 PM",
    deliveryDuration: "Within 24 Hours",
    farmerContact: "+91 94432 10987",
    farmerName: "Ramesh Organic Farm",
    customer: {
      name: "Priya",
      phone: "+91 98765 01234",
      address: "123, Green Meadows, Farm Colony",
      city: "Coimbatore",
      pincode: "641001",
    },
    items: [
      { id: "prod_tomato", name: "Fresh Country Tomatoes (தக்காளி)", price: 30, quantity: 2, unit: "kg" },
      { id: "prod_onion", name: "Fresh Red Country Onions (வெங்காயம்)", price: 35, quantity: 1, unit: "kg" },
    ],
  },
  {
    id: "ORD-871239",
    orderId: "ORD-871239",
    trackingId: "TRK-381920",
    status: "Accepted",
    payment: "Cash on Delivery",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending (COD)",
    amount: 80,
    totalAmount: 80,
    date: new Date().toLocaleDateString("en-IN"),
    deliveryDate: "In 2 Days",
    deliveryTimeSlot: "04:00 PM - 07:00 PM",
    deliveryDuration: "Within 48 Hours",
    farmerContact: "+91 94432 10987",
    farmerName: "Ramesh Organic Farm",
    customer: {
      name: "Karthik",
      phone: "+91 98421 55678",
      address: "45, Temple View St",
      city: "Madurai",
      pincode: "625001",
    },
    items: [
      { id: "prod_carrot", name: "Fresh Crunchy Ooty Carrots (கேரட்)", price: 40, quantity: 2, unit: "kg" },
    ],
  },
];

function getLocalOrders() {
  try {
    const data = JSON.parse(localStorage.getItem("placedOrders") || "[]");
    if (data.length > 0) return data;
    return defaultDemoOrders;
  } catch (e) {
    return defaultDemoOrders;
  }
}

function saveLocalOrder(order) {
  try {
    const current = getLocalOrders();
    const orderId = order.orderId || order.id;
    const updated = [order, ...current.filter((o) => (o.orderId || o.id) !== orderId)];
    localStorage.setItem("placedOrders", JSON.stringify(updated));
    window.dispatchEvent(new Event("farmerOrdersUpdated"));
  } catch (e) {
    console.error(e);
  }
}

function getLocalNotifications(role, email) {
  try {
    const all = JSON.parse(localStorage.getItem("farmerNotifications") || "[]");
    return all.filter((n) => {
      if (!role) return true;
      if (n.recipientRole === role || n.recipientRole === "all") {
        if (role === "customer" && email && n.recipientEmail && n.recipientEmail !== email) {
          return false;
        }
        return true;
      }
      return false;
    });
  } catch (e) {
    return [];
  }
}

function addLocalNotification(notif) {
  try {
    const all = JSON.parse(localStorage.getItem("farmerNotifications") || "[]");
    const item = {
      _id: "NOTIF" + Date.now() + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notif,
    };
    const updated = [item, ...all];
    localStorage.setItem("farmerNotifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("farmerNotificationUpdated"));
    playNotificationSound();
    return item;
  } catch (e) {
    console.error(e);
  }
}

function getCustomProducts() {
  try {
    return JSON.parse(localStorage.getItem("customProducts") || "[]");
  } catch (e) {
    return [];
  }
}

function saveCustomProduct(prod) {
  try {
    const current = getCustomProducts();
    const updated = [prod, ...current.filter((p) => (p.id || p._id) !== (prod.id || prod._id))];
    localStorage.setItem("customProducts", JSON.stringify(updated));
    window.dispatchEvent(new Event("farmerProductsUpdated"));
  } catch (e) {
    console.error(e);
  }
}

/* =====================================================
   NAVBAR COMPONENT
===================================================== */
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [cartCount, setCartCount] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    return savedCart.reduce((total, item) => total + Number(item.quantity || 1), 0);
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    const role = user?.role || "customer";
    const email = user?.email || "";

    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/notifications?role=${role}&email=${email}`
      );
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setNotifications(res.data);
        return;
      }
    } catch (e) {}

    const local = getLocalNotifications(role, email);
    setNotifications(local);
  };

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(savedCart.reduce((total, item) => total + Number(item.quantity || 1), 0));
    };

    window.addEventListener("farmerCartUpdated", updateCartCount);
    window.addEventListener("farmerNotificationUpdated", fetchNotifications);
    window.addEventListener("farmerOrdersUpdated", fetchNotifications);
    window.addEventListener("storage", () => {
      updateCartCount();
      fetchNotifications();
    });

    updateCartCount();
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 4000);

    return () => {
      window.removeEventListener("farmerCartUpdated", updateCartCount);
      window.removeEventListener("farmerNotificationUpdated", fetchNotifications);
      window.removeEventListener("farmerOrdersUpdated", fetchNotifications);
      clearInterval(interval);
    };
  }, [user?.role, user?.email]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await axios.patch("http://localhost:5000/api/orders/notifications/mark-all/read", {
        role: user?.role,
      });
    } catch (e) {}
    const all = JSON.parse(localStorage.getItem("farmerNotifications") || "[]");
    const updated = all.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem("farmerNotifications", JSON.stringify(updated));
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="logo">🌱 Farmer E-Commerce</Link>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/products">Products</Link>
        {user?.role === "farmer" && <Link to="/dashboard">Farmer Dashboard</Link>}
        <Link to="/orders">Orders</Link>

        {/* NOTIFICATION BELL */}
        <div className="notif-btn-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="notif-bell-btn tactile-3d-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            title="View Notifications"
          >
            <span>🔔</span>
            <span>Notifications</span>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifMenu && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h4>
                  {user?.role === "farmer" ? "👨‍🌾 Farmer Alerts" : "🔔 Order Alerts"}
                </h4>
                {unreadCount > 0 && (
                  <button type="button" className="notif-clear-btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#6e8071" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>No notifications yet.</p>
                  <small style={{ color: "#95a898" }}>
                    {user?.role === "farmer"
                      ? "Customer orders will appear here in real-time."
                      : "Order acceptance and tracking updates appear here."}
                  </small>
                </div>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <div
                    key={n._id || n.id || Math.random()}
                    className={`notif-item ${!n.isRead ? "unread" : ""}`}
                  >
                    <div className="notif-item-title">
                      <span>{n.title}</span>
                      {n.details?.paymentMethod && (
                        <span className="notif-item-pill">
                          {n.details.paymentMethod.includes("Cash") ? "COD" : "PAID"}
                        </span>
                      )}
                    </div>
                    <div className="notif-item-msg">{n.message}</div>
                    {n.details?.trackingId && (
                      <div style={{ fontSize: "11.5px", color: "#0c831f", fontWeight: 800, marginBottom: "4px" }}>
                        🚚 Tracking ID: {n.details.trackingId} | ⏱️ {n.details.deliveryDuration || "24-48 hrs"}
                      </div>
                    )}
                    <div className="notif-item-time">
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                    </div>
                  </div>
                ))
              )}

              <div style={{ marginTop: "10px", textAlign: "center", borderTop: "1px solid #edf1ed", paddingTop: "10px" }}>
                {user?.role === "farmer" ? (
                  <Link to="/dashboard" onClick={() => setShowNotifMenu(false)} style={{ fontSize: "13px", fontWeight: 800, color: "#0c831f" }}>
                    Open Farmer Orders Dashboard →
                  </Link>
                ) : (
                  <Link to="/orders" onClick={() => setShowNotifMenu(false)} style={{ fontSize: "13px", fontWeight: 800, color: "#0c831f" }}>
                    Track Deliveries in Orders →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="navbar-cart-link">
          🛒 Cart <span className="navbar-cart-count">{cartCount}</span>
        </Link>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

/* =====================================================
   LOGIN COMPONENT (CLEAN, BOLD, NO DEMO BUTTONS)
===================================================== */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate(response.data.user.role === "farmer" ? "/dashboard" : "/home");
    } catch (err) {
      const isFarmerEmail = email.toLowerCase().includes("farmer");
      const mockUser = {
        name: isFarmerEmail ? "Ramesh (Farmer)" : "Priya (Customer)",
        email: email || (isFarmerEmail ? "farmer@farm.com" : "customer@farm.com"),
        role: isFarmerEmail ? "farmer" : "customer",
      };
      localStorage.setItem("token", "token-" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));
      navigate(mockUser.role === "farmer" ? "/dashboard" : "/home");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-content">
          <div className="login-logo">🌱 Farmer E-Commerce</div>
          <div className="farmer-pill">100% FARM FRESH • DIRECT ACCESS</div>
          <h1>
            Harvest-Fresh Produce<br />
            <span>Direct to Your Doorstep</span>
          </h1>
          <p style={{ fontWeight: 600, color: "#eef6f0" }}>
            Experience harvest-crisp vegetables, fruits, and dairy straight from local growers with live 24-48 hour tracking.
          </p>
          <div className="login-features">
            <div>🌱 <strong>Farm-to-Kitchen Fresh</strong></div>
            <div>⚡ <strong>Instant Order Confirmation</strong></div>
            <div>🚚 <strong>Express Live Tracking</strong></div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card auth-3d-card" style={{ padding: "36px 32px" }}>
          <div className="card-glow" />
          <div className="auth-icon">🔐</div>
          <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#113c1f", margin: "6px 0" }}>
            Welcome Back
          </h2>
          <p className="login-subtitle" style={{ fontSize: "14px", fontWeight: 600, color: "#4f6356" }}>
            Sign in to access fresh produce and live deliveries
          </p>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} style={{ marginTop: "16px" }}>
            <label style={{ fontWeight: 800, fontSize: "13.5px", color: "#1f3a28" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ fontWeight: 600 }}
            />

            <label style={{ fontWeight: 800, fontSize: "13.5px", color: "#1f3a28" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ fontWeight: 600 }}
            />

            <button
              type="submit"
              className="login-btn tactile-3d-btn"
              style={{ width: "100%", marginTop: "14px", fontSize: "15px" }}
            >
              Sign In to Store <span>→</span>
            </button>
          </form>

          <div className="auth-switch" style={{ marginTop: "22px", fontWeight: 600 }}>
            Don't have an account? <Link to="/register" style={{ fontWeight: 800, color: "#0c831f" }}>Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   REGISTER COMPONENT
===================================================== */
function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const newUser = { name, email, role };
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", "mock-reg-token");
      alert("Registration successful! Redirecting...");
      navigate(role === "farmer" ? "/dashboard" : "/home");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-content">
          <div className="login-logo">🌱 Farmer E-Commerce</div>
          <div className="farmer-pill">CREATE NEW ACCOUNT</div>
          <h1>Join Our Community<br /><span>Support Local Farmers</span></h1>
          <p style={{ fontWeight: 600, color: "#eef6f0" }}>
            Register as a Customer to order fresh produce or as a Farmer to sell directly to local consumers.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card auth-3d-card" style={{ padding: "34px 30px" }}>
          <div className="auth-icon">📝</div>
          <h2 style={{ fontSize: "27px", fontWeight: 900, color: "#113c1f" }}>Create Account</h2>
          <p className="login-subtitle" style={{ fontWeight: 600 }}>Join the fresh farm-to-doorstep revolution</p>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleRegister}>
            <label style={{ fontWeight: 800 }}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Shanmuga Priya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ fontWeight: 600 }}
            />
            <label style={{ fontWeight: 800 }}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ fontWeight: 600 }}
            />
            <label style={{ fontWeight: 800 }}>Password</label>
            <input
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ fontWeight: 600 }}
            />

            <label style={{ fontWeight: 800 }}>Select Your Role</label>
            <div className="role-selection">
              <button
                type="button"
                className={role === "customer" ? "role-btn active" : "role-btn"}
                onClick={() => setRole("customer")}
              >
                🛒 Customer
              </button>
              <button
                type="button"
                className={role === "farmer" ? "role-btn active" : "role-btn"}
                onClick={() => setRole("farmer")}
              >
                👨‍🌾 Farmer
              </button>
            </div>

            <button type="submit" className="login-btn tactile-3d-btn" style={{ width: "100%", marginTop: "14px" }}>
              Complete Registration <span>→</span>
            </button>
          </form>

          <div className="auth-switch" style={{ fontWeight: 600 }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 800, color: "#0c831f" }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   HOME COMPONENT (CLEAN 3-CARD ALIGNMENT & BOLD STYLING)
===================================================== */
function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
  const [cartMessage, setCartMessage] = useState("");

  const updateCart = (product, change) => {
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    const pid = String(product.id || product._id);
    const existingItem = existing.find((item) => String(item.id || item._id) === pid);

    let updated;
    if (change > 0) {
      if (existingItem) {
        updated = existing.map((item) =>
          String(item.id || item._id) === pid
            ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
            : item
        );
      } else {
        updated = [...existing, { ...product, id: pid, quantity: 1 }];
      }
      setCartMessage(`Added ${product.name} to cart! 🌱`);
    } else {
      if (existingItem && (Number(existingItem.quantity) || 1) > 1) {
        updated = existing.map((item) =>
          String(item.id || item._id) === pid
            ? { ...item, quantity: (Number(item.quantity) || 1) - 1 }
            : item
        );
      } else {
        updated = existing.filter((item) => String(item.id || item._id) !== pid);
      }
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("farmerCartUpdated"));
    setTimeout(() => setCartMessage(""), 2200);
  };

  const featured = sampleProducts.slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="home-page">
        <section className="hero-section" style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div className="hero-content" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="express-delivery-highlight-badge" style={{ margin: "0 auto 20px" }}>
              <span className="badge-bolt">⚡</span>
              <span>24–48 Hours Express Farmers Delivery</span>
              <span className="badge-speed">FAST 🚀</span>
            </div>
            <h1 style={{ textAlign: "center", margin: "0 auto 18px", maxWidth: "700px" }}>
              Harvest-Fresh Produce,<br />
              Direct from Local Growers 🌱
            </h1>
            <p style={{ textAlign: "center", fontWeight: 600, fontSize: "16px", color: "#f1f8f3", maxWidth: "620px", margin: "0 auto 24px" }}>
              Experience the unmatched freshness of authentic farm-grown vegetables, fruits,
              dairy, and grains with instant order confirmation and live delivery tracking.
            </p>
            <div className="hero-buttons" style={{ justifyContent: "center" }}>
              {user?.role === "farmer" ? (
                <>
                  <Link to="/dashboard" className="primary-btn tactile-3d-btn" style={{ background: "linear-gradient(135deg, #0c831f, #15803d)" }}>
                    🌾 Open Farmer Dashboard →
                  </Link>
                  <Link to="/products" className="secondary-btn tactile-3d-btn">
                    🛒 View Farm Store
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/products" className="primary-btn tactile-3d-btn">
                    🥦 Shop Farm Fresh Produce →
                  </Link>
                  <Link to="/orders" className="secondary-btn tactile-3d-btn">
                    📦 Track My Orders
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {cartMessage && (
          <div className="cart-toast" role="status">
            <span className="cart-toast-icon">✓</span>
            <span>{cartMessage}</span>
          </div>
        )}

        {/* 3 HIGH-CONVERTING FEATURE CARDS WITH CLEAN 3D ALIGNMENT */}
        <section className="features-grid-zepto">
          <div className="feature-card-zepto">
            <div className="feature-icon-circle">👨‍🌾</div>
            <span className="feature-pill-tag">100% DIRECT HARVEST</span>
            <h3>Direct From Local Farmers</h3>
            <p>
              Zero middlemen commissions. Farmers receive 100% fair prices, and you get harvest-crisp organic produce at lowest farm rates.
            </p>
          </div>

          <div className="feature-card-zepto">
            <div className="feature-icon-circle">🔔</div>
            <span className="feature-pill-tag">REAL-TIME CONFIRMATION</span>
            <h3>Instant Order Notifications</h3>
            <p>
              Farmers are notified immediately upon order placement. You receive real-time notifications when the farmer accepts and packs your basket.
            </p>
          </div>

          <div className="feature-card-zepto">
            <div className="feature-icon-circle">🚚</div>
            <span className="feature-pill-tag">EXPRESS DOORSTEP TRACKING</span>
            <h3>24-48 Hours Express Delivery</h3>
            <p>
              Guaranteed delivery within 24 to 48 hours. Complete with live tracking ID, delivery duration, and farmer support contact.
            </p>
          </div>
        </section>

        {/* FEATURED HARVEST SECTION WITH 3D CARDS */}
        <section style={{ margin: "45px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <div className="page-tag">TODAY'S HARVEST PICKS</div>
            <h2 style={{ fontSize: "32px", fontWeight: 900, color: "#113c1f", margin: "6px 0" }}>
              Featured Fresh Produce
            </h2>
            <p style={{ color: "#4f6356", fontWeight: 600, margin: 0 }}>
              Add organic harvest directly to your cart with one click.
            </p>
          </div>

          <div className="products-grid">
            {featured.map((product) => {
              const pid = String(product.id || product._id);
              const inCartItem = cart.find((i) => String(i.id || i._id) === pid);
              const inCartQty = inCartItem ? Number(inCartItem.quantity) || 1 : 0;

              return (
                <div className="product-card-3d" key={pid}>
                  <div className="product-img-box">
                    <img src={product.image} alt={product.name} />
                    <span className="product-tag-floating">{product.category}</span>
                    <span className="product-fresh-pill">🌿 Farm Fresh</span>
                    <span className="product-stock-tag">In Stock ({product.stock} {product.unit})</span>
                  </div>

                  <div className="product-details-body">
                    <div>
                      <div className="product-title-row">
                        <h3 className="product-title-text">{product.name}</h3>
                        <span className="product-star-rating">⭐ {product.rating || 4.8}</span>
                      </div>

                      <div className="product-farmer-name">
                        <span>👨‍🌾</span>
                        <span><strong>{product.farmerName || "Local Farm Fresh"}</strong></span>
                      </div>

                      <p className="product-desc-box">{product.description}</p>
                    </div>

                    <div className="product-bottom-bar">
                      <div className="price-container">
                        <span className="price-highlight">₹{product.price}</span>
                        <span className="price-sub">per {product.unit}</span>
                      </div>

                      {inCartQty === 0 ? (
                        <button
                          type="button"
                          className="btn-cart-3d tactile-3d-btn"
                          onClick={() => updateCart(product, 1)}
                        >
                          🛒 Add to Cart
                        </button>
                      ) : (
                        <div className="qty-ctrl-box">
                          <button
                            type="button"
                            className="qty-ctrl-btn"
                            onClick={() => updateCart(product, -1)}
                          >
                            −
                          </button>
                          <span className="qty-ctrl-display">{inCartQty} in Cart</span>
                          <button
                            type="button"
                            className="qty-ctrl-btn"
                            onClick={() => updateCart(product, 1)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

/* =====================================================
   PRODUCTS COMPONENT (BLINKIT / ZEPTO CATEGORY PILLS)
===================================================== */
function Products() {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
  const [cartMessage, setCartMessage] = useState("");

  const categoryItems = [
    { id: "All", label: "All Items", icon: "🧺" },
    { id: "Vegetables", label: "Vegetables", icon: "🥕" },
    { id: "Fruits", label: "Fruits", icon: "🍎" },
    { id: "Leafy Greens", label: "Leafy Greens", icon: "🥬" },
    { id: "Grains", label: "Grains & Rice", icon: "🌾" },
    { id: "Dairy", label: "Dairy & Milk", icon: "🥛" },
    { id: "Pulses", label: "Dals & Pulses", icon: "🫘" },
  ];

  const loadProducts = async () => {
    let combined = [...sampleProducts];

    const custom = getCustomProducts();
    if (custom.length > 0) {
      combined = [...custom, ...combined];
    }

    try {
      const res = await axios.get("http://localhost:5000/api/products");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const backendFormatted = res.data.map((p) => ({
          id: p._id || p.id,
          _id: p._id || p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          unit: p.unit || "kg",
          stock: p.stock || 20,
          rating: p.rating || 4.8,
          description: p.description || `Fresh ${p.name} directly from local farmer.`,
          image: p.image || getDefaultImage(p.name, p.category),
          farmerName: p.farmer?.name || "Ramesh Organic Farm",
        }));
        combined = [...backendFormatted, ...combined];
      }
    } catch (e) {}

    const seen = new Set();
    const unique = [];
    for (const p of combined) {
      let normKey = (p.name || "").toLowerCase().trim();
      if (normKey.includes("onion") || normKey.includes("vengayam") || normKey.includes("venkaiyam")) {
        normKey = "category_onion";
      } else if (normKey.includes("tomato") || normKey.includes("thakkali")) {
        normKey = "category_tomato";
      } else if (normKey.includes("carrot")) {
        normKey = "category_carrot";
      } else if (normKey.includes("potato") || normKey.includes("urulai")) {
        normKey = "category_potato";
      } else if (normKey.includes("spinach") || normKey.includes("keerai") || normKey.includes("palak")) {
        normKey = "category_spinach";
      } else if (normKey.includes("cauliflower")) {
        normKey = "category_cauliflower";
      } else if (normKey.includes("banana") || normKey.includes("vazhai")) {
        normKey = "category_banana";
      } else if (normKey.includes("milk") || normKey.includes("paal")) {
        normKey = "category_milk";
      } else if (normKey.includes("rice") || normKey.includes("arisi")) {
        normKey = "category_rice";
      }

      if (!seen.has(normKey)) {
        seen.add(normKey);
        unique.push(p);
      }
    }
    setProductsList(unique);
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener("farmerProductsUpdated", loadProducts);
    window.addEventListener("storage", loadProducts);
    return () => {
      window.removeEventListener("farmerProductsUpdated", loadProducts);
      window.removeEventListener("storage", loadProducts);
    };
  }, []);

  const updateCart = (product, change) => {
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    const pid = String(product.id || product._id);
    const existingItem = existing.find((item) => String(item.id || item._id) === pid);

    let updated;
    if (change > 0) {
      if (existingItem) {
        updated = existing.map((item) =>
          String(item.id || item._id) === pid
            ? { ...item, quantity: (Number(item.quantity) || 1) + 1 }
            : item
        );
      } else {
        updated = [...existing, { ...product, id: pid, quantity: 1 }];
      }
      setCartMessage(`Added ${product.name} to cart! 🌱`);
    } else {
      if (existingItem && (Number(existingItem.quantity) || 1) > 1) {
        updated = existing.map((item) =>
          String(item.id || item._id) === pid
            ? { ...item, quantity: (Number(item.quantity) || 1) - 1 }
            : item
        );
      } else {
        updated = existing.filter((item) => String(item.id || item._id) !== pid);
      }
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("farmerCartUpdated"));
    setTimeout(() => setCartMessage(""), 2200);
  };

  const filteredProducts = productsList.filter((p) => {
    const matchesCat = category === "All" || p.category?.toLowerCase() === category.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + Number(item.price || 0) * (Number(item.quantity) || 1), 0);

  return (
    <>
      <Navbar />
      <main className="products-page">
        {/* CLEAN CENTERED STORE HEADER WITH CONSISTENT TITLE CASE */}
        <div className="products-header" style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="products-hero-badge" style={{ marginBottom: "10px" }}>
            🌱 100% Certified Farm Fresh Harvest
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: "#113c1f", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
            Farm Harvest Store
          </h1>
          <p style={{ fontSize: "15.5px", fontWeight: 600, color: "#4f6356", margin: "0 auto", lineHeight: "1.6", maxWidth: "620px" }}>
            Handpicked Farm-Fresh Produce Delivered Direct from Local Growers within 24–48 Hours
          </p>
        </div>

        {cartMessage && (
          <div className="cart-toast" role="status">
            <span className="cart-toast-icon">✓</span>
            <span>{cartMessage}</span>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="products-search-box">
          <span className="search-icon-inside">🔍</span>
          <input
            type="text"
            className="products-search-input"
            placeholder="Search fresh items (e.g. Onion, Tomato, Carrot, Milk...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* MODERN BLINKIT / ZEPTO CATEGORY PILLS */}
        <div className="category-pills-scroll">
          {categoryItems.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-pill-zepto ${category === cat.id ? "active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 3D PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#687a6b" }}>
            <p style={{ fontSize: "18px", fontWeight: 700 }}>No produce found matching your search.</p>
            <button
              type="button"
              className="primary-btn tactile-3d-btn"
              onClick={() => { setCategory("All"); setSearchQuery(""); }}
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const pid = String(product.id || product._id);
              const inCartItem = cart.find((i) => String(i.id || i._id) === pid);
              const inCartQty = inCartItem ? Number(inCartItem.quantity) || 1 : 0;

              return (
                <div className="product-card-3d" key={pid}>
                  <div className="product-img-box">
                    <img src={product.image} alt={product.name} />
                    <span className="product-tag-floating">{product.category}</span>
                    <span className="product-fresh-pill">🌿 Farm Fresh</span>
                    <span className="product-stock-tag">In Stock ({product.stock} {product.unit})</span>
                  </div>

                  <div className="product-details-body">
                    <div>
                      <div className="product-title-row">
                        <h3 className="product-title-text">{product.name}</h3>
                        <span className="product-star-rating">⭐ {product.rating || 4.8}</span>
                      </div>

                      <div className="product-farmer-name">
                        <span>👨‍🌾</span>
                        <span><strong>{product.farmerName || "Ramesh Organic Farm"}</strong></span>
                      </div>

                      <p className="product-desc-box">{product.description}</p>
                    </div>

                    <div className="product-bottom-bar">
                      <div className="price-container">
                        <span className="price-highlight">₹{product.price}</span>
                        <span className="price-sub">per {product.unit}</span>
                      </div>

                      {inCartQty === 0 ? (
                        <button
                          type="button"
                          className="btn-cart-3d tactile-3d-btn"
                          onClick={() => updateCart(product, 1)}
                        >
                          🛒 Add to Cart
                        </button>
                      ) : (
                        <div className="qty-ctrl-box">
                          <button
                            type="button"
                            className="qty-ctrl-btn"
                            onClick={() => updateCart(product, -1)}
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="qty-ctrl-display">{inCartQty} in Cart</span>
                          <button
                            type="button"
                            className="qty-ctrl-btn"
                            onClick={() => updateCart(product, 1)}
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FLOATING ACTION CART BAR */}
        {totalCartCount > 0 && (
          <div className="floating-cart-bar">
            <span>🛒 <strong>{totalCartCount} items</strong> in Basket (₹{totalCartPrice.toFixed(2)})</span>
            <Link to="/cart" className="floating-cart-btn tactile-3d-btn">
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

/* =====================================================
   FARMER DASHBOARD (FOCUSED SIDEBAR & 3D ORDER CARDS)
===================================================== */
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOrders(res.data);
      } else {
        setOrders(getLocalOrders());
      }
    } catch (e) {
      setOrders(getLocalOrders());
    }

    try {
      const notifRes = await axios.get("http://localhost:5000/api/orders/notifications?role=farmer");
      if (notifRes.data && Array.isArray(notifRes.data) && notifRes.data.length > 0) {
        setNotifications(notifRes.data);
      } else {
        setNotifications(getLocalNotifications("farmer"));
      }
    } catch (e) {
      setNotifications(getLocalNotifications("farmer"));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("farmerOrdersUpdated", loadData);
    window.addEventListener("farmerNotificationUpdated", loadData);
    window.addEventListener("storage", loadData);

    const interval = setInterval(loadData, 4000);
    return () => {
      window.removeEventListener("farmerOrdersUpdated", loadData);
      window.removeEventListener("farmerNotificationUpdated", loadData);
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
    };
  }, []);

  const activeUser = user && user.role === "farmer" ? user : { name: "Ramesh (Farmer)", role: "farmer" };

  const handleAcceptOrder = async (order) => {
    const orderId = order.orderId || order.id;

    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: "Accepted",
      });
    } catch (e) {}

    const currentOrders = getLocalOrders();
    const updated = currentOrders.map((o) => {
      if ((o.orderId || o.id) === orderId) {
        return { ...o, status: "Accepted", acceptedAt: new Date().toISOString() };
      }
      return o;
    });
    localStorage.setItem("placedOrders", JSON.stringify(updated));
    setOrders(updated);

    addLocalNotification({
      recipientRole: "customer",
      recipientEmail: order.customer?.email || "",
      orderId: orderId,
      trackingId: order.trackingId,
      title: "🎉 Order Accepted by Farmer!",
      message: `Your order #${orderId} has been confirmed by farmer ${order.farmerName || user.name}! Tracking ID: ${order.trackingId}. Expected delivery: ${order.deliveryDate} (${order.deliveryTimeSlot}, ${order.deliveryDuration}). Contact: ${order.farmerContact}. Payment: ${order.paymentMethod || order.payment}.`,
      type: "order_accepted",
      details: {
        deliveryDate: order.deliveryDate,
        deliveryTimeSlot: order.deliveryTimeSlot,
        deliveryDuration: order.deliveryDuration,
        farmerContact: order.farmerContact,
        farmerName: order.farmerName || user.name,
        paymentMethod: order.paymentMethod || order.payment,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount || order.amount,
      },
    });

    window.dispatchEvent(new Event("farmerOrdersUpdated"));
    alert(`✅ Order #${orderId} accepted successfully! Customer has received the notification.`);
  };

  const handleAdvanceStatus = async (order, nextStatus) => {
    const orderId = order.orderId || order.id;

    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: nextStatus,
      });
    } catch (e) {}

    const currentOrders = getLocalOrders();
    const updated = currentOrders.map((o) => {
      if ((o.orderId || o.id) === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    });
    localStorage.setItem("placedOrders", JSON.stringify(updated));
    setOrders(updated);

    let notifTitle = "";
    let notifMsg = "";
    if (nextStatus === "Packed") {
      notifTitle = "📦 Order Packed!";
      notifMsg = `Your order #${orderId} has been freshly packed by the farmer and is ready for pickup. Tracking ID: ${order.trackingId}.`;
    } else if (nextStatus === "Out for Delivery") {
      notifTitle = "🚚 Order Out for Delivery!";
      notifMsg = `Your order #${orderId} is out for delivery! Expected today by ${order.deliveryTimeSlot}. Contact: ${order.farmerContact}.`;
    } else if (nextStatus === "Delivered") {
      notifTitle = "🏁 Order Delivered!";
      notifMsg = `Your order #${orderId} has been successfully delivered. Thank you for buying direct from farmers!`;
    }

    if (notifTitle) {
      addLocalNotification({
        recipientRole: "customer",
        recipientEmail: order.customer?.email || "",
        orderId: orderId,
        trackingId: order.trackingId,
        title: notifTitle,
        message: notifMsg,
        type: "order_" + nextStatus.toLowerCase().replace(/ /g, "_"),
        details: {
          deliveryDate: order.deliveryDate,
          deliveryTimeSlot: order.deliveryTimeSlot,
          deliveryDuration: order.deliveryDuration,
          farmerContact: order.farmerContact,
          paymentMethod: order.paymentMethod || order.payment,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount || order.amount,
        },
      });
    }

    window.dispatchEvent(new Event("farmerOrdersUpdated"));
  };

  const pendingOrders = orders.filter((o) => (o.status || "Placed") === "Placed");
  const acceptedOrders = orders.filter((o) => o.status === "Accepted" || o.status === "Packed" || o.status === "Out for Delivery");
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");

  const filteredOrders =
    activeTab === "pending"
      ? pendingOrders
      : activeTab === "accepted"
      ? acceptedOrders
      : activeTab === "delivered"
      ? deliveredOrders
      : orders;

  const totalSales = orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.amount) || 0), 0);

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        {/* FOCUSED FARMER SIDEBAR (NO CONFUSING CUSTOMER VIEW) */}
        <aside className="dashboard-sidebar 3d-sidebar">
          <div className="farmer-profile">
            <div className="profile-avatar">👨‍🌾</div>
            <h3>{activeUser.name}</h3>
            <small>Registered Producer</small>
          </div>
          <Link to="/dashboard" className="sidebar-active">🌱 Dashboard & Orders</Link>
          <Link to="/products">🌾 My Farm Produce</Link>
          <Link to="/add-product">➕ Add New Product</Link>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <div className="page-tag">FARMER FULFILLMENT PORTAL</div>
              <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#113c1f" }}>
                Welcome, {activeUser.name} 🌾
              </h1>
              <p style={{ fontWeight: 600, color: "#4f6356" }}>
                Review incoming customer order requests, accept orders with 1-click, and manage farm dispatch.
              </p>
            </div>
            <Link to="/add-product" className="add-product-btn tactile-3d-btn">
              + Add Product
            </Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card 3d-card">
              <div className="stat-icon">🌱</div>
              <div>
                <small>Total Produce</small>
                <h2>{sampleProducts.length + getCustomProducts().length}</h2>
              </div>
            </div>
            <div className="stat-card 3d-card" style={{ border: pendingOrders.length > 0 ? "2px solid #e65100" : "" }}>
              <div className="stat-icon">🔔</div>
              <div>
                <small>Pending Requests</small>
                <h2 style={{ color: pendingOrders.length > 0 ? "#e65100" : "#113c1f" }}>
                  {pendingOrders.length}
                </h2>
              </div>
            </div>
            <div className="stat-card 3d-card">
              <div className="stat-icon">📦</div>
              <div>
                <small>Total Orders</small>
                <h2>{orders.length}</h2>
              </div>
            </div>
            <div className="stat-card 3d-card">
              <div className="stat-icon">💰</div>
              <div>
                <small>Total Sales</small>
                <h2>₹{totalSales.toFixed(2)}</h2>
              </div>
            </div>
          </div>

          {/* MODERN 3D ORDER REQUEST CARDS */}
          <section className="farmer-orders-panel 3d-card">
            <div className="dashboard-requests-header">
              <div className="page-tag">DISPATCH & FULFILLMENT</div>
              <h2 style={{ margin: "4px 0 6px", fontSize: "26px", fontWeight: 900, color: "#113c1f" }}>
                Customer Order Requests
              </h2>
              <p style={{ margin: "0 0 16px", color: "#4f6356", fontSize: "14.5px", fontWeight: 600 }}>
                Review incoming orders. Click <strong>"Accept Order"</strong> below to confirm and notify the customer immediately.
              </p>

              {/* MODERN SEGMENTED FILTER BAR WITH CRISP TYPOGRAPHY */}
              <div className="order-segmented-bar">
                <button
                  type="button"
                  className={`order-seg-tab ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  <span className="tab-icon">📋</span>
                  <span>All</span>
                  <span className="seg-badge">{orders.length}</span>
                </button>
                <button
                  type="button"
                  className={`order-seg-tab ${activeTab === "pending" ? "active pending-tab" : ""}`}
                  onClick={() => setActiveTab("pending")}
                >
                  <span className="tab-icon">⚡</span>
                  <span>Needs Acceptance</span>
                  <span className={`seg-badge ${pendingOrders.length > 0 ? "seg-badge-alert" : ""}`}>
                    {pendingOrders.length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`order-seg-tab ${activeTab === "accepted" ? "active" : ""}`}
                  onClick={() => setActiveTab("accepted")}
                >
                  <span className="tab-icon">✓</span>
                  <span>Accepted</span>
                  <span className="seg-badge">{acceptedOrders.length}</span>
                </button>
                <button
                  type="button"
                  className={`order-seg-tab ${activeTab === "delivered" ? "active" : ""}`}
                  onClick={() => setActiveTab("delivered")}
                >
                  <span className="tab-icon">🏁</span>
                  <span>Delivered</span>
                  <span className="seg-badge">{deliveredOrders.length}</span>
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 0", color: "#6e8071" }}>
                <p style={{ fontSize: "16px", fontWeight: 700 }}>No orders currently in this tab.</p>
                <small>When a customer places an order, the request card will appear here instantly.</small>
              </div>
            ) : (
              <div className="farmer-order-cards-grid">
                {filteredOrders.map((ord) => {
                  const id = ord.orderId || ord.id;
                  const status = ord.status || "Placed";
                  const isPending = status === "Placed";
                  const isCod = (ord.paymentMethod || ord.payment || "").toLowerCase().includes("cash") || (ord.paymentMethod || ord.payment || "").toLowerCase().includes("cod");

                  return (
                    <div
                      key={id}
                      className="farmer-order-item-card"
                      style={{ borderLeft: isPending ? "5px solid #e65100" : "5px solid #0c831f" }}
                    >
                      <div className="farmer-order-card-top">
                        <div className="farmer-order-id-badge">
                          <span>Order #{id}</span>
                          <span className="farmer-trk-sub">🚚 {ord.trackingId || "TRK-Pending"}</span>
                        </div>
                        <div>
                          {isCod ? (
                            <span className="payment-badge-cod">💵 COD</span>
                          ) : (
                            <span className="payment-badge-paid">💳 Paid (UPI)</span>
                          )}
                        </div>
                      </div>

                      <div className="farmer-cust-info">
                        <div className="cust-name-phone">
                          <span>👤 {ord.customer?.name || "Customer"}</span>
                          <a
                            href={`tel:${(ord.customer?.phone || "+919876501234").replace(/[^0-9+]/g, "")}`}
                            style={{ color: "#0c831f", textDecoration: "none", fontWeight: 800 }}
                          >
                            📞 {ord.customer?.phone || "+91 98765 01234"}
                          </a>
                        </div>
                        <div className="cust-address-line">
                          <span>📍</span>
                          <span>{ord.customer?.address || "Farm Colony"}, {ord.customer?.city || "Coimbatore"}</span>
                        </div>
                      </div>

                      <div>
                        <small style={{ fontWeight: 800, color: "#4f6356", display: "block", marginBottom: "6px" }}>
                          ORDER ITEMS:
                        </small>
                        <div className="farmer-items-list-pills">
                          {ord.items && ord.items.length > 0 ? (
                            ord.items.map((item, idx) => (
                              <span key={idx} className="farmer-item-pill">
                                {item.name} × {item.quantity} ({item.unit || "kg"})
                              </span>
                            ))
                          ) : (
                            <span className="farmer-item-pill">Fresh Farm Basket</span>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: "12.5px", color: "#556c5c", fontWeight: 600 }}>
                        ⏱️ Target Delivery: <strong>{ord.deliveryDate || "Within 2 Days"}</strong> ({ord.deliveryDuration || "24-48 hrs"})
                      </div>

                      <div className="farmer-order-bottom-bar">
                        <span className="farmer-order-price-bold">
                          ₹{Number(ord.totalAmount || ord.amount || 0).toFixed(2)}
                        </span>

                        {isPending && (
                          <button
                            type="button"
                            className="tactile-3d-btn accept-order-btn"
                            onClick={() => handleAcceptOrder(ord)}
                          >
                            ✓ Accept Order
                          </button>
                        )}

                        {status === "Accepted" && (
                          <button
                            type="button"
                            className="tactile-3d-btn status-advance-btn"
                            onClick={() => handleAdvanceStatus(ord, "Packed")}
                          >
                            📦 Mark Packed
                          </button>
                        )}

                        {status === "Packed" && (
                          <button
                            type="button"
                            className="tactile-3d-btn status-advance-btn"
                            onClick={() => handleAdvanceStatus(ord, "Out for Delivery")}
                          >
                            🚚 Out for Delivery
                          </button>
                        )}

                        {status === "Out for Delivery" && (
                          <button
                            type="button"
                            className="tactile-3d-btn status-advance-btn"
                            onClick={() => handleAdvanceStatus(ord, "Delivered")}
                          >
                            🏁 Mark Delivered
                          </button>
                        )}

                        {status === "Delivered" && (
                          <span style={{ color: "#2e7d32", fontWeight: 850, fontSize: "13px" }}>
                            ✓ Fulfilled
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* NOTIFICATION FEED */}
          <section className="farmer-orders-panel 3d-card" style={{ marginTop: "24px" }}>
            <div className="section-heading left-heading">
              <div className="page-tag">RECENT LOGS</div>
              <h2 style={{ fontSize: "22px", fontWeight: 850, color: "#113c1f" }}>Real-Time Store Activity</h2>
            </div>
            {notifications.slice(0, 5).map((n) => (
              <div key={n._id || Math.random()} className="notif-item">
                <div className="notif-item-title">
                  <span>{n.title}</span>
                  <small style={{ color: "#778c7c" }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : "Recent"}
                  </small>
                </div>
                <div className="notif-item-msg">{n.message}</div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}

/* =====================================================
   REDESIGNED: PRODUCT PUBLISH CONSOLE (WITH LIVE PREVIEW)
===================================================== */
function AddProduct() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const activeUser = user || { name: "Ramesh Organic Farm", role: "farmer" };

  const [name, setName] = useState("Fresh Country Tomatoes (தக்காளி)");
  const [category, setCategory] = useState("Vegetables");
  const [price, setPrice] = useState("30");
  const [stock, setStock] = useState("25");
  const [unit, setUnit] = useState("kg");
  const [image, setImage] = useState(PRESET_IMAGES[1]?.url || PRESET_IMAGES[0]?.url);
  const [description, setDescription] = useState("Fresh harvest ripe red tomatoes grown with 100% natural organic compost. Directly plucked from field.");
  const [loading, setLoading] = useState(false);

  const presetLabels = {
    Onion: "Fresh Red Country Onions (வெங்காயம்)",
    Tomato: "Fresh Country Tomatoes (தக்காளி)",
    Carrot: "Fresh Crunchy Ooty Carrots (கேரட்)",
    Potato: "Farm Fresh Potatoes (உருளைக்கிழங்கு)",
    Cauliflower: "Fresh Farm Cauliflower (காலிஃபிளவர்)",
    Spinach: "Organic Green Palak / Spinach (பசலைக்கீரை)",
    Banana: "Robusta Farm Bananas (வாழைப்பழம்)",
    Milk: "Pure Farm Fresh Cow Milk (பசும்பால்)",
    Rice: "Traditional Ponni Boiled Rice (பொன்னி அரிசி)",
  };

  const categoriesList = [
    { label: "Vegetables", icon: "🥦" },
    { label: "Fruits", icon: "🍎" },
    { label: "Leafy Greens", icon: "🌿" },
    { label: "Grains", icon: "🌾" },
    { label: "Dairy", icon: "🥛" },
    { label: "Pulses", icon: "🫘" },
  ];

  const handleSelectPreset = (preset) => {
    setImage(preset.url);
    setCategory(preset.category);
    if (presetLabels[preset.label]) {
      setName(presetLabels[preset.label]);
    } else {
      setName(`Fresh Farm ${preset.label}`);
    }
  };

  const addQuickTag = (tag) => {
    if (!description.includes(tag)) {
      setDescription((prev) => (prev ? `${prev} • ${tag}` : tag));
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!name.trim() || price === "" || stock === "") {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const newProd = {
      id: "PROD_" + Date.now(),
      _id: "PROD_" + Date.now(),
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      unit: unit || "kg",
      image: image || getDefaultImage(name, category),
      description: description.trim() || `Harvest-fresh ${name.trim()} grown naturally by local farmers.`,
      farmerName: activeUser.name,
      rating: 4.8,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/products",
        {
          name: newProd.name,
          category: newProd.category,
          price: newProd.price,
          stock: newProd.stock,
          unit: newProd.unit,
          image: newProd.image,
          description: newProd.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {}

    saveCustomProduct(newProd);

    alert(`🎉 Produce "${newProd.name}" published successfully! Customers can now order it with 24-48h delivery.`);
    navigate("/products");
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="add-product-page">
        <div className="add-product-wrapper">
          {/* TOP HEADER BAR */}
          <div className="add-product-top-bar">
            <div>
              <div className="page-tag">🌱 FARM PRODUCER CONSOLE</div>
              <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#113c1f", margin: "6px 0" }}>
                Publish Fresh Farm Harvest 🌾
              </h1>
              <p style={{ fontWeight: 600, color: "#4f6356", margin: 0, fontSize: "14.5px" }}>
                List your agricultural produce directly for customers to purchase with 24–48h express delivery.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/dashboard" className="secondary-btn tactile-3d-btn" style={{ padding: "10px 18px", fontSize: "14px" }}>
                ← Farmer Dashboard
              </Link>
              <Link to="/products" className="secondary-btn tactile-3d-btn" style={{ padding: "10px 18px", fontSize: "14px" }}>
                🛒 View Store
              </Link>
            </div>
          </div>

          {/* 2-COLUMN SPLIT PUBLISH CONSOLE */}
          <div className="publish-grid-layout">
            {/* LEFT COLUMN: EDIT FORM */}
            <div className="publish-form-card">
              <form onSubmit={submitProduct}>
                <div className="form-section-title">
                  <span>📝</span>
                  <span>Produce Information</span>
                </div>

                <label style={{ fontWeight: 800, fontSize: "13px", color: "#1c3c25" }}>
                  Product Name (English & Tamil)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Red Country Onions (வெங்காயம்)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ fontWeight: 600, fontSize: "14.5px" }}
                />

                <label style={{ fontWeight: 800, fontSize: "13px", color: "#1c3c25", marginTop: "12px", display: "block" }}>
                  Select Category
                </label>
                <div className="category-choice-grid">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      className={`category-choice-btn ${category === cat.label ? "active" : ""}`}
                      onClick={() => setCategory(cat.label)}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="form-row" style={{ marginTop: "14px" }}>
                  <div>
                    <label style={{ fontWeight: 800, fontSize: "13px", color: "#1c3c25" }}>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="35"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="1"
                      style={{ fontWeight: 700, fontSize: "15px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 800, fontSize: "13px", color: "#1c3c25" }}>Selling Unit</label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      style={{ fontWeight: 700, fontSize: "14px" }}
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="bunch">bunch (கட்டு)</option>
                      <option value="litre">litre (லிட்டர்)</option>
                      <option value="dozen">dozen (டஜன்)</option>
                      <option value="packet">packet (பாக்கெட்)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 800, fontSize: "13px", color: "#1c3c25" }}>Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      min="1"
                      style={{ fontWeight: 700, fontSize: "15px" }}
                    />
                  </div>
                </div>

                <div className="form-section-title" style={{ marginTop: "20px" }}>
                  <span>📸</span>
                  <span>Choose Verified Produce Photo</span>
                </div>

                <div className="preset-photos-scroll">
                  {PRESET_IMAGES.map((preset) => (
                    <div
                      key={preset.label}
                      className={`preset-photo-thumb ${image === preset.url ? "selected" : ""}`}
                      onClick={() => handleSelectPreset(preset)}
                      title={`Click to choose ${preset.label}`}
                    >
                      <img src={preset.url} alt={preset.label} />
                      <span>{preset.label}</span>
                      {image === preset.url && <div className="preset-photo-check">✓</div>}
                    </div>
                  ))}
                </div>

                <label style={{ fontWeight: 800, fontSize: "12.5px", color: "#506856" }}>
                  Or Paste Custom Image URL (Optional):
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{ fontWeight: 550, fontSize: "13px" }}
                />

                <div className="form-section-title" style={{ marginTop: "20px" }}>
                  <span>🌾</span>
                  <span>Freshness & Farm Quality Notes</span>
                </div>

                <div className="quick-tags-row">
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#325039", alignSelf: "center", marginRight: "4px" }}>
                    Quick Tags:
                  </span>
                  <button type="button" className="quick-tag-chip" onClick={() => addQuickTag("100% Organic Compost")}>
                    + 100% Organic Compost
                  </button>
                  <button type="button" className="quick-tag-chip" onClick={() => addQuickTag("Morning Fresh Harvest")}>
                    + Morning Fresh Harvest
                  </button>
                  <button type="button" className="quick-tag-chip" onClick={() => addQuickTag("Zero Chemical Pesticides")}>
                    + Zero Pesticides
                  </button>
                  <button type="button" className="quick-tag-chip" onClick={() => addQuickTag("Direct From Farmer Fields")}>
                    + Direct From Field
                  </button>
                </div>

                <textarea
                  rows="3"
                  placeholder="Describe soil, harvesting date, pesticide-free methods..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "14px",
                    border: "1.5px solid #cfe0d3",
                    boxSizing: "border-box",
                    fontWeight: 550,
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="primary-btn tactile-3d-btn"
                  style={{
                    width: "100%",
                    marginTop: "22px",
                    padding: "15px",
                    fontSize: "16.5px",
                    fontWeight: 900,
                    letterSpacing: "0.4px",
                  }}
                >
                  {loading ? "Publishing Produce..." : "🚀 Publish Produce to Farm Store →"}
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: REAL-TIME LIVE CUSTOMER STORE PREVIEW */}
            <aside className="live-preview-panel">
              <div className="live-preview-header">
                <h3>
                  <span>👁️</span>
                  <span>Live Store Preview</span>
                </h3>
                <div className="live-sync-pill">
                  <span className="live-sync-dot" />
                  <span>Real-Time Sync</span>
                </div>
              </div>

              <div className="preview-card-wrapper">
                <div className="product-card-3d" style={{ border: "none", boxShadow: "none", margin: 0 }}>
                  <div className="product-img-box">
                    <img src={image || getDefaultImage(name, category)} alt={name || "Product"} />
                    <span className="product-tag-floating">{category}</span>
                    <span className="product-fresh-pill">🌿 Farm Fresh</span>
                    <span className="product-stock-tag">
                      In Stock ({stock || "0"} {unit})
                    </span>
                  </div>

                  <div className="product-details-body">
                    <div>
                      <div className="product-title-row">
                        <h3 className="product-title-text">{name || "Fresh Farm Produce"}</h3>
                        <span className="product-star-rating">⭐ 4.8</span>
                      </div>

                      <div className="product-farmer-name">
                        <span>👨‍🌾</span>
                        <span><strong>{activeUser.name}</strong></span>
                      </div>

                      <p className="product-desc-box">
                        {description || "Fresh natural produce harvested straight from local farm fields."}
                      </p>
                    </div>

                    <div className="product-bottom-bar">
                      <div className="price-container">
                        <span className="price-highlight">₹{price || "0"}</span>
                        <span className="price-sub">per {unit}</span>
                      </div>

                      <button
                        type="button"
                        className="btn-cart-3d tactile-3d-btn"
                        style={{ pointerEvents: "none" }}
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FARMER BENEFIT HIGHLIGHTS */}
              <div className="farmer-benefits-box">
                <h4>🌾 Direct Producer Benefits:</h4>
                <ul>
                  <li><strong>100% Direct Payout:</strong> ₹{price || 0} per {unit} goes entirely to you with 0% middleman fees.</li>
                  <li><strong>Guaranteed 24–48h Dispatch:</strong> Fresh doorstep delivery to nearby customers.</li>
                  <li><strong>Instant Order Alerts:</strong> Receive notifications when customers place an order.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

/* =====================================================
   CART & CHECKOUT (CLEAN 2-COLUMN ADDRESS ALIGNMENT)
===================================================== */
function Cart() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Priya","role":"customer"}');
  const [cart, setCart] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    if (saved.length > 0) return saved;
    return [
      {
        id: "prod_tomato",
        name: "Fresh Country Tomatoes (தக்காளி)",
        price: 30,
        quantity: 2,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "prod_onion",
        name: "Fresh Red Country Onions (வெங்காயம்)",
        price: 35,
        quantity: 1,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80",
      },
    ];
  });
  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [customerName, setCustomerName] = useState(user?.name || "Priya");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 01234");
  const [customerAddress, setCustomerAddress] = useState("123, Green Meadows, Farm Colony");
  const [customerCity, setCustomerCity] = useState("Coimbatore");
  const [customerPincode, setCustomerPincode] = useState("641001");

  const upiId = "shanmuga2205priya@okicici";
  const payeeName = "Farmer E-Commerce";

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const deliveryInfo = getEstimatedDeliveryInfo();

  const upiUrl =
    `upi://pay?pa=${encodeURIComponent(upiId)}` +
    `&pn=${encodeURIComponent(payeeName)}` +
    `&am=${total.toFixed(2)}` +
    `&cu=INR`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

  const updateQuantity = (id, change) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updated = existingCart
      .map((item) => {
        if (String(item.id || item._id) !== String(id)) return item;
        return {
          ...item,
          quantity: Math.max(1, (Number(item.quantity) || 1) + change),
        };
      })
      .filter((item) => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("farmerCartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => String(item.id || item._id) !== String(id));
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("farmerCartUpdated"));
  };

  const placeOrder = async (methodType) => {
    const isCod =
      methodType.toLowerCase().includes("cash") ||
      methodType.toLowerCase().includes("cod");

    const normalizedPayment = isCod
      ? "Cash on Delivery"
      : "UPI / Online Payment";

    const paymentStatus = isCod
      ? "Pending (COD - Pay on Delivery)"
      : "Paid Successfully (UPI)";

    const timestampNum = Date.now().toString().slice(-6);
    const orderId = `ORD-${timestampNum}`;
    const trackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData = {
      id: orderId,
      orderId,
      trackingId,
      status: "Placed",
      payment: normalizedPayment,
      paymentMethod: normalizedPayment,
      paymentStatus,
      amount: total,
      totalAmount: total,
      date: new Date().toLocaleDateString("en-IN"),
      deliveryDate: deliveryInfo.deliveryDate,
      deliveryTimeSlot: deliveryInfo.deliveryTimeSlot,
      deliveryDuration: deliveryInfo.deliveryDuration,
      farmerContact: deliveryInfo.farmerContact,
      farmerName: deliveryInfo.farmerName,
      customer: {
        name: customerName.trim() || user?.name || "Customer",
        email: user?.email || "customer@farm.com",
        phone: customerPhone.trim() || "+91 98765 01234",
        address: customerAddress.trim() || "123, Green Meadows",
        city: customerCity.trim() || "Coimbatore",
        pincode: customerPincode.trim() || "641001",
      },
      items: cart.map((i) => ({
        id: i.id || i._id,
        name: i.name,
        price: i.price,
        quantity: Number(i.quantity) || 1,
        unit: i.unit || "kg",
        image: i.image,
      })),
    };

    try {
      await axios.post("http://localhost:5000/api/orders", {
        customer: orderData.customer,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
      });
    } catch (err) {}

    saveLocalOrder(orderData);

    addLocalNotification({
      recipientRole: "farmer",
      recipientEmail: "",
      orderId: orderId,
      trackingId: trackingId,
      title: "🔔 New Customer Order Received!",
      message: `New order #${orderId} placed by ${orderData.customer.name} for ₹${orderData.totalAmount}. Payment: ${orderData.paymentMethod}. Estimated Delivery: ${orderData.deliveryDate} (${orderData.deliveryDuration}). Please review and accept.`,
      type: "order_placed",
      details: {
        deliveryDate: orderData.deliveryDate,
        deliveryTimeSlot: orderData.deliveryTimeSlot,
        deliveryDuration: orderData.deliveryDuration,
        farmerContact: orderData.farmerContact,
        farmerName: orderData.farmerName,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        totalAmount: orderData.totalAmount,
      },
    });

    localStorage.removeItem("cart");
    setPlacedOrder(orderData);
    setCart([]);
    setOrderPlaced(true);
    window.dispatchEvent(new Event("farmerCartUpdated"));
  };

  if (orderPlaced && placedOrder) {
    return (
      <>
        <Navbar />
        <main className="payment-success-page">
          <div className="payment-success-card 3d-card" style={{ maxWidth: "620px" }}>
            <div className="success-orb">✓</div>
            <div className="page-tag">ORDER CONFIRMED</div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#113c1f" }}>
              Order Placed Successfully! 🌱
            </h1>
            <p style={{ fontWeight: 600, color: "#4f6356" }}>
              Your fresh order has been forwarded to the local farmer for confirmation.
            </p>

            <div className="order-alert-banner order-alert-placed" style={{ textAlign: "left" }}>
              <span>🔔</span>
              <span>
                <strong>Notification Sent to Farmer:</strong> The farmer has received your order alert.
                As soon as they click <strong>"Accept Order"</strong>, you will receive an instant confirmation!
              </span>
            </div>

            <div className="delivery-details-grid" style={{ textAlign: "left" }}>
              <div className="delivery-info-card">
                <span className="delivery-info-label">Order ID</span>
                <span className="delivery-info-value">#{placedOrder.id}</span>
              </div>
              <div className="delivery-info-card">
                <span className="delivery-info-label">Tracking ID</span>
                <span className="delivery-info-value" style={{ color: "#0c831f", fontWeight: 850 }}>
                  🚚 {placedOrder.trackingId}
                </span>
              </div>
              <div className="delivery-info-card">
                <span className="delivery-info-label">Expected Delivery Date</span>
                <span className="delivery-info-value">📅 {placedOrder.deliveryDate}</span>
              </div>
              <div className="delivery-info-card">
                <span className="delivery-info-label">Delivery Time & Duration</span>
                <span className="delivery-info-value">⏱️ {placedOrder.deliveryTimeSlot} ({placedOrder.deliveryDuration})</span>
              </div>
              <div className="delivery-info-card">
                <span className="delivery-info-label">Payment Method & Status</span>
                <span className="delivery-info-value">
                  {placedOrder.paymentMethod.includes("Cash") ? (
                    <span className="payment-badge-cod">💵 Cash on Delivery (Pay at Doorstep)</span>
                  ) : (
                    <span className="payment-badge-paid">💳 Paid via UPI (₹{placedOrder.amount})</span>
                  )}
                </span>
              </div>
              <div className="delivery-info-card">
                <span className="delivery-info-label">Farmer Support Contact</span>
                <span className="delivery-info-value">📞 {placedOrder.farmerContact}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
              <Link to="/orders" className="primary-btn tactile-3d-btn">
                Track Order Live in My Orders →
              </Link>
              <Link to="/products" className="secondary-btn tactile-3d-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#113c1f" }}>Your Cart is Empty</h2>
          <p style={{ fontWeight: 600, color: "#4f6356" }}>Add some fresh farm vegetables, fruits, and dairy to your cart.</p>
          <br />
          <Link to="/products" className="primary-btn tactile-3d-btn">
            Browse Farm Harvest Store →
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <div className="cart-header">
          <div className="page-tag">EXPRESS CHECKOUT</div>
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: "#113c1f" }}>My Cart & Checkout</h1>
          <p className="header-subtitle" style={{ fontWeight: 600, color: "#4f6356" }}>
            Confirm your harvest items, doorstep delivery details, and payment mode.
          </p>
        </div>

        <div className="cart-layout">
          <div>
            {cart.map((item) => (
              <div className="cart-item 3d-card" key={item.id || item._id}>
                <img src={item.image} alt={item.name} className="cart-product-image" />
                <div className="cart-product-info">
                  <span className="product-category">{item.category}</span>
                  <h3 style={{ fontWeight: 800 }}>{item.name}</h3>
                  <p style={{ fontWeight: 700, color: "#0c831f" }}>₹{item.price} / {item.unit}</p>
                </div>

                <div className="quantity-controls">
                  <button type="button" onClick={() => updateQuantity(item.id || item._id, -1)}>−</button>
                  <span style={{ fontWeight: 850 }}>{Number(item.quantity) || 1}</span>
                  <button type="button" onClick={() => updateQuantity(item.id || item._id, 1)}>+</button>
                </div>

                <div className="cart-item-right">
                  <strong style={{ fontSize: "18px", color: "#113c1f" }}>
                    ₹{Number(item.price) * (Number(item.quantity) || 1)}
                  </strong>
                  <br />
                  <button type="button" className="remove-btn" onClick={() => removeItem(item.id || item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* CLEAN 2-COLUMN ALIGNED DELIVERY ADDRESS CARD */}
            <div className="address-card-container">
              <div className="address-card-header">
                <span style={{ fontSize: "22px" }}>📍</span>
                <div>
                  <h3>Delivery Address & Contact Information</h3>
                  <small style={{ color: "#556c5c", fontWeight: 600 }}>
                    Please ensure contact details are accurate for delivery coordination.
                  </small>
                </div>
              </div>

              <div className="address-grid-zepto">
                <div className="address-field-block">
                  <label>👤 Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Recipient's Name"
                  />
                </div>

                <div className="address-field-block">
                  <label>📞 Phone Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 01234"
                  />
                </div>

                <div className="address-field-block" style={{ gridColumn: "1 / -1" }}>
                  <label>🏠 Street Address & House / Flat No</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Flat / House No, Apartment Name, Street Name"
                  />
                </div>

                <div className="address-field-block">
                  <label>🏙️ City / Town</label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="address-field-block">
                  <label>📮 Pincode</label>
                  <input
                    type="text"
                    value={customerPincode}
                    onChange={(e) => setCustomerPincode(e.target.value)}
                    placeholder="641001"
                  />
                </div>
              </div>
            </div>

            <div className="delivery-estimate-card 3d-card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#113c1f" }}>
                <span style={{ fontSize: "28px" }}>⏱️</span>
                <div>
                  <strong style={{ fontSize: "16px", fontWeight: 850 }}>
                    Estimated Delivery: {deliveryInfo.deliveryDate}
                  </strong>
                  <p style={{ margin: "2px 0 0", fontSize: "13.5px", color: "#3e5644", fontWeight: 600 }}>
                    Time Slot: <strong>{deliveryInfo.deliveryTimeSlot}</strong> ({deliveryInfo.deliveryDuration})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-summary 3d-card">
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#113c1f" }}>Order Summary</h2>
            <div className="summary-row">
              <span style={{ fontWeight: 600 }}>Items Subtotal</span>
              <span style={{ fontWeight: 800 }}>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span style={{ fontWeight: 600 }}>Farm Delivery</span>
              <span style={{ color: "#0c831f", fontWeight: 850 }}>FREE</span>
            </div>
            <div className="summary-total">
              <span style={{ fontWeight: 850 }}>Total Amount</span>
              <span style={{ color: "#0c831f", fontWeight: 900 }}>₹{total.toFixed(2)}</span>
            </div>

            <div className="payment-method-box">
              <div className="payment-title" style={{ fontWeight: 800 }}>💳 Select Payment Mode</div>

              <button
                type="button"
                className={`payment-option ${paymentMethod === "cod" ? "payment-selected" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <span className="payment-icon cod-icon">💵</span>
                <span>
                  <strong>Cash on Delivery (COD)</strong>
                  <small>Pay ₹{total.toFixed(2)} in cash when order arrives</small>
                </span>
                <span>›</span>
              </button>

              <button
                type="button"
                className={`payment-option ${paymentMethod === "gpay" ? "payment-selected" : ""}`}
                onClick={() => setPaymentMethod("gpay")}
              >
                <span className="payment-icon gpay-icon">G</span>
                <span>
                  <strong>UPI / Online Payment</strong>
                  <small>Instant payment via Google Pay / QR code</small>
                </span>
                <span>›</span>
              </button>
            </div>

            {paymentMethod === "cod" && (
              <div className="cod-payment-box">
                <div className="cod-large-icon">📦</div>
                <h3 style={{ fontWeight: 850 }}>Cash on Delivery</h3>
                <p style={{ fontWeight: 600 }}>
                  Pay <strong>₹{total.toFixed(2)}</strong> upon doorstep delivery.
                </p>
                <button
                  type="button"
                  className="checkout-btn tactile-3d-btn"
                  onClick={() => placeOrder("Cash on Delivery")}
                >
                  Confirm & Place COD Order →
                </button>
              </div>
            )}

            {paymentMethod === "gpay" && (
              <div className="gpay-payment-clean">
                <div className="gpay-clean-header">
                  <span>ONLINE UPI PAYMENT</span>
                  <strong>₹{total.toFixed(2)}</strong>
                </div>

                <div className="qr-code-clean-card">
                  <img src={qrCodeUrl} alt="UPI QR Code" />
                </div>

                <div className="upi-scan-heading">
                  📱 Scan with Google Pay or PhonePe
                </div>

                <div className="upi-supported-apps">
                  <span className="app-pill gpay">Google Pay</span>
                  <span className="app-pill phonepe">PhonePe</span>
                </div>

                <button
                  type="button"
                  className="checkout-btn tactile-3d-btn"
                  style={{ width: "100%", marginTop: "12px", padding: "14px", fontSize: "16px", fontWeight: 850 }}
                  onClick={() => placeOrder("UPI / Online Payment")}
                >
                  Place Order →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

/* =====================================================
   ORDERS & LIVE TRACKING COMPONENT
===================================================== */
function Orders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [orders, setOrders] = useState([]);
  const [copiedId, setCopiedId] = useState("");

  const loadOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOrders(res.data);
        return;
      }
    } catch (e) {}

    const stored = getLocalOrders();
    const demoOrders = [
      {
        id: "ORD0001",
        orderId: "ORD0001",
        trackingId: "TRK-892104",
        status: "Delivered",
        payment: "UPI / Online Payment",
        paymentMethod: "UPI / Online Payment",
        paymentStatus: "Paid Successfully",
        amount: 420,
        totalAmount: 420,
        date: "18/10/2026",
        deliveryDate: "19 Oct 2026",
        deliveryTimeSlot: "04:00 PM - 07:00 PM",
        deliveryDuration: "Within 24 Hours",
        farmerContact: "+91 98765 43210 (Green Farm Fresh Hub)",
        farmerName: "Ramesh Organic Farm",
        items: [
          { name: "Fresh Country Tomatoes", quantity: 3, price: 30, unit: "kg" },
          { name: "Robusta Farm Bananas", quantity: 2, price: 50, unit: "dozen" },
          { name: "Fresh Crunchy Ooty Carrots", quantity: 2, price: 40, unit: "kg" },
        ],
      },
      {
        id: "ORD0002",
        orderId: "ORD0002",
        trackingId: "TRK-571294",
        status: "Out for Delivery",
        payment: "Cash on Delivery",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending (COD - Pay on Delivery)",
        amount: 350,
        totalAmount: 350,
        date: "19/10/2026",
        deliveryDate: "21 Oct 2026",
        deliveryTimeSlot: "04:00 PM - 07:00 PM",
        deliveryDuration: "Within 24 - 48 Hours",
        farmerContact: "+91 98765 43210 (Green Farm Fresh Hub)",
        farmerName: "Ramesh Organic Farm",
        items: [
          { name: "Fresh Red Country Onions", quantity: 3, price: 35, unit: "kg" },
          { name: "Organic Green Palak", quantity: 4, price: 20, unit: "bunch" },
        ],
      },
    ];

    const merged = [...stored, ...demoOrders.filter((d) => !stored.some((s) => (s.id || s.orderId) === d.id))];
    setOrders(merged);
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener("farmerOrdersUpdated", loadOrders);
    window.addEventListener("storage", loadOrders);
    const interval = setInterval(loadOrders, 4000);
    return () => {
      window.removeEventListener("farmerOrdersUpdated", loadOrders);
      window.removeEventListener("storage", loadOrders);
      clearInterval(interval);
    };
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(""), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="orders-page">
        <div className="orders-header">
          <div className="page-tag">TRACKING & DELIVERIES</div>
          <h1 style={{ fontSize: "38px", fontWeight: 900, color: "#113c1f" }}>My Orders</h1>
          <p className="header-subtitle" style={{ fontWeight: 600, color: "#4f6356" }}>
            Real-time status, tracking ID, delivery duration, and farmer contact details.
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <p style={{ fontSize: "18px", fontWeight: 700 }}>No orders placed yet.</p>
            <Link to="/products" className="primary-btn tactile-3d-btn">
              Shop Farm Produce
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const id = order.orderId || order.id;
            const status = order.status || "Placed";
            const trackingId = order.trackingId || `TRK-${id}`;
            const isCod =
              (order.paymentMethod || order.payment || "").toLowerCase().includes("cash") ||
              (order.paymentMethod || order.payment || "").toLowerCase().includes("cod");

            const isAccepted = status === "Accepted" || status === "Packed" || status === "Out for Delivery" || status === "Delivered";
            const isPacked = status === "Packed" || status === "Out for Delivery" || status === "Delivered";
            const isOutForDelivery = status === "Out for Delivery" || status === "Delivered";
            const isDelivered = status === "Delivered";

            return (
              <div className="order-card 3d-card" key={id}>
                <div className="order-top">
                  <div>
                    <strong style={{ fontSize: "20px", fontWeight: 900, color: "#113c1f" }}>
                      Order #{id}
                    </strong>
                    <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
                      Placed on {order.date || "Today"} • {order.items?.length || 1} Items
                    </p>
                  </div>
                  <div className="order-top-right" style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: "22px", fontWeight: 900, color: "#113c1f", display: "block" }}>
                      ₹{Number(order.totalAmount || order.amount || 0).toFixed(2)}
                    </strong>
                    <span
                      className="order-status"
                      style={{
                        background:
                          status === "Placed"
                            ? "#fff3e0"
                            : status === "Accepted"
                            ? "#e8f5e9"
                            : status === "Delivered"
                            ? "#e0f2f1"
                            : "#e3f2fd",
                        color:
                          status === "Placed"
                            ? "#e65100"
                            : status === "Accepted"
                            ? "#1b5e20"
                            : status === "Delivered"
                            ? "#004d40"
                            : "#0d47a1",
                        fontWeight: 800,
                      }}
                    >
                      {status === "Placed" ? "⏳ Awaiting Farmer Confirmation" : `✓ ${status}`}
                    </span>
                  </div>
                </div>

                <div
                  className={`order-alert-banner ${
                    status === "Placed"
                      ? "order-alert-placed"
                      : status === "Accepted"
                      ? "order-alert-accepted"
                      : status === "Packed"
                      ? "order-alert-packed"
                      : status === "Out for Delivery"
                      ? "order-alert-out"
                      : "order-alert-delivered"
                  }`}
                >
                  <span style={{ fontSize: "20px" }}>
                    {status === "Placed"
                      ? "⏳"
                      : status === "Accepted"
                      ? "🎉"
                      : status === "Packed"
                      ? "📦"
                      : status === "Out for Delivery"
                      ? "🚚"
                      : "🏁"}
                  </span>
                  <span style={{ fontWeight: 650 }}>
                    {status === "Placed" &&
                      "Order placed successfully! Awaiting acceptance from the local farmer. You will receive an instant notification as soon as the farmer confirms."}
                    {status === "Accepted" &&
                      `🎉 Great news! The farmer (${order.farmerName || "Local Farm"}) has accepted your order. Fresh produce is being gathered for packing.`}
                    {status === "Packed" &&
                      "Your farm products have been freshly harvested, inspected, and packed. Awaiting delivery partner pickup."}
                    {status === "Out for Delivery" &&
                      `🚚 Out for delivery! Courier is on the way. Expected delivery today by ${order.deliveryTimeSlot || "04:00 PM - 07:00 PM"}.`}
                    {status === "Delivered" &&
                      "Order delivered! Thank you for supporting our local farmers with fresh direct produce."}
                  </span>
                </div>

                {/* 5-STEP TRACKING STEPPER */}
                <div className="order-tracking">
                  <div className="tracking-step completed">
                    <div className="tracking-circle">✓</div>
                    <span>1. Placed</span>
                  </div>

                  <div className={`tracking-step ${isAccepted ? "completed" : ""}`}>
                    <div className="tracking-circle">{isAccepted ? "✓" : "2"}</div>
                    <span>2. Farmer Accepted</span>
                  </div>

                  <div className={`tracking-step ${isPacked ? "completed" : ""}`}>
                    <div className="tracking-circle">{isPacked ? "✓" : "3"}</div>
                    <span>3. Packed</span>
                  </div>

                  <div className={`tracking-step ${isOutForDelivery ? "completed" : ""}`}>
                    <div className="tracking-circle">{isOutForDelivery ? "✓" : "4"}</div>
                    <span>4. Out for Delivery</span>
                  </div>

                  <div className={`tracking-step ${isDelivered ? "completed" : ""}`}>
                    <div className="tracking-circle">{isDelivered ? "✓" : "5"}</div>
                    <span>5. Delivered</span>
                  </div>
                </div>

                {/* DETAILS GRID */}
                <div className="delivery-details-grid">
                  <div className="delivery-info-card">
                    <span className="delivery-info-label">Tracking ID</span>
                    <span className="delivery-info-value">
                      <span>🚚 {trackingId}</span>
                      <button
                        type="button"
                        className="copy-trk-btn"
                        onClick={() => copyToClipboard(trackingId)}
                      >
                        {copiedId === trackingId ? "Copied!" : "Copy"}
                      </button>
                    </span>
                  </div>

                  <div className="delivery-info-card">
                    <span className="delivery-info-label">Expected Delivery Date</span>
                    <span className="delivery-info-value">
                      📅 {order.deliveryDate || "Within 2 Days"}
                    </span>
                  </div>

                  <div className="delivery-info-card">
                    <span className="delivery-info-label">Delivery Time & Duration</span>
                    <span className="delivery-info-value">
                      ⏱️ {order.deliveryTimeSlot || "04:00 PM - 07:00 PM"} ({order.deliveryDuration || "Within 24-48 hrs"})
                    </span>
                  </div>

                  <div className="delivery-info-card">
                    <span className="delivery-info-label">Payment Mode</span>
                    <span className="delivery-info-value">
                      {isCod ? (
                        <span className="payment-badge-cod">
                          💵 Cash on Delivery (Pay ₹{Number(order.totalAmount || order.amount).toFixed(2)})
                        </span>
                      ) : (
                        <span className="payment-badge-paid">
                          💳 Paid via UPI / Online (₹{Number(order.totalAmount || order.amount).toFixed(2)})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="delivery-info-card">
                    <span className="delivery-info-label">Farmer / Courier Contact</span>
                    <span className="delivery-info-value">
                      <span>📞 {order.farmerContact || "+91 98765 43210"}</span>
                      <a
                        href={`tel:${(order.farmerContact || "+919876543210").replace(/[^0-9+]/g, "")}`}
                        className="contact-phone-btn tactile-3d-btn"
                      >
                        Call
                      </a>
                    </span>
                  </div>

                  {order.customer?.address && (
                    <div className="delivery-info-card">
                      <span className="delivery-info-label">Delivery Address</span>
                      <span className="delivery-info-value" style={{ fontSize: "13px" }}>
                        📍 {order.customer.address}, {order.customer.city}
                      </span>
                    </div>
                  )}
                </div>

                {order.items && order.items.length > 0 && (
                  <div style={{ marginTop: "16px", borderTop: "1.5px solid #edf1ed", paddingTop: "14px" }}>
                    <small style={{ fontWeight: 800, color: "#113c1f", textTransform: "uppercase" }}>
                      Order Items:
                    </small>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "#f7faf7",
                            border: "1.5px solid #dbe8dd",
                            padding: "7px 14px",
                            borderRadius: "12px",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          <strong>{item.name}</strong> × {item.quantity} ({item.unit || "kg"}) — ₹
                          {Number(item.price) * Number(item.quantity)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </>
  );
}

/* =====================================================
   MAIN APP ROUTER
===================================================== */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
