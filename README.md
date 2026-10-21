# 🌱 Direct Farm-to-Consumer E-Commerce & Market Access Platform
## 🌐 Live Website

Click here to visit Farmer E-Commerce Website
https://farmer-e-commerce-ten.vercel.app/login

A full-stack agricultural e-commerce platform that connects local farmers directly with consumers, eliminating traditional middlemen to deliver harvest-fresh produce within a guaranteed 24–48 hour window.

Developed under the **Department of Artificial Intelligence and Data Science**.

---

## 🌟 Key Features

### 👨‍🌾 For Farmers:
1. **Interactive Produce Publish Console (`/add-product`):**
   - 2-Column Split Console featuring a **Real-Time Live Customer Store Card Preview**.
   - 1-Click **Visual Photo Gallery** with accurate high-res verified produce images (Onion, Tomato, Carrot, Potato, Cauliflower, Spinach, Banana, Cow Milk, Ponni Rice).
   - **Quick Freshness Tag Chips** (`+ 100% Organic Compost`, `+ Morning Fresh Harvest`, `+ Zero Pesticides`, `+ Direct From Field`) that append to description with one click.
   - Transparent producer earnings (100% payout with 0% middleman commission).
2. **Fulfillment & Dispatch Portal (`/dashboard`):**
   - Modern Segmented Tab Bar (**All Orders**, **Needs Acceptance**, **Accepted & In Transit**, **Delivered**).
   - 1-Click **"Accept Order"** action that instantly confirms requests and triggers packing.
   - Real-time in-app audio-visual notifications on incoming customer orders.
   - Visual revenue & order analytics: Total Sales (₹), Pending Order Requests, Total Produce Inventory.

### 🛒 For Customers:
1. **Certified Farm Harvest Store (`/products`):**
   - Blinkit / Zepto-inspired 3D tactile interface.
   - Category filter pills with icons (`🥦 Vegetables`, `🍎 Fruits`, `🌿 Leafy Greens`, `🌾 Grains`, `🥛 Dairy`, `🫘 Pulses`).
   - Authentic dual-language naming in English and Tamil:
     - *Fresh Country Tomatoes (தக்காளி)*
     - *Fresh Red Country Onions (வெங்காயம்)*
     - *Fresh Crunchy Ooty Carrots (கேரட்)*
     - *Fresh Farm Cauliflower (காலிஃபிளவர்)*
     - *Organic Green Palak / Spinach (பசலைக்கீரை)*
     - *Pure Farm Fresh Cow Milk (பசும்பால்)*
   - In-card quantity controls (`[ − ]  Qty  [ + ]`).
2. **Smart Cart & Omnichannel Checkout (`/cart`):**
   - Clean 2-column delivery address form.
   - **Cash on Delivery (COD)** with doorstep pay confirmation.
   - **UPI / Online Payment:** Clean centered QR code card compatible with Google Pay, PhonePe, Paytm, and BHIM UPI.
3. **End-to-End Live Order Tracking (`/orders`):**
   - Visual 5-step progress stepper:
     1. *Order Placed* → 2. *Accepted by Farmer* → 3. *Packed* → 4. *Out for Delivery* → 5. *Delivered*.
   - Live Tracking ID, Expected Delivery Window, and direct Farmer Support Contact.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js (v19), Vite, React Router DOM (v7), Modern 3D CSS with Tactile Animations |
| **Backend** | Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | MongoDB with Mongoose ODM |
| **Payment Flow** | UPI Deep-Link QR Generation, Dynamic COD Handling |
| **DevOps / Scripts** | Windows Batch Script (`start_project.bat`) for 1-Click startup |

---

## 📂 Project Directory Structure

```text
farmer-ecommerce/
├── backend/
│   ├── config/             # MongoDB connection configuration
│   ├── middleware/         # JWT Auth & Role-based access control
│   ├── models/             # Mongoose schemas (User, Product, Order, Notification)
│   ├── routes/             # REST API endpoints (Auth, Products, Orders, Notifications)
│   ├── .env                # Backend environment configuration
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React application & route components
│   │   ├── App.css         # Modern 3D responsive stylesheet
│   │   └── main.jsx        # React root mounting
│   ├── index.html          # HTML entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite build configuration
├── start_project.bat       # 1-Click Windows execution script
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

---

## 🚀 Quick Setup & Installation

### Option 1: 1-Click Automated Startup (Recommended on Windows)
Simply double-click:
```cmd
start_project.bat
```
This automatically launches both the **Backend API (Port 5000)** and the **Frontend Vite Server (Port 5173)** in two separate terminal windows.

---

### Option 2: Manual Terminal Startup

#### 1. Start the Backend API:
```bash
cd backend
npm install
node server.js
```
> Server runs on `http://localhost:5000` with MongoDB connected.

#### 2. Start the Frontend React App:
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
> Open your browser and navigate to: **`http://localhost:5173`**

---

## 👥 Project Team & Acknowledgements

* **Department:** Department of Artificial Intelligence and Data Science
* **Principal:** Dr. P. Deiva Sundari
* **Head of the Department:** Dr. T. KalaiSelvi
* **Project Guide:** Ms. D. S. K. Harshitha
* **Student Developer:** Shanmugapriya

---

## 📜 License
This project is developed for educational and academic submission purposes.
