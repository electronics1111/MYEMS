import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, Bell, Calendar, Users, DollarSign, UtensilsCrossed, Package, BarChart3, Building2, Smartphone, Shield, Settings, LogOut, Plus, X, Check, ChevronLeft, ChevronRight, Edit, Trash2, Eye, AlertTriangle, Clock, MapPin, Star, Phone, CreditCard, FileText, UserCheck, Truck, ChefHat, Armchair, TrendingUp, TrendingDown, Filter, Download, Upload, Printer, MessageSquare, Lock, Unlock, Activity, ArrowRight, CheckCircle, XCircle, AlertCircle, Info, Menu, Home, Layers } from "lucide-react";

// ─── SEED DATA ───
const INITIAL_HALLS = [];

const INITIAL_USERS = [
  { id: "u1", email: "owner@jalalkhan.com",   password: "owner123",   role: "owner",   name: "Owner",   hallId: null },
  { id: "u2", email: "mashal@jalalkhan.com",  password: "mashal123",  role: "manager", name: "Manager 1", hallId: null },
  { id: "u3", email: "deewa@jalalkhan.com",   password: "deewa123",   role: "manager", name: "Manager 2", hallId: null },
  { id: "u4", email: "cashier@jalalkhan.com", password: "cashier123", role: "cashier", name: "Cashier",  hallId: null },
];

const SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 AM – 2:00 PM" },
  { id: "evening", label: "Evening", time: "4:00 PM – 10:00 PM" },
  { id: "fullday", label: "Full Day", time: "8:00 AM – 10:00 PM" },
];

const EVENT_TYPES = ["Wedding", "Mehndi", "Reception", "Corporate", "Birthday", "Engagement"];

const INITIAL_PACKAGES = [
  { id: "pkg1", name: "Package 1", pricePerHead: 850, items: [
    { text: "Chawal Chana Mewa", choice: false },
    { text: "Chicken Qorma / White Meat", choice: true, options: ["Chicken Qorma", "White Meat"] },
    { text: "Dal Gosht / Aloo Gosht", choice: true, options: ["Dal Gosht", "Aloo Gosht"] },
    { text: "Suji Halwa", choice: false },
    { text: "Roti", choice: false },
    { text: "Cold Drinks", choice: false },
    { text: "Mineral Water", choice: false },
  ]},
  { id: "pkg2", name: "Package 2", pricePerHead: 1050, items: [
    { text: "Kabuli Pulao / Narinj Pulao", choice: true, options: ["Kabuli Pulao", "Narinj Pulao"] },
    { text: "Chicken Dhaka", choice: false },
    { text: "Seekh Kabab", choice: false },
    { text: "White Meat / Beef Qorma", choice: true, options: ["White Meat", "Beef Qorma"] },
    { text: "Saag Paneer", choice: false },
    { text: "Halwa", choice: false },
    { text: "Roti", choice: false },
    { text: "Cold Drinks", choice: false },
    { text: "Mineral Water", choice: false },
  ]},
  { id: "pkg3", name: "Package 3", pricePerHead: 1200, items: [
    { text: "Kabuli Pulao / Narinj Pulao", choice: true, options: ["Kabuli Pulao", "Narinj Pulao"] },
    { text: "Chicken Dhaka", choice: false },
    { text: "Seekh Kabab", choice: false },
    { text: "White Meat / Beef Qorma", choice: true, options: ["White Meat", "Beef Qorma"] },
    { text: "Kofta Curry", choice: false },
    { text: "Kheer / Muraba", choice: true, options: ["Kheer", "Muraba"] },
    { text: "Cold Drinks", choice: false },
    { text: "Mineral Water", choice: false },
    { text: "Roti", choice: false },
    { text: "Fresh Salad", choice: false },
  ]},
];

const DEFAULT_EXTRA_SERVICES = [
  { key: "dj", label: "DJ / Sound System", amount: 0, enabled: true, free: false },
  { key: "stage", label: "Stage Setup", amount: 0, enabled: true, free: false },
  { key: "decoration", label: "Floor Decoration", amount: 0, enabled: true, free: false },
  { key: "lighting", label: "Lighting", amount: 0, enabled: true, free: false },
  { key: "camera", label: "Camera / Photography", amount: 0, enabled: false, free: false },
  { key: "video", label: "Videography", amount: 0, enabled: false, free: false },
  { key: "flowers", label: "Flower Arrangement", amount: 0, enabled: false, free: false },
  { key: "generator", label: "Generator", amount: 0, enabled: false, free: false },
];

const STAFF_ROLES = ["Waiter", "Chef", "Security", "Manager", "Cleaner", "Electrician"];
const VENDOR_TYPES = ["DJ", "Lighting", "Decoration", "Flowers", "Photography", "Videography"];

const genId = () => Math.random().toString(36).substr(2, 9);
const fmt = (n) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });

const today = new Date();
const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function generateSeedBookings() {
  const bookings = [];
  const names = ["Ali Raza", "Hassan Sheikh", "Usman Malik", "Tariq Mehmood", "Kamran Younus", "Noman Ahmed", "Waqar Zafar", "Imran Siddiqui", "Junaid Akhtar", "Shahid Hussain", "Farhan Latif", "Asad Bukhari"];
  const phones = ["0300-1234567", "0321-9876543", "0333-4567890", "0345-6789012", "0312-3456789", "0301-5678901", "0322-8901234", "0334-2345678", "0346-7890123", "0313-4561237", "0302-7894561", "0323-1237894"];
  const statuses = ["confirmed", "confirmed", "confirmed", "pending", "pending", "cancelled"];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + Math.floor(Math.random() * 60) - 15);
    const hall = INITIAL_HALLS[i % 2];
    const slot = SLOTS[i % 3];
    const pkg = INITIAL_PACKAGES[i % 3];
    const guests = 100 + Math.floor(Math.random() * 400);
    const hallRent = hall.priceBase + Math.floor(Math.random() * 5) * 10000;
    const customPrice = i % 3 === 0 ? pkg.pricePerHead - 50 : pkg.pricePerHead;
    const total = hallRent + guests * customPrice;
    const paid = statuses[i % 6] === "cancelled" ? 0 : Math.floor(total * (0.3 + Math.random() * 0.7));
    bookings.push({
      id: genId(), customerName: names[i], customerPhone: phones[i], customerCNIC: `35201-${1234567 + i * 111}-${i}`,
      hallId: hall.id, slotId: slot.id, eventType: EVENT_TYPES[i % 6], date: toISO(d),
      packageId: pkg.id, guests, hallRent, customPricePerHead: customPrice, totalAmount: total, paidAmount: paid,
      status: statuses[i % 6], notes: "", createdAt: toISO(new Date(d.getTime() - 7 * 86400000)),
      discount: i % 4 === 0 ? 10000 : 0, paymentMethod: ["Cash", "Bank Transfer", "Easypaisa", "JazzCash"][i % 4],
      extraServices: DEFAULT_EXTRA_SERVICES.map((s) => ({ ...s })), customServices: [],
      menuChoices: {}, choicesFinalized: statuses[i % 6] === "confirmed",
      expenses: [],
    });
  }
  return bookings;
}

function generateStaff() {
  const staff = [];
  const names = ["Aslam", "Bashir", "Chacha Noor", "Danish", "Ehsan", "Fayyaz", "Ghulam", "Habib", "Irfan", "Javed"];
  names.forEach((n, i) => staff.push({ id: genId(), name: n, role: STAFF_ROLES[i % 6], phone: `030${i}-111222${i}`, salary: 15000 + i * 5000, status: "active" }));
  return staff;
}

function generateVendors() {
  return VENDOR_TYPES.map((t, i) => ({ id: genId(), name: `${t} Pro Services`, type: t, phone: `031${i}-999888${i}`, rate: 20000 + i * 15000, rating: 3.5 + (i % 3) * 0.5 }));
}

function generateSuppliers() {
  const suppliers = [
    { name: "Khan Chicken Supplier", type: "Chicken", phone: "0300-1112233", address: "Main Bazar, Charsadda" },
    { name: "Haji Meat House", type: "Beef/Mutton", phone: "0321-4445566", address: "GT Road, Peshawar" },
    { name: "Peshawar Rice Traders", type: "Rice/Grocery", phone: "0333-7778899", address: "Karkhano Market" },
    { name: "Fresh Vegetables Center", type: "Vegetables", phone: "0345-1234567", address: "Sabzi Mandi, Charsadda" },
    { name: "Cold Drinks Distributor", type: "Beverages", phone: "0312-9876543", address: "Industrial Area" },
    { name: "Gas & Fuel Agency", type: "Gas/Fuel", phone: "0301-5556677", address: "Mardan Road" },
  ];
  return suppliers.map((s, i) => ({
    id: genId(), ...s, status: "active",
    ledger: [
      { id: genId(), date: toISO(new Date(today.getTime() - (30 - i * 5) * 86400000)), description: "Monthly supply bill", billAmount: 50000 + i * 15000, paidAmount: 30000 + i * 10000, method: "Cash" },
      { id: genId(), date: toISO(new Date(today.getTime() - (15 - i * 2) * 86400000)), description: "Event supply", billAmount: 25000 + i * 8000, paidAmount: 25000 + i * 8000, method: "Bank Transfer" },
    ],
  }));
}

function generateInventory() {
  const items = [
    { name: "Chairs (Gold)", qty: 600, minQty: 100, owned: true, damaged: 12 },
    { name: "Chairs (White)", qty: 400, minQty: 80, owned: true, damaged: 8 },
    { name: "Round Tables", qty: 80, minQty: 20, owned: true, damaged: 2 },
    { name: "Rectangular Tables", qty: 40, minQty: 10, owned: true, damaged: 1 },
    { name: "Fine China Plates", qty: 800, minQty: 200, owned: true, damaged: 35 },
    { name: "Glass Sets", qty: 600, minQty: 150, owned: true, damaged: 20 },
    { name: "Table Cloths", qty: 120, minQty: 30, owned: true, damaged: 5 },
    { name: "Stage Setup", qty: 3, minQty: 1, owned: true, damaged: 0 },
    { name: "Sound System", qty: 4, minQty: 2, owned: true, damaged: 0 },
    { name: "LED Wall Panel", qty: 6, minQty: 2, owned: false, damaged: 0 },
    { name: "Flower Vases", qty: 150, minQty: 40, owned: true, damaged: 8 },
    { name: "Candle Holders", qty: 200, minQty: 50, owned: true, damaged: 3 },
  ];
  return items.map((it) => ({ id: genId(), ...it }));
}

function generateAuditLog() {
  const actions = [
    { user: "Ahmed Khan", action: "Created booking for Ali Raza", module: "Booking" },
    { user: "Bilal Shah", action: "Updated payment for Hassan Sheikh", module: "Billing" },
    { user: "Ahmed Khan", action: "Added staff member Danish", module: "Staff" },
    { user: "Faisal Ali", action: "Recorded payment PKR 50,000", module: "Billing" },
    { user: "Bilal Shah", action: "Cancelled booking #4521", module: "Booking" },
    { user: "Ahmed Khan", action: "Updated inventory: Chairs -20", module: "Inventory" },
    { user: "Ahmed Khan", action: "Generated monthly report", module: "Reports" },
    { user: "Bilal Shah", action: "Assigned staff to event #3312", module: "Staff" },
  ];
  return actions.map((a, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return { id: genId(), ...a, timestamp: d.toISOString() };
  });
}

// ─── PERMISSION MATRIX ───
const PERMISSIONS = {
  owner: { booking: "full", calendar: "full", crm: "full", billing: "full", catering: "full", staff: "full", inventory: "full", reports: "full", multiHall: "full", mobile: "full", admin: "full", settings: "full", dailyExpenses: "full", monthlyExpenses: "full", netProfit: "full" },
  manager: { booking: "full", calendar: "full", crm: "view", billing: "full", catering: "full", staff: "view", inventory: "full", reports: "view", multiHall: "view", mobile: "full", admin: "none", settings: "none", dailyExpenses: "full", monthlyExpenses: "none", netProfit: "none" },
  cashier: { booking: "view", calendar: "view", crm: "none", billing: "full", catering: "none", staff: "none", inventory: "none", reports: "none", multiHall: "none", mobile: "none", admin: "none", settings: "none", dailyExpenses: "none", monthlyExpenses: "none", netProfit: "none" },
};

// ─── STYLES ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

:root {
  /* ═══ MODERN SLATE THEME (Light) ═══ */
  /* Primary accent — slate (replaces gold) */
  --gold: #334155;
  --gold-light: #475569;
  --gold-dark: #1e293b;
  /* Pop accent — vibrant orange (used on key CTAs) */
  --pop: #f97316;
  --pop-dark: #c2410c;
  /* Surfaces — light hierarchy (replaces navy/charcoal) */
  --navy: #ffffff;          /* primary surface (cards, sidebar) */
  --navy-light: #f8fafc;    /* secondary surface */
  --navy-lighter: #f1f5f9;  /* tertiary surface */
  --charcoal: #f8fafc;      /* page background */
  /* Text */
  --slate: #64748b;          /* secondary/muted text */
  --cream: #1e293b;          /* primary text on light bg */
  --white: #0f172a;          /* heading text */
  /* Status colors — slightly darkened for readability on light bg */
  --green: #059669;
  --green-bg: rgba(5, 150, 105, 0.10);
  --red: #dc2626;
  --red-bg: rgba(220, 38, 38, 0.08);
  --yellow: #d97706;
  --yellow-bg: rgba(217, 119, 6, 0.10);
  --blue: #2563eb;
  --blue-bg: rgba(37, 99, 235, 0.08);
  --sidebar-w: 260px;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05);
}

* { margin:0; padding:0; box-sizing:border-box; }

body, #root {
  font-family: 'DM Sans', sans-serif;
  background: var(--charcoal);
  color: var(--cream);
  min-height: 100vh;
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN — Professional split-screen design
   ═══════════════════════════════════════════════════════════════ */
.login-page {
  min-height:100vh; display:flex;
  background: var(--charcoal);
  position: relative; overflow: hidden;
}

/* Left panel — branding side */
.login-brand {
  flex: 1.1;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 48px 56px;
  background:
    radial-gradient(circle at 30% 20%, rgba(148, 163, 184, 0.35), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(91,141,239,0.12), transparent 55%),
    linear-gradient(135deg, #0a0e1a 0%, #14182a 100%);
  position: relative;
  overflow: hidden;
}
.login-brand::before {
  content:''; position:absolute; top:-30%; right:-20%; width:60vh; height:60vh;
  border-radius:50%; border:1px solid rgba(148, 163, 184, 0.20);
  pointer-events: none;
}
.login-brand::after {
  content:''; position:absolute; bottom:-20%; left:-15%; width:45vh; height:45vh;
  border-radius:50%; border:1px solid rgba(148, 163, 184, 0.15);
  pointer-events: none;
}
.login-brand-header { position: relative; z-index: 2; }
.login-brand-logo {
  display: flex; align-items: center; gap: 12px;
  font-family:'Playfair Display',serif; font-size: 28px; color: var(--pop);
  font-weight: 700; letter-spacing: -0.5px;
}
.login-brand-logo-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: linear-gradient(135deg, var(--pop) 0%, var(--pop-dark) 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: #ffffff; box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
}

.login-brand-content { position: relative; z-index: 2; max-width: 520px; }
.login-brand-title {
  font-family:'Playfair Display',serif; font-size: 44px; line-height: 1.15;
  color: #f8fafc; margin-bottom: 20px; font-weight: 700; letter-spacing: -1px;
}
.login-brand-title em { font-style: normal; color: var(--pop); }
.login-brand-subtitle {
  font-size: 16px; line-height: 1.6; color: #94a3b8;
  margin-bottom: 32px; max-width: 460px;
}

.login-brand-stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  padding-top: 28px; border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.login-brand-stat-num {
  font-family:'Playfair Display',serif; font-size: 28px; color: var(--pop);
  font-weight: 700; line-height: 1;
}
.login-brand-stat-label { font-size: 12px; color: #94a3b8; margin-top: 6px; letter-spacing: 0.5px; }

.login-brand-footer {
  position: relative; z-index: 2; font-size: 12px; color: #94a3b8; opacity: 0.6;
}

/* Right panel — login form side */
.login-form-side {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  padding: 48px;
  background: var(--charcoal);
}
.login-form {
  width: 100%; max-width: 420px;
}
.login-form-header { margin-bottom: 36px; }
.login-form-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 2px;
  color: var(--pop); text-transform: uppercase; margin-bottom: 8px;
}
.login-form-title {
  font-family:'Playfair Display',serif; font-size: 32px; color: var(--white);
  margin-bottom: 8px; line-height: 1.2; letter-spacing: -0.5px;
}
.login-form-subtitle { font-size: 14px; color: var(--slate); }

/* Role selector cards */
.login-role-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px;
}
.login-role-card {
  display: flex; flex-direction: column; gap: 4px;
  padding: 14px 14px; border-radius: 10px; cursor: pointer;
  background: var(--navy); border: 1.5px solid rgba(15, 23, 42, 0.10);
  transition: all 0.18s ease;
  position: relative;
}
.login-role-card:hover { background: var(--navy-light); border-color: rgba(15, 23, 42, 0.20); }
.login-role-card.active {
  background: rgba(249, 115, 22, 0.06); border-color: var(--pop);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.10);
}
.login-role-card-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(15, 23, 42, 0.05); display: flex; align-items: center; justify-content: center;
  font-size: 16px; margin-bottom: 4px;
}
.login-role-card.active .login-role-card-icon {
  background: var(--pop); color: #ffffff;
}
.login-role-card-name { font-size: 13px; font-weight: 600; color: var(--cream); }
.login-role-card.active .login-role-card-name { color: var(--pop-dark); }
.login-role-card-scope { font-size: 10px; color: var(--slate); letter-spacing: 0.3px; }

/* Form fields */
.login-field { margin-bottom: 18px; }
.login-field-label {
  display: block; font-size: 12px; font-weight: 600; color: var(--cream);
  margin-bottom: 8px; letter-spacing: 0.3px;
}
.login-input-wrap { position: relative; }
.login-input {
  width: 100%; padding: 12px 14px; padding-right: 42px;
  background: var(--navy); border: 1.5px solid rgba(15, 23, 42, 0.12);
  border-radius: 10px; color: var(--white); font-size: 14px;
  outline: none; transition: all 0.15s; font-family: inherit;
  box-sizing: border-box;
}
.login-input::placeholder { color: var(--slate); opacity: 0.6; }
.login-input:focus {
  border-color: var(--pop); background: var(--navy);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.10);
}
.login-input-icon-btn {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  background: transparent; border: none; cursor: pointer;
  width: 30px; height: 30px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--slate); transition: all 0.15s;
}
.login-input-icon-btn:hover { background: rgba(15, 23, 42, 0.06); color: var(--pop); }

.login-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
.login-checkbox-label {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  font-size: 13px; color: var(--slate); user-select: none;
}
.login-checkbox-label input[type="checkbox"] {
  width: 16px; height: 16px; accent-color: var(--pop); cursor: pointer;
}
.login-forgot {
  font-size: 13px; color: var(--pop); text-decoration: none;
  background: transparent; border: none; cursor: pointer; font-family: inherit;
  padding: 0;
}
.login-forgot:hover { text-decoration: underline; }

.login-btn {
  width: 100%; padding: 13px; font-size: 14px; font-weight: 700;
  background: linear-gradient(135deg, var(--pop) 0%, var(--pop-dark) 100%);
  color: #ffffff; border: none; border-radius: 10px; cursor: pointer;
  letter-spacing: 0.3px; transition: all 0.18s; font-family: inherit;
  box-shadow: 0 4px 14px rgba(249, 115, 22, 0.30);
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.login-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249, 115, 22, 0.45); }
.login-btn:active { transform: translateY(0); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.login-alert {
  padding: 10px 12px; border-radius: 8px; font-size: 13px;
  margin-bottom: 16px; display: flex; align-items: flex-start; gap: 8px;
}
.login-alert-error {
  background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2);
  color: #b91c1c;
}
.login-alert-warn {
  background: rgba(217, 119, 6, 0.08); border: 1px solid rgba(217, 119, 6, 0.2);
  color: #b45309;
}
.login-alert-info {
  background: rgba(37, 99, 235, 0.06); border: 1px solid rgba(37, 99, 235, 0.2);
  color: #1d4ed8;
}

/* Divider with text */
.login-divider {
  display: flex; align-items: center; gap: 12px; margin: 24px 0;
  font-size: 11px; color: var(--slate); text-transform: uppercase; letter-spacing: 1px;
}
.login-divider::before, .login-divider::after {
  content: ''; flex: 1; height: 1px; background: rgba(15, 23, 42, 0.10);
}

.login-credentials-box {
  margin-top: 20px; padding: 14px 16px;
  background: var(--navy-lighter); border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
}
.login-credentials-title {
  font-size: 11px; color: var(--pop); font-weight: 700; letter-spacing: 1.2px;
  margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
}
.login-credentials-list { font-size: 12px; color: var(--slate); line-height: 1.9; }
.login-credentials-list code {
  background: var(--navy); padding: 2px 7px; border-radius: 4px;
  font-size: 11px; color: var(--cream); font-family: 'SF Mono', Menlo, monospace;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

/* Mobile responsive — single column on smaller screens */
@media (max-width: 900px) {
  .login-page { flex-direction: column; }
  .login-brand {
    flex: none; padding: 32px 24px; min-height: 200px;
  }
  .login-brand-stats { display: none; }
  .login-brand-title { font-size: 28px; margin-bottom: 8px; }
  .login-brand-subtitle { font-size: 14px; margin-bottom: 0; }
  .login-form-side { flex: 1; padding: 32px 24px; }
  .login-form-title { font-size: 24px; }
}

.app-layout { display:flex; min-height:100vh; }

.sidebar {
  width:var(--sidebar-w); background:var(--navy); border-right:1px solid rgba(15, 23, 42, 0.08);
  display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:100;
  transition: transform .3s;
}
.sidebar-header { padding:24px 20px 20px; border-bottom:1px solid rgba(15, 23, 42, 0.06); }
.sidebar-header h2 { font-family:'Playfair Display',serif; font-size:18px; color:var(--cream); line-height:1.2; }
.sidebar-header .user-info { display:flex; align-items:center; gap:10px; margin-top:14px; padding:10px; background:var(--navy-light); border-radius:var(--radius-sm); }
.sidebar-header .user-info .avatar { width:36px; height:36px; border-radius:50%; background:var(--pop); display:flex; align-items:center; justify-content:center; font-weight:700; color:#ffffff; font-size:14px; }
.sidebar-header .user-info span { font-size:13px; color:var(--cream); }
.sidebar-header .user-info small { display:block; font-size:11px; color:var(--pop); text-transform:uppercase; letter-spacing:1px; }

.sidebar-nav { flex:1; padding:12px 10px; overflow-y:auto; }
.sidebar-nav button {
  width:100%; display:flex; align-items:center; gap:12px; padding:11px 14px; border:none;
  background:transparent; color:var(--slate); font-size:14px; border-radius:var(--radius-sm);
  cursor:pointer; transition:all .15s; text-align:left; font-family:inherit;
}
.sidebar-nav button:hover { background:var(--navy-light); color:var(--cream); }
.sidebar-nav button.active { background:rgba(249, 115, 22, 0.10); color:var(--pop); font-weight:600; }
.sidebar-nav button svg { width:18px; height:18px; flex-shrink:0; }
.sidebar-nav .section-label { font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:var(--slate); padding:16px 14px 6px; opacity:.7; }

.sidebar-footer { padding:12px 10px; border-top:1px solid rgba(15, 23, 42, 0.06); }
.sidebar-footer button { width:100%; display:flex; align-items:center; gap:10px; padding:10px 14px; border:none; background:transparent; color:var(--red); font-size:14px; cursor:pointer; border-radius:var(--radius-sm); font-family:inherit; }
.sidebar-footer button:hover { background:var(--red-bg); }

.main-content { margin-left:var(--sidebar-w); flex:1; min-height:100vh; }
.topbar {
  position:sticky; top:0; z-index:50; padding:16px 28px; display:flex; align-items:center; justify-content:space-between;
  background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); border-bottom:1px solid rgba(15, 23, 42, 0.08);
}
.topbar h1 { font-family:'Playfair Display',serif; font-size:22px; color:var(--cream); }
.topbar-actions { display:flex; align-items:center; gap:12px; }
.topbar .hall-select {
  padding:8px 14px; background:var(--navy); border:1px solid rgba(15, 23, 42, 0.12); border-radius:var(--radius-sm);
  color:var(--cream); font-size:13px; outline:none; cursor:pointer;
}
.topbar .icon-btn {
  width:38px; height:38px; border-radius:50%; border:1px solid rgba(15, 23, 42, 0.10); background:var(--navy);
  display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--slate); transition:all .15s;
}
.topbar .icon-btn:hover { border-color:var(--pop); color:var(--pop); }
.topbar .mobile-menu-btn { display:none; }

.page-content { padding:24px 28px; }

/* Cards */
.card { background:var(--navy); border:1px solid rgba(15, 23, 42, 0.06); border-radius:var(--radius); padding:20px; box-shadow: var(--shadow-sm); }
.card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.card-header h3 { font-family:'Playfair Display',serif; font-size:16px; color:var(--cream); }

/* Stat cards */
.stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px,1fr)); gap:16px; margin-bottom:24px; }
.stat-card {
  background:var(--navy); border:1px solid rgba(15, 23, 42, 0.06); border-radius:var(--radius); padding:20px;
  display:flex; align-items:flex-start; gap:14px; transition:border-color .2s;
  box-shadow: var(--shadow-sm);
}
.stat-card:hover { border-color:rgba(15, 23, 42, 0.15); }
.stat-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.stat-card .stat-value { font-size:24px; font-weight:700; color:var(--cream); font-family:'Playfair Display',serif; }
.stat-card .stat-label { font-size:12px; color:var(--slate); margin-top:2px; }
.stat-card .stat-change { font-size:11px; margin-top:4px; display:flex; align-items:center; gap:3px; }

/* Tables */
.data-table { width:100%; border-collapse:separate; border-spacing:0; }
.data-table th {
  text-align:left; padding:10px 14px; font-size:11px; text-transform:uppercase; letter-spacing:1px;
  color:var(--slate); border-bottom:1px solid rgba(15, 23, 42, 0.08); font-weight:600;
  background: var(--navy-light);
}
.data-table td { padding:12px 14px; font-size:13px; border-bottom:1px solid rgba(15, 23, 42, 0.05); color:var(--cream); }
.data-table tr:hover td { background:rgba(15, 23, 42, 0.04); }

/* Badges */
.badge {
  display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600;
}
.badge-green { background:var(--green-bg); color:var(--green); }
.badge-yellow { background:var(--yellow-bg); color:var(--yellow); }
.badge-red { background:var(--red-bg); color:var(--red); }
.badge-blue { background:var(--blue-bg); color:var(--blue); }

/* Buttons */
.btn {
  display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:var(--radius-sm);
  font-size:13px; font-weight:600; border:none; cursor:pointer; transition:all .15s; font-family:inherit;
}
.btn-gold { background:var(--pop); color:#ffffff; }
.btn-gold:hover { background:var(--pop-dark); }
.btn-outline { background:transparent; border:1px solid rgba(15, 23, 42, 0.15); color:var(--cream); }
.btn-outline:hover { background:var(--navy-light); border-color:var(--gold); }
.btn-sm { padding:6px 12px; font-size:12px; }
.btn-danger { background:var(--red-bg); color:var(--red); border:1px solid rgba(220, 38, 38, 0.20); }
.btn-danger:hover { background:rgba(220, 38, 38, 0.12); }
.btn-icon { width:32px; height:32px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-sm); background:var(--navy-light); border:1px solid rgba(15, 23, 42, 0.08); color:var(--slate); cursor:pointer; }
.btn-icon:hover { color:var(--pop); border-color:rgba(249, 115, 22, 0.30); background:rgba(249, 115, 22, 0.05); }

/* Modal */
.modal-overlay {
  position:fixed; inset:0; background:rgba(15, 23, 42, 0.5); backdrop-filter:blur(4px); z-index:200;
  display:flex; align-items:center; justify-content:center; padding:20px;
}
.modal {
  background:var(--navy); border:1px solid rgba(15, 23, 42, 0.08); border-radius:16px;
  width:560px; max-width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(15, 23, 42, 0.18);
}
.modal-header { padding:20px 24px; border-bottom:1px solid rgba(15, 23, 42, 0.06); display:flex; align-items:center; justify-content:space-between; }
.modal-header h2 { font-family:'Playfair Display',serif; font-size:18px; color:var(--cream); }
.modal-body { padding:24px; }
.modal-footer { padding:16px 24px; border-top:1px solid rgba(15, 23, 42, 0.06); display:flex; justify-content:flex-end; gap:10px; }

/* Form */
.form-group { margin-bottom:18px; }
.form-group label { display:block; font-size:12px; font-weight:600; color:var(--slate); margin-bottom:6px; text-transform:uppercase; letter-spacing:.8px; }
.form-input {
  width:100%; padding:10px 14px; background:var(--navy); border:1px solid rgba(15, 23, 42, 0.12);
  border-radius:var(--radius-sm); color:var(--white); font-size:14px; outline:none; font-family:inherit;
}
.form-input:focus { border-color:var(--pop); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.10); }
select.form-input { cursor:pointer; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

/* Calendar */
.calendar-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
.calendar-header-cell { text-align:center; font-size:11px; color:var(--slate); padding:8px 0; font-weight:600; text-transform:uppercase; }
.calendar-cell {
  aspect-ratio:1; border-radius:var(--radius-sm); display:flex; flex-direction:column; align-items:center;
  justify-content:flex-start; padding:6px 4px; font-size:13px; cursor:pointer; border:1px solid transparent;
  transition:all .15s; position:relative; overflow:hidden;
}
.calendar-cell:hover { border-color:rgba(148, 163, 184, 0.55); }
.calendar-cell.today { border-color:var(--gold); }
.calendar-cell.other-month { opacity:.3; }
.calendar-cell .day-num { font-weight:600; margin-bottom:2px; }
.calendar-cell .dots { display:flex; gap:2px; flex-wrap:wrap; justify-content:center; }
.calendar-cell .dot { width:6px; height:6px; border-radius:50%; }

/* Tabs */
.tabs { display:flex; gap:2px; margin-bottom:20px; background:var(--navy-light); border-radius:var(--radius-sm); padding:3px; }
.tab-btn {
  flex:1; padding:9px 16px; border:none; background:transparent; color:var(--slate); font-size:13px;
  font-weight:500; cursor:pointer; border-radius:6px; transition:all .15s; font-family:inherit; white-space:nowrap;
}
.tab-btn.active { background:var(--navy); color:var(--pop); font-weight:600; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06); }

/* Chart placeholder */
.chart-bar-container { display:flex; align-items:flex-end; gap:8px; height:200px; padding:10px 0; }
.chart-bar { flex:1; border-radius:6px 6px 0 0; transition:height .5s ease; position:relative; min-width:20px; }
.chart-bar-label { position:absolute; bottom:-22px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--slate); white-space:nowrap; }
.chart-bar-value { position:absolute; top:-20px; left:50%; transform:translateX(-50%); font-size:11px; color:var(--cream); font-weight:600; }

.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px,1fr)); gap:16px; }

.notification-toast {
  position:fixed; top:24px; right:24px; z-index:999; background:var(--navy); border:1px solid rgba(15, 23, 42, 0.10);
  border-radius:var(--radius); padding:14px 20px; display:flex; align-items:center; gap:10px;
  box-shadow:0 12px 32px rgba(15, 23, 42, 0.15); animation:slideIn .3s ease;
}
@keyframes slideIn { from { transform:translateX(100px); opacity:0; } to { transform:translateX(0); opacity:1; } }

.scroll-table { overflow-x:auto; }

.empty-state { text-align:center; padding:40px 20px; color:var(--slate); }
.empty-state svg { margin-bottom:12px; opacity:.4; }
.empty-state p { font-size:14px; }

.progress-bar { height:6px; background:var(--navy-lighter); border-radius:3px; overflow:hidden; }
.progress-fill { height:100%; border-radius:3px; transition:width .5s ease; }

.whatsapp-msg {
  background: #075E54; border-radius: var(--radius); padding: 14px 18px; color: #E8E8E8; font-size: 13px;
  line-height: 1.6; max-width: 400px; position: relative;
}
.whatsapp-msg::before { content:''; position:absolute; top:12px; left:-8px; border:8px solid transparent; border-right-color:#075E54; }

@media (max-width:768px) {
  .sidebar { transform:translateX(-100%); }
  .sidebar.open { transform:translateX(0); }
  .main-content { margin-left:0; }
  .topbar .mobile-menu-btn { display:flex; }
  .stats-grid { grid-template-columns:1fr 1fr; }
  .grid-2, .grid-3 { grid-template-columns:1fr; }
  .form-row { grid-template-columns:1fr; }
  .modal { width:100%; }
  .page-content { padding:16px; }
}
`;

// ─── COMPONENTS ───
function Badge({ type, children }) {
  const cls = { confirmed: "badge-green", pending: "badge-yellow", cancelled: "badge-red", active: "badge-green", inactive: "badge-red", low: "badge-red", ok: "badge-green", vip: "badge-gold" }[type] || "badge-blue";
  return <span className={`badge ${cls}`}>{children}</span>;
}

function Modal({ title, onClose, children, footer, wide }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={wide ? { width: 900, maxWidth: "95vw" } : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, value, label, change, changeType }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: iconBg || "rgba(148, 163, 184, 0.28)" }}>
        <Icon size={20} style={{ color: iconBg ? "#fff" : "var(--gold)" }} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && (
          <div className="stat-change" style={{ color: changeType === "up" ? "var(--green)" : "var(--red)" }}>
            {changeType === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {change}
          </div>
        )}
      </div>
    </div>
  );
}

function BarChart({ data, maxVal }) {
  const max = maxVal || Math.max(...data.map((d) => d.value));
  return (
    <div className="chart-bar-container">
      {data.map((d, i) => (
        <div key={i} className="chart-bar" style={{ height: `${(d.value / max) * 100}%`, background: d.color || "var(--gold)" }}>
          <span className="chart-bar-value">{typeof d.value === "number" && d.value > 999 ? `${(d.value / 1000).toFixed(0)}k` : d.value}</span>
          <span className="chart-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--navy-light)", borderRadius: 8, border: "1px solid rgba(148, 163, 184, 0.25)" }}>
      <Clock size={14} style={{ color: "var(--gold)" }} />
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--cream)" }}>{now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
        <div style={{ fontSize: 10, color: "var(--gold)", fontWeight: 500 }}>{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function WeddingHallApp() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", role: "owner" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [selectedHall, setSelectedHall] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // ═══════════════════════════════════════════════════════════════
  // PERSISTENT STORAGE — DUAL MODE
  //
  // Mode A: Backend API (when running via http://localhost:5000)
  //   → Data saved to server's database.json file
  //   → Multiple devices on same network share the same data
  //
  // Mode B: localStorage (when opened as file:// from disk)
  //   → Data saved to browser's localStorage
  //   → Single-device only, but works offline with no server
  //
  // The system auto-detects which mode is available and uses it
  // transparently. The frontend code is identical in both cases.
  // ═══════════════════════════════════════════════════════════════
  const STORAGE_KEY = "jalal_khan_whms_data_v2";
  const STORAGE_META_KEY = "jalal_khan_whms_meta_v2";

  // Detect if a backend is reachable (only when served via http://, not file://)
  const apiBase = useMemo(() => {
    if (typeof window === "undefined") return null;
    if (window.location.protocol === "file:") return null;
    return window.location.origin + "/api";
  }, []);

  const [storageMode, setStorageMode] = useState("localStorage"); // "cloud" | "localStorage"
  const [backendReady, setBackendReady] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);  // server version we've synced to
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [syncStatus, setSyncStatus] = useState("idle");  // "idle" | "saving" | "synced" | "error"

  // Auth token (cloud mode) — declared early because the data sync effects use it
  const [authToken, setAuthToken] = useState(() => {
    try {
      // Check both — sessionStorage takes priority (current session)
      return sessionStorage.getItem("jh_token") || localStorage.getItem("jh_token") || null;
    } catch (e) { return null; }
  });

  const handleLogout = useCallback(() => {
    try { localStorage.removeItem("jh_token"); } catch (e) {}
    try { sessionStorage.removeItem("jh_token"); } catch (e) {}
    try { localStorage.removeItem("jh_session"); } catch (e) {}
    try { sessionStorage.removeItem("jh_session"); } catch (e) {}
    setAuthToken(null);
    setUser(null);
  }, []);

  // Notify needs to be available before data sync effects (forward declaration)
  const notify = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // On first mount, ping the backend to detect cloud mode
  useEffect(() => {
    let cancelled = false;
    if (!apiBase) {
      setBackendReady(true);
      return;
    }
    (async () => {
      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 2500);
        const r = await fetch(apiBase + "/health", { signal: ctrl.signal });
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error("not OK");
        // Verify the response is actually JSON (not HTML from a static server)
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) throw new Error("not JSON");
        const data = await r.json();
        if (!data || data.status !== "ok") throw new Error("invalid response");
        if (!cancelled) setStorageMode("cloud");
      } catch (e) {
        if (!cancelled) setStorageMode("localStorage");
      } finally {
        if (!cancelled) setBackendReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [apiBase]);

  // Load persisted data on first mount (returns the value if found, else fallback)
  const loadPersisted = (key, fallback) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return typeof fallback === "function" ? fallback() : fallback;
      const all = JSON.parse(raw);
      if (all && Object.prototype.hasOwnProperty.call(all, key)) return all[key];
    } catch (e) { console.warn("Load failed for", key, e); }
    return typeof fallback === "function" ? fallback() : fallback;
  };

  // Migration: ensure all users have an email field (for users saved before email-login update)
  const migrateUsers = (arr) => {
    if (!Array.isArray(arr)) return INITIAL_USERS;
    return arr.map((u) => {
      if (!u) return u;
      if (u.email && u.email.trim()) return u;
      // Derive an email from the username if missing
      const base = (u.username || u.name || "user").toString().toLowerCase().replace(/[^a-z0-9]/g, "");
      return { ...u, email: `${base || "user"}@jalalkhan.com` };
    });
  };

  // Data State (loaded from localStorage on first run, falls back to seed data)
  const [users, setUsers] = useState(() => migrateUsers(loadPersisted("users", INITIAL_USERS)));
  const [halls, setHalls] = useState(() => loadPersisted("halls", INITIAL_HALLS));
  const [bookings, setBookings] = useState(() => loadPersisted("bookings", []));
  const [packages, setPackages] = useState(() => loadPersisted("packages", INITIAL_PACKAGES));
  const [staff, setStaff] = useState(() => loadPersisted("staff", []));
  const [vendors, setVendors] = useState(() => loadPersisted("vendors", []));
  const [suppliers, setSuppliers] = useState(() => loadPersisted("suppliers", []));
  const [dailyExpenses, setDailyExpenses] = useState(() => loadPersisted("dailyExpenses", []));
  const [monthlyExpenses, setMonthlyExpenses] = useState(() => loadPersisted("monthlyExpenses", []));
  const [permissions, setPermissions] = useState(() => loadPersisted("permissions", PERMISSIONS));
  const [inventory, setInventory] = useState(() => loadPersisted("inventory", []));
  const [auditLog, setAuditLog] = useState(() => loadPersisted("auditLog", []));
  const [blockedDates, setBlockedDates] = useState(() => loadPersisted("blockedDates", []));
  const [customers, setCustomers] = useState(() => loadPersisted("customers", []));

  // Helper to apply data from server response
  const applyServerData = useCallback((d) => {
    if (!d || typeof d !== "object") return;
    if (Array.isArray(d.halls) && d.halls.length > 0) setHalls(d.halls);
    if (Array.isArray(d.bookings)) setBookings(d.bookings);
    if (Array.isArray(d.packages) && d.packages.length > 0) setPackages(d.packages);
    if (Array.isArray(d.staff)) setStaff(d.staff);
    if (Array.isArray(d.vendors)) setVendors(d.vendors);
    if (Array.isArray(d.suppliers)) setSuppliers(d.suppliers);
    if (Array.isArray(d.dailyExpenses)) setDailyExpenses(d.dailyExpenses);
    if (Array.isArray(d.monthlyExpenses)) setMonthlyExpenses(d.monthlyExpenses);
    if (d.permissions && Object.keys(d.permissions).length > 0) setPermissions(d.permissions);
    if (Array.isArray(d.inventory)) setInventory(d.inventory);
    if (Array.isArray(d.auditLog)) setAuditLog(d.auditLog);
    if (Array.isArray(d.blockedDates)) setBlockedDates(d.blockedDates);
    if (Array.isArray(d.customers)) setCustomers(d.customers);
  }, []);

  // Cloud: load all data after login
  const justSavedRef = useRef(0);  // timestamp of our last save (to ignore our own version bump)
  useEffect(() => {
    if (storageMode !== "cloud" || !user || !authToken) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(apiBase + "/data", { headers: { Authorization: "Bearer " + authToken } });
        if (!r.ok) {
          if (r.status === 401) handleLogout();
          return;
        }
        const json = await r.json();
        if (cancelled) return;
        applyServerData(json.data);
        setDataVersion(json.version);
        setLastSyncAt(new Date());
        setSyncStatus("synced");
      } catch (e) {
        console.warn("Initial cloud load failed:", e);
        setSyncStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [storageMode, user, authToken, apiBase, applyServerData, handleLogout]);

  // Cloud: poll for version changes every 5 seconds — refresh when changed
  useEffect(() => {
    if (storageMode !== "cloud" || !user || !authToken) return;
    const interval = setInterval(async () => {
      try {
        const r = await fetch(apiBase + "/data/version", { headers: { Authorization: "Bearer " + authToken } });
        if (!r.ok) return;
        const v = await r.json();
        // Ignore the bump from our own save (within 2 seconds)
        if (Date.now() - justSavedRef.current < 2000) return;
        if (v.version > dataVersion) {
          // Someone else updated — fetch full data
          const full = await fetch(apiBase + "/data", { headers: { Authorization: "Bearer " + authToken } });
          if (full.ok) {
            const j = await full.json();
            applyServerData(j.data);
            setDataVersion(j.version);
            setLastSyncAt(new Date());
            notify(`📡 Data updated by ${v.lastUpdatedBy || "another user"}`);
          }
        }
      } catch (e) { /* network glitch — ignore, will retry next tick */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [storageMode, user, authToken, apiBase, dataVersion, applyServerData, notify]);

  // Cloud: fetch users list from /api/users (owner only, since the route is owner-protected)
  useEffect(() => {
    if (storageMode !== "cloud" || !user || !authToken || user.role !== "owner") return;
    const fetchUsers = async () => {
      try {
        const r = await fetch(apiBase + "/users", { headers: { Authorization: "Bearer " + authToken } });
        if (r.ok) {
          const list = await r.json();
          setUsers(list.map((u) => ({ ...u, id: u._id || u.id })));
        }
      } catch (e) { /* ignore */ }
    };
    fetchUsers();
    const t = setInterval(fetchUsers, 10000);  // refresh users every 10 sec
    return () => clearInterval(t);
  }, [storageMode, user, authToken, apiBase]);


  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (!backendReady) return;
    const all = { halls, bookings, packages, staff, vendors, suppliers, dailyExpenses, monthlyExpenses, permissions, inventory, auditLog, blockedDates, customers };
    // Always write to localStorage as a safety net
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...all, users }));
      localStorage.setItem(STORAGE_META_KEY, JSON.stringify({ lastSaved: new Date().toISOString(), mode: storageMode }));
    } catch (e) { console.error("localStorage save failed:", e); }

    // Cloud save (only if logged in)
    if (storageMode === "cloud" && user && authToken) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSyncStatus("saving");
      saveTimerRef.current = setTimeout(async () => {
        try {
          const r = await fetch(apiBase + "/data", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + authToken },
            body: JSON.stringify({ data: all }),
          });
          if (r.ok) {
            const j = await r.json();
            setDataVersion(j.version);
            justSavedRef.current = Date.now();
            setLastSyncAt(new Date());
            setSyncStatus("synced");
          } else {
            setSyncStatus("error");
            if (r.status === 401) handleLogout();
          }
        } catch (e) {
          console.warn("Cloud save failed:", e);
          setSyncStatus("error");
        }
      }, 800);
    }
  }, [backendReady, storageMode, apiBase, user, authToken, halls, bookings, packages, staff, vendors, suppliers, dailyExpenses, monthlyExpenses, permissions, inventory, auditLog, blockedDates, customers, users, handleLogout]);

  // Modals
  const [modal, setModal] = useState(null);
  const [prefillDate, setPrefillDate] = useState(null);

  // Calendar → Booking navigation
  const handleCalendarNewBooking = useCallback((date) => {
    setPrefillDate(date);
    setActiveModule("booking");
    setModal("bookingForm");
  }, []);

  const handleCalendarViewBooking = useCallback((bookingId) => {
    setActiveModule("booking");
    setModal({ type: "viewBooking", id: bookingId });
  }, []);

  useEffect(() => {
    const unique = {};
    bookings.forEach((b) => {
      if (!unique[b.customerPhone]) unique[b.customerPhone] = { name: b.customerName, phone: b.customerPhone, cnic: b.customerCNIC, bookings: 0, totalSpent: 0, vip: false };
      unique[b.customerPhone].bookings++;
      unique[b.customerPhone].totalSpent += b.paidAmount;
      if (unique[b.customerPhone].bookings >= 3) unique[b.customerPhone].vip = true;
    });
    setCustomers(Object.values(unique));
  }, [bookings]);

  const addAudit = useCallback((action, module) => {
    setAuditLog((prev) => [{ id: genId(), user: user?.name || "System", action, module, timestamp: new Date().toISOString() }, ...prev]);
  }, [user]);

  // ═══════════════════════════════════════════════════════════════
  // BACKUP / RESTORE
  // The customer can download all their data to a file, and restore it later.
  // This is essential when updating the software — backup before update, restore after.
  // ═══════════════════════════════════════════════════════════════
  const downloadBackup = useCallback(() => {
    const data = { users, halls, bookings, packages, staff, vendors, suppliers, dailyExpenses, monthlyExpenses, permissions, inventory, auditLog, blockedDates, customers };
    const payload = {
      _meta: {
        app: "Jalal Khan Wedding Hall Management",
        version: 1,
        exportedAt: new Date().toISOString(),
        exportedBy: user?.name || "Unknown",
        recordCounts: {
          bookings: bookings.length,
          suppliers: suppliers.length,
          staff: staff.length,
          dailyExpenses: dailyExpenses.length,
          monthlyExpenses: monthlyExpenses.length,
        },
      },
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jalal-khan-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addAudit(`Downloaded backup file (${bookings.length} bookings, ${dailyExpenses.length} daily expenses, ${monthlyExpenses.length} monthly expenses)`, "Settings");
    notify("✅ Backup downloaded successfully");
  }, [users, halls, bookings, packages, staff, vendors, suppliers, dailyExpenses, monthlyExpenses, permissions, inventory, auditLog, blockedDates, customers, user, addAudit, notify]);

  const restoreBackup = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const d = parsed.data || parsed;
        if (!d || typeof d !== "object") throw new Error("Invalid backup file");
        if (!confirm("⚠️ This will REPLACE all current data with the backup. Continue?")) return;

        // Restore each section if present in the file
        if (d.users) setUsers(d.users);
        if (d.halls) setHalls(d.halls);
        if (d.bookings) setBookings(d.bookings);
        if (d.packages) setPackages(d.packages);
        if (d.staff) setStaff(d.staff);
        if (d.vendors) setVendors(d.vendors);
        if (d.suppliers) setSuppliers(d.suppliers);
        if (d.dailyExpenses) setDailyExpenses(d.dailyExpenses);
        if (d.monthlyExpenses) setMonthlyExpenses(d.monthlyExpenses);
        if (d.permissions) setPermissions(d.permissions);
        if (d.inventory) setInventory(d.inventory);
        if (d.auditLog) setAuditLog(d.auditLog);
        if (d.blockedDates) setBlockedDates(d.blockedDates);
        if (d.customers) setCustomers(d.customers);

        addAudit(`Restored data from backup file (${d.bookings?.length || 0} bookings restored)`, "Settings");
        notify("✅ Backup restored successfully — please refresh the page");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        notify("❌ Invalid backup file: " + err.message, "error");
      }
    };
    reader.readAsText(file);
  }, [addAudit, notify]);

  const factoryReset = useCallback(() => {
    if (!confirm("⚠️ DANGER: This will DELETE ALL DATA and reset to default seed data. Are you absolutely sure?")) return;
    if (!confirm("This action CANNOT be undone. All bookings, expenses, suppliers, and customizations will be lost. Type confirm to proceed?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_META_KEY);
      notify("Resetting... reloading page");
      setTimeout(() => window.location.reload(), 800);
    } catch (e) { notify("Reset failed: " + e.message, "error"); }
  }, [notify]);

  const filteredBookings = useMemo(() => {
    // Managers are strictly locked to their assigned hall
    if (user?.role === "manager" && user?.hallId) {
      return bookings.filter((b) => b.hallId === user.hallId);
    }
    if (selectedHall === "all") return bookings;
    return bookings.filter((b) => b.hallId === selectedHall);
  }, [bookings, selectedHall, user]);

  // Halls visible to current user
  const visibleHalls = useMemo(() => {
    if (user?.role === "manager" && user?.hallId) {
      return halls.filter((h) => h.id === user.hallId);
    }
    return halls;
  }, [user, halls]);

  const hasPermission = (module, level = "view") => {
    if (!user) return false;
    const p = permissions[user.role]?.[module];
    if (p === "full") return true;
    if (p === "view" && level === "view") return true;
    return false;
  };

  // Login (cloud-aware: if backend available, use it; otherwise fall back to local users)
  const handleLogin = async () => {
    if (loggingIn) return;
    const email = (loginForm.email || "").trim().toLowerCase();
    if (!email || !loginForm.password) {
      setLoginError("Please enter both email and password.");
      return;
    }
    setLoginError("");
    setLoggingIn(true);

    // Try cloud login first if backend is reachable AND confirmed cloud mode
    if (apiBase && storageMode === "cloud") {
      try {
        const r = await fetch(apiBase + "/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: loginForm.password }),
        });
        // Check the response is actually JSON before parsing
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) throw new Error("Backend returned non-JSON response");
        const data = await r.json();
        if (!r.ok) { setLoginError(data.error || "Login failed"); setLoggingIn(false); return; }
        // Save token: localStorage if "Remember Me", else sessionStorage (lost on browser close)
        try {
          if (rememberMe) {
            localStorage.setItem("jh_token", data.token);
            sessionStorage.removeItem("jh_token");
          } else {
            sessionStorage.setItem("jh_token", data.token);
            localStorage.removeItem("jh_token");
          }
        } catch (e) {}
        setAuthToken(data.token);
        const u = { ...data.user, id: data.user._id || data.user.id };
        setUser(u);
        setActiveModule("dashboard");
        if (u.role === "manager" && u.hallId) setSelectedHall(u.hallId);
        else setSelectedHall("all");
        setLoggingIn(false);
        return;
      } catch (err) {
        // Network error or invalid backend response — fall back silently to local login
        setStorageMode("localStorage");
        // Don't return — fall through to local login below
      }
    }

    // Local login (standalone mode — match by email primarily, with backward-compat for username)
    // Also handle the case where someone enters just "owner" instead of "owner@jalalkhan.com"
    const inputBase = email.split("@")[0]; // "owner@jalalkhan.com" → "owner"
    const found = users.find((u) => {
      if (u.password !== loginForm.password) return false;
      const userEmail = (u.email || "").toLowerCase();
      const userName = (u.username || "").toLowerCase();
      // Match by full email
      if (userEmail && userEmail === email) return true;
      // Match by username (backward compat)
      if (userName && userName === email) return true;
      // Match by username when user just typed "owner" or "owner@..."
      if (userName && userName === inputBase) return true;
      // Match by email's local-part when user typed just "owner"
      if (userEmail && userEmail.split("@")[0] === inputBase) return true;
      return false;
    });
    if (found) {
      setUser(found);
      setActiveModule("dashboard");
      if (found.role === "manager" && found.hallId) setSelectedHall(found.hallId);
      else setSelectedHall("all");
      // Persist the active user based on Remember Me preference
      try {
        const sessionData = JSON.stringify({ id: found.id, email: found.email || found.username });
        if (rememberMe) {
          localStorage.setItem("jh_session", sessionData);
          sessionStorage.removeItem("jh_session");
        } else {
          sessionStorage.setItem("jh_session", sessionData);
          localStorage.removeItem("jh_session");
        }
      } catch (e) {}
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
    setLoggingIn(false);
  };

  // Auto-login from saved token (cloud mode)
  useEffect(() => {
    if (!apiBase || !authToken || user) return;
    fetch(apiBase + "/auth/me", { headers: { Authorization: "Bearer " + authToken } })
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((u) => {
        const usr = { ...u, id: u._id || u.id };
        setUser(usr);
        setActiveModule("dashboard");
        if (usr.role === "manager" && usr.hallId) setSelectedHall(usr.hallId);
        else setSelectedHall("all");
      })
      .catch(() => { try { localStorage.removeItem("jh_token"); } catch (e) {} setAuthToken(null); });
  }, [apiBase, authToken, user]);

  // Auto-login from saved session (standalone mode)
  useEffect(() => {
    if (apiBase || user) return;  // Only for standalone
    try {
      // Check session first (more recent), then local
      const sessionStr = sessionStorage.getItem("jh_session") || localStorage.getItem("jh_session");
      if (!sessionStr) return;
      const saved = JSON.parse(sessionStr);
      const found = users.find((u) => u.id === saved.id || (saved.email && (u.email || "").toLowerCase() === saved.email.toLowerCase()));
      if (found && found.active !== false) {
        setUser(found);
        setActiveModule("dashboard");
        if (found.role === "manager" && found.hallId) setSelectedHall(found.hallId);
        else setSelectedHall("all");
      } else {
        // Saved user no longer exists / disabled — clear session
        sessionStorage.removeItem("jh_session");
        localStorage.removeItem("jh_session");
      }
    } catch (e) {}
  }, [apiBase, user, users]);

  // Managers can only see their own hall
  const isHallLocked = user?.role === "manager" && user?.hallId;
  const userHallName = isHallLocked ? halls.find((h) => h.id === user.hallId)?.name : null;

  if (!user) {
    const checkCaps = (e) => {
      try { setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock")); } catch (err) {}
    };
    return (
      <>
        <style>{CSS}</style>
        <div className="login-page">
          {/* ═══ LEFT: BRAND PANEL ═══ */}
          <div className="login-brand">
            <div className="login-brand-header">
              <div className="login-brand-logo">
                <div className="login-brand-logo-icon">✦</div>
                Jalal Khan
              </div>
            </div>

            <div className="login-brand-content">
              <h1 className="login-brand-title">
                Manage your halls with <em>elegance</em>.
              </h1>
              <p className="login-brand-subtitle">
                Bookings, billing, expenses, and reports — everything you need to run Mashal & Deewa Wedding Halls in one beautiful, professional system.
              </p>

              <div className="login-brand-stats">
                <div>
                  <div className="login-brand-stat-num">2</div>
                  <div className="login-brand-stat-label">Halls Managed</div>
                </div>
                <div>
                  <div className="login-brand-stat-num">15+</div>
                  <div className="login-brand-stat-label">Modules</div>
                </div>
                <div>
                  <div className="login-brand-stat-num">256</div>
                  <div className="login-brand-stat-label">Bit Encryption</div>
                </div>
              </div>
            </div>

            <div className="login-brand-footer">
              © {new Date().getFullYear()} Jalal Khan Wedding Halls · Pakistan
            </div>
          </div>

          {/* ═══ RIGHT: LOGIN FORM ═══ */}
          <div className="login-form-side">
            <div className="login-form">
              <div className="login-form-header">
                <div className="login-form-eyebrow">Welcome back</div>
                <div className="login-form-title">Sign in to continue</div>
                <div className="login-form-subtitle">
                  Enter your credentials to access your account.
                </div>
              </div>

              {storageMode === "cloud" && (
                <div className="login-alert login-alert-info">
                  <span>🌐</span>
                  <div><strong>Cloud Mode</strong> — your data syncs across all devices.</div>
                </div>
              )}

              {/* Email field */}
              <div className="login-field">
                <label className="login-field-label">Email Address</label>
                <div className="login-input-wrap">
                  <input
                    className="login-input"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@jalalkhan.com"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password field with show/hide */}
              <div className="login-field">
                <label className="login-field-label">Password</label>
                <div className="login-input-wrap">
                  <input
                    className="login-input"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Enter your password"
                    onKeyDown={(e) => { checkCaps(e); if (e.key === "Enter") handleLogin(); }}
                    onKeyUp={checkCaps}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-input-icon-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye size={16} /> : <Lock size={16} />}
                  </button>
                </div>
              </div>

              {/* Caps Lock warning */}
              {capsLockOn && (
                <div className="login-alert login-alert-warn">
                  <span>⚠</span>
                  <div>Caps Lock is on — your password is case-sensitive.</div>
                </div>
              )}

              {/* Error message */}
              {loginError && (
                <div className="login-alert login-alert-error">
                  <span>✕</span>
                  <div>{loginError}</div>
                </div>
              )}

              {/* Remember me + Forgot password */}
              <div className="login-row">
                <label className="login-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  className="login-forgot"
                  onClick={() => setForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign in button */}
              <button
                className="login-btn"
                onClick={handleLogin}
                disabled={loggingIn}
              >
                {loggingIn ? "Signing in..." : "Sign In"}
                {!loggingIn && <ArrowRight size={16} />}
              </button>
            </div>
          </div>

          {/* ═══ FORGOT PASSWORD MODAL ═══ */}
          {forgotModal && (
            <div onClick={() => setForgotModal(false)} style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
              backdropFilter: "blur(4px)",
            }}>
              <div onClick={(e) => e.stopPropagation()} style={{
                background: "var(--charcoal)", border: "1px solid rgba(148, 163, 184, 0.40)",
                borderRadius: 16, padding: 32, maxWidth: 460, width: "92vw",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(148, 163, 184, 0.28)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <Lock size={22} color="var(--gold)" />
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--white)", fontWeight: 700, marginBottom: 4 }}>
                      Reset your password
                    </div>
                    <div style={{ fontSize: 13, color: "var(--slate)" }}>
                      Here's how to recover access to your account.
                    </div>
                  </div>
                  <button onClick={() => setForgotModal(false)} style={{ background: "transparent", border: "none", color: "var(--slate)", cursor: "pointer", padding: 4 }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ marginTop: 20 }}>
                  {loginForm.role === "owner" ? (
                    <>
                      <div style={{ background: "rgba(217, 119, 6, 0.08)", border: "1px solid rgba(217, 119, 6, 0.2)", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, color: "#b45309" }}>
                        <strong>⚠ Owner password recovery</strong><br/>
                        As the Owner, password recovery requires server-side access. Contact your system administrator or developer to reset it.
                      </div>
                      <div style={{ fontSize: 13, color: "var(--cream)", lineHeight: 1.7 }}>
                        <strong style={{ color: "var(--gold)" }}>For technical recovery:</strong><br/>
                        1. SSH into your server<br/>
                        2. Run: <code style={{ background: "rgba(15, 23, 42, 0.05)", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>cd /root/backend && node scripts/reset-owner-password.js</code><br/>
                        3. Or restore from a recent database backup
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ background: "rgba(37, 99, 235, 0.06)", border: "1px solid rgba(37, 99, 235, 0.2)", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, color: "#1d4ed8" }}>
                        <strong>👑 Contact the Owner</strong><br/>
                        For security, only the Owner can reset Manager and Cashier passwords.
                      </div>
                      <div style={{ fontSize: 13, color: "var(--cream)", lineHeight: 1.7 }}>
                        <strong style={{ color: "var(--gold)" }}>Steps:</strong>
                        <ol style={{ margin: "8px 0 0 20px", padding: 0 }}>
                          <li>Contact <strong>Jalal Khan (Owner)</strong></li>
                          <li>The Owner will log in and go to <strong>Admin & Security → Users</strong></li>
                          <li>They will click the 🔑 icon next to your account</li>
                          <li>You'll receive a new temporary password</li>
                          <li>Sign in with the new password and change it immediately</li>
                        </ol>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setForgotModal(false)} style={{
                    padding: "10px 20px", background: "var(--gold)", color: "var(--navy)",
                    border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit",
                  }}>
                    Got it
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: Home, section: "main" },
    { id: "booking", label: "Bookings", icon: Calendar, section: "main" },
    { id: "calendar", label: "Calendar", icon: Calendar, section: "main" },
    { id: "billing", label: "Billing & Finance", icon: DollarSign, section: "main" },
    { id: "catering", label: "Catering & Menu", icon: UtensilsCrossed, section: "operations" },
    { id: "staff", label: "Staff/Vendors/Suppliers", icon: UserCheck, section: "operations" },
    { id: "inventory", label: "Inventory", icon: Package, section: "operations" },
    { id: "dailyExpenses", label: "Daily Expenses", icon: FileText, section: "operations" },
    { id: "reports", label: "Reports", icon: BarChart3, section: "analytics" },
    { id: "monthlyExpenses", label: "Monthly Expenses", icon: CreditCard, section: "analytics" },
    { id: "netProfit", label: "Net Profit / Loss", icon: TrendingUp, section: "analytics" },
    { id: "multiHall", label: "Multi-Hall", icon: Building2, section: "analytics" },
    { id: "mobile", label: "WhatsApp/Mobile", icon: Smartphone, section: "system" },
    { id: "admin", label: "Admin & Security", icon: Shield, section: "system" },
  ];

  const sections = { main: "Management", operations: "Operations", analytics: "Analytics", system: "System" };

  return (
    <>
      <style>{CSS}</style>
      {notification && (
        <div className="notification-toast">
          {notification.type === "success" ? <CheckCircle size={18} style={{ color: "var(--green)" }} /> : <AlertCircle size={18} style={{ color: "var(--red)" }} />}
          <span style={{ fontSize: 13 }}>{notification.msg}</span>
        </div>
      )}
      <div className="app-layout">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h2>✦ Jalal Khan</h2>
            <div className="user-info">
              <div className="avatar">{user.name.charAt(0)}</div>
              <div>
                <span>{user.name}</span>
                <small>{user.role}</small>
                {isHallLocked && <small style={{ display: "block", color: "var(--cream)", fontSize: 10, letterSpacing: 0, textTransform: "none", marginTop: 2 }}>🏛️ {userHallName}</small>}
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {Object.entries(sections).map(([key, label]) => (
              <div key={key}>
                <div className="section-label">{label}</div>
                {NAV.filter((n) => n.section === key).map((n) => {
                  const perm = permissions[user.role];
                  const moduleKey = n.id === "dashboard" ? "booking" : n.id;
                  if (perm[moduleKey] === "none" && n.id !== "dashboard") return null;
                  return (
                    <button key={n.id} className={activeModule === n.id ? "active" : ""} onClick={() => { setActiveModule(n.id); setSidebarOpen(false); }}>
                      <n.icon /> {n.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-content">
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={18} /></button>
              <h1>{NAV.find((n) => n.id === activeModule)?.label || "Dashboard"}</h1>
            </div>
            <div className="topbar-actions">
              <LiveClock />
              {storageMode === "cloud" && (
                <div title={lastSyncAt ? `Last synced: ${lastSyncAt.toLocaleTimeString()}` : "Cloud sync active"} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 14, fontSize: 11,
                  background: syncStatus === "error" ? "rgba(248,113,113,0.1)" : syncStatus === "saving" ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)",
                  color: syncStatus === "error" ? "var(--red)" : syncStatus === "saving" ? "var(--yellow)" : "var(--green)",
                  border: "1px solid " + (syncStatus === "error" ? "rgba(248,113,113,0.3)" : syncStatus === "saving" ? "rgba(251,191,36,0.3)" : "rgba(52,211,153,0.3)"),
                  fontWeight: 600,
                }}>
                  <span style={{ fontSize: 9 }}>●</span>
                  {syncStatus === "saving" ? "Saving..." : syncStatus === "error" ? "Sync error" : "Cloud synced"}
                </div>
              )}
              {isHallLocked ? (
                <div className="hall-select" style={{ display: "flex", alignItems: "center", gap: 6, cursor: "default" }}>
                  <Lock size={12} style={{ color: "var(--gold)" }} />
                  {userHallName}
                </div>
              ) : (
                <select className="hall-select" value={selectedHall} onChange={(e) => setSelectedHall(e.target.value)}>
                  <option value="all">All Halls</option>
                  {halls.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              )}
              <button className="icon-btn"><Bell size={16} /></button>
              <button className="icon-btn"><Settings size={16} /></button>
            </div>
          </div>

          <div className="page-content">
            {activeModule === "dashboard" && <DashboardModule bookings={filteredBookings} customers={customers} staff={staff} inventory={inventory} halls={visibleHalls} selectedHall={selectedHall} user={user} />}
            {activeModule === "booking" && <BookingModule bookings={filteredBookings} setBookings={setBookings} notify={notify} addAudit={addAudit} user={user} hasPermission={hasPermission} blockedDates={blockedDates} modal={modal} setModal={setModal} visibleHalls={visibleHalls} packages={packages} prefillDate={prefillDate} setPrefillDate={setPrefillDate} halls={halls} suppliers={suppliers} setSuppliers={setSuppliers} />}
            {activeModule === "calendar" && <CalendarModule bookings={filteredBookings} blockedDates={blockedDates} setBlockedDates={setBlockedDates} hasPermission={hasPermission} visibleHalls={visibleHalls} onCreateBooking={handleCalendarNewBooking} onViewBooking={handleCalendarViewBooking} packages={packages} halls={halls} />}
            {activeModule === "billing" && <BillingModule bookings={filteredBookings} setBookings={setBookings} notify={notify} addAudit={addAudit} hasPermission={hasPermission} />}
            {activeModule === "catering" && <CateringModule bookings={filteredBookings} packages={packages} setPackages={setPackages} notify={notify} addAudit={addAudit} hasPermission={hasPermission} />}
            {activeModule === "staff" && <StaffModule staff={staff} setStaff={setStaff} vendors={vendors} setVendors={setVendors} suppliers={suppliers} setSuppliers={setSuppliers} notify={notify} addAudit={addAudit} hasPermission={hasPermission} />}
            {activeModule === "inventory" && <InventoryModule inventory={inventory} setInventory={setInventory} notify={notify} addAudit={addAudit} hasPermission={hasPermission} />}
            {activeModule === "dailyExpenses" && <DailyExpensesModule dailyExpenses={dailyExpenses} setDailyExpenses={setDailyExpenses} notify={notify} addAudit={addAudit} user={user} halls={halls} visibleHalls={visibleHalls} />}
            {activeModule === "reports" && <ReportsModule bookings={filteredBookings} staff={staff} vendors={vendors} halls={visibleHalls} packages={packages} allHalls={halls} />}
            {activeModule === "monthlyExpenses" && <MonthlyExpensesModule monthlyExpenses={monthlyExpenses} setMonthlyExpenses={setMonthlyExpenses} notify={notify} addAudit={addAudit} halls={halls} />}
            {activeModule === "netProfit" && <NetProfitModule bookings={bookings} dailyExpenses={dailyExpenses} monthlyExpenses={monthlyExpenses} packages={packages} halls={halls} />}
            {activeModule === "multiHall" && <MultiHallModule bookings={filteredBookings} halls={visibleHalls} allHalls={halls} setHalls={setHalls} notify={notify} addAudit={addAudit} user={user} />}
            {activeModule === "mobile" && <MobileModule bookings={filteredBookings} visibleHalls={visibleHalls} halls={halls} />}
            {activeModule === "admin" && <AdminModule auditLog={auditLog} user={user} setUser={setUser} users={users} setUsers={setUsers} notify={notify} addAudit={addAudit} halls={halls} permissions={permissions} setPermissions={setPermissions} downloadBackup={downloadBackup} restoreBackup={restoreBackup} factoryReset={factoryReset} bookings={bookings} dailyExpenses={dailyExpenses} monthlyExpenses={monthlyExpenses} suppliers={suppliers} storageMode={storageMode} apiBase={apiBase} authToken={authToken} setAuthToken={setAuthToken} />}
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: DASHBOARD
// ═══════════════════════════════════════════════
function DashboardModule({ bookings, customers, staff, inventory, halls, selectedHall, user }) {
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const pending = bookings.filter((b) => b.status === "pending");
  const totalRevenue = confirmed.reduce((s, b) => s + b.paidAmount, 0);
  const outstanding = confirmed.reduce((s, b) => s + (b.totalAmount - b.paidAmount - b.discount), 0);
  const upcoming = bookings.filter((b) => b.status !== "cancelled" && new Date(b.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  const lowStock = inventory.filter((i) => i.qty <= i.minQty);

  return (
    <>
      {halls.length === 0 && user?.role === "owner" && (
        <div className="card" style={{ marginBottom: 20, background: "linear-gradient(135deg, rgba(249, 115, 22, 0.06), rgba(249, 115, 22, 0.02))", border: "1px solid rgba(249, 115, 22, 0.20)", padding: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--pop)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, color: "white" }}>
              ✦
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--white)", marginBottom: 6 }}>
                Welcome — let's set up your halls
              </h3>
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6, marginBottom: 4 }}>
                Get started by adding your wedding halls in the <strong>Multi-Hall</strong> section (sidebar). Once added,
                you can start managing bookings, staff, suppliers, and finances. Default user logins are already
                configured — update them anytime in <strong>Admin & Security → Users</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="stats-grid">
        <StatCard icon={Calendar} iconBg="rgba(148, 163, 184, 0.30)" value={confirmed.length} label="Confirmed Bookings" />
        <StatCard icon={Clock} iconBg="var(--yellow-bg)" value={pending.length} label="Pending Bookings" />
        <StatCard icon={DollarSign} iconBg="var(--green-bg)" value={fmt(totalRevenue)} label="Total Revenue" />
        <StatCard icon={AlertTriangle} iconBg="var(--red-bg)" value={fmt(outstanding)} label="Outstanding Dues" />
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><h3>Upcoming Events</h3></div>
          {upcoming.length === 0 ? <div className="empty-state"><p>No upcoming events</p></div> : (
            <table className="data-table">
              <thead><tr><th>Date</th><th>Customer</th><th>Event</th><th>Hall</th><th>Status</th></tr></thead>
              <tbody>
                {upcoming.map((b) => (
                  <tr key={b.id}>
                    <td>{fmtDate(b.date)}</td>
                    <td>{b.customerName}</td>
                    <td>{b.eventType}</td>
                    <td>{halls.find((h) => h.id === b.hallId)?.name}</td>
                    <td><Badge type={b.status}>{b.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <div className="card-header"><h3>Revenue by Hall</h3></div>
          <BarChart data={halls.map((h) => ({
            label: h.name.split(" ")[0],
            value: bookings.filter((b) => b.hallId === h.id && b.status === "confirmed").reduce((s, b) => s + b.paidAmount, 0),
            color: h.color,
          }))} />
          <div style={{ marginTop: 32 }} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>Quick Stats</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Total Customers</span><span style={{ fontWeight: 600 }}>{customers.length}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>VIP Customers</span><span style={{ fontWeight: 600, color: "var(--gold)" }}>{customers.filter((c) => c.vip).length}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Active Staff</span><span style={{ fontWeight: 600 }}>{staff.filter((s) => s.status === "active").length}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Low Stock Alerts</span><span style={{ fontWeight: 600, color: "var(--red)" }}>{lowStock.length}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Hall Occupancy Rate</span><span style={{ fontWeight: 600, color: "var(--green)" }}>{Math.round((confirmed.length / (bookings.length || 1)) * 100)}%</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Payment Distribution</h3></div>
          <BarChart data={[
            { label: "Cash", value: bookings.filter((b) => b.paymentMethod === "Cash").length, color: "var(--green)" },
            { label: "Bank", value: bookings.filter((b) => b.paymentMethod === "Bank Transfer").length, color: "var(--blue)" },
            { label: "Easypaisa", value: bookings.filter((b) => b.paymentMethod === "Easypaisa").length, color: "var(--gold)" },
            { label: "JazzCash", value: bookings.filter((b) => b.paymentMethod === "JazzCash").length, color: "var(--red)" },
          ]} />
          <div style={{ marginTop: 32 }} />
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: BOOKING
// ═══════════════════════════════════════════════
function BookingModule({ bookings, setBookings, notify, addAudit, user, hasPermission, blockedDates, modal, setModal, visibleHalls, packages, prefillDate, setPrefillDate, halls, suppliers, setSuppliers }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMode, setFilterMode] = useState("all"); // "all", "month", "date"
  const [filterMonth, setFilterMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
  const [filterDate, setFilterDate] = useState("");
  const [calOpen, setCalOpen] = useState(false);
  const [calNav, setCalNav] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const defaultHall = user?.hallId || visibleHalls[0]?.id || halls[0]?.id || "";
  const emptyForm = { customerName: "", customerPhone: "", customerCNIC: "", hallId: defaultHall, slotId: "evening", eventType: "Wedding", date: toISO(today), packageId: packages[0]?.id || "pkg1", guests: 200, hallRent: 0, customPricePerHead: packages[0]?.pricePerHead || 850, extraServices: DEFAULT_EXTRA_SERVICES.map((s) => ({ ...s })), customServices: [], menuChoices: {}, menuItemOverrides: {}, choicesFinalized: false, notes: "", paymentMethod: "Cash", advancePayment: 0, discount: 0, status: "pending" };
  const [bookingForm, setBookingForm] = useState(emptyForm);
  const [editingBooking, setEditingBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [expenseModal, setExpenseModal] = useState(null);
  const [expenseItems, setExpenseItems] = useState([]);
  const [programMenu, setProgramMenu] = useState([]);
  const [incentivesAmount, setIncentivesAmount] = useState(0);
  const [newExpense, setNewExpense] = useState({ item: "", qty: "", unit: "kg", rate: "" });
  const [newMenuItem, setNewMenuItem] = useState("");
  const [supplierExpenseForm, setSupplierExpenseForm] = useState({ supplierId: "", description: "", qty: "", amount: "", paidAmount: "", method: "Cash" });

  // Handle navigation from Calendar module
  useEffect(() => {
    if (modal === "bookingForm" && prefillDate) {
      // Calendar sent us here to create a new booking with a specific date
      setBookingForm({ ...emptyForm, date: prefillDate });
      setEditingBooking(null);
      setPrefillDate(null);
    } else if (modal && typeof modal === "object" && modal.type === "viewBooking" && modal.id) {
      // Calendar sent us here to view a specific booking
      const found = bookings.find((b) => b.id === modal.id);
      if (found) {
        setViewBooking(found);
        setModal(null);
      }
    }
  }, [modal, prefillDate]);

  const filtered = bookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.customerName.toLowerCase().includes(search.toLowerCase()) && !b.customerPhone.includes(search)) return false;
    if (filterMode === "month") {
      const bd = new Date(b.date);
      const monthKey = `${bd.getFullYear()}-${String(bd.getMonth() + 1).padStart(2, "0")}`;
      if (monthKey !== filterMonth) return false;
    } else if (filterMode === "date" && filterDate) {
      if (b.date !== filterDate) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  // Calendar picker helpers
  const calYear = calNav.getFullYear();
  const calMonth = calNav.getMonth();
  const calFirstDay = new Date(calYear, calMonth, 1).getDay();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calPrevDays = new Date(calYear, calMonth, 0).getDate();

  const calCells = [];
  for (let i = calFirstDay - 1; i >= 0; i--) calCells.push({ day: calPrevDays - i, other: true });
  for (let i = 1; i <= calDaysInMonth; i++) calCells.push({ day: i, other: false });
  const calRemain = 42 - calCells.length;
  for (let i = 1; i <= calRemain; i++) calCells.push({ day: i, other: true });

  const getBookingCountForDay = (day) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter((b) => b.date === dateStr && b.status !== "cancelled").length;
  };

  const handleCalDateClick = (day, other) => {
    if (other) return;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setFilterDate(dateStr);
    setFilterMode("date");
    setCalOpen(false);
  };

  const handleCalMonthSelect = () => {
    const monthKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;
    setFilterMonth(monthKey);
    setFilterMode("month");
    setCalOpen(false);
  };

  const handleCalToday = () => {
    setFilterDate(toISO(today));
    setFilterMode("date");
    setCalNav(new Date(today.getFullYear(), today.getMonth(), 1));
    setCalOpen(false);
  };

  const handleCalClear = () => {
    setFilterMode("all");
    setFilterDate("");
    setCalOpen(false);
  };

  const calFilterLabel = filterMode === "all" ? "All Bookings" : filterMode === "date" ? fmtDate(filterDate) : new Date(calYear, calMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const calRef = useRef(null);

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e) => { if (calRef.current && !calRef.current.contains(e.target)) setCalOpen(false); };
    if (calOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calOpen]);

  const checkConflict = (date, hallId, slotId, excludeId) => {
    return bookings.some((b) => b.id !== excludeId && b.date === date && b.hallId === hallId && b.status !== "cancelled" && (b.slotId === slotId || b.slotId === "fullday" || slotId === "fullday"));
  };

  const calcTotal = (form) => {
    const catering = (form.guests || 0) * (Number(form.customPricePerHead) || 0);
    const servicesTotal = (form.extraServices || []).filter((sv) => sv.enabled && !sv.free).reduce((s, sv) => s + (Number(sv.amount) || 0), 0) + (form.customServices || []).filter((sv) => sv.enabled !== false && !sv.free).reduce((s, sv) => s + (Number(sv.amount) || 0), 0);
    return (Number(form.hallRent) || 0) + catering + servicesTotal;
  };

  /**
   * Smart Profit Estimator — uses up to 10 most similar past bookings
   * to estimate expenses and profit for the current booking form.
   *
   * Returns null if no usable past data exists.
   * Returns an object with the estimate breakdown otherwise.
   */
  const estimateProfit = (form) => {
    // Only consider bookings that have recorded expenses (otherwise we can't learn cost patterns)
    const pastBookings = bookings.filter((b) =>
      b.id !== editingBooking?.id &&
      Array.isArray(b.expenses) && b.expenses.length > 0 &&
      b.guests > 0 && b.status !== "cancelled"
    );

    if (pastBookings.length === 0) return { confidence: "none", samples: 0 };

    // Score similarity to current booking
    const guests = Number(form.guests) || 0;
    const scored = pastBookings.map((b) => {
      let score = 0;
      if (b.packageId === form.packageId) score += 3;
      if (b.eventType === form.eventType) score += 2;
      if (b.hallId === form.hallId) score += 2;
      const guestRatio = guests > 0 ? Math.min(b.guests, guests) / Math.max(b.guests, guests) : 0;
      if (guestRatio >= 0.7) score += 2;
      else if (guestRatio >= 0.5) score += 1;
      // Recency boost — newer bookings reflect current costs better
      const daysAgo = (Date.now() - new Date(b.createdAt || b.date).getTime()) / 86400000;
      if (daysAgo < 30) score += 1;
      return { b, score };
    });

    // Take top 10 by similarity
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 10);
    const samples = top.length;

    // Compute median cost-per-guest from past bookings (median is robust to outliers)
    const costsPerGuest = top.map(({ b }) => {
      const exp = (b.expenses || []).reduce((s, e) => s + (Number(e.total) || 0), 0);
      return exp / b.guests;
    }).filter((v) => v > 0).sort((a, b) => a - b);
    const medianCostPerGuest = costsPerGuest.length > 0
      ? costsPerGuest[Math.floor(costsPerGuest.length / 2)]
      : 0;

    // Compute average revenue and profit margin from past bookings
    const avgMargin = top.reduce((s, { b }) => {
      const rev = (b.totalAmount || 0) - (b.discount || 0);
      const exp = (b.expenses || []).reduce((sum, e) => sum + (Number(e.total) || 0), 0);
      const profit = rev - exp;
      return s + (rev > 0 ? profit / rev : 0);
    }, 0) / Math.max(top.length, 1);

    // Project onto current booking
    const expectedRevenue = calcTotal(form) - (Number(form.discount) || 0);
    const expectedExpenses = Math.round(guests * medianCostPerGuest);
    const expectedProfit = expectedRevenue - expectedExpenses;
    const projectedMargin = expectedRevenue > 0 ? expectedProfit / expectedRevenue : 0;

    // Confidence: more samples + closer matches = higher confidence
    const avgScore = top.reduce((s, x) => s + x.score, 0) / Math.max(top.length, 1);
    let confidence = "low";
    if (samples >= 5 && avgScore >= 5) confidence = "high";
    else if (samples >= 3 && avgScore >= 3) confidence = "medium";

    // Insights
    const insights = [];
    if (projectedMargin >= 0.35) insights.push({ type: "good", text: "Healthy profit margin" });
    else if (projectedMargin >= 0.20) insights.push({ type: "ok", text: "Acceptable margin" });
    else if (projectedMargin > 0) insights.push({ type: "warn", text: "Low profit margin — consider higher pricing" });
    else insights.push({ type: "bad", text: "Projected loss — review pricing or expenses" });

    // Cost trend (last 5 vs previous 5)
    if (top.length >= 5) {
      const recent = top.slice(0, Math.min(5, Math.floor(top.length / 2)));
      const older = top.slice(Math.min(5, Math.floor(top.length / 2)));
      if (older.length > 0) {
        const recentAvg = recent.reduce((s, { b }) => s + ((b.expenses || []).reduce((a, e) => a + (Number(e.total) || 0), 0) / b.guests), 0) / recent.length;
        const olderAvg = older.reduce((s, { b }) => s + ((b.expenses || []).reduce((a, e) => a + (Number(e.total) || 0), 0) / b.guests), 0) / older.length;
        if (olderAvg > 0) {
          const trend = (recentAvg - olderAvg) / olderAvg;
          if (trend > 0.10) insights.push({ type: "warn", text: `Material costs trending up (+${Math.round(trend * 100)}% recently)` });
          else if (trend < -0.10) insights.push({ type: "good", text: `Material costs trending down (${Math.round(trend * 100)}% recently)` });
        }
      }
    }

    // Recommend price-per-head if margin is low
    if (projectedMargin > 0 && projectedMargin < 0.20 && guests > 0) {
      const targetMargin = 0.30;
      const targetRev = expectedExpenses / (1 - targetMargin);
      const recommendedPph = Math.ceil((targetRev - (Number(form.hallRent) || 0)) / guests / 50) * 50; // round to nearest 50
      if (recommendedPph > (Number(form.customPricePerHead) || 0)) {
        insights.push({ type: "tip", text: `For 30% margin, try Rs ${recommendedPph}/guest` });
      }
    }

    // Take top 3 most similar bookings to show the user
    const similarSamples = top.slice(0, 3).map(({ b }) => {
      const rev = (b.totalAmount || 0) - (b.discount || 0);
      const exp = (b.expenses || []).reduce((s, e) => s + (Number(e.total) || 0), 0);
      const pkg = packages.find((p) => p.id === b.packageId);
      return {
        eventType: b.eventType,
        guests: b.guests,
        packageName: pkg?.name || "—",
        profit: rev - exp,
      };
    });

    return {
      confidence,
      samples,
      expectedRevenue,
      expectedExpenses,
      expectedProfit,
      projectedMargin,
      medianCostPerGuest: Math.round(medianCostPerGuest),
      avgMargin,
      insights,
      similarSamples,
    };
  };

  const openNew = () => {
    setBookingForm(emptyForm);
    setEditingBooking(null);
    setModal("bookingForm");
  };

  // Build & open a printable receipt window for a booking
  const printReceipt = (b) => {
    if (!b) return;
    const hall = halls.find((h) => h.id === b.hallId) || {};
    const slot = SLOTS.find((s) => s.id === b.slotId) || { name: "" };
    const pkg = packages.find((p) => p.id === b.packageId) || { name: "", pricePerHead: 0 };
    const catering = (b.guests || 0) * (Number(b.customPricePerHead) || 0);
    const enabledExtras = [
      ...(b.extraServices || []).filter((s) => s.enabled),
      ...(b.customServices || []).filter((s) => s.enabled !== false),
    ];
    const extrasCharged = enabledExtras.filter((s) => !s.free);
    const extrasFree = enabledExtras.filter((s) => s.free);
    const extrasTotal = extrasCharged.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const subtotal = (Number(b.hallRent) || 0) + catering + extrasTotal;
    const discount = Number(b.discount) || 0;
    const total = Number(b.totalAmount) || subtotal;
    const paid = Number(b.paidAmount) || 0;
    const balance = Math.max(0, total - paid - discount);
    const receiptNo = "JK-" + String(b.id).slice(-6).toUpperCase();
    const fmtPK = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");

    const css = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'DM Sans', Arial, sans-serif; color: #1e293b; padding: 32px; max-width: 780px; margin: 0 auto; line-height: 1.5; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid #0f172a; margin-bottom: 22px; }
      .brand { font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
      .tagline { font-size: 12px; color: #64748b; letter-spacing: 1px; text-transform: uppercase; }
      .receipt-meta { text-align: right; font-size: 12px; }
      .receipt-meta .label { color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px; }
      .receipt-meta .value { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 6px; }
      h1.title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 6px; letter-spacing: 1px; text-transform: uppercase; }
      h2 { font-size: 13px; color: #f97316; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 22px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; font-size: 13px; }
      .row { display: flex; justify-content: space-between; padding: 4px 0; }
      .row .label { color: #64748b; }
      .row .value { color: #0f172a; font-weight: 500; text-align: right; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
      table th { text-align: left; padding: 8px 10px; background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
      table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
      table td.amt { text-align: right; font-weight: 500; }
      .totals { margin-top: 14px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; background: #f8fafc; }
      .totals .row { padding: 5px 0; font-size: 14px; }
      .totals .grand { padding-top: 10px; margin-top: 6px; border-top: 2px solid #0f172a; font-size: 16px; font-weight: 700; }
      .totals .grand .value { color: #f97316; }
      .balance { font-size: 15px; font-weight: 700; }
      .balance.due .value { color: #dc2626; }
      .balance.paid .value { color: #059669; }
      .menu-list { font-size: 13px; line-height: 1.9; column-count: 2; }
      .menu-list .item { break-inside: avoid; }
      .menu-list .free { color: #64748b; font-size: 12px; }
      .footer { margin-top: 36px; padding-top: 20px; border-top: 1px dashed #cbd5e1; }
      .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 50px; }
      .sig { text-align: center; font-size: 12px; color: #64748b; }
      .sig .line { border-top: 1px solid #0f172a; margin-bottom: 6px; padding-top: 6px; }
      .thanks { text-align: center; font-family: 'Playfair Display', serif; font-size: 16px; color: #0f172a; margin-top: 28px; font-style: italic; }
      .small { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 8px; }
      .badge-status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      .badge-confirmed { background: #d1fae5; color: #047857; }
      .badge-pending { background: #fef3c7; color: #b45309; }
      .badge-cancelled { background: #fee2e2; color: #b91c1c; }
      @media print {
        body { padding: 20px; }
        @page { margin: 0.5in; }
        .no-print { display: none; }
      }
      .print-controls { position: fixed; top: 16px; right: 16px; }
      .print-controls button { background: #f97316; color: white; border: none; padding: 10px 18px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; margin-left: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
      .print-controls button.secondary { background: #475569; }
    `;

    const itemsList = (pkg.items || []).map((item, idx) => {
      const override = b.menuItemOverrides && b.menuItemOverrides[idx];
      if (override) return `<div class="item">• ${override}</div>`;
      if (item.choice) {
        const choice = b.menuChoices && b.menuChoices[idx];
        if (choice && choice !== "Later") return `<div class="item">• ${choice}</div>`;
        return `<div class="item">• ${item.text} <span class="free">(choice pending)</span></div>`;
      }
      return `<div class="item">• ${item.text}</div>`;
    }).join("");

    const extrasRows = extrasCharged.map((s) =>
      `<tr><td>${s.label || s.key}</td><td class="amt">${fmtPK(s.amount)}</td></tr>`
    ).join("");

    const freeExtrasRows = extrasFree.length
      ? `<tr><td colspan="2" style="font-size: 11px; color: #059669; padding: 6px 10px;">🎁 Complimentary (no charge): ${extrasFree.map((s) => s.label || s.key).join(", ")}</td></tr>`
      : "";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Booking Receipt — ${b.customerName} — ${receiptNo}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
  <div class="print-controls no-print">
    <button onclick="window.print()">🖨️ Print</button>
    <button class="secondary" onclick="window.close()">Close</button>
  </div>

  <div class="header">
    <div>
      <div class="brand">✦ Jalal Khan</div>
      <div class="tagline">Wedding Halls · Pakistan</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">${hall.name || ""}</div>
    </div>
    <div class="receipt-meta">
      <div class="label">Receipt No.</div>
      <div class="value">${receiptNo}</div>
      <div class="label">Issued On</div>
      <div class="value">${new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}</div>
      <span class="badge-status badge-${b.status}">${(b.status || "").toUpperCase()}</span>
    </div>
  </div>

  <h1 class="title">Booking Receipt</h1>
  <p style="font-size: 12px; color: #64748b; margin-bottom: 14px;">This receipt confirms your booking and any payments received.</p>

  <h2>Customer Details</h2>
  <div class="grid-2">
    <div class="row"><span class="label">Name</span><span class="value">${b.customerName || ""}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${b.customerPhone || "—"}</span></div>
    <div class="row"><span class="label">CNIC</span><span class="value">${b.customerCNIC || "—"}</span></div>
    <div class="row"><span class="label">Booking ID</span><span class="value">${receiptNo}</span></div>
  </div>

  <h2>Event Details</h2>
  <div class="grid-2">
    <div class="row"><span class="label">Event Type</span><span class="value">${b.eventType || ""}</span></div>
    <div class="row"><span class="label">Event Date</span><span class="value">${fmtDate(b.date)}</span></div>
    <div class="row"><span class="label">Hall</span><span class="value">${hall.name || ""}</span></div>
    <div class="row"><span class="label">Slot</span><span class="value">${slot.name || b.slotId}</span></div>
    <div class="row"><span class="label">Number of Guests</span><span class="value">${b.guests || 0}</span></div>
    <div class="row"><span class="label">Booked On</span><span class="value">${fmtDate(b.createdAt)}</span></div>
  </div>

  <h2>Charges</h2>
  <table>
    <thead>
      <tr><th>Description</th><th style="text-align: right; width: 130px;">Amount</th></tr>
    </thead>
    <tbody>
      <tr><td>Hall Rent</td><td class="amt">${fmtPK(b.hallRent)}</td></tr>
      <tr>
        <td>Catering — ${pkg.name} (${b.guests} × ${fmtPK(b.customPricePerHead)})</td>
        <td class="amt">${fmtPK(catering)}</td>
      </tr>
      ${extrasRows}
      ${freeExtrasRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span class="label">Subtotal</span><span class="value">${fmtPK(subtotal)}</span></div>
    ${discount > 0 ? `<div class="row"><span class="label">Discount</span><span class="value" style="color: #059669;">− ${fmtPK(discount)}</span></div>` : ""}
    <div class="row grand"><span class="label">Total Amount</span><span class="value">${fmtPK(total - discount)}</span></div>
    <div class="row" style="margin-top: 10px;"><span class="label">Amount Paid (${b.paymentMethod || "—"})</span><span class="value" style="color: #059669;">${fmtPK(paid)}</span></div>
    <div class="row balance ${balance > 0 ? "due" : "paid"}"><span class="label">${balance > 0 ? "Balance Due" : "Fully Paid"}</span><span class="value">${fmtPK(balance)}</span></div>
  </div>

  ${pkg.items?.length ? `
  <h2>Menu — ${pkg.name}</h2>
  <div class="menu-list">${itemsList}</div>
  ` : ""}

  ${b.notes ? `
  <h2>Notes</h2>
  <p style="font-size: 13px; color: #475569;">${b.notes}</p>
  ` : ""}

  <div class="footer">
    <div class="signatures">
      <div class="sig"><div class="line">Customer Signature</div><div>${b.customerName || ""}</div></div>
      <div class="sig"><div class="line">Authorized Signature</div><div>Jalal Khan Wedding Halls</div></div>
    </div>
    <p class="thanks">Thank you for choosing Jalal Khan Wedding Halls</p>
    <p class="small">This is a computer-generated receipt. For inquiries, contact our office.</p>
  </div>

  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) {
      notify("Pop-up blocked — please allow pop-ups to print receipt", "error");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const openEdit = (b) => {
    if (new Date(b.date) < new Date(toISO(today)) && b.status !== "cancelled") {
      notify("🔒 This event is completed and locked — cannot edit", "error");
      return;
    }
    setBookingForm({
      customerName: b.customerName, customerPhone: b.customerPhone, customerCNIC: b.customerCNIC || "",
      hallId: b.hallId, slotId: b.slotId, eventType: b.eventType, date: b.date,
      packageId: b.packageId, guests: b.guests, hallRent: b.hallRent || 0,
      customPricePerHead: b.customPricePerHead || packages.find((p) => p.id === b.packageId)?.pricePerHead || 0,
      extraServices: b.extraServices ? b.extraServices.map((s) => ({ ...s })) : DEFAULT_EXTRA_SERVICES.map((s) => ({ ...s })),
      customServices: b.customServices ? b.customServices.map((s) => ({ ...s })) : [],
      menuChoices: b.menuChoices ? { ...b.menuChoices } : {}, menuItemOverrides: b.menuItemOverrides ? { ...b.menuItemOverrides } : {}, choicesFinalized: b.choicesFinalized || false,
      notes: b.notes || "",
      paymentMethod: b.paymentMethod, advancePayment: b.paidAmount, discount: b.discount || 0, status: b.status,
    });
    setEditingBooking(b);
    setModal("bookingForm");
  };

  const openView = (b) => setViewBooking(b);

  const handleSave = () => {
    if (!bookingForm.customerName || !bookingForm.customerPhone || !bookingForm.date) { notify("Please fill all required fields", "error"); return; }
    const excludeId = editingBooking?.id || null;
    if (bookingForm.status !== "cancelled" && checkConflict(bookingForm.date, bookingForm.hallId, bookingForm.slotId, excludeId)) { notify("⚠️ CONFLICT: This hall is already booked for this date/slot!", "error"); return; }
    if (blockedDates.includes(bookingForm.date)) { notify("⚠️ This date is blocked!", "error"); return; }

    const total = calcTotal(bookingForm);

    if (editingBooking) {
      // UPDATE existing booking
      const changes = [];
      if (editingBooking.customerName !== bookingForm.customerName) changes.push("name");
      if (editingBooking.date !== bookingForm.date) changes.push("date");
      if (editingBooking.hallId !== bookingForm.hallId) changes.push("hall");
      if (editingBooking.slotId !== bookingForm.slotId) changes.push("slot");
      if (editingBooking.status !== bookingForm.status) changes.push(`status→${bookingForm.status}`);
      if (editingBooking.guests !== bookingForm.guests) changes.push("guests");
      if (editingBooking.packageId !== bookingForm.packageId) changes.push("package");

      if (editingBooking.hallRent !== Number(bookingForm.hallRent)) changes.push("hallRent");

      setBookings((prev) => prev.map((b) => b.id === editingBooking.id ? {
        ...b,
        customerName: bookingForm.customerName, customerPhone: bookingForm.customerPhone,
        customerCNIC: bookingForm.customerCNIC, hallId: bookingForm.hallId, slotId: bookingForm.slotId,
        eventType: bookingForm.eventType, date: bookingForm.date, packageId: bookingForm.packageId,
        guests: Number(bookingForm.guests), hallRent: Number(bookingForm.hallRent),
        customPricePerHead: Number(bookingForm.customPricePerHead),
        extraServices: bookingForm.extraServices, customServices: bookingForm.customServices,
        menuChoices: bookingForm.menuChoices, menuItemOverrides: bookingForm.menuItemOverrides || {}, choicesFinalized: bookingForm.choicesFinalized,
        notes: bookingForm.notes, paymentMethod: bookingForm.paymentMethod,
        paidAmount: Number(bookingForm.advancePayment), discount: Number(bookingForm.discount),
        status: bookingForm.status, totalAmount: total,
      } : b));
      addAudit(`Edited booking for ${bookingForm.customerName} [${changes.join(", ")}]`, "Booking");
      notify(`Booking for "${bookingForm.customerName}" updated successfully`);
    } else {
      // CREATE new booking
      const newBooking = { ...bookingForm, id: genId(), totalAmount: total, paidAmount: Number(bookingForm.advancePayment), discount: Number(bookingForm.discount), hallRent: Number(bookingForm.hallRent), customPricePerHead: Number(bookingForm.customPricePerHead), extraServices: bookingForm.extraServices, customServices: bookingForm.customServices, menuChoices: bookingForm.menuChoices, menuItemOverrides: bookingForm.menuItemOverrides || {}, choicesFinalized: bookingForm.choicesFinalized, expenses: [], status: "pending", createdAt: toISO(today), guests: Number(bookingForm.guests) };
      setBookings((prev) => [newBooking, ...prev]);
      addAudit(`Created booking for ${bookingForm.customerName}`, "Booking");
      notify(`Booking created for ${bookingForm.customerName}`);
    }

    setModal(null);
    setEditingBooking(null);
    setBookingForm(emptyForm);
  };

  const updateStatus = (id, status) => {
    const booking = bookings.find((b) => b.id === id);
    if (booking && new Date(booking.date) < new Date(toISO(today))) {
      notify("⚠️ This event is completed and locked — cannot modify", "error");
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    addAudit(`Changed booking status to ${status}`, "Booking");
    notify(`Booking ${status}`);
  };

  const isPast = (dateStr) => new Date(dateStr) < new Date(toISO(today));

  // Expense management
  // Build menu items from package + choices
  const buildMenuFromBooking = (b) => {
    const pkg = packages.find((p) => p.id === b.packageId);
    if (!pkg) return [];
    return (pkg.items || []).map((item, idx) => {
      const it = typeof item === "string" ? { text: item, choice: false } : item;
      const overrideKey = `item_${idx}`;
      const override = b.menuItemOverrides?.[overrideKey];
      if (!it.choice) {
        return (override !== undefined && override !== "") ? override : it.text;
      }
      const choiceKey = `choice_${idx}`;
      const selected = b.menuChoices?.[choiceKey];
      return selected || `${it.options[0]} / ${it.options[1]} (undecided)`;
    });
  };

  const openExpenses = (b) => {
    setExpenseItems(b.expenses ? b.expenses.map((e) => ({ ...e })) : []);
    // Auto-populate menu from booking package if no saved menu
    if (b.programMenu && b.programMenu.length > 0) {
      setProgramMenu([...b.programMenu]);
    } else {
      setProgramMenu(buildMenuFromBooking(b));
    }
    setIncentivesAmount(b.incentives || 0);
    setNewExpense({ item: "", qty: "", unit: "kg", rate: "" });
    setNewMenuItem("");
    setSupplierExpenseForm({ supplierId: "", description: "", qty: "", amount: "", paidAmount: "", method: "Cash" });
    setExpenseModal(b);
  };

  // Add expense FROM a supplier — creates expense item AND adds ledger entry
  const addSupplierExpense = () => {
    const f = supplierExpenseForm;
    if (!f.supplierId) { notify("Please select a supplier", "error"); return; }
    if (!f.description.trim()) { notify("Enter a description", "error"); return; }
    if (!f.amount || Number(f.amount) <= 0) { notify("Enter a valid amount", "error"); return; }

    const supplier = suppliers.find((s) => s.id === f.supplierId);
    if (!supplier) { notify("Supplier not found", "error"); return; }

    const billAmount = Number(f.amount) || 0;
    const paidAmount = Number(f.paidAmount) || 0;
    const qty = f.qty || "";

    // 1. Add to program expenses
    const newItem = {
      id: genId(),
      item: `${supplier.type || supplier.name}: ${f.description.trim()}`,
      qty: qty,
      unit: "",
      rate: billAmount,
      total: billAmount,
      supplierId: supplier.id,
      supplierName: supplier.name,
    };
    setExpenseItems((prev) => [...prev, newItem]);

    // 2. Add to supplier ledger
    const ledgerEntry = {
      id: genId(),
      date: toISO(today),
      description: `${expenseModal.customerName} (${expenseModal.eventType}, ${fmtDate(expenseModal.date)}) — ${f.description.trim()}${qty ? ` (${qty})` : ""}`,
      billAmount: billAmount,
      paidAmount: paidAmount,
      method: f.method || "Cash",
    };
    setSuppliers((prev) => prev.map((s) => s.id === supplier.id ? { ...s, ledger: [...(s.ledger || []), ledgerEntry] } : s));

    addAudit(`Expense from ${supplier.name} for ${expenseModal.customerName}: ${fmt(billAmount)} (Paid: ${fmt(paidAmount)})`, "Expense");
    notify(`✅ ${supplier.name} ledger updated — Bill: ${fmt(billAmount)}${paidAmount > 0 ? `, Paid: ${fmt(paidAmount)}` : ""}`);

    // Reset form
    setSupplierExpenseForm({ supplierId: "", description: "", qty: "", amount: "", paidAmount: "", method: "Cash" });
  };

  // Delete an expense item AND its ledger entry (if linked to supplier)
  const removeExpenseItem = (id) => {
    const item = expenseItems.find((e) => e.id === id);
    setExpenseItems((prev) => prev.filter((e) => e.id !== id));

    // If this expense was linked to a supplier, remove the corresponding ledger entry
    if (item && item.supplierId) {
      setSuppliers((prev) => prev.map((s) => {
        if (s.id !== item.supplierId) return s;
        // Find ledger entry that matches by description containing customer name + this description
        const matchDesc = expenseModal.customerName;
        const filtered = (s.ledger || []).filter((l) => {
          // Match by description containing customer name AND amount
          return !(l.description?.includes(matchDesc) && l.billAmount === item.total);
        });
        return { ...s, ledger: filtered };
      }));
      notify(`Expense removed from ${item.supplierName || "supplier"} ledger`);
    }
  };

  const saveExpenses = () => {
    if (!expenseModal) return;
    setBookings((prev) => prev.map((b) => b.id === expenseModal.id ? { ...b, expenses: expenseItems, programMenu, incentives: Number(incentivesAmount) || 0 } : b));
    const totalExp = expenseItems.reduce((s, e) => s + (e.total || 0), 0);
    addAudit(`Updated expenses for ${expenseModal.customerName} — Total: ${fmt(totalExp)} (${expenseItems.length} items)`, "Booking");
    notify(`✅ Expenses saved for ${expenseModal.customerName}`);
    setExpenseModal(null);
  };

  const getEventPL = (b) => {
    const revenue = b.totalAmount - (b.discount || 0);
    const expenses = (b.expenses || []).reduce((s, e) => s + (e.total || 0), 0);
    const incentives = b.incentives || 0;
    return { revenue, expenses, incentives, profit: revenue - expenses - incentives };
  };

  const canEdit = hasPermission("booking", "full");
  const canSeeExpenses = user?.role === "owner";
  const formTotal = calcTotal(bookingForm);

  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "var(--slate)" }} />
          <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Google Calendar Style Picker */}
        <div style={{ position: "relative" }} ref={calRef}>
          <button onClick={() => { if (!calOpen) setCalNav(new Date(today.getFullYear(), today.getMonth(), 1)); setCalOpen(!calOpen); }}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 16px",
              background: filterMode !== "all" ? "rgba(148, 163, 184, 0.30)" : "var(--navy)",
              border: `1px solid ${filterMode !== "all" ? "var(--gold)" : "rgba(148, 163, 184, 0.40)"}`,
              borderRadius: 8, color: filterMode !== "all" ? "var(--gold)" : "var(--cream)",
              cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap",
            }}>
            <Calendar size={15} />
            {filterMode === "all" ? "📅 All Bookings" : filterMode === "date" ? fmtDate(filterDate) : (() => { const [y, m] = filterMonth.split("-"); return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }); })()}
            <ChevronLeft size={14} style={{ transform: calOpen ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
          </button>

          {calOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 300,
              background: "var(--navy)", border: "1px solid rgba(148, 163, 184, 0.40)",
              borderRadius: 12, boxShadow: "0 16px 48px rgba(0,0,0,0.5)", width: 320, padding: 0,
              overflow: "hidden",
            }}>
              {/* Today's Date Banner */}
              <div style={{ background: "rgba(148, 163, 184, 0.25)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Today's Date</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", fontFamily: "'Playfair Display',serif", marginTop: 2 }}>
                    {today.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--navy)", fontSize: 18, fontFamily: "'Playfair Display',serif" }}>
                  {today.getDate()}
                </div>
              </div>

              {/* Calendar Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid rgba(148, 163, 184, 0.25)" }}>
                <button style={{ background: "none", border: "none", color: "var(--slate)", cursor: "pointer", padding: 4, borderRadius: 4 }} onClick={() => setCalNav(new Date(calYear, calMonth - 1, 1))}><ChevronLeft size={18} /></button>
                <button onClick={handleCalMonthSelect}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: "var(--cream)", padding: "4px 12px", borderRadius: 6 }}
                  title="Click to filter this entire month"
                  onMouseEnter={(e) => e.target.style.background = "rgba(148, 163, 184, 0.25)"}
                  onMouseLeave={(e) => e.target.style.background = "none"}>
                  {calNav.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </button>
                <button style={{ background: "none", border: "none", color: "var(--slate)", cursor: "pointer", padding: 4, borderRadius: 4 }} onClick={() => setCalNav(new Date(calYear, calMonth + 1, 1))}><ChevronRight size={18} /></button>
              </div>

              {/* Year quick nav */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "8px 14px 4px" }}>
                {[calYear - 1, calYear, calYear + 1].map((y) => (
                  <button key={y} onClick={() => setCalNav(new Date(y, calMonth, 1))}
                    style={{
                      padding: "3px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit",
                      background: y === calYear ? "rgba(148, 163, 184, 0.30)" : "transparent",
                      color: y === calYear ? "var(--gold)" : "var(--slate)",
                    }}>{y}</button>
                ))}
              </div>

              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "8px 10px 0" }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "var(--slate)", padding: "4px 0" }}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 10px 10px", gap: 2 }}>
                {calCells.map((c, i) => {
                  const count = c.other ? 0 : getBookingCountForDay(c.day);
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(c.day).padStart(2, "0")}`;
                  const isToday2 = !c.other && c.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  const isSelected = filterMode === "date" && filterDate === dateStr && !c.other;
                  return (
                    <button key={i} onClick={() => handleCalDateClick(c.day, c.other)}
                      style={{
                        width: "100%", aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        border: isToday2 && !isSelected ? "2px solid var(--gold)" : "2px solid transparent",
                        borderRadius: "50%", fontSize: 13, cursor: c.other ? "default" : "pointer", fontFamily: "inherit",
                        fontWeight: isToday2 || isSelected ? 800 : 400,
                        background: isToday2 ? "var(--gold)" : isSelected ? "rgba(96,165,250,0.9)" : count > 0 && !c.other ? "rgba(148, 163, 184, 0.20)" : "transparent",
                        color: isToday2 ? "var(--navy)" : isSelected ? "#fff" : c.other ? "rgba(123,135,148,0.3)" : "var(--cream)",
                        boxShadow: isToday2 ? "0 0 12px rgba(249, 115, 22, 0.50)" : "none",
                        position: "relative",
                      }}>
                      {c.day}
                      {count > 0 && !c.other && (
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: isToday2 ? "var(--navy)" : isSelected ? "#fff" : "var(--green)", position: "absolute", bottom: 3 }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick actions */}
              <div style={{ display: "flex", gap: 6, padding: "8px 14px 12px", borderTop: "1px solid rgba(148, 163, 184, 0.25)" }}>
                <button onClick={handleCalToday} style={{ flex: 1, padding: "7px 0", border: "1px solid rgba(148, 163, 184, 0.40)", background: "transparent", color: "var(--gold)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Today</button>
                <button onClick={handleCalMonthSelect} style={{ flex: 1, padding: "7px 0", border: "1px solid rgba(148, 163, 184, 0.40)", background: "transparent", color: "var(--cream)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>This Month</button>
                <button onClick={handleCalClear} style={{ flex: 1, padding: "7px 0", border: "1px solid rgba(148, 163, 184, 0.40)", background: "transparent", color: "var(--slate)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>All</button>
              </div>
            </div>
          )}
        </div>

        <div className="tabs" style={{ marginBottom: 0, width: "auto" }}>
          {["all", "confirmed", "pending", "cancelled"].map((s) => (
            <button key={s} className={`tab-btn ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
        {canEdit && halls.length > 0 && <button className="btn btn-gold" onClick={openNew}><Plus size={16} /> New Booking</button>}
        {canEdit && halls.length === 0 && (
          <button className="btn btn-outline" onClick={() => notify("Please add a hall first in Multi-Hall section", "error")} title="No halls configured yet">
            <Plus size={16} /> New Booking
          </button>
        )}
      </div>

      {/* Active filters info */}
      {(filterMode !== "all" || filterStatus !== "all") && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 12, color: "var(--slate)" }}>
          <Filter size={14} />
          <span>Showing {filtered.length} bookings</span>
          {filterMode === "date" && <Badge type="active">{fmtDate(filterDate)}</Badge>}
          {filterMode === "month" && <Badge type="active">{(() => { const [y, m] = filterMonth.split("-"); return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }); })()}</Badge>}
          {filterStatus !== "all" && <Badge type={filterStatus}>{filterStatus}</Badge>}
          <button style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 12, fontFamily: "inherit", textDecoration: "underline" }} onClick={() => { setFilterMode("all"); setFilterDate(""); setFilterStatus("all"); }}>Clear filters</button>
        </div>
      )}

      <div className="card">
        <div className="scroll-table">
          <table className="data-table">
            <thead><tr><th>Booked On</th><th>Event Date</th><th>Customer</th><th>Event</th><th>Hall</th><th>Slot</th><th>Guests</th><th>Total</th><th>Paid</th><th>Status</th>{canSeeExpenses && <th>P&L</th>}<th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((b) => {
                const locked = isPast(b.date) && b.status !== "cancelled";
                const pl = getEventPL(b);
                const hasExpenses = (b.expenses || []).length > 0;
                return (
                <tr key={b.id} style={{ opacity: locked ? 0.7 : 1 }}>
                  <td style={{ whiteSpace: "nowrap", fontSize: 11, color: "var(--slate)" }}>{fmtDate(b.createdAt || b.date)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDate(b.date)}</td>
                  <td style={{ fontWeight: 500 }}>{b.customerName}</td>
                  <td>{b.eventType}</td>
                  <td>{halls.find((h) => h.id === b.hallId)?.name?.split(",")[0]}</td>
                  <td>{SLOTS.find((s) => s.id === b.slotId)?.label}</td>
                  <td>{b.guests}</td>
                  <td>{fmt(b.totalAmount)}</td>
                  <td style={{ color: b.paidAmount < b.totalAmount ? "var(--yellow)" : "var(--green)" }}>{fmt(b.paidAmount)}</td>
                  <td>
                    {locked ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(123,135,148,0.15)", color: "var(--slate)" }}>
                        <Lock size={10} /> Completed
                      </span>
                    ) : (
                      <Badge type={b.status}>{b.status}</Badge>
                    )}
                  </td>
                  {canSeeExpenses && (
                    <td>
                      {hasExpenses ? (
                        <span style={{ fontSize: 12, fontWeight: 600, color: pl.profit >= 0 ? "var(--green)" : "var(--red)" }}>
                          {pl.profit >= 0 ? "+" : ""}{fmt(pl.profit)}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--slate)" }}>—</span>
                      )}
                    </td>
                  )}
                  <td>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <button className="btn-icon" title="View Details" onClick={() => openView(b)}><Eye size={14} /></button>
                      {canSeeExpenses && <button className="btn-icon" title="Event Expenses" onClick={() => openExpenses(b)} style={{ color: hasExpenses ? "var(--gold)" : "var(--slate)" }}><FileText size={14} /></button>}
                      {locked ? (
                        <span title="Event completed — locked" style={{ display: "flex", alignItems: "center", color: "var(--slate)", cursor: "default" }}><Lock size={14} /></span>
                      ) : (
                        <>
                          {b.status !== "cancelled" && canEdit && <button className="btn-icon" title="Edit Booking" onClick={() => openEdit(b)}><Edit size={14} /></button>}
                          {b.status === "pending" && canEdit && <button className="btn-icon" title="Confirm" onClick={() => updateStatus(b.id, "confirmed")} style={{ color: "var(--green)" }}><Check size={14} /></button>}
                          {b.status !== "cancelled" && canEdit && <button className="btn-icon" title="Cancel Booking" onClick={() => updateStatus(b.id, "cancelled")} style={{ color: "var(--red)" }}><X size={14} /></button>}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><Package size={40} /><p>No bookings found</p></div>}
        </div>
      </div>

      {/* VIEW BOOKING DETAIL MODAL */}
      {viewBooking && (() => {
        const viewLocked = isPast(viewBooking.date) && viewBooking.status !== "cancelled";
        return (
        <Modal title={`Booking Details — ${viewBooking.customerName}`} onClose={() => setViewBooking(null)} footer={
          <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {viewLocked ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--slate)" }}>
                  <Lock size={14} /> Event completed — locked for editing
                </span>
              ) : (
                viewBooking.status !== "cancelled" && canEdit && <button className="btn btn-outline" onClick={() => { setViewBooking(null); openEdit(viewBooking); }}><Edit size={14} /> Edit</button>
              )}
              <button className="btn btn-gold" onClick={() => printReceipt(viewBooking)}><Printer size={14} /> Print Receipt</button>
            </div>
            <button className="btn btn-outline" onClick={() => setViewBooking(null)}>Close</button>
          </div>
        }>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            {viewLocked ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "rgba(123,135,148,0.15)", color: "var(--slate)" }}>
                <Lock size={12} /> Completed Event
              </span>
            ) : (
              <Badge type={viewBooking.status} style={{ fontSize: 14, padding: "6px 16px" }}>{viewBooking.status.toUpperCase()}</Badge>
            )}
            <span style={{ fontSize: 12, color: "var(--slate)" }}>Created: {fmtDate(viewBooking.createdAt)}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { label: "Customer Name", value: viewBooking.customerName },
              { label: "Phone", value: viewBooking.customerPhone },
              { label: "CNIC", value: viewBooking.customerCNIC || "—" },
              { label: "Booking Date", value: fmtDate(viewBooking.createdAt || viewBooking.date) },
              { label: "Event Date", value: fmtDate(viewBooking.date) },
              { label: "Hall", value: halls.find((h) => h.id === viewBooking.hallId)?.name },
              { label: "Time Slot", value: SLOTS.find((s) => s.id === viewBooking.slotId)?.label + " — " + SLOTS.find((s) => s.id === viewBooking.slotId)?.time },
              { label: "Event Type", value: viewBooking.eventType },
              { label: "Package", value: packages.find((p) => p.id === viewBooking.packageId)?.name || "Custom" },
              { label: "Guests", value: viewBooking.guests },
              { label: "Hall Rent", value: fmt(viewBooking.hallRent || 0) },
              { label: "Per Head", value: (() => { const orig = packages.find((p) => p.id === viewBooking.packageId)?.pricePerHead || 0; const custom = viewBooking.customPricePerHead || orig; return custom < orig ? `${fmt(custom)} (was ${fmt(orig)})` : fmt(custom); })() },
              { label: "Payment Method", value: viewBooking.paymentMethod },
            ].map((item, i) => (
              <div key={i} style={{ padding: "8px 0" }}>
                <div style={{ fontSize: 11, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--cream)" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Menu Items with choices */}
          {(() => {
            const vpkg = packages.find((p) => p.id === viewBooking.packageId);
            if (!vpkg) return null;
            return (
              <div style={{ background: "var(--navy-light)", padding: 14, borderRadius: 8, marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, letterSpacing: 1 }}>MENU — {vpkg.name}</div>
                  {viewBooking.choicesFinalized ? (
                    <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 600 }}>✅ Choices Finalized</span>
                  ) : (
                    <span style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 600 }}>⏳ Choices Pending</span>
                  )}
                </div>
                {(vpkg.items || []).map((item, idx) => {
                  const it = typeof item === "string" ? { text: item, choice: false } : item;
                  const choiceKey = `choice_${idx}`;
                  const overrideKey = `item_${idx}`;
                  const selected = viewBooking.menuChoices?.[choiceKey];
                  const override = viewBooking.menuItemOverrides?.[overrideKey];
                  if (!it.choice) {
                    const display = (override !== undefined && override !== "") ? override : it.text;
                    const isCustomized = (override !== undefined && override !== it.text);
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: isCustomized ? "var(--gold)" : "var(--cream)" }}>
                        <Check size={13} style={{ color: isCustomized ? "var(--gold)" : "var(--green)" }} />
                        <span style={{ fontWeight: isCustomized ? 600 : 400, fontStyle: isCustomized ? "italic" : "normal" }}>{display}</span>
                        {isCustomized && <span style={{ fontSize: 10, color: "var(--slate)" }}>(customized — original: {it.text})</span>}
                      </div>
                    );
                  }
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13 }}>
                      {selected ? (
                        <><Check size={13} style={{ color: "var(--gold)" }} /> <span style={{ color: "var(--gold)", fontWeight: 600 }}>{selected}</span> <span style={{ fontSize: 10, color: "var(--slate)" }}>(from: {it.options.join(" / ")})</span></>
                      ) : (
                        <><span style={{ color: "var(--yellow)", fontSize: 12 }}>⏳</span> <span style={{ color: "var(--yellow)" }}>{it.options.join(" / ")}</span> <span style={{ fontSize: 10, color: "var(--slate)" }}>— not yet decided</span></>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {viewBooking.notes && (
            <div style={{ marginTop: 8, padding: "8px 0" }}>
              <div style={{ fontSize: 11, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: 13, color: "var(--cream)" }}>{viewBooking.notes}</div>
            </div>
          )}

          {/* Extra Services in view modal */}
          {(() => {
            const allSvcs = [...(viewBooking.extraServices || []), ...(viewBooking.customServices || [])];
            if (allSvcs.length === 0) return null;
            const includedCharged = allSvcs.filter((s) => s.enabled !== false && !s.free && Number(s.amount) > 0);
            const includedFree = allSvcs.filter((s) => s.enabled !== false && s.free);
            const excluded = allSvcs.filter((s) => s.enabled === false);
            const chargedTotal = includedCharged.reduce((s, sv) => s + (Number(sv.amount) || 0), 0);
            return (
              <div style={{ background: "var(--navy-light)", padding: 14, borderRadius: 8, marginTop: 12 }}>
                <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>EXTRA SERVICES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {allSvcs.map((sv, i) => {
                    const isEnabled = sv.enabled !== false;
                    const isFree = sv.free === true;
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: isEnabled ? 1 : 0.5 }}>
                        <span style={{ color: isEnabled ? "var(--cream)" : "var(--slate)", textDecoration: isEnabled ? "none" : "line-through", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: isEnabled ? "var(--green)" : "var(--red)" }}>{isEnabled ? "✓" : "✗"}</span>
                          {sv.label}
                        </span>
                        {isEnabled ? (
                          isFree ? <span style={{ color: "var(--green)", fontWeight: 500, fontSize: 12 }}>🎁 FREE</span>
                          : Number(sv.amount) > 0 ? <span style={{ color: "var(--cream)", fontWeight: 500 }}>{fmt(Number(sv.amount))}</span>
                          : <span style={{ color: "var(--slate)", fontSize: 12 }}>PKR 0</span>
                        ) : (
                          <span style={{ color: "var(--red)", fontSize: 11 }}>Not included</span>
                        )}
                      </div>
                    );
                  })}
                  {chargedTotal > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, borderTop: "1px solid rgba(148, 163, 184, 0.30)", paddingTop: 6, marginTop: 4 }}>
                      <span style={{ color: "var(--gold)" }}>Charged Services Total</span>
                      <span style={{ color: "var(--gold)" }}>{fmt(chargedTotal)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <div style={{ background: "var(--navy-light)", padding: 16, borderRadius: 8, marginTop: 16 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>FINANCIAL SUMMARY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Total Amount</span><span style={{ fontWeight: 600 }}>{fmt(viewBooking.totalAmount)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Discount</span><span style={{ color: "var(--gold)" }}>{viewBooking.discount > 0 ? `-${fmt(viewBooking.discount)}` : "—"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Paid</span><span style={{ color: "var(--green)" }}>{fmt(viewBooking.paidAmount)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, borderTop: "1px solid rgba(148, 163, 184, 0.30)", paddingTop: 8, marginTop: 4 }}>
                <span style={{ color: "var(--cream)" }}>Balance Due</span>
                <span style={{ color: Math.max(0, viewBooking.totalAmount - viewBooking.paidAmount - viewBooking.discount) > 0 ? "var(--red)" : "var(--green)" }}>
                  {fmt(Math.max(0, viewBooking.totalAmount - viewBooking.paidAmount - viewBooking.discount))}
                </span>
              </div>
            </div>
          </div>

          {/* EVENT EXPENSES & P&L — OWNER ONLY */}
          {canSeeExpenses && (() => {
            const pl = getEventPL(viewBooking);
            const exps = viewBooking.expenses || [];
            return (
              <div style={{ background: pl.profit >= 0 ? "var(--green-bg)" : "var(--red-bg)", border: `1px solid ${pl.profit >= 0 ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`, padding: 16, borderRadius: 8, marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, letterSpacing: 1 }}>EVENT PROFIT / LOSS</div>
                  <button className="btn btn-sm btn-outline" onClick={() => { setViewBooking(null); openExpenses(viewBooking); }}>
                    <FileText size={12} /> {exps.length > 0 ? "Edit Expenses" : "Add Expenses"}
                  </button>
                </div>
                {exps.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "var(--slate)" }}>Revenue (after discount)</span>
                      <span style={{ color: "var(--green)", fontWeight: 600 }}>{fmt(pl.revenue)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "var(--slate)" }}>Total Expenses ({exps.length} items)</span>
                      <span style={{ color: "var(--red)", fontWeight: 600 }}>{fmt(pl.expenses)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, borderTop: `1px solid ${pl.profit >= 0 ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`, paddingTop: 8, marginTop: 4, fontFamily: "'Playfair Display',serif" }}>
                      <span style={{ color: "var(--cream)" }}>{pl.profit >= 0 ? "✅ Profit" : "❌ Loss"}</span>
                      <span style={{ color: pl.profit >= 0 ? "var(--green)" : "var(--red)" }}>{pl.profit >= 0 ? "+" : ""}{fmt(pl.profit)}</span>
                    </div>
                    {viewBooking.guests > 0 && (
                      <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>
                        Cost per head: {fmt(Math.round(pl.expenses / viewBooking.guests))} | Revenue per head: {fmt(Math.round(pl.revenue / viewBooking.guests))} | Profit per head: {fmt(Math.round(pl.profit / viewBooking.guests))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--slate)" }}>No expenses recorded yet. Click "Add Expenses" to enter costs (chicken, meat, rice, etc.) and see profit/loss for this event.</div>
                )}
              </div>
            );
          })()}
        </Modal>
        );
      })()}

      {/* CREATE / EDIT BOOKING MODAL */}
      {modal === "bookingForm" && (
        <Modal title={editingBooking ? `Edit Booking — ${editingBooking.customerName}` : "New Booking"} onClose={() => { setModal(null); setEditingBooking(null); }} footer={<><button className="btn btn-outline" onClick={() => { setModal(null); setEditingBooking(null); }}>Cancel</button><button className="btn btn-gold" onClick={handleSave}>{editingBooking ? "Save Changes" : "Create Booking"}</button></>}>
          
          {editingBooking && (
            <div style={{ background: "rgba(148, 163, 184, 0.20)", padding: 12, borderRadius: 8, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Info size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--gold)" }}>Editing booking #{editingBooking.id.slice(0, 6).toUpperCase()} — You can modify all fields including status, date, hall, guests, and payment.</span>
            </div>
          )}

          <div className="form-row">
            <div className="form-group"><label>Customer Name *</label><input className="form-input" value={bookingForm.customerName} onChange={(e) => setBookingForm((f) => ({ ...f, customerName: e.target.value }))} /></div>
            <div className="form-group"><label>Phone *</label><input className="form-input" value={bookingForm.customerPhone} onChange={(e) => setBookingForm((f) => ({ ...f, customerPhone: e.target.value }))} placeholder="0300-1234567" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>CNIC (Optional)</label><input className="form-input" value={bookingForm.customerCNIC} onChange={(e) => setBookingForm((f) => ({ ...f, customerCNIC: e.target.value }))} /></div>
            <div className="form-group"><label>Event Date *</label><input type="date" className="form-input" value={bookingForm.date} onChange={(e) => setBookingForm((f) => ({ ...f, date: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Hall</label><select className="form-input" value={bookingForm.hallId} onChange={(e) => setBookingForm((f) => ({ ...f, hallId: e.target.value }))} disabled={visibleHalls.length === 1}>{visibleHalls.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.capacity} pax)</option>)}</select></div>
            <div className="form-group"><label>Time Slot</label><select className="form-input" value={bookingForm.slotId} onChange={(e) => setBookingForm((f) => ({ ...f, slotId: e.target.value }))}>{SLOTS.map((s) => <option key={s.id} value={s.id}>{s.label} — {s.time}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Event Type</label><select className="form-input" value={bookingForm.eventType} onChange={(e) => setBookingForm((f) => ({ ...f, eventType: e.target.value }))}>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label>Package</label><select className="form-input" value={bookingForm.packageId} onChange={(e) => { const pkg = packages.find((p) => p.id === e.target.value); setBookingForm((f) => ({ ...f, packageId: e.target.value, customPricePerHead: pkg?.pricePerHead || 0, menuChoices: {}, menuItemOverrides: {}, choicesFinalized: false })); }}>{packages.map((p) => <option key={p.id} value={p.id}>{p.name} — {fmt(p.pricePerHead)}/head</option>)}</select></div>
          </div>

          {/* Editable Price Per Head */}
          {(() => {
            const origPrice = packages.find((p) => p.id === bookingForm.packageId)?.pricePerHead || 0;
            const customPrice = Number(bookingForm.customPricePerHead) || 0;
            const isDiscounted = customPrice > 0 && customPrice < origPrice;
            const saving = origPrice - customPrice;
            return (
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Price Per Head (PKR)
                  <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— editable for customer discount</span>
                </label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="number" className="form-input" style={{ flex: 1, fontSize: 16, fontWeight: 600, color: isDiscounted ? "var(--green)" : "var(--gold)", margin: 0 }} value={bookingForm.customPricePerHead} onChange={(e) => setBookingForm((f) => ({ ...f, customPricePerHead: e.target.value }))} />
                  {isDiscounted && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ fontSize: 12, color: "var(--slate)", textDecoration: "line-through" }}>{fmt(origPrice)}</span>
                      <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>-{fmt(saving)} off</span>
                    </div>
                  )}
                  {customPrice > origPrice && (
                    <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 600 }}>+{fmt(customPrice - origPrice)} extra</span>
                  )}
                  <button onClick={() => setBookingForm((f) => ({ ...f, customPricePerHead: origPrice }))}
                    style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(148, 163, 184, 0.40)", background: "transparent", color: "var(--slate)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                    Reset {fmt(origPrice)}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* MENU ITEMS & CHOICES */}
          {(() => {
            const selectedPkg = packages.find((p) => p.id === bookingForm.packageId);
            if (!selectedPkg) return null;
            const choiceItems = (selectedPkg.items || []).filter((it) => typeof it === "object" && it.choice);
            return (
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Menu — {selectedPkg.name} ({fmt(Number(bookingForm.customPricePerHead) || selectedPkg.pricePerHead)}/head)</span>
                  {choiceItems.length > 0 && (
                    <span style={{ fontSize: 10, color: bookingForm.choicesFinalized ? "var(--green)" : "var(--yellow)", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>
                      {bookingForm.choicesFinalized ? "✅ Choices Finalized" : "⏳ Customer will decide later"}
                    </span>
                  )}
                </label>
                <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--slate)", marginBottom: 8, fontStyle: "italic" }}>
                    💡 You can customize menu items for this customer (e.g. replace Suji Halwa with Kheer)
                  </div>
                  {(selectedPkg.items || []).map((item, idx) => {
                    const it = typeof item === "string" ? { text: item, choice: false } : item;
                    const overrideKey = `item_${idx}`;
                    const overrideText = bookingForm.menuItemOverrides?.[overrideKey];
                    const isCustomized = overrideText !== undefined;
                    const displayText = isCustomized ? overrideText : it.text;
                    const setOverride = (val) => setBookingForm((f) => {
                      const ov = { ...(f.menuItemOverrides || {}) };
                      if (val === null) delete ov[overrideKey];
                      else ov[overrideKey] = val;
                      return { ...f, menuItemOverrides: ov };
                    });

                    if (!it.choice) {
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13 }}>
                          <Check size={14} style={{ color: "var(--green)", flexShrink: 0 }} />
                          <input
                            type="text"
                            value={displayText}
                            onChange={(e) => setOverride(e.target.value)}
                            placeholder={it.text}
                            style={{
                              flex: 1, background: "transparent", border: "none",
                              borderBottom: `1px ${isCustomized ? "solid var(--gold)" : "dashed rgba(148, 163, 184, 0.40)"}`,
                              color: isCustomized ? "var(--gold)" : "var(--cream)",
                              fontSize: 13, fontFamily: "inherit", outline: "none", padding: "2px 4px",
                              fontStyle: isCustomized ? "italic" : "normal",
                              fontWeight: isCustomized ? 600 : 400,
                            }}
                          />
                          {isCustomized && (
                            <button
                              type="button"
                              onClick={() => setOverride(null)}
                              title={`Reset to "${it.text}"`}
                              style={{ background: "none", border: "none", color: "var(--slate)", cursor: "pointer", fontSize: 11, padding: "2px 6px", borderRadius: 4 }}
                            >
                              ↺ reset
                            </button>
                          )}
                          {isCustomized && (
                            <span style={{ fontSize: 9, color: "var(--gold)", fontStyle: "italic", whiteSpace: "nowrap" }}>
                              was: {it.text}
                            </span>
                          )}
                        </div>
                      );
                    }
                    const choiceKey = `choice_${idx}`;
                    const selected = bookingForm.menuChoices[choiceKey] || "";
                    return (
                      <div key={idx} style={{ padding: "6px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "var(--navy)", fontWeight: 800, flexShrink: 0 }}>?</div>
                          <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>Customer Choice:</span>
                        </div>
                        <div style={{ display: "flex", gap: 6, paddingLeft: 22 }}>
                          {it.options.map((opt) => (
                            <button key={opt} onClick={() => setBookingForm((f) => ({ ...f, menuChoices: { ...f.menuChoices, [choiceKey]: opt } }))}
                              style={{
                                flex: 1, padding: "8px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                border: `2px solid ${selected === opt ? "var(--gold)" : "rgba(148, 163, 184, 0.30)"}`,
                                background: selected === opt ? "rgba(148, 163, 184, 0.30)" : "var(--navy)",
                                color: selected === opt ? "var(--gold)" : "var(--slate)",
                              }}>
                              {selected === opt ? "✓ " : ""}{opt}
                            </button>
                          ))}
                          {!bookingForm.choicesFinalized && (
                            <button onClick={() => setBookingForm((f) => { const mc = { ...f.menuChoices }; delete mc[choiceKey]; return { ...f, menuChoices: mc }; })}
                              style={{ padding: "8px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit", border: `2px solid ${!selected ? "var(--yellow)" : "rgba(15, 23, 42, 0.08)"}`, background: !selected ? "var(--yellow-bg)" : "transparent", color: !selected ? "var(--yellow)" : "var(--slate)" }}>
                              Later
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {choiceItems.length > 0 && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(148, 163, 184, 0.25)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "var(--slate)" }}>
                        {Object.keys(bookingForm.menuChoices).length} of {choiceItems.length} choices made
                      </span>
                      <button onClick={() => setBookingForm((f) => ({ ...f, choicesFinalized: !f.choicesFinalized }))}
                        style={{
                          padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: "none",
                          background: bookingForm.choicesFinalized ? "var(--green-bg)" : "var(--yellow-bg)",
                          color: bookingForm.choicesFinalized ? "var(--green)" : "var(--yellow)",
                        }}>
                        {bookingForm.choicesFinalized ? "✅ Finalized — Click to Reopen" : "🔒 Finalize Choices"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="form-row">
            <div className="form-group"><label>No. of Guests</label><input type="number" className="form-input" value={bookingForm.guests} onChange={(e) => setBookingForm((f) => ({ ...f, guests: Number(e.target.value) }))} /></div>
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Hall Rent (PKR) *
                <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— set as per customer deal</span>
              </label>
              <input type="number" className="form-input" style={{ fontSize: 16, fontWeight: 600, color: "var(--gold)" }} value={bookingForm.hallRent} onChange={(e) => setBookingForm((f) => ({ ...f, hallRent: e.target.value }))} placeholder="e.g. 250000" />
            </div>
          </div>

          {/* EXTRA SERVICES SECTION */}
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Extra Services</span>
              <span style={{ fontSize: 10, color: "var(--slate)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>Toggle ✓ to include, ✗ to exclude, or mark as FREE</span>
            </label>
            <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {bookingForm.extraServices.map((sv, idx) => {
                const isEnabled = sv.enabled !== false;
                const isFree = sv.free === true;
                return (
                  <div key={sv.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, background: isEnabled ? "transparent" : "rgba(248,113,113,0.05)", opacity: isEnabled ? 1 : 0.5 }}>
                    {/* Toggle include/exclude */}
                    <button onClick={() => setBookingForm((f) => { const arr = [...f.extraServices]; arr[idx] = { ...arr[idx], enabled: !isEnabled, free: false, amount: !isEnabled ? arr[idx].amount : 0 }; return { ...f, extraServices: arr }; })}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        background: isEnabled ? "var(--green-bg)" : "var(--red-bg)", color: isEnabled ? "var(--green)" : "var(--red)", fontSize: 14, fontWeight: 800 }}>
                      {isEnabled ? "✓" : "✗"}
                    </button>

                    {/* Label */}
                    <span style={{ fontSize: 13, width: 145, flexShrink: 0, color: isEnabled ? "var(--cream)" : "var(--slate)", textDecoration: isEnabled ? "none" : "line-through" }}>{sv.label}</span>

                    {isEnabled && (
                      <>
                        {/* Free toggle */}
                        <button onClick={() => setBookingForm((f) => { const arr = [...f.extraServices]; arr[idx] = { ...arr[idx], free: !isFree, amount: !isFree ? 0 : arr[idx].amount }; return { ...f, extraServices: arr }; })}
                          style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${isFree ? "var(--green)" : "rgba(148, 163, 184, 0.30)"}`, background: isFree ? "var(--green-bg)" : "transparent", color: isFree ? "var(--green)" : "var(--slate)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                          {isFree ? "✓ FREE" : "FREE"}
                        </button>

                        {/* Amount input */}
                        {!isFree && (
                          <div style={{ position: "relative", flex: 1 }}>
                            <span style={{ position: "absolute", left: 8, top: 7, fontSize: 11, color: "var(--slate)" }}>PKR</span>
                            <input type="number" className="form-input" style={{ paddingLeft: 38, margin: 0, padding: "6px 8px 6px 38px", fontSize: 13 }} value={sv.amount} placeholder="0"
                              onChange={(e) => setBookingForm((f) => { const arr = [...f.extraServices]; arr[idx] = { ...arr[idx], amount: e.target.value }; return { ...f, extraServices: arr }; })} />
                          </div>
                        )}
                        {isFree && <span style={{ flex: 1, fontSize: 12, color: "var(--green)", textAlign: "right" }}>Complimentary</span>}
                      </>
                    )}
                    {!isEnabled && <span style={{ flex: 1, fontSize: 11, color: "var(--red)", textAlign: "right" }}>Not included</span>}
                  </div>
                );
              })}

              {/* Custom services */}
              {bookingForm.customServices.map((sv, idx) => {
                const isEnabled = sv.enabled !== false;
                const isFree = sv.free === true;
                return (
                  <div key={`custom-${idx}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, borderLeft: "3px solid var(--gold)" }}>
                    <button onClick={() => setBookingForm((f) => { const arr = [...f.customServices]; arr[idx] = { ...arr[idx], enabled: !isEnabled }; return { ...f, customServices: arr }; })}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        background: isEnabled ? "var(--green-bg)" : "var(--red-bg)", color: isEnabled ? "var(--green)" : "var(--red)", fontSize: 14, fontWeight: 800 }}>
                      {isEnabled ? "✓" : "✗"}
                    </button>
                    <input className="form-input" style={{ width: 130, flexShrink: 0, margin: 0, padding: "6px 8px", fontSize: 13, textDecoration: isEnabled ? "none" : "line-through" }} value={sv.label} placeholder="Service name"
                      onChange={(e) => setBookingForm((f) => { const arr = [...f.customServices]; arr[idx] = { ...arr[idx], label: e.target.value }; return { ...f, customServices: arr }; })} />
                    {isEnabled && (
                      <>
                        <button onClick={() => setBookingForm((f) => { const arr = [...f.customServices]; arr[idx] = { ...arr[idx], free: !isFree, amount: !isFree ? 0 : arr[idx].amount }; return { ...f, customServices: arr }; })}
                          style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${isFree ? "var(--green)" : "rgba(148, 163, 184, 0.30)"}`, background: isFree ? "var(--green-bg)" : "transparent", color: isFree ? "var(--green)" : "var(--slate)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                          {isFree ? "✓ FREE" : "FREE"}
                        </button>
                        {!isFree && (
                          <div style={{ position: "relative", flex: 1 }}>
                            <span style={{ position: "absolute", left: 8, top: 7, fontSize: 11, color: "var(--slate)" }}>PKR</span>
                            <input type="number" className="form-input" style={{ paddingLeft: 38, margin: 0, padding: "6px 8px 6px 38px", fontSize: 13 }} value={sv.amount} placeholder="0"
                              onChange={(e) => setBookingForm((f) => { const arr = [...f.customServices]; arr[idx] = { ...arr[idx], amount: e.target.value }; return { ...f, customServices: arr }; })} />
                          </div>
                        )}
                        {isFree && <span style={{ flex: 1, fontSize: 12, color: "var(--green)", textAlign: "right" }}>Complimentary</span>}
                      </>
                    )}
                    <button className="btn-icon" style={{ width: 24, height: 24, color: "var(--red)", flexShrink: 0 }} onClick={() => setBookingForm((f) => ({ ...f, customServices: f.customServices.filter((_, i) => i !== idx) }))}><X size={12} /></button>
                  </div>
                );
              })}

              <button className="btn btn-sm btn-outline" style={{ marginTop: 4, alignSelf: "flex-start" }} onClick={() => setBookingForm((f) => ({ ...f, customServices: [...f.customServices, { key: `custom_${genId()}`, label: "", amount: 0, enabled: true, free: false }] }))}>
                <Plus size={12} /> Add Custom Service
              </button>

              {/* Summary */}
              {(() => {
                const included = bookingForm.extraServices.filter((sv) => sv.enabled !== false);
                const freeCount = [...bookingForm.extraServices, ...bookingForm.customServices].filter((sv) => sv.enabled !== false && sv.free).length;
                const chargedTotal = bookingForm.extraServices.filter((sv) => sv.enabled !== false && !sv.free).reduce((s, sv) => s + (Number(sv.amount) || 0), 0) + bookingForm.customServices.filter((sv) => sv.enabled !== false && !sv.free).reduce((s, sv) => s + (Number(sv.amount) || 0), 0);
                const excludedCount = bookingForm.extraServices.filter((sv) => sv.enabled === false).length;
                return (
                  <div style={{ paddingTop: 8, borderTop: "1px solid rgba(148, 163, 184, 0.30)", marginTop: 4, fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                    <div style={{ display: "flex", gap: 10, color: "var(--slate)" }}>
                      <span>✓ {included.length} included</span>
                      {freeCount > 0 && <span style={{ color: "var(--green)" }}>🎁 {freeCount} free</span>}
                      {excludedCount > 0 && <span style={{ color: "var(--red)" }}>✗ {excludedCount} excluded</span>}
                    </div>
                    {chargedTotal > 0 && <span style={{ fontWeight: 600, color: "var(--gold)" }}>Charges: {fmt(chargedTotal)}</span>}
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group"><label>{editingBooking ? "Total Paid Amount" : "Advance Payment"}</label><input type="number" className="form-input" value={bookingForm.advancePayment} onChange={(e) => setBookingForm((f) => ({ ...f, advancePayment: e.target.value }))} /></div>
            <div className="form-group"><label>Payment Method</label><select className="form-input" value={bookingForm.paymentMethod} onChange={(e) => setBookingForm((f) => ({ ...f, paymentMethod: e.target.value }))}><option>Cash</option><option>Bank Transfer</option><option>Easypaisa</option><option>JazzCash</option></select></div>
          </div>

          {editingBooking && (
            <div className="form-group">
              <label>Booking Status</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["pending", "confirmed", "cancelled"].map((s) => (
                  <button key={s} onClick={() => setBookingForm((f) => ({ ...f, status: s }))}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 8, border: "2px solid",
                      borderColor: bookingForm.status === s ? (s === "confirmed" ? "var(--green)" : s === "pending" ? "var(--yellow)" : "var(--red)") : "rgba(15, 23, 42, 0.10)",
                      background: bookingForm.status === s ? (s === "confirmed" ? "var(--green-bg)" : s === "pending" ? "var(--yellow-bg)" : "var(--red-bg)") : "var(--navy-light)",
                      color: bookingForm.status === s ? (s === "confirmed" ? "var(--green)" : s === "pending" ? "var(--yellow)" : "var(--red)") : "var(--slate)",
                      cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center", textTransform: "capitalize", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                    {s === "confirmed" && <CheckCircle size={14} />}
                    {s === "pending" && <Clock size={14} />}
                    {s === "cancelled" && <XCircle size={14} />}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bookingForm.date && bookingForm.hallId && bookingForm.status !== "cancelled" && checkConflict(bookingForm.date, bookingForm.hallId, bookingForm.slotId, editingBooking?.id) && (
            <div style={{ background: "var(--red-bg)", padding: 12, borderRadius: 8, display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={16} style={{ color: "var(--red)" }} />
              <span style={{ fontSize: 13, color: "var(--red)", fontWeight: 600 }}>⚠️ CONFLICT: This hall is already booked for this date/slot!</span>
            </div>
          )}
          <div className="form-group"><label>Notes</label><textarea className="form-input" rows={2} value={bookingForm.notes} onChange={(e) => setBookingForm((f) => ({ ...f, notes: e.target.value }))} /></div>
          
          {bookingForm.guests > 0 && bookingForm.hallId && (
            <div style={{ background: "var(--navy-light)", padding: 14, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 6 }}>{editingBooking ? "UPDATED TOTAL" : "ESTIMATED TOTAL"}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)", fontFamily: "'Playfair Display',serif" }}>
                {fmt(formTotal)}
              </div>
              <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 4 }}>
                {(() => {
                  const svcTotal = (bookingForm.extraServices || []).filter((sv) => sv.enabled !== false && !sv.free).reduce((s, sv) => s + (Number(sv.amount) || 0), 0) + (bookingForm.customServices || []).filter((sv) => sv.enabled !== false && !sv.free).reduce((s, sv) => s + (Number(sv.amount) || 0), 0);
                  const freeCount = [...(bookingForm.extraServices || []), ...(bookingForm.customServices || [])].filter((sv) => sv.enabled !== false && sv.free).length;
                  return <>
                    Hall Rent: {fmt(Number(bookingForm.hallRent) || 0)} + Catering: {fmt(bookingForm.guests * (Number(bookingForm.customPricePerHead) || 0))}
                    {svcTotal > 0 && <> + Services: {fmt(svcTotal)}</>}
                    {freeCount > 0 && <> | 🎁 {freeCount} free</>}
                  </>;
                })()}
              </div>
              {editingBooking && (
                <div style={{ fontSize: 12, color: "var(--green)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <DollarSign size={12} /> Paid: {fmt(Number(bookingForm.advancePayment))} | Balance: {fmt(Math.max(0, formTotal - Number(bookingForm.advancePayment)))}
                </div>
              )}
            </div>
          )}

          {/* ═══ SMART PROFIT ESTIMATOR ═══ */}
          {bookingForm.guests > 0 && bookingForm.hallId && (() => {
            const est = estimateProfit(bookingForm);
            if (!est) return null;

            // Cold start: no past bookings with expenses
            if (est.confidence === "none") {
              return (
                <div style={{ marginTop: 12, padding: 14, background: "rgba(37, 99, 235, 0.06)", border: "1px solid rgba(37, 99, 235, 0.20)", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ fontSize: 18 }}>🔮</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cream)", marginBottom: 3 }}>
                        Smart Profit Estimate — Coming Soon
                      </div>
                      <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                        Once you complete a few bookings and record their expenses (in <strong>Program Expenses</strong>),
                        this section will show expected profit based on your past bookings.
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Confidence colors
            const confColor = est.confidence === "high" ? "var(--green)" : est.confidence === "medium" ? "#d97706" : "var(--slate)";
            const confLabel = est.confidence === "high" ? "High confidence" : est.confidence === "medium" ? "Medium confidence" : "Low confidence";

            // Profit color
            const profitColor = est.expectedProfit > 0 ? "var(--green)" : est.expectedProfit < 0 ? "var(--red)" : "var(--slate)";
            const marginPct = (est.projectedMargin * 100).toFixed(1);

            return (
              <div style={{ marginTop: 12, padding: 16, background: "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(249, 115, 22, 0.02))", border: "1px solid rgba(249, 115, 22, 0.20)", borderRadius: 10 }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(15, 23, 42, 0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 18 }}>🔮</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cream)", letterSpacing: 0.3 }}>
                        Smart Profit Estimate
                      </div>
                      <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 1 }}>
                        Based on your last {est.samples} similar booking{est.samples !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--navy)", borderRadius: 12, fontSize: 10, fontWeight: 600, color: confColor, border: `1px solid ${confColor}33` }}>
                    <div style={{ width: 6, height: 6, borderRadius: 50, background: confColor }}></div>
                    {confLabel}
                  </div>
                </div>

                {/* Numbers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div style={{ padding: 10, background: "var(--navy)", borderRadius: 8, border: "1px solid rgba(15, 23, 42, 0.06)" }}>
                    <div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Revenue</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)", fontFamily: "'Playfair Display', serif" }}>{fmt(est.expectedRevenue)}</div>
                  </div>
                  <div style={{ padding: 10, background: "var(--navy)", borderRadius: 8, border: "1px solid rgba(15, 23, 42, 0.06)" }}>
                    <div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Est. Expenses</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--red)", fontFamily: "'Playfair Display', serif" }}>{fmt(est.expectedExpenses)}</div>
                    <div style={{ fontSize: 10, color: "var(--slate)", marginTop: 2 }}>~ {fmt(est.medianCostPerGuest)}/guest</div>
                  </div>
                  <div style={{ padding: 10, background: "var(--navy)", borderRadius: 8, border: `1px solid ${profitColor}33` }}>
                    <div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Est. Profit</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: profitColor, fontFamily: "'Playfair Display', serif" }}>{fmt(est.expectedProfit)}</div>
                    <div style={{ fontSize: 10, color: profitColor, marginTop: 2 }}>{marginPct}% margin</div>
                  </div>
                </div>

                {/* Insights */}
                {est.insights.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: est.similarSamples?.length > 0 ? 12 : 0 }}>
                    {est.insights.map((ins, i) => {
                      const c = ins.type === "good" ? "var(--green)" : ins.type === "warn" ? "#d97706" : ins.type === "bad" ? "var(--red)" : ins.type === "tip" ? "var(--pop)" : "var(--slate)";
                      const icon = ins.type === "good" ? "✓" : ins.type === "warn" ? "⚠" : ins.type === "bad" ? "✕" : ins.type === "tip" ? "💡" : "•";
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: c }}>
                          <span style={{ fontSize: 11, flexShrink: 0 }}>{icon}</span>
                          <span>{ins.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Similar past bookings */}
                {est.similarSamples?.length > 0 && (
                  <div style={{ paddingTop: 10, borderTop: "1px solid rgba(15, 23, 42, 0.06)" }}>
                    <div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, fontWeight: 600 }}>📊 Most Similar Past Bookings</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {est.similarSamples.map((s, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 8px", background: "var(--navy)", borderRadius: 6, border: "1px solid rgba(15, 23, 42, 0.04)" }}>
                          <span style={{ color: "var(--cream)" }}>
                            {s.eventType} · {s.guests} guests · {s.packageName}
                          </span>
                          <span style={{ color: s.profit > 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                            {s.profit > 0 ? "+" : ""}{fmt(s.profit)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* EVENT EXPENSES MODAL */}
      {expenseModal && (() => {
        const totalExp = expenseItems.reduce((s, e) => s + (e.total || 0), 0);
        const hallRent = expenseModal.hallRent || 0;
        const perHead = expenseModal.customPricePerHead || packages.find((p) => p.id === expenseModal.packageId)?.pricePerHead || 0;
        const enabledServices = [...(expenseModal.extraServices || []), ...(expenseModal.customServices || [])].filter((sv) => sv.enabled !== false);
        const totalAmount = expenseModal.totalAmount;
        const discount = expenseModal.discount || 0;
        const pendingDue = Math.max(0, totalAmount - expenseModal.paidAmount - discount);
        const receivedCash = expenseModal.paidAmount;
        const incentives = Number(incentivesAmount) || 0;
        const netRevenue = totalAmount - discount;
        const profit = netRevenue - totalExp - incentives;
        const expPerHead = expenseModal.guests > 0 ? Math.round(totalExp / expenseModal.guests) : 0;

        return (
        <Modal wide title={`📋 Program Expenses — ${expenseModal.customerName}`} onClose={() => setExpenseModal(null)} footer={<><button className="btn btn-outline" onClick={() => setExpenseModal(null)}>Cancel</button><button className="btn btn-gold" onClick={saveExpenses}>💾 Save All</button></>}>

          {/* HEADER */}
          <div style={{ textAlign: "center", padding: "8px 0 16px", borderBottom: "2px solid var(--gold)" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "var(--gold)", letterSpacing: 1 }}>{halls.find((h) => h.id === expenseModal.hallId)?.name?.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>{expenseModal.eventType} — {fmtDate(expenseModal.date)} — {SLOTS.find((s) => s.id === expenseModal.slotId)?.label}</div>
          </div>

          {/* SPLIT LAYOUT */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>

            {/* ═══ LEFT SIDE: EXPENSE ITEMS ═══ */}
            <div>
              <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Expense Items</div>

              {/* Add Expense from Supplier */}
              <div style={{ background: "rgba(148, 163, 184, 0.18)", border: "1px solid rgba(148, 163, 184, 0.30)", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>➕ Add Expense from Supplier</div>
                {(suppliers || []).length === 0 ? (
                  <div style={{ fontSize: 11, color: "var(--slate)", fontStyle: "italic" }}>
                    💡 No suppliers added yet. Go to <strong>Staff/Vendors/Suppliers → Suppliers</strong> to add one first.
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                      <select className="form-input" style={{ flex: 2, minWidth: 130, margin: 0, padding: "6px 8px", fontSize: 12 }}
                        value={supplierExpenseForm.supplierId}
                        onChange={(e) => setSupplierExpenseForm((f) => ({ ...f, supplierId: e.target.value }))}>
                        <option value="">— Select supplier —</option>
                        {(suppliers || []).map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.type || "Supplier"})</option>
                        ))}
                      </select>
                      <input className="form-input" style={{ flex: 2, minWidth: 130, margin: 0, padding: "6px 8px", fontSize: 12 }}
                        value={supplierExpenseForm.description}
                        onChange={(e) => setSupplierExpenseForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Description (e.g. 50kg Chicken)" />
                      <input className="form-input" style={{ width: 70, margin: 0, padding: "6px 6px", fontSize: 12 }}
                        value={supplierExpenseForm.qty}
                        onChange={(e) => setSupplierExpenseForm((f) => ({ ...f, qty: e.target.value }))}
                        placeholder="Qty" />
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <input type="number" className="form-input" style={{ width: 110, margin: 0, padding: "6px 8px", fontSize: 12 }}
                        value={supplierExpenseForm.amount}
                        onChange={(e) => setSupplierExpenseForm((f) => ({ ...f, amount: e.target.value }))}
                        placeholder="Bill Amt (PKR)" />
                      <input type="number" className="form-input" style={{ width: 110, margin: 0, padding: "6px 8px", fontSize: 12 }}
                        value={supplierExpenseForm.paidAmount}
                        onChange={(e) => setSupplierExpenseForm((f) => ({ ...f, paidAmount: e.target.value }))}
                        placeholder="Paid (PKR)" />
                      <select className="form-input" style={{ width: 100, margin: 0, padding: "6px 6px", fontSize: 12 }}
                        value={supplierExpenseForm.method}
                        onChange={(e) => setSupplierExpenseForm((f) => ({ ...f, method: e.target.value }))}>
                        <option>Cash</option><option>Bank Transfer</option><option>Easypaisa</option><option>JazzCash</option><option>Credit</option>
                      </select>
                      <button className="btn btn-gold" style={{ padding: "6px 14px", marginLeft: "auto" }} onClick={addSupplierExpense}>
                        <Plus size={12} /> Add & Update Ledger
                      </button>
                    </div>
                    {supplierExpenseForm.supplierId && supplierExpenseForm.amount && (
                      <div style={{ fontSize: 10, color: "var(--slate)", marginTop: 6, fontStyle: "italic" }}>
                        💡 This will add the expense here AND record it in <strong>{suppliers.find((s) => s.id === supplierExpenseForm.supplierId)?.name}</strong>'s ledger
                        {Number(supplierExpenseForm.paidAmount) < Number(supplierExpenseForm.amount) && (
                          <> · Outstanding: <span style={{ color: "var(--red)" }}>{fmt(Number(supplierExpenseForm.amount) - (Number(supplierExpenseForm.paidAmount) || 0))}</span></>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Items table */}
              <div style={{ background: "var(--navy-light)", borderRadius: 8, overflow: "hidden", maxHeight: 380, overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "rgba(148, 163, 184, 0.25)" }}>
                      <th style={{ padding: "6px 8px", textAlign: "left", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>#</th>
                      <th style={{ padding: "6px 8px", textAlign: "left", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Particular / Supplier</th>
                      <th style={{ padding: "6px 8px", textAlign: "right", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Quantity</th>
                      <th style={{ padding: "6px 8px", textAlign: "right", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Amount</th>
                      <th style={{ width: 24 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseItems.map((e, i) => (
                      <tr key={e.id} style={{ borderBottom: "1px solid rgba(15, 23, 42, 0.05)" }}>
                        <td style={{ padding: "5px 8px", color: "var(--slate)" }}>{i + 1}</td>
                        <td style={{ padding: "5px 8px", color: "var(--cream)", fontWeight: 500 }}>
                          {e.item}
                          {e.supplierName && (
                            <div style={{ fontSize: 10, color: "var(--gold)", marginTop: 2 }}>
                              📒 from {e.supplierName}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "5px 8px", color: "var(--slate)", textAlign: "right" }}>{e.qty}{e.unit ? ` ${e.unit}` : ""}</td>
                        <td style={{ padding: "5px 8px", color: "var(--cream)", textAlign: "right", fontWeight: 600 }}>{Number(e.total).toLocaleString()}</td>
                        <td><button style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: 2 }} onClick={() => removeExpenseItem(e.id)} title="Remove (also removes from supplier ledger)"><X size={10} /></button></td>
                      </tr>
                    ))}
                    {expenseItems.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "var(--slate)", fontSize: 12 }}>No expenses added yet — add one from a supplier above</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Program Expenses */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 8px", background: "rgba(148, 163, 184, 0.25)", borderRadius: "0 0 8px 8px", marginTop: 2, fontWeight: 700, fontSize: 13 }}>
                <span style={{ color: "var(--cream)" }}>Total Program Expenses</span>
                <span style={{ color: "var(--gold)" }}>{Number(totalExp).toLocaleString()}</span>
              </div>
            </div>

            {/* ═══ RIGHT SIDE: PROGRAM DETAILS & P&L ═══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Program Details */}
              <div style={{ background: "var(--navy-light)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ background: "rgba(148, 163, 184, 0.25)", padding: "6px 10px", fontSize: 10, fontWeight: 700, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase" }}>Program Details</div>
                <div style={{ padding: "6px 0" }}>
                  {[
                    { label: "Customer Name", value: expenseModal.customerName },
                    { label: "Hall Rent", value: Number(hallRent).toLocaleString() },
                    { label: "Per Head", value: Number(perHead).toLocaleString() },
                    { label: "Total Persons", value: expenseModal.guests },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 10px", fontSize: 12 }}>
                      <span style={{ color: "var(--slate)" }}>{r.label}</span>
                      <span style={{ color: "var(--cream)", fontWeight: 500 }}>{r.value}</span>
                    </div>
                  ))}
                  {enabledServices.length > 0 && (
                    <div style={{ borderTop: "1px solid rgba(148, 163, 184, 0.25)", marginTop: 4, paddingTop: 4 }}>
                      {enabledServices.map((sv, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 10px", fontSize: 12 }}>
                          <span style={{ color: "var(--slate)" }}>{sv.label}</span>
                          <span style={{ color: sv.free ? "var(--green)" : "var(--cream)", fontWeight: 500 }}>
                            {sv.free ? "FREE" : Number(sv.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              <div style={{ background: "var(--navy-light)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ background: "rgba(148, 163, 184, 0.25)", padding: "6px 10px", fontSize: 10, fontWeight: 700, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase" }}>Financial Summary</div>
                <div style={{ padding: "6px 0" }}>
                  {[
                    { label: "Total Amount", value: fmt(totalAmount), color: "var(--cream)", bold: true },
                    { label: "Discount", value: fmt(discount), color: "var(--gold)" },
                    { label: "Pending Payment", value: fmt(pendingDue), color: pendingDue > 0 ? "var(--red)" : "var(--green)", highlight: pendingDue > 0 },
                    { label: "Receive Cash", value: fmt(receivedCash), color: "var(--green)", bold: true },
                    { label: "Program Expenses", value: fmt(totalExp), color: "var(--red)" },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 10px", fontSize: 12, background: r.highlight ? "rgba(248,113,113,0.1)" : "transparent" }}>
                      <span style={{ color: "var(--slate)" }}>{r.label}</span>
                      <span style={{ color: r.color || "var(--cream)", fontWeight: r.bold ? 700 : 500 }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incentives */}
              <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--slate)" }}>Incentives / Other Cost</span>
                  <input type="number" className="form-input" style={{ width: 110, margin: 0, padding: "4px 8px", fontSize: 12, textAlign: "right" }} value={incentivesAmount} onChange={(e) => setIncentivesAmount(e.target.value)} placeholder="0" />
                </div>
              </div>

              {/* Exp Per Head + Profit/Loss */}
              <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: "var(--slate)" }}>Exp Per Head</span>
                  <span style={{ color: "var(--cream)", fontWeight: 600 }}>{Number(expPerHead).toLocaleString()}</span>
                </div>
              </div>

              {/* TOTAL PROFIT/LOSS - prominent */}
              <div style={{ background: profit >= 0 ? "var(--green-bg)" : "var(--red-bg)", border: `2px solid ${profit >= 0 ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--cream)" }}>Total Profit / Loss</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: profit >= 0 ? "var(--green)" : "var(--red)", fontFamily: "'Playfair Display',serif" }}>
                    {profit >= 0 ? "+" : ""}{Number(profit).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Program Menu — Auto-loaded from Booking */}
              <div style={{ background: "var(--navy-light)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ background: "rgba(148, 163, 184, 0.25)", padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase" }}>Program Menu</span>
                  <button style={{ fontSize: 9, padding: "2px 8px", background: "var(--navy)", border: "1px solid rgba(148, 163, 184, 0.40)", borderRadius: 4, color: "var(--gold)", cursor: "pointer", fontFamily: "inherit" }}
                    onClick={() => setProgramMenu(buildMenuFromBooking(expenseModal))}>↻ Reload from Booking</button>
                </div>
                <div style={{ padding: 8 }}>
                  {programMenu.length > 0 ? (
                    programMenu.map((item, i) => {
                      const isUndecided = item.includes("(undecided)");
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0", fontSize: 12 }}>
                          <span style={{ color: "var(--slate)", width: 18, textAlign: "right" }}>{i + 1}</span>
                          <span style={{ color: isUndecided ? "var(--yellow)" : "var(--cream)", flex: 1, fontStyle: isUndecided ? "italic" : "normal" }}>
                            {isUndecided ? `⏳ ${item}` : item}
                          </span>
                          <button style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: 2 }} onClick={() => setProgramMenu((prev) => prev.filter((_, j) => j !== i))}><X size={10} /></button>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ fontSize: 11, color: "var(--slate)", padding: 8, textAlign: "center" }}>No menu items. Click "Reload from Booking" to load.</div>
                  )}
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <input className="form-input" style={{ flex: 1, margin: 0, padding: "5px 8px", fontSize: 12 }} value={newMenuItem} onChange={(e) => setNewMenuItem(e.target.value)} placeholder="Add extra item..." onKeyDown={(e) => { if (e.key === "Enter" && newMenuItem.trim()) { setProgramMenu((prev) => [...prev, newMenuItem.trim()]); setNewMenuItem(""); } }} />
                    <button className="btn btn-sm btn-outline" style={{ padding: "5px 8px" }} onClick={() => { if (newMenuItem.trim()) { setProgramMenu((prev) => [...prev, newMenuItem.trim()]); setNewMenuItem(""); } }}><Plus size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        );
      })()}
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: CALENDAR
// ═══════════════════════════════════════════════
function CalendarModule({ bookings, blockedDates, setBlockedDates, hasPermission, visibleHalls, onCreateBooking, onViewBooking, packages, halls }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [viewMode, setViewMode] = useState("month");
  const [calFilter, setCalFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, month: month - 1, year: month === 0 ? year - 1 : year, other: true });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, month, year, other: false });
  const remain = 42 - cells.length;
  for (let i = 1; i <= remain; i++) cells.push({ day: i, month: month + 1, year: month === 11 ? year + 1 : year, other: true });

  const buildDateStr = (d) => {
    const m = d.month < 0 ? 11 : d.month > 11 ? 0 : d.month;
    const y = d.year || year;
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
  };

  const getBookingsForDate = (d) => {
    const dateStr = buildDateStr(d);
    let results = bookings.filter((b) => b.date === dateStr);
    if (calFilter !== "all") results = results.filter((b) => b.status === calFilter);
    return results;
  };

  const handleCellClick = (d) => {
    if (d.other) return;
    const dateStr = buildDateStr(d);
    // Get ALL bookings for this date (ignore filter)
    const allDayBookings = bookings.filter((b) => b.date === dateStr && b.status !== "cancelled");

    if (allDayBookings.length > 0) {
      // Has bookings → show popup with booking details
      setSelectedDate(dateStr);
      setSelectedDateBookings(allDayBookings);
    } else {
      // No bookings → go to new booking with date prefilled
      onCreateBooking(dateStr);
    }
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const isToday = (d) => !d.other && d.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const listBookings = bookings.filter((b) => calFilter === "all" ? true : b.status === calFilter).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="tabs" style={{ marginBottom: 0, width: "auto" }}>
          <button className={`tab-btn ${viewMode === "month" ? "active" : ""}`} onClick={() => setViewMode("month")}>Month</button>
          <button className={`tab-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>List</button>
        </div>
        <div className="tabs" style={{ marginBottom: 0, width: "auto" }}>
          <button className={`tab-btn ${calFilter === "all" ? "active" : ""}`} onClick={() => setCalFilter("all")}>All</button>
          <button className={`tab-btn ${calFilter === "confirmed" ? "active" : ""}`} onClick={() => setCalFilter("confirmed")}>Confirmed</button>
          <button className={`tab-btn ${calFilter === "pending" ? "active" : ""}`} onClick={() => setCalFilter("pending")}>Pending</button>
          <button className={`tab-btn ${calFilter === "cancelled" ? "active" : ""}`} onClick={() => setCalFilter("cancelled")}>Cancelled</button>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--cream)", display: "flex", alignItems: "center", gap: 3 }}>☀️ Lunch</span>
          <span style={{ fontSize: 12, color: "var(--cream)", display: "flex", alignItems: "center", gap: 3 }}>🌙 Dinner</span>
          <span className="badge badge-green" style={{ fontSize: 12 }}>● {confirmed} Confirmed</span>
          <span className="badge badge-yellow" style={{ fontSize: 12 }}>● {pending} Pending</span>
          <span className="badge badge-red" style={{ fontSize: 12 }}>● {cancelled} Cancelled</span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "var(--cream)" }}>
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <button className="btn-icon" onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>

        <div style={{ marginBottom: 12, fontSize: 12, color: "var(--slate)", display: "flex", alignItems: "center", gap: 6 }}>
          <Info size={14} /> Click any date to view bookings or create new. Confirmed: ☀️ = Lunch (Morning) | 🌙 = Dinner (Evening) | Pending/Cancelled = colored dots.
        </div>

        {viewMode === "month" ? (
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="calendar-header-cell">{d}</div>)}
            {cells.map((d, i) => {
              const dayBookings = getBookingsForDate(d);
              // Separate confirmed by slot for sun/moon display
              const confirmedMorning = dayBookings.filter((b) => b.status === "confirmed" && (b.slotId === "morning" || b.slotId === "fullday"));
              const confirmedEvening = dayBookings.filter((b) => b.status === "confirmed" && (b.slotId === "evening" || b.slotId === "fullday"));
              const nonConfirmed = dayBookings.filter((b) => b.status !== "confirmed");
              const hasConfirmedSlots = confirmedMorning.length > 0 || confirmedEvening.length > 0;

              return (
                <div key={i} className={`calendar-cell ${d.other ? "other-month" : ""} ${isToday(d) ? "today" : ""}`}
                  onClick={() => handleCellClick(d)}
                  style={{
                    background: dayBookings.length > 0 && !d.other ? "rgba(148, 163, 184, 0.18)" : undefined,
                    cursor: d.other ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}>
                  <span className="day-num">{d.day}</span>

                  {/* Confirmed bookings: ☀️ for morning/lunch, 🌙 for evening/dinner */}
                  {hasConfirmedSlots && !d.other && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, lineHeight: 1.2 }}>
                      {confirmedMorning.length > 0 && (
                        <span style={{ fontSize: 12 }} title={`${confirmedMorning.length} confirmed lunch`}>☀️</span>
                      )}
                      {confirmedEvening.length > 0 && (
                        <span style={{ fontSize: 12 }} title={`${confirmedEvening.length} confirmed dinner`}>🌙</span>
                      )}
                    </div>
                  )}

                  {/* Pending/Cancelled bookings: colored dots */}
                  {nonConfirmed.length > 0 && (
                    <div className="dots">
                      {nonConfirmed.slice(0, 3).map((b, j) => (
                        <div key={j} className="dot" style={{
                          background: b.status === "pending" ? "var(--yellow)" : "var(--red)",
                          width: 6, height: 6,
                          boxShadow: b.status === "pending" ? "0 0 4px var(--yellow)" : "none",
                        }} />
                      ))}
                    </div>
                  )}

                  {dayBookings.length === 0 && !d.other && (
                    <div style={{ fontSize: 8, color: "rgba(148, 163, 184, 0.55)", marginTop: 2 }}>+</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {listBookings.length === 0 ? (
              <div className="empty-state"><Calendar size={40} /><p>No {calFilter !== "all" ? calFilter : ""} bookings found</p></div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Date</th><th>Customer</th><th>Phone</th><th>Event</th><th>Hall</th><th>Slot</th><th>Guests</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {listBookings.map((b) => (
                    <tr key={b.id} style={{ cursor: "pointer" }} onClick={() => onViewBooking(b.id)}>
                      <td style={{ whiteSpace: "nowrap" }}>{fmtDate(b.date)}</td>
                      <td style={{ fontWeight: 500 }}>{b.customerName}</td>
                      <td>{b.customerPhone}</td>
                      <td>{b.eventType}</td>
                      <td>{halls.find((h) => h.id === b.hallId)?.name}</td>
                      <td>{SLOTS.find((s) => s.id === b.slotId)?.label}</td>
                      <td>{b.guests}</td>
                      <td><Badge type={b.status}>{b.status}</Badge></td>
                      <td><button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); onViewBooking(b.id); }}><Eye size={12} /> View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* DATE CLICK POPUP — Shows bookings for the clicked date */}
      {selectedDate && selectedDateBookings.length > 0 && (
        <Modal title={`Bookings on ${fmtDate(selectedDate)}`} onClose={() => { setSelectedDate(null); setSelectedDateBookings([]); }} footer={
          <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "space-between" }}>
            <button className="btn btn-gold" onClick={() => { setSelectedDate(null); setSelectedDateBookings([]); onCreateBooking(selectedDate); }}>
              <Plus size={14} /> Add New Booking on This Date
            </button>
            <button className="btn btn-outline" onClick={() => { setSelectedDate(null); setSelectedDateBookings([]); }}>Close</button>
          </div>
        }>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedDateBookings.map((b) => {
              const hall = halls.find((h) => h.id === b.hallId);
              const pkg = packages.find((p) => p.id === b.packageId);
              const due = Math.max(0, b.totalAmount - b.paidAmount - (b.discount || 0));
              return (
                <div key={b.id} style={{
                  background: "var(--navy-light)", borderRadius: 10, padding: 16,
                  borderLeft: `4px solid ${b.status === "confirmed" ? "var(--green)" : b.status === "pending" ? "var(--yellow)" : "var(--red)"}`,
                  cursor: "pointer", transition: "all 0.15s",
                }} onClick={() => { setSelectedDate(null); setSelectedDateBookings([]); onViewBooking(b.id); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "var(--cream)", fontFamily: "'Playfair Display',serif" }}>{b.customerName}</span>
                      <Badge type={b.status}>{b.status}</Badge>
                    </div>
                    <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); setSelectedDate(null); setSelectedDateBookings([]); onViewBooking(b.id); }}>
                      <Eye size={12} /> Open
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div><div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1 }}>Event</div><div style={{ fontSize: 13, color: "var(--cream)", marginTop: 2 }}>{b.eventType}</div></div>
                    <div><div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1 }}>Hall</div><div style={{ fontSize: 13, color: "var(--cream)", marginTop: 2 }}>{hall?.name?.split(",")[0]}</div></div>
                    <div><div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1 }}>Slot</div><div style={{ fontSize: 13, color: "var(--cream)", marginTop: 2 }}>{SLOTS.find((s) => s.id === b.slotId)?.label}</div></div>
                    <div><div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1 }}>Guests</div><div style={{ fontSize: 13, color: "var(--cream)", marginTop: 2 }}>{b.guests}</div></div>
                    <div><div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1 }}>Package</div><div style={{ fontSize: 13, color: "var(--cream)", marginTop: 2 }}>{pkg?.name || "—"}</div></div>
                    <div><div style={{ fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 1 }}>Phone</div><div style={{ fontSize: 13, color: "var(--cream)", marginTop: 2 }}>{b.customerPhone}</div></div>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(15, 23, 42, 0.08)" }}>
                    <div style={{ fontSize: 12 }}><span style={{ color: "var(--slate)" }}>Total: </span><span style={{ fontWeight: 600 }}>{fmt(b.totalAmount)}</span></div>
                    <div style={{ fontSize: 12 }}><span style={{ color: "var(--slate)" }}>Paid: </span><span style={{ fontWeight: 600, color: "var(--green)" }}>{fmt(b.paidAmount)}</span></div>
                    {due > 0 && <div style={{ fontSize: 12 }}><span style={{ color: "var(--slate)" }}>Due: </span><span style={{ fontWeight: 600, color: "var(--red)" }}>{fmt(due)}</span></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><h3>Slot Availability — Today ({fmtDate(toISO(today))})</h3></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12 }}>
          {visibleHalls.map((hall) => (
            <div key={hall.id} style={{ background: "var(--navy-light)", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "var(--cream)" }}>{hall.name}</div>
              {SLOTS.map((slot) => {
                const matchingBooking = bookings.find((b) => b.date === toISO(today) && b.hallId === hall.id && b.status !== "cancelled" && (b.slotId === slot.id || b.slotId === "fullday" || slot.id === "fullday"));
                return (
                  <div key={slot.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--slate)" }}>{slot.label}</span>
                    {matchingBooking ? (
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {matchingBooking.status === "confirmed" ? (
                          <span style={{ color: "var(--red)" }}>Booked ✓</span>
                        ) : (
                          <span style={{ color: "var(--yellow)" }}>Pending ⏳</span>
                        )}
                      </span>
                    ) : (
                      <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 600 }}>Available ✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: BILLING
// ═══════════════════════════════════════════════
function BillingModule({ bookings, setBookings, notify, addAudit, hasPermission }) {
  const [tab, setTab] = useState("pending");
  const [pendingFilter, setPendingFilter] = useState("completed"); // "completed" | "upcoming" | "all"
  const [paymentModal, setPaymentModal] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState("Cash");
  const [extraDiscount, setExtraDiscount] = useState(0);

  const isPastDate = (dateStr) => new Date(dateStr) < new Date(toISO(today));

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const totalRevenue = activeBookings.reduce((s, b) => s + b.paidAmount, 0);
  const totalDues = activeBookings.reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount - b.discount), 0);
  const totalDiscount = activeBookings.reduce((s, b) => s + b.discount, 0);
  const allPending = activeBookings.filter((b) => b.paidAmount < b.totalAmount - b.discount);
  const completedPending = allPending.filter((b) => isPastDate(b.date)); // event already happened but unpaid
  const upcomingPending = allPending.filter((b) => !isPastDate(b.date)); // future events with dues
  const completedDues = completedPending.reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount - b.discount), 0);
  const upcomingDues = upcomingPending.reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount - b.discount), 0);

  const pendingPayments = pendingFilter === "completed" ? completedPending : pendingFilter === "upcoming" ? upcomingPending : allPending;
  const fullyPaid = activeBookings.filter((b) => b.paidAmount >= b.totalAmount - b.discount);

  const recordPayment = () => {
    if (!paymentModal) return;
    const pay = Number(payAmount) || 0;
    const disc = Number(extraDiscount) || 0;
    if (pay <= 0 && disc <= 0) { notify("Please enter a payment amount or discount", "error"); return; }
    const currentDue = Math.max(0, paymentModal.totalAmount - paymentModal.paidAmount - paymentModal.discount);
    if (pay + disc > currentDue) { notify(`Payment + Discount (${fmt(pay + disc)}) exceeds remaining dues of ${fmt(currentDue)}`, "error"); return; }
    setBookings((prev) => prev.map((b) => (b.id === paymentModal.id ? { ...b, paidAmount: b.paidAmount + pay, discount: b.discount + disc, paymentMethod: pay > 0 ? payMethod : b.paymentMethod } : b)));
    const parts = [];
    if (pay > 0) parts.push(`payment ${fmt(pay)} (${payMethod})`);
    if (disc > 0) parts.push(`additional discount ${fmt(disc)}`);
    addAudit(`Recorded ${parts.join(" + ")} for ${paymentModal.customerName}`, "Billing");
    notify(`✅ ${parts.join(" + ")} recorded for ${paymentModal.customerName}`);
    setPaymentModal(null);
    setPayAmount(0);
    setExtraDiscount(0);
  };

  const canPay = hasPermission("billing", "full");

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={DollarSign} iconBg="var(--green-bg)" value={fmt(totalRevenue)} label="Total Collected" change={`${fullyPaid.length} fully paid`} changeType="up" />
        <StatCard icon={AlertTriangle} iconBg="var(--red-bg)" value={fmt(totalDues)} label="Outstanding Dues" change={`${pendingPayments.length} pending`} changeType="down" />
        <StatCard icon={CreditCard} value={fmt(totalDiscount)} label="Total Discounts" />
        <StatCard icon={FileText} value={activeBookings.length} label="Total Invoices" />
      </div>

      {/* Alert for outstanding dues */}
      {totalDues > 0 && (
        <div style={{ background: "var(--red-bg)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius)", padding: 16, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle size={20} style={{ color: "var(--red)" }} />
            <span style={{ fontSize: 13, color: "var(--red)" }}>⚠️ {allPending.length} bookings have outstanding dues totaling <strong>{fmt(totalDues)}</strong>{completedPending.length > 0 && <> · <strong>{completedPending.length} completed events</strong> still owe <strong>{fmt(completedDues)}</strong></>}</span>
          </div>
          <button className="btn btn-sm btn-danger" onClick={() => { setTab("pending"); setPendingFilter("completed"); }}>View Completed Dues →</button>
        </div>
      )}

      <div className="tabs">
        <button className={`tab-btn ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>💰 Pending Payments ({allPending.length})</button>
        <button className={`tab-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>All Invoices</button>
        <button className={`tab-btn ${tab === "paid" ? "active" : ""}`} onClick={() => setTab("paid")}>✅ Fully Paid ({fullyPaid.length})</button>
      </div>

      {/* Sub-filter for pending payments by booking status */}
      {tab === "pending" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Filter by Event Status:</span>
          <button onClick={() => setPendingFilter("completed")}
            style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              border: `1px solid ${pendingFilter === "completed" ? "var(--gold)" : "rgba(148, 163, 184, 0.30)"}`,
              background: pendingFilter === "completed" ? "rgba(148, 163, 184, 0.30)" : "var(--navy)",
              color: pendingFilter === "completed" ? "var(--gold)" : "var(--slate)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            <Lock size={13} /> Completed Events ({completedPending.length})
            {completedDues > 0 && <span style={{ fontSize: 11, color: "var(--red)", fontWeight: 700, marginLeft: 4 }}>{fmt(completedDues)}</span>}
          </button>
          <button onClick={() => setPendingFilter("upcoming")}
            style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              border: `1px solid ${pendingFilter === "upcoming" ? "var(--gold)" : "rgba(148, 163, 184, 0.30)"}`,
              background: pendingFilter === "upcoming" ? "rgba(148, 163, 184, 0.30)" : "var(--navy)",
              color: pendingFilter === "upcoming" ? "var(--gold)" : "var(--slate)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            <Calendar size={13} /> Upcoming Events ({upcomingPending.length})
            {upcomingDues > 0 && <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, marginLeft: 4 }}>{fmt(upcomingDues)}</span>}
          </button>
          <button onClick={() => setPendingFilter("all")}
            style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              border: `1px solid ${pendingFilter === "all" ? "var(--gold)" : "rgba(148, 163, 184, 0.30)"}`,
              background: pendingFilter === "all" ? "rgba(148, 163, 184, 0.30)" : "var(--navy)",
              color: pendingFilter === "all" ? "var(--gold)" : "var(--slate)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            All Pending ({allPending.length})
          </button>
          {pendingFilter === "completed" && completedPending.length > 0 && (
            <span style={{ fontSize: 11, color: "var(--red)", fontStyle: "italic", marginLeft: "auto" }}>
              ⚠️ These events have already happened — payment is overdue
            </span>
          )}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>{tab === "pending"
            ? (pendingFilter === "completed" ? "✅ Completed Events — Outstanding Dues" : pendingFilter === "upcoming" ? "📅 Upcoming Events — Pending Payments" : "💰 All Pending Payments")
            : tab === "paid" ? "Fully Paid Bookings" : "All Invoices"}</h3>
          {tab === "pending" && canPay && <span style={{ fontSize: 12, color: "var(--gold)" }}>Click "💰 Record Payment" to collect dues</span>}
        </div>
        <div className="scroll-table">
          <table className="data-table">
            <thead><tr><th>Date</th>{tab === "pending" && <th>Status</th>}<th>Customer</th><th>Phone</th><th>Event</th><th>Total</th><th>Discount</th><th>Paid</th><th>Due</th><th>Method</th><th>Progress</th><th>Actions</th></tr></thead>
            <tbody>
              {(() => {
                const list = tab === "pending" ? pendingPayments : tab === "paid" ? fullyPaid : activeBookings;
                if (list.length === 0) {
                  return (
                    <tr>
                      <td colSpan={tab === "pending" ? 12 : 11} style={{ textAlign: "center", padding: 30, color: "var(--slate)" }}>
                        {tab === "pending" && pendingFilter === "completed" ? "🎉 No completed events with outstanding dues!" :
                         tab === "pending" && pendingFilter === "upcoming" ? "✓ No upcoming events with pending payments" :
                         tab === "pending" ? "✓ All bookings are fully paid" :
                         tab === "paid" ? "No fully paid bookings yet" :
                         "No bookings yet"}
                      </td>
                    </tr>
                  );
                }
                return list.map((b) => {
                  const due = Math.max(0, b.totalAmount - b.paidAmount - b.discount);
                  const net = b.totalAmount - b.discount;
                  const pct = net > 0 ? Math.round((b.paidAmount / net) * 100) : 100;
                  const isCompleted = isPastDate(b.date);
                  return (
                    <tr key={b.id}>
                      <td style={{ whiteSpace: "nowrap" }}>{fmtDate(b.date)}</td>
                      {tab === "pending" && (
                        <td>
                          {isCompleted ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: "var(--red-bg)", color: "var(--red)" }}>
                              <Lock size={10} /> COMPLETED
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: "var(--yellow-bg)", color: "var(--yellow)" }}>
                              <Calendar size={10} /> UPCOMING
                            </span>
                          )}
                        </td>
                      )}
                      <td style={{ fontWeight: 500 }}>{b.customerName}</td>
                      <td>{b.customerPhone}</td>
                      <td>{b.eventType}</td>
                    <td>{fmt(b.totalAmount)}</td>
                    <td style={{ color: "var(--gold)" }}>{b.discount > 0 ? fmt(b.discount) : "—"}</td>
                    <td style={{ color: "var(--green)" }}>{fmt(b.paidAmount)}</td>
                    <td style={{ color: due > 0 ? "var(--red)" : "var(--green)", fontWeight: due > 0 ? 700 : 400 }}>{fmt(due)}</td>
                    <td>{b.paymentMethod}</td>
                    <td style={{ minWidth: 100 }}>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? "var(--green)" : "var(--gold)" }} /></div>
                      <span style={{ fontSize: 11, color: "var(--slate)" }}>{pct}%</span>
                    </td>
                    <td>
                      {due > 0 && canPay ? (
                        <button className="btn btn-sm btn-gold" onClick={() => { setPaymentModal(b); setPayAmount(due); setPayMethod(b.paymentMethod || "Cash"); setExtraDiscount(0); }}>
                          <DollarSign size={12} /> Record Payment
                        </button>
                      ) : due === 0 ? (
                        <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✅ Paid</span>
                      ) : null}
                    </td>
                  </tr>
                );
              });
              })()}
            </tbody>
          </table>
          {tab === "paid" && fullyPaid.length === 0 && (
            <div className="empty-state"><DollarSign size={40} /><p>No fully paid bookings yet</p></div>
          )}
        </div>
      </div>

      {paymentModal && (() => {
        const currentDue = Math.max(0, paymentModal.totalAmount - paymentModal.paidAmount - paymentModal.discount);
        const pay = Number(payAmount) || 0;
        const disc = Number(extraDiscount) || 0;
        const newTotalDiscount = paymentModal.discount + disc;
        const afterPaid = paymentModal.paidAmount + pay;
        const afterDue = Math.max(0, paymentModal.totalAmount - afterPaid - newTotalDiscount);

        return (
        <Modal title={`💰 Record Payment — ${paymentModal.customerName}`} onClose={() => setPaymentModal(null)} footer={<><button className="btn btn-outline" onClick={() => setPaymentModal(null)}>Cancel</button><button className="btn btn-gold" onClick={recordPayment}>✅ Confirm Payment</button></>}>
          <div style={{ background: "var(--navy-light)", padding: 16, borderRadius: 8, marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>PAYMENT SUMMARY</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}><span style={{ color: "var(--slate)" }}>Total Amount</span><span style={{ fontWeight: 600 }}>{fmt(paymentModal.totalAmount)}</span></div>
            {paymentModal.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}><span style={{ color: "var(--slate)" }}>Previous Discount</span><span style={{ color: "var(--gold)" }}>-{fmt(paymentModal.discount)}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}><span style={{ color: "var(--slate)" }}>Already Paid</span><span style={{ color: "var(--green)", fontWeight: 600 }}>{fmt(paymentModal.paidAmount)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, borderTop: "1px solid rgba(148, 163, 184, 0.30)", paddingTop: 10, marginTop: 4 }}>
              <span style={{ color: "var(--cream)" }}>Current Due</span>
              <span style={{ color: "var(--red)" }}>{fmt(currentDue)}</span>
            </div>
          </div>

          <div style={{ background: "rgba(148, 163, 184, 0.18)", padding: 12, borderRadius: 8, marginBottom: 18, fontSize: 12, color: "var(--slate)" }}>
            📅 Event: {paymentModal.eventType} on {fmtDate(paymentModal.date)} | 👥 {paymentModal.guests} guests
          </div>

          <div className="form-group">
            <label>Payment Amount (PKR)</label>
            <input type="number" className="form-input" style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="0" />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[0.25, 0.5, 0.75, 1].map((pct) => {
                const dueAfterDisc = Math.max(0, currentDue - disc);
                const amount = Math.round(dueAfterDisc * pct);
                return (
                  <button key={pct} className="btn btn-sm btn-outline" onClick={() => setPayAmount(amount)} style={{ flex: 1 }}>
                    {pct === 1 ? "Full" : `${pct * 100}%`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              Additional Discount (PKR)
              <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— apply extra discount on remaining dues</span>
            </label>
            <input type="number" className="form-input" value={extraDiscount} onChange={(e) => setExtraDiscount(e.target.value)} placeholder="0" />
            {disc > 0 && (
              <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 4 }}>
                Total discount will become: {fmt(paymentModal.discount)} (previous) + {fmt(disc)} (new) = {fmt(newTotalDiscount)}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["Cash", "Bank Transfer", "Easypaisa", "JazzCash"].map((m) => (
                <button key={m} onClick={() => setPayMethod(m)}
                  style={{
                    padding: "10px 12px", borderRadius: 8, border: "2px solid",
                    borderColor: payMethod === m ? "var(--gold)" : "rgba(15, 23, 42, 0.10)",
                    background: payMethod === m ? "rgba(148, 163, 184, 0.28)" : "var(--navy-light)",
                    color: payMethod === m ? "var(--gold)" : "var(--slate)",
                    cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center", fontFamily: "inherit",
                  }}>
                  {m === "Cash" ? "💵" : m === "Bank Transfer" ? "🏦" : m === "Easypaisa" ? "📱" : "📱"} {m}
                </button>
              ))}
            </div>
          </div>

          {(pay > 0 || disc > 0) && (
            <div style={{ background: "var(--green-bg)", padding: 14, borderRadius: 8, border: "1px solid rgba(52,211,153,0.2)" }}>
              <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600, marginBottom: 8 }}>After this transaction:</div>
              {pay > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "var(--slate)" }}>Payment Received</span>
                  <span style={{ color: "var(--green)", fontWeight: 600 }}>+{fmt(pay)}</span>
                </div>
              )}
              {disc > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "var(--slate)" }}>Additional Discount</span>
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>-{fmt(disc)}</span>
                </div>
              )}
              <div style={{ borderTop: "1px solid rgba(52,211,153,0.2)", paddingTop: 8, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "var(--slate)" }}>Total Paid</span>
                  <span style={{ color: "var(--green)", fontWeight: 600 }}>{fmt(afterPaid)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "var(--slate)" }}>Total Discount</span>
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>{fmt(newTotalDiscount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                  <span style={{ color: "var(--cream)" }}>New Balance Due</span>
                  <span style={{ color: afterDue > 0 ? "var(--red)" : "var(--green)" }}>{fmt(afterDue)}</span>
                </div>
              </div>
            </div>
          )}

          {pay + disc > currentDue && (
            <div style={{ background: "var(--red-bg)", padding: 12, borderRadius: 8, marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={16} style={{ color: "var(--red)" }} />
              <span style={{ fontSize: 12, color: "var(--red)", fontWeight: 600 }}>Payment + Discount ({fmt(pay + disc)}) exceeds remaining dues ({fmt(currentDue)})</span>
            </div>
          )}
        </Modal>
        );
      })()}
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: CATERING
// ═══════════════════════════════════════════════
function CateringModule({ bookings, packages, setPackages, notify, addAudit, hasPermission }) {
  const [tab, setTab] = useState("packages");
  const [modal, setModal] = useState(null);
  const [editingPkg, setEditingPkg] = useState(null);
  const [pkgForm, setPkgForm] = useState({ name: "", pricePerHead: 0, items: [] });
  const [newItem, setNewItem] = useState("");
  const [newChoiceA, setNewChoiceA] = useState("");
  const [newChoiceB, setNewChoiceB] = useState("");
  const [addMode, setAddMode] = useState("fixed"); // "fixed" or "choice"

  const upcoming = bookings.filter((b) => b.status !== "cancelled" && new Date(b.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));

  const openAddPackage = () => {
    setPkgForm({ name: "", pricePerHead: 0, items: [] });
    setEditingPkg(null);
    setNewItem(""); setNewChoiceA(""); setNewChoiceB(""); setAddMode("fixed");
    setModal("package");
  };

  const openEditPackage = (pkg) => {
    setPkgForm({ name: pkg.name, pricePerHead: pkg.pricePerHead, items: (pkg.items || []).map((it) => typeof it === "string" ? { text: it, choice: false } : { ...it }) });
    setEditingPkg(pkg);
    setNewItem(""); setNewChoiceA(""); setNewChoiceB(""); setAddMode("fixed");
    setModal("package");
  };

  const addItem = () => {
    if (addMode === "fixed") {
      if (!newItem.trim()) return;
      setPkgForm((f) => ({ ...f, items: [...f.items, { text: newItem.trim(), choice: false }] }));
      setNewItem("");
    } else {
      if (!newChoiceA.trim() || !newChoiceB.trim()) { notify("Enter both options for customer choice", "error"); return; }
      setPkgForm((f) => ({ ...f, items: [...f.items, { text: `${newChoiceA.trim()} / ${newChoiceB.trim()}`, choice: true, options: [newChoiceA.trim(), newChoiceB.trim()] }] }));
      setNewChoiceA(""); setNewChoiceB("");
    }
  };

  const removeItem = (idx) => {
    setPkgForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const moveItem = (idx, dir) => {
    setPkgForm((f) => {
      const arr = [...f.items];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return f;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...f, items: arr };
    });
  };

  const savePackage = () => {
    if (!pkgForm.name.trim()) { notify("Please enter package name", "error"); return; }
    if (pkgForm.pricePerHead <= 0) { notify("Please enter a valid price per head", "error"); return; }
    if (pkgForm.items.length === 0) { notify("Please add at least one menu item", "error"); return; }

    if (editingPkg) {
      setPackages((prev) => prev.map((p) => p.id === editingPkg.id ? { ...p, name: pkgForm.name, pricePerHead: Number(pkgForm.pricePerHead), items: pkgForm.items } : p));
      addAudit(`Updated package: ${pkgForm.name} — ${fmt(pkgForm.pricePerHead)}/head`, "Catering");
      notify(`Package "${pkgForm.name}" updated successfully`);
    } else {
      const newPkg = { id: genId(), name: pkgForm.name, pricePerHead: Number(pkgForm.pricePerHead), items: pkgForm.items };
      setPackages((prev) => [...prev, newPkg]);
      addAudit(`Created new package: ${pkgForm.name} — ${fmt(pkgForm.pricePerHead)}/head`, "Catering");
      notify(`Package "${pkgForm.name}" created successfully`);
    }
    setModal(null);
    setEditingPkg(null);
  };

  const deletePackage = (pkg) => {
    const inUse = bookings.filter((b) => b.packageId === pkg.id && b.status !== "cancelled").length;
    if (inUse > 0) { notify(`Cannot delete — ${inUse} active bookings use this package`, "error"); return; }
    setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    addAudit(`Deleted package: ${pkg.name}`, "Catering");
    notify(`Package "${pkg.name}" deleted`);
  };

  const canEdit = hasPermission("catering", "full");

  // Find most booked package
  const pkgCounts = packages.map((p) => ({ id: p.id, count: bookings.filter((b) => b.packageId === p.id && b.status !== "cancelled").length }));
  const mostPopularId = pkgCounts.sort((a, b) => b.count - a.count)[0]?.id;

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={UtensilsCrossed} value={packages.length} label="Menu Packages" />
        <StatCard icon={FileText} value={upcoming.length} label="Upcoming Orders" />
        <StatCard icon={DollarSign} iconBg="var(--green-bg)" value={fmt(upcoming.reduce((s, b) => s + b.guests * (b.customPricePerHead || packages.find((p) => p.id === b.packageId)?.pricePerHead || 0), 0))} label="Upcoming Catering Revenue" />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div className="tabs" style={{ marginBottom: 0 }}>
          <button className={`tab-btn ${tab === "packages" ? "active" : ""}`} onClick={() => setTab("packages")}>Menu Packages</button>
          <button className={`tab-btn ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>Kitchen Orders (KOT)</button>
        </div>
        {tab === "packages" && canEdit && (
          <button className="btn btn-gold" style={{ marginLeft: "auto" }} onClick={openAddPackage}><Plus size={16} /> New Package</button>
        )}
      </div>

      {tab === "packages" && (
        <div className="grid-3">
          {packages.map((pkg) => {
            const count = bookings.filter((b) => b.packageId === pkg.id && b.status !== "cancelled").length;
            const isPopular = pkg.id === mostPopularId && count > 0;
            return (
              <div key={pkg.id} className="card" style={{ borderColor: isPopular ? "var(--gold)" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--cream)" }}>{pkg.name}</h3>
                    {isPopular && <Badge type="confirmed">Most Popular</Badge>}
                  </div>
                  {canEdit && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn-icon" title="Edit Package" onClick={() => openEditPackage(pkg)}><Edit size={14} /></button>
                      <button className="btn-icon" title="Delete Package" onClick={() => deletePackage(pkg)} style={{ color: "var(--red)" }}><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)", fontFamily: "'Playfair Display',serif", marginBottom: 4 }}>{fmt(pkg.pricePerHead)}</div>
                <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>per head</div>
                <div style={{ borderTop: "1px solid rgba(148, 163, 184, 0.25)", paddingTop: 14 }}>
                  {(pkg.items || []).map((item, i) => {
                    const it = typeof item === "string" ? { text: item, choice: false } : item;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13 }}>
                        {it.choice ? (
                          <><span style={{ color: "var(--yellow)", fontSize: 12 }}>⟷</span> <span style={{ color: "var(--gold)" }}>{it.options.join("  /  ")}</span></>
                        ) : (
                          <><Check size={14} style={{ color: "var(--green)" }} /> <span style={{ color: "var(--cream)" }}>{it.text}</span></>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, padding: "10px 14px", background: "var(--navy-light)", borderRadius: 8, fontSize: 12, color: "var(--slate)", display: "flex", justifyContent: "space-between" }}>
                  <span>{count} bookings</span>
                  <span>Revenue: {fmt(count > 0 ? bookings.filter((b) => b.packageId === pkg.id && b.status !== "cancelled").reduce((s, b) => s + b.guests * (b.customPricePerHead || pkg.pricePerHead), 0) : 0)}</span>
                </div>
              </div>
            );
          })}

          {packages.length === 0 && (
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state">
                <UtensilsCrossed size={40} />
                <p>No packages created yet. Click "New Package" to add your first menu package.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="card">
          <div className="card-header"><h3>Upcoming Kitchen Orders</h3></div>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Customer</th><th>Event</th><th>Package</th><th>Guests</th><th>Catering Cost</th><th>Status</th></tr></thead>
            <tbody>
              {upcoming.map((b) => {
                const pkg = packages.find((p) => p.id === b.packageId);
                return (
                  <tr key={b.id}>
                    <td>{fmtDate(b.date)}</td>
                    <td>{b.customerName}</td>
                    <td>{b.eventType}</td>
                    <td><Badge type="active">{pkg?.name || "Custom"}</Badge></td>
                    <td>{b.guests}</td>
                    <td>{fmt(b.guests * (b.customPricePerHead || pkg?.pricePerHead || 0))}</td>
                    <td><Badge type={b.status}>{b.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {upcoming.length === 0 && <div className="empty-state"><UtensilsCrossed size={40} /><p>No upcoming kitchen orders</p></div>}
        </div>
      )}

      {modal === "package" && (
        <Modal title={editingPkg ? `Edit Package — ${editingPkg.name}` : "Create New Package"} onClose={() => setModal(null)} footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-gold" onClick={savePackage}>{editingPkg ? "Save Changes" : "Create Package"}</button></>}>
          <div className="form-row">
            <div className="form-group">
              <label>Package Name *</label>
              <input className="form-input" value={pkgForm.name} onChange={(e) => setPkgForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Premium, Gold, Diamond" />
            </div>
            <div className="form-group">
              <label>Price Per Head (PKR) *</label>
              <input type="number" className="form-input" value={pkgForm.pricePerHead} onChange={(e) => setPkgForm((f) => ({ ...f, pricePerHead: e.target.value }))} placeholder="e.g. 2500" />
            </div>
          </div>

          <div className="form-group">
            <label>Menu Items ({pkgForm.items.length} items)</label>

            {/* Add mode tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              <button onClick={() => setAddMode("fixed")} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", background: addMode === "fixed" ? "var(--gold)" : "var(--navy-light)", color: addMode === "fixed" ? "var(--navy)" : "var(--slate)" }}>
                ✓ Fixed Item
              </button>
              <button onClick={() => setAddMode("choice")} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", background: addMode === "choice" ? "var(--yellow)" : "var(--navy-light)", color: addMode === "choice" ? "var(--navy)" : "var(--slate)" }}>
                ⟷ Customer Choice (A / B)
              </button>
            </div>

            {addMode === "fixed" ? (
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input className="form-input" style={{ flex: 1 }} value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="e.g. Seekh Kabab, Roti, Halwa..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }} />
                <button className="btn btn-gold" onClick={addItem} style={{ whiteSpace: "nowrap" }}><Plus size={14} /> Add</button>
              </div>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "var(--yellow)", marginBottom: 6 }}>Customer will choose one of these two options:</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="form-input" style={{ flex: 1 }} value={newChoiceA} onChange={(e) => setNewChoiceA(e.target.value)} placeholder="Option A (e.g. Chicken Qorma)" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }} />
                  <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16 }}>/</span>
                  <input className="form-input" style={{ flex: 1 }} value={newChoiceB} onChange={(e) => setNewChoiceB(e.target.value)} placeholder="Option B (e.g. White Meat)" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }} />
                  <button className="btn btn-gold" onClick={addItem}><Plus size={14} /></button>
                </div>
              </div>
            )}

            {pkgForm.items.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "var(--slate)", fontSize: 13, background: "var(--navy-light)", borderRadius: 8 }}>
                No items added yet. Add fixed items or customer choice items above.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {pkgForm.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--navy-light)", borderRadius: 8, borderLeft: item.choice ? "3px solid var(--yellow)" : "3px solid var(--green)" }}>
                    <span style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, width: 20 }}>{i + 1}.</span>
                    {item.choice ? (
                      <><span style={{ color: "var(--yellow)", fontSize: 12, flexShrink: 0 }}>⟷</span><span style={{ flex: 1, fontSize: 13, color: "var(--gold)" }}>{item.options[0]} <span style={{ color: "var(--slate)" }}>/</span> {item.options[1]}</span></>
                    ) : (
                      <><Check size={14} style={{ color: "var(--green)", flexShrink: 0 }} /><span style={{ flex: 1, fontSize: 13, color: "var(--cream)" }}>{item.text}</span></>
                    )}
                    <button className="btn-icon" style={{ width: 24, height: 24 }} title="Move Up" onClick={() => moveItem(i, -1)} disabled={i === 0}><ChevronLeft size={12} style={{ transform: "rotate(90deg)" }} /></button>
                    <button className="btn-icon" style={{ width: 24, height: 24 }} title="Move Down" onClick={() => moveItem(i, 1)} disabled={i === pkgForm.items.length - 1}><ChevronRight size={12} style={{ transform: "rotate(90deg)" }} /></button>
                    <button className="btn-icon" style={{ width: 24, height: 24, color: "var(--red)" }} title="Remove" onClick={() => removeItem(i)}><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "var(--navy-light)", padding: 14, borderRadius: 8, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>PACKAGE PREVIEW</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "var(--cream)" }}>{pkgForm.name || "Untitled Package"}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)", fontFamily: "'Playfair Display',serif" }}>{pkgForm.pricePerHead > 0 ? fmt(Number(pkgForm.pricePerHead)) : "PKR 0"}/head</span>
            </div>
            {pkgForm.items.length > 0 && (
              <div style={{ fontSize: 12, color: "var(--slate)" }}>
                {pkgForm.items.map((it) => it.choice ? it.options.join(" / ") : it.text).join(" • ")}
              </div>
            )}
            {pkgForm.pricePerHead > 0 && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(148, 163, 184, 0.25)", fontSize: 12, color: "var(--slate)" }}>
                Example: 200 guests = {fmt(200 * Number(pkgForm.pricePerHead))} | 500 guests = {fmt(500 * Number(pkgForm.pricePerHead))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: STAFF, VENDORS & SUPPLIERS
// ═══════════════════════════════════════════════
function StaffModule({ staff, setStaff, vendors, setVendors, suppliers, setSuppliers, notify, addAudit, hasPermission }) {
  const [tab, setTab] = useState("staff");
  const [modal, setModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [staffForm, setStaffForm] = useState({ name: "", role: "Waiter", phone: "", salary: 15000 });
  const [vendorForm, setVendorForm] = useState({ name: "", type: "DJ", phone: "", rate: 25000, rating: 4.0 });
  const [supplierForm, setSupplierForm] = useState({ name: "", type: "", phone: "", address: "" });
  const [ledgerSupplier, setLedgerSupplier] = useState(null);
  const [ledgerEntry, setLedgerEntry] = useState({ date: toISO(today), description: "", billAmount: 0, paidAmount: 0, method: "Cash" });
  const [editingLedger, setEditingLedger] = useState(null);

  const canEdit = hasPermission("staff", "full");

  // ── Staff CRUD ──
  const openAddStaff = () => { setStaffForm({ name: "", role: "Waiter", phone: "", salary: 15000 }); setEditingItem(null); setModal("staff"); };
  const openEditStaff = (s) => { setStaffForm({ name: s.name, role: s.role, phone: s.phone, salary: s.salary }); setEditingItem(s); setModal("staff"); };
  const saveStaff = () => {
    if (!staffForm.name) { notify("Please enter staff name", "error"); return; }
    if (editingItem) { setStaff((prev) => prev.map((s) => s.id === editingItem.id ? { ...s, ...staffForm, salary: Number(staffForm.salary) } : s)); addAudit(`Updated staff: ${staffForm.name}`, "Staff"); notify(`${staffForm.name} updated`); }
    else { setStaff((prev) => [...prev, { id: genId(), ...staffForm, salary: Number(staffForm.salary), status: "active" }]); addAudit(`Added staff: ${staffForm.name}`, "Staff"); notify(`${staffForm.name} added`); }
    setModal(null); setEditingItem(null);
  };
  const deleteStaff = (s) => { setStaff((prev) => prev.filter((st) => st.id !== s.id)); addAudit(`Deleted staff: ${s.name}`, "Staff"); notify(`${s.name} removed`); };
  const toggleStaffStatus = (s) => { setStaff((prev) => prev.map((st) => st.id === s.id ? { ...st, status: st.status === "active" ? "inactive" : "active" } : st)); };

  // ── Vendor CRUD ──
  const openAddVendor = () => { setVendorForm({ name: "", type: "DJ", phone: "", rate: 25000, rating: 4.0 }); setEditingItem(null); setModal("vendor"); };
  const openEditVendor = (v) => { setVendorForm({ name: v.name, type: v.type, phone: v.phone, rate: v.rate, rating: v.rating || 4.0 }); setEditingItem(v); setModal("vendor"); };
  const saveVendor = () => {
    if (!vendorForm.name) { notify("Please enter vendor name", "error"); return; }
    if (editingItem) { setVendors((prev) => prev.map((v) => v.id === editingItem.id ? { ...v, ...vendorForm, rate: Number(vendorForm.rate), rating: Number(vendorForm.rating) } : v)); addAudit(`Updated vendor: ${vendorForm.name}`, "Vendor"); notify(`${vendorForm.name} updated`); }
    else { setVendors((prev) => [...prev, { id: genId(), ...vendorForm, rate: Number(vendorForm.rate), rating: Number(vendorForm.rating) }]); addAudit(`Added vendor: ${vendorForm.name}`, "Vendor"); notify(`${vendorForm.name} added`); }
    setModal(null); setEditingItem(null);
  };
  const deleteVendor = (v) => { setVendors((prev) => prev.filter((vn) => vn.id !== v.id)); addAudit(`Deleted vendor: ${v.name}`, "Vendor"); notify(`${v.name} removed`); };

  // ── Supplier CRUD ──
  const openAddSupplier = () => { setSupplierForm({ name: "", type: "", phone: "", address: "" }); setEditingItem(null); setModal("supplier"); };
  const openEditSupplier = (s) => { setSupplierForm({ name: s.name, type: s.type, phone: s.phone, address: s.address || "" }); setEditingItem(s); setModal("supplier"); };
  const saveSupplier = () => {
    if (!supplierForm.name) { notify("Please enter supplier name", "error"); return; }
    if (editingItem) { setSuppliers((prev) => prev.map((s) => s.id === editingItem.id ? { ...s, ...supplierForm } : s)); addAudit(`Updated supplier: ${supplierForm.name}`, "Supplier"); notify(`${supplierForm.name} updated`); }
    else { setSuppliers((prev) => [...prev, { id: genId(), ...supplierForm, status: "active", ledger: [] }]); addAudit(`Added supplier: ${supplierForm.name}`, "Supplier"); notify(`${supplierForm.name} added`); }
    setModal(null); setEditingItem(null);
  };
  const deleteSupplier = (s) => { setSuppliers((prev) => prev.filter((sp) => sp.id !== s.id)); addAudit(`Deleted supplier: ${s.name}`, "Supplier"); notify(`${s.name} removed`); };

  // ── Supplier Ledger ──
  const openLedger = (s) => {
    setLedgerSupplier(s);
    setLedgerEntry({ date: toISO(today), description: "", billAmount: 0, paidAmount: 0, method: "Cash" });
    setEditingLedger(null);
    setModal("ledger");
  };
  const addLedgerEntry = () => {
    if (!ledgerEntry.description) { notify("Enter description", "error"); return; }
    if (!ledgerEntry.billAmount && !ledgerEntry.paidAmount) { notify("Enter bill or paid amount", "error"); return; }
    if (editingLedger) {
      setSuppliers((prev) => prev.map((s) => s.id === ledgerSupplier.id ? { ...s, ledger: s.ledger.map((e) => e.id === editingLedger.id ? { ...e, ...ledgerEntry, billAmount: Number(ledgerEntry.billAmount), paidAmount: Number(ledgerEntry.paidAmount) } : e) } : s));
      notify("Ledger entry updated");
      setEditingLedger(null);
    } else {
      const entry = { id: genId(), ...ledgerEntry, billAmount: Number(ledgerEntry.billAmount), paidAmount: Number(ledgerEntry.paidAmount) };
      setSuppliers((prev) => prev.map((s) => s.id === ledgerSupplier.id ? { ...s, ledger: [...s.ledger, entry] } : s));
      addAudit(`Added ledger entry for ${ledgerSupplier.name}: Bill ${fmt(entry.billAmount)}, Paid ${fmt(entry.paidAmount)}`, "Supplier");
      notify("Ledger entry added");
    }
    setLedgerEntry({ date: toISO(today), description: "", billAmount: 0, paidAmount: 0, method: "Cash" });
  };
  const editLedgerEntry = (e) => {
    setLedgerEntry({ date: e.date, description: e.description, billAmount: e.billAmount, paidAmount: e.paidAmount, method: e.method || "Cash" });
    setEditingLedger(e);
  };
  const deleteLedgerEntry = (entryId) => {
    setSuppliers((prev) => prev.map((s) => s.id === ledgerSupplier.id ? { ...s, ledger: s.ledger.filter((e) => e.id !== entryId) } : s));
    notify("Ledger entry deleted");
  };

  // Get fresh supplier data for ledger modal
  const currentLedgerSupplier = ledgerSupplier ? suppliers.find((s) => s.id === ledgerSupplier.id) : null;
  const ledgerItems = currentLedgerSupplier?.ledger || [];
  const totalBill = ledgerItems.reduce((s, e) => s + (e.billAmount || 0), 0);
  const totalPaid = ledgerItems.reduce((s, e) => s + (e.paidAmount || 0), 0);
  const totalOutstanding = totalBill - totalPaid;

  const totalSalary = staff.filter((s) => s.status === "active").reduce((s, st) => s + st.salary, 0);
  const totalVendorCost = vendors.reduce((s, v) => s + v.rate, 0);
  const totalSupplierDues = suppliers.reduce((s, sp) => { const b = (sp.ledger || []).reduce((a, e) => a + (e.billAmount || 0), 0); const p = (sp.ledger || []).reduce((a, e) => a + (e.paidAmount || 0), 0); return s + Math.max(0, b - p); }, 0);

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={Users} value={staff.length} label="Total Staff" />
        <StatCard icon={Truck} value={vendors.length} label="Vendors" />
        <StatCard icon={Package} value={suppliers.length} label="Suppliers" />
        <StatCard icon={AlertTriangle} iconBg="var(--red-bg)" value={fmt(totalSupplierDues)} label="Supplier Dues" />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div className="tabs" style={{ marginBottom: 0 }}>
          <button className={`tab-btn ${tab === "staff" ? "active" : ""}`} onClick={() => setTab("staff")}>Staff ({staff.length})</button>
          <button className={`tab-btn ${tab === "vendors" ? "active" : ""}`} onClick={() => setTab("vendors")}>Vendors ({vendors.length})</button>
          <button className={`tab-btn ${tab === "suppliers" ? "active" : ""}`} onClick={() => setTab("suppliers")}>Suppliers ({suppliers.length})</button>
        </div>
        {canEdit && (
          <button className="btn btn-gold" style={{ marginLeft: "auto" }} onClick={tab === "staff" ? openAddStaff : tab === "vendors" ? openAddVendor : openAddSupplier}>
            <Plus size={16} /> Add {tab === "staff" ? "Staff" : tab === "vendors" ? "Vendor" : "Supplier"}
          </button>
        )}
      </div>

      <div className="card">
        {/* ═══ STAFF TAB ═══ */}
        {tab === "staff" && (
          <>
            <div className="scroll-table"><table className="data-table">
              <thead><tr><th>Name</th><th>Role</th><th>Phone</th><th>Salary</th><th>Status</th>{canEdit && <th>Actions</th>}</tr></thead>
              <tbody>{staff.map((s) => (
                <tr key={s.id} style={{ opacity: s.status === "inactive" ? 0.5 : 1 }}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td><td>{s.role}</td><td>{s.phone}</td><td>{fmt(s.salary)}</td>
                  <td>{canEdit ? <button onClick={() => toggleStaffStatus(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Badge type={s.status}>{s.status}</Badge></button> : <Badge type={s.status}>{s.status}</Badge>}</td>
                  {canEdit && <td><div style={{ display: "flex", gap: 4 }}><button className="btn-icon" title="Edit" onClick={() => openEditStaff(s)}><Edit size={14} /></button><button className="btn-icon" title="Delete" onClick={() => deleteStaff(s)} style={{ color: "var(--red)" }}><Trash2 size={14} /></button></div></td>}
                </tr>
              ))}</tbody>
            </table></div>
            {staff.length === 0 && <div className="empty-state"><Users size={40} /><p>No staff added yet</p></div>}
          </>
        )}

        {/* ═══ VENDORS TAB ═══ */}
        {tab === "vendors" && (
          <>
            <div className="scroll-table"><table className="data-table">
              <thead><tr><th>Name</th><th>Type</th><th>Phone</th><th>Rate</th><th>Rating</th>{canEdit && <th>Actions</th>}</tr></thead>
              <tbody>{vendors.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 500 }}>{v.name}</td><td><Badge type="active">{v.type}</Badge></td><td>{v.phone}</td><td>{fmt(v.rate)}</td>
                  <td style={{ color: "var(--gold)" }}>{"★".repeat(Math.round(v.rating))} {v.rating}</td>
                  {canEdit && <td><div style={{ display: "flex", gap: 4 }}><button className="btn-icon" title="Edit" onClick={() => openEditVendor(v)}><Edit size={14} /></button><button className="btn-icon" title="Delete" onClick={() => deleteVendor(v)} style={{ color: "var(--red)" }}><Trash2 size={14} /></button></div></td>}
                </tr>
              ))}</tbody>
            </table></div>
            {vendors.length === 0 && <div className="empty-state"><Truck size={40} /><p>No vendors added yet</p></div>}
          </>
        )}

        {/* ═══ SUPPLIERS TAB ═══ */}
        {tab === "suppliers" && (
          <>
            <div className="scroll-table"><table className="data-table">
              <thead><tr><th>Name</th><th>Type</th><th>Phone</th><th>Address</th><th>Total Bill</th><th>Paid</th><th>Outstanding</th>{canEdit && <th>Actions</th>}</tr></thead>
              <tbody>{suppliers.map((sp) => {
                const spBill = (sp.ledger || []).reduce((s, e) => s + (e.billAmount || 0), 0);
                const spPaid = (sp.ledger || []).reduce((s, e) => s + (e.paidAmount || 0), 0);
                const spDue = Math.max(0, spBill - spPaid);
                return (
                  <tr key={sp.id}>
                    <td style={{ fontWeight: 500 }}>{sp.name}</td>
                    <td><Badge type="active">{sp.type}</Badge></td>
                    <td>{sp.phone}</td>
                    <td style={{ fontSize: 12, color: "var(--slate)" }}>{sp.address}</td>
                    <td>{fmt(spBill)}</td>
                    <td style={{ color: "var(--green)" }}>{fmt(spPaid)}</td>
                    <td style={{ color: spDue > 0 ? "var(--red)" : "var(--green)", fontWeight: spDue > 0 ? 700 : 400 }}>{fmt(spDue)}</td>
                    {canEdit && (
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="btn btn-sm btn-outline" title="Open Ledger" onClick={() => openLedger(sp)}><FileText size={12} /> Ledger</button>
                          <button className="btn-icon" title="Edit" onClick={() => openEditSupplier(sp)}><Edit size={14} /></button>
                          <button className="btn-icon" title="Delete" onClick={() => deleteSupplier(sp)} style={{ color: "var(--red)" }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}</tbody>
            </table></div>
            {suppliers.length === 0 && <div className="empty-state"><Package size={40} /><p>No suppliers added yet</p></div>}
          </>
        )}
      </div>

      {/* ═══ STAFF MODAL ═══ */}
      {modal === "staff" && (
        <Modal title={editingItem ? `Edit Staff — ${editingItem.name}` : "Add Staff Member"} onClose={() => { setModal(null); setEditingItem(null); }} footer={<><button className="btn btn-outline" onClick={() => { setModal(null); setEditingItem(null); }}>Cancel</button><button className="btn btn-gold" onClick={saveStaff}>{editingItem ? "Save Changes" : "Add Staff"}</button></>}>
          <div className="form-group"><label>Name *</label><input className="form-input" value={staffForm.name} onChange={(e) => setStaffForm((f) => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-row">
            <div className="form-group"><label>Role</label><select className="form-input" value={staffForm.role} onChange={(e) => setStaffForm((f) => ({ ...f, role: e.target.value }))}>{STAFF_ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div className="form-group"><label>Phone</label><input className="form-input" value={staffForm.phone} onChange={(e) => setStaffForm((f) => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div className="form-group"><label>Monthly Salary (PKR)</label><input type="number" className="form-input" value={staffForm.salary} onChange={(e) => setStaffForm((f) => ({ ...f, salary: e.target.value }))} /></div>
        </Modal>
      )}

      {/* ═══ VENDOR MODAL ═══ */}
      {modal === "vendor" && (
        <Modal title={editingItem ? `Edit Vendor — ${editingItem.name}` : "Add Vendor"} onClose={() => { setModal(null); setEditingItem(null); }} footer={<><button className="btn btn-outline" onClick={() => { setModal(null); setEditingItem(null); }}>Cancel</button><button className="btn btn-gold" onClick={saveVendor}>{editingItem ? "Save Changes" : "Add Vendor"}</button></>}>
          <div className="form-group"><label>Business Name *</label><input className="form-input" value={vendorForm.name} onChange={(e) => setVendorForm((f) => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-row">
            <div className="form-group"><label>Type</label><select className="form-input" value={vendorForm.type} onChange={(e) => setVendorForm((f) => ({ ...f, type: e.target.value }))}>{VENDOR_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label>Phone</label><input className="form-input" value={vendorForm.phone} onChange={(e) => setVendorForm((f) => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Rate per Event (PKR)</label><input type="number" className="form-input" value={vendorForm.rate} onChange={(e) => setVendorForm((f) => ({ ...f, rate: e.target.value }))} /></div>
            <div className="form-group"><label>Rating</label><div style={{ display: "flex", gap: 6, marginTop: 4 }}>{[1,2,3,4,5].map((r) => (<button key={r} onClick={() => setVendorForm((f) => ({ ...f, rating: r }))} style={{ width: 36, height: 36, borderRadius: 6, border: "none", cursor: "pointer", fontSize: 16, background: vendorForm.rating >= r ? "rgba(148, 163, 184, 0.40)" : "var(--navy-light)", color: vendorForm.rating >= r ? "var(--gold)" : "var(--slate)" }}>★</button>))}</div></div>
          </div>
        </Modal>
      )}

      {/* ═══ SUPPLIER MODAL ═══ */}
      {modal === "supplier" && (
        <Modal title={editingItem ? `Edit Supplier — ${editingItem.name}` : "Add Supplier"} onClose={() => { setModal(null); setEditingItem(null); }} footer={<><button className="btn btn-outline" onClick={() => { setModal(null); setEditingItem(null); }}>Cancel</button><button className="btn btn-gold" onClick={saveSupplier}>{editingItem ? "Save Changes" : "Add Supplier"}</button></>}>
          <div className="form-group"><label>Supplier Name *</label><input className="form-input" value={supplierForm.name} onChange={(e) => setSupplierForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Khan Chicken Supplier" /></div>
          <div className="form-row">
            <div className="form-group"><label>Supply Type</label><input className="form-input" value={supplierForm.type} onChange={(e) => setSupplierForm((f) => ({ ...f, type: e.target.value }))} placeholder="e.g. Chicken, Rice, Vegetables" /></div>
            <div className="form-group"><label>Phone</label><input className="form-input" value={supplierForm.phone} onChange={(e) => setSupplierForm((f) => ({ ...f, phone: e.target.value }))} placeholder="0300-1234567" /></div>
          </div>
          <div className="form-group"><label>Address</label><input className="form-input" value={supplierForm.address} onChange={(e) => setSupplierForm((f) => ({ ...f, address: e.target.value }))} placeholder="e.g. Main Bazar, Charsadda" /></div>
        </Modal>
      )}

      {/* ═══ SUPPLIER LEDGER MODAL ═══ */}
      {modal === "ledger" && currentLedgerSupplier && (
        <Modal wide title={`📒 Supplier Ledger — ${currentLedgerSupplier.name}`} onClose={() => { setModal(null); setLedgerSupplier(null); setEditingLedger(null); }} footer={<button className="btn btn-outline" onClick={() => { setModal(null); setLedgerSupplier(null); setEditingLedger(null); }}>Close</button>}>

          {/* Supplier Info & Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: "var(--slate)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Supplier Info</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: "var(--slate)" }}>Name</span><span style={{ color: "var(--cream)", fontWeight: 600 }}>{currentLedgerSupplier.name}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: "var(--slate)" }}>Type</span><span style={{ color: "var(--cream)" }}>{currentLedgerSupplier.type}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: "var(--slate)" }}>Phone</span><span style={{ color: "var(--cream)" }}>{currentLedgerSupplier.phone}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: "var(--slate)" }}>Address</span><span style={{ color: "var(--cream)" }}>{currentLedgerSupplier.address}</span></div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--slate)" }}>Total Bill</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)", fontFamily: "'Playfair Display',serif" }}>{fmt(totalBill)}</span>
              </div>
              <div style={{ background: "var(--green-bg)", borderRadius: 8, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--green)" }}>Total Paid</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--green)", fontFamily: "'Playfair Display',serif" }}>{fmt(totalPaid)}</span>
              </div>
              <div style={{ background: totalOutstanding > 0 ? "var(--red-bg)" : "var(--green-bg)", border: `1px solid ${totalOutstanding > 0 ? "rgba(248,113,113,0.2)" : "rgba(52,211,153,0.2)"}`, borderRadius: 8, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: totalOutstanding > 0 ? "var(--red)" : "var(--green)", fontWeight: 600 }}>{totalOutstanding > 0 ? "Outstanding" : "All Cleared"}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: totalOutstanding > 0 ? "var(--red)" : "var(--green)", fontFamily: "'Playfair Display',serif" }}>{fmt(totalOutstanding)}</span>
              </div>
            </div>
          </div>

          {/* Add / Edit Ledger Entry */}
          <div style={{ background: "rgba(148, 163, 184, 0.18)", borderRadius: 8, padding: 14, marginBottom: 16, border: "1px solid rgba(148, 163, 184, 0.30)" }}>
            <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>{editingLedger ? "✏️ EDIT ENTRY" : "➕ ADD NEW ENTRY"}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input type="date" className="form-input" style={{ width: 130, margin: 0, padding: "7px 8px", fontSize: 12 }} value={ledgerEntry.date} onChange={(e) => setLedgerEntry((f) => ({ ...f, date: e.target.value }))} />
              <input className="form-input" style={{ flex: 2, minWidth: 140, margin: 0, padding: "7px 8px", fontSize: 12 }} value={ledgerEntry.description} onChange={(e) => setLedgerEntry((f) => ({ ...f, description: e.target.value }))} placeholder="Description (e.g. Chicken 50kg supply)" onKeyDown={(e) => e.key === "Enter" && addLedgerEntry()} />
              <input type="number" className="form-input" style={{ width: 100, margin: 0, padding: "7px 8px", fontSize: 12 }} value={ledgerEntry.billAmount} onChange={(e) => setLedgerEntry((f) => ({ ...f, billAmount: e.target.value }))} placeholder="Bill Amt" />
              <input type="number" className="form-input" style={{ width: 100, margin: 0, padding: "7px 8px", fontSize: 12 }} value={ledgerEntry.paidAmount} onChange={(e) => setLedgerEntry((f) => ({ ...f, paidAmount: e.target.value }))} placeholder="Paid Amt" />
              <select className="form-input" style={{ width: 100, margin: 0, padding: "7px 8px", fontSize: 12 }} value={ledgerEntry.method} onChange={(e) => setLedgerEntry((f) => ({ ...f, method: e.target.value }))}>
                <option>Cash</option><option>Bank Transfer</option><option>Easypaisa</option><option>JazzCash</option>
              </select>
              <button className="btn btn-gold" style={{ padding: "7px 14px" }} onClick={addLedgerEntry}>{editingLedger ? "Update" : <Plus size={14} />}</button>
              {editingLedger && <button className="btn btn-outline" style={{ padding: "7px 14px" }} onClick={() => { setEditingLedger(null); setLedgerEntry({ date: toISO(today), description: "", billAmount: 0, paidAmount: 0, method: "Cash" }); }}>Cancel</button>}
            </div>
          </div>

          {/* Ledger Table */}
          <div style={{ background: "var(--navy-light)", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "rgba(148, 163, 184, 0.25)" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>#</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Date</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Description</th>
                  <th style={{ padding: "8px 10px", textAlign: "right", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Bill</th>
                  <th style={{ padding: "8px 10px", textAlign: "right", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Paid</th>
                  <th style={{ padding: "8px 10px", textAlign: "right", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Balance</th>
                  <th style={{ padding: "8px 10px", textAlign: "center", color: "var(--slate)", fontSize: 10, fontWeight: 700 }}>Method</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {ledgerItems.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 30, textAlign: "center", color: "var(--slate)" }}>No ledger entries yet. Add the first entry above.</td></tr>
                ) : (() => {
                  let runningBalance = 0;
                  return ledgerItems.sort((a, b) => new Date(a.date) - new Date(b.date)).map((entry, i) => {
                    runningBalance += (entry.billAmount || 0) - (entry.paidAmount || 0);
                    return (
                      <tr key={entry.id} style={{ borderBottom: "1px solid rgba(15, 23, 42, 0.05)", background: editingLedger?.id === entry.id ? "rgba(148, 163, 184, 0.20)" : "transparent" }}>
                        <td style={{ padding: "7px 10px", color: "var(--slate)" }}>{i + 1}</td>
                        <td style={{ padding: "7px 10px", color: "var(--cream)", whiteSpace: "nowrap" }}>{fmtDate(entry.date)}</td>
                        <td style={{ padding: "7px 10px", color: "var(--cream)", fontWeight: 500 }}>{entry.description}</td>
                        <td style={{ padding: "7px 10px", color: "var(--cream)", textAlign: "right", fontWeight: 600 }}>{entry.billAmount > 0 ? fmt(entry.billAmount) : "—"}</td>
                        <td style={{ padding: "7px 10px", color: "var(--green)", textAlign: "right", fontWeight: 600 }}>{entry.paidAmount > 0 ? fmt(entry.paidAmount) : "—"}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: 700, color: runningBalance > 0 ? "var(--red)" : "var(--green)" }}>{fmt(runningBalance)}</td>
                        <td style={{ padding: "7px 10px", textAlign: "center", color: "var(--slate)", fontSize: 11 }}>{entry.method}</td>
                        <td style={{ padding: "7px 4px" }}>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", padding: 2 }} title="Edit" onClick={() => editLedgerEntry(entry)}><Edit size={12} /></button>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: 2 }} title="Delete" onClick={() => deleteLedgerEntry(entry.id)}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
              {ledgerItems.length > 0 && (
                <tfoot>
                  <tr style={{ background: "rgba(148, 163, 184, 0.25)" }}>
                    <td colSpan={3} style={{ padding: "8px 10px", fontWeight: 700, color: "var(--gold)", fontSize: 12 }}>TOTALS</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: "var(--cream)", fontSize: 13 }}>{fmt(totalBill)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: "var(--green)", fontSize: 13 }}>{fmt(totalPaid)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: totalOutstanding > 0 ? "var(--red)" : "var(--green)", fontSize: 13 }}>{fmt(totalOutstanding)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Modal>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: INVENTORY
// ═══════════════════════════════════════════════
function InventoryModule({ inventory, setInventory, notify, addAudit, hasPermission }) {
  const lowStock = inventory.filter((i) => i.qty <= i.minQty);
  const damaged = inventory.reduce((s, i) => s + i.damaged, 0);
  const totalItems = inventory.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={Package} value={totalItems} label="Total Items" />
        <StatCard icon={AlertTriangle} iconBg="var(--red-bg)" value={lowStock.length} label="Low Stock Alerts" />
        <StatCard icon={XCircle} iconBg="var(--yellow-bg)" value={damaged} label="Damaged Items" />
      </div>

      {lowStock.length > 0 && (
        <div style={{ background: "var(--red-bg)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius)", padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={20} style={{ color: "var(--red)" }} />
          <span style={{ fontSize: 13, color: "var(--red)" }}>⚠️ {lowStock.length} items are below minimum stock level: {lowStock.map((i) => i.name).join(", ")}</span>
        </div>
      )}

      <div className="card">
        <div className="card-header"><h3>Inventory Items</h3></div>
        <table className="data-table">
          <thead><tr><th>Item</th><th>Quantity</th><th>Min Level</th><th>Damaged</th><th>Ownership</th><th>Stock Status</th></tr></thead>
          <tbody>
            {inventory.map((item) => {
              const isLow = item.qty <= item.minQty;
              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.minQty}</td>
                  <td style={{ color: item.damaged > 0 ? "var(--red)" : "var(--slate)" }}>{item.damaged}</td>
                  <td>{item.owned ? <Badge type="confirmed">Owned</Badge> : <Badge type="pending">Rental</Badge>}</td>
                  <td>
                    {isLow ? <Badge type="cancelled">Low Stock</Badge> : <Badge type="confirmed">OK</Badge>}
                    <div className="progress-bar" style={{ marginTop: 4, width: 80 }}>
                      <div className="progress-fill" style={{ width: `${Math.min((item.qty / (item.minQty * 3)) * 100, 100)}%`, background: isLow ? "var(--red)" : "var(--green)" }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: DAILY EXPENSES (MANAGER)
// ═══════════════════════════════════════════════
function DailyExpensesModule({ dailyExpenses, setDailyExpenses, notify, addAudit, user, halls, visibleHalls }) {
  const isOwner = user.role === "owner";
  const isManager = user.role === "manager";
  const defaultHall = isManager ? user.hallId : (halls[0]?.id || "");

  const [form, setForm] = useState({ date: toISO(today), description: "", amount: 0, category: "General", hallId: defaultHall });
  const [editing, setEditing] = useState(null);
  const [filterMonth, setFilterMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
  const [filterHall, setFilterHall] = useState(isManager ? user.hallId : "all");
  const [viewMode, setViewMode] = useState(isOwner ? "combined" : "list"); // "combined" (owner overview), "list"

  const categories = ["General", "Food/Ingredients", "Transport", "Cleaning", "Repair", "Fuel/Gas", "Utilities", "Wages", "Miscellaneous"];

  // Filter expenses: manager sees only their hall, owner sees based on filter
  const visibleExpenses = dailyExpenses.filter((e) => {
    if (isManager) return e.hallId === user.hallId;
    if (filterHall !== "all") return e.hallId === filterHall;
    return true;
  });

  const filtered = visibleExpenses.filter((e) => {
    const ed = new Date(e.date);
    return `${ed.getFullYear()}-${String(ed.getMonth() + 1).padStart(2, "0")}` === filterMonth;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const monthTotal = filtered.reduce((s, e) => s + (e.amount || 0), 0);
  const todayTotal = visibleExpenses.filter((e) => e.date === toISO(today)).reduce((s, e) => s + (e.amount || 0), 0);

  // Hall-wise breakdown for owner
  const hallBreakdown = halls.map((h) => {
    const hallExp = dailyExpenses.filter((e) => {
      if (e.hallId !== h.id) return false;
      const ed = new Date(e.date);
      return `${ed.getFullYear()}-${String(ed.getMonth() + 1).padStart(2, "0")}` === filterMonth;
    });
    return { hall: h, total: hallExp.reduce((s, e) => s + (e.amount || 0), 0), count: hallExp.length, items: hallExp.sort((a, b) => new Date(b.date) - new Date(a.date)) };
  });

  const saveEntry = () => {
    if (!form.description.trim()) { notify("Enter description", "error"); return; }
    if (!form.amount || Number(form.amount) <= 0) { notify("Enter valid amount", "error"); return; }
    const hallId = isManager ? user.hallId : form.hallId;
    if (editing) {
      setDailyExpenses((prev) => prev.map((e) => e.id === editing.id ? { ...e, ...form, hallId, amount: Number(form.amount) } : e));
      addAudit(`Updated daily expense: ${form.description} — ${fmt(form.amount)}`, "Expense");
      notify("Expense updated"); setEditing(null);
    } else {
      setDailyExpenses((prev) => [...prev, { id: genId(), ...form, hallId, amount: Number(form.amount), addedBy: user.name }]);
      addAudit(`Added daily expense: ${form.description} — ${fmt(form.amount)} [${halls.find((h) => h.id === hallId)?.name?.split(",")[0] || ""}]`, "Expense");
      notify("Expense added");
    }
    setForm((f) => ({ date: toISO(today), description: "", amount: 0, category: "General", hallId: f.hallId }));
  };

  const deleteEntry = (e) => {
    setDailyExpenses((prev) => prev.filter((x) => x.id !== e.id));
    addAudit(`Deleted daily expense: ${e.description}`, "Expense"); notify("Expense deleted");
  };

  const editEntry = (e) => {
    setForm({ date: e.date, description: e.description, amount: e.amount, category: e.category, hallId: e.hallId || defaultHall });
    setEditing(e);
  };

  const months = [];
  for (let i = -6; i <= 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }) });
  }

  return (
    <>
      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={FileText} value={fmt(todayTotal)} label="Today's Expenses" />
        <StatCard icon={Calendar} value={fmt(monthTotal)} label="This Month Total" />
        <StatCard icon={Layers} value={filtered.length} label="Entries This Month" />
        {isOwner && <StatCard icon={Building2} value={halls.length} label="Halls Tracked" />}
      </div>

      {/* Add/Edit Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>{editing ? "✏️ Edit Expense" : "➕ Add Daily Expense"}</h3>
          {isManager && <span style={{ fontSize: 12, color: "var(--gold)" }}>🏛️ {halls.find((h) => h.id === user.hallId)?.name?.split(",")[0]}</span>}
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Date</label><input type="date" className="form-input" style={{ margin: 0 }} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></div>
            {isOwner && (
              <div className="form-group" style={{ marginBottom: 0 }}><label>Hall</label>
                <select className="form-input" style={{ margin: 0 }} value={form.hallId} onChange={(e) => setForm((f) => ({ ...f, hallId: e.target.value }))}>
                  {halls.map((h) => <option key={h.id} value={h.id}>{h.name.split(",")[0]}</option>)}
                </select>
              </div>
            )}
            <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: 140 }}><label>Description</label><input className="form-input" style={{ margin: 0 }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="e.g. Diesel for generator, Cleaning supplies..." onKeyDown={(e) => e.key === "Enter" && saveEntry()} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Category</label><select className="form-input" style={{ margin: 0 }} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group" style={{ marginBottom: 0, width: 120 }}><label>Amount (PKR)</label><input type="number" className="form-input" style={{ margin: 0 }} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && saveEntry()} /></div>
            <button className="btn btn-gold" style={{ height: 42 }} onClick={saveEntry}>{editing ? "Update" : <><Plus size={14} /> Add</>}</button>
            {editing && <button className="btn btn-outline" style={{ height: 42 }} onClick={() => { setEditing(null); setForm({ date: toISO(today), description: "", amount: 0, category: "General", hallId: form.hallId }); }}>Cancel</button>}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 8 }}>
          <h3>Daily Expenses</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <select className="form-input" style={{ width: "auto", margin: 0 }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              {months.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            {isOwner && (
              <>
                <select className="form-input" style={{ width: "auto", margin: 0 }} value={filterHall} onChange={(e) => setFilterHall(e.target.value)}>
                  <option value="all">All Halls</option>
                  {halls.map((h) => <option key={h.id} value={h.id}>{h.name.split(",")[0]}</option>)}
                </select>
                <div className="tabs" style={{ marginBottom: 0, width: "auto" }}>
                  <button className={`tab-btn ${viewMode === "combined" ? "active" : ""}`} onClick={() => setViewMode("combined")}>Hall Overview</button>
                  <button className={`tab-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>All Entries</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══ OWNER: HALL OVERVIEW MODE ═══ */}
        {isOwner && viewMode === "combined" ? (
          <div style={{ padding: 16 }}>
            {/* Hall-wise summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${halls.length}, 1fr)`, gap: 12, marginBottom: 20 }}>
              {hallBreakdown.map((hb) => (
                <div key={hb.hall.id} style={{ background: "var(--navy-light)", borderRadius: 8, padding: 14, borderTop: `3px solid ${hb.hall.color || "var(--gold)"}` }}>
                  <div style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, marginBottom: 4 }}>{hb.hall.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: hb.total > 0 ? "var(--red)" : "var(--slate)", fontFamily: "'Playfair Display',serif" }}>{fmt(hb.total)}</div>
                  <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 4 }}>{hb.count} entries this month</div>
                </div>
              ))}
            </div>

            {/* Combined total */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "rgba(148, 163, 184, 0.20)", borderRadius: 8, marginBottom: 16 }}>
              <span style={{ fontWeight: 700, color: "var(--cream)" }}>Combined Total — All Halls</span>
              <span style={{ fontWeight: 700, color: "var(--red)", fontSize: 18, fontFamily: "'Playfair Display',serif" }}>{fmt(hallBreakdown.reduce((s, hb) => s + hb.total, 0))}</span>
            </div>

            {/* Per-hall expense tables */}
            {hallBreakdown.map((hb) => (
              <div key={hb.hall.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(148, 163, 184, 0.18)", borderRadius: "8px 8px 0 0", borderLeft: `4px solid ${hb.hall.color || "var(--gold)"}` }}>
                  <span style={{ fontWeight: 700, color: "var(--cream)", fontFamily: "'Playfair Display',serif" }}>{hb.hall.name}</span>
                  <span style={{ fontWeight: 700, color: "var(--red)" }}>{fmt(hb.total)} ({hb.count} entries)</span>
                </div>
                {hb.items.length > 0 ? (
                  <table className="data-table" style={{ margin: 0 }}>
                    <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Added By</th><th style={{ textAlign: "right" }}>Amount</th><th></th></tr></thead>
                    <tbody>
                      {hb.items.map((e) => (
                        <tr key={e.id}>
                          <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>{fmtDate(e.date)}</td>
                          <td style={{ fontWeight: 500 }}>{e.description}</td>
                          <td><Badge type="active">{e.category}</Badge></td>
                          <td style={{ color: "var(--slate)", fontSize: 12 }}>{e.addedBy}</td>
                          <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(e.amount)}</td>
                          <td style={{ width: 60 }}><div style={{ display: "flex", gap: 4 }}><button className="btn-icon" onClick={() => { setViewMode("list"); editEntry(e); }}><Edit size={13} /></button><button className="btn-icon" onClick={() => deleteEntry(e)} style={{ color: "var(--red)" }}><Trash2 size={13} /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: 20, textAlign: "center", color: "var(--slate)", fontSize: 12, background: "var(--navy-light)", borderRadius: "0 0 8px 8px" }}>No expenses this month</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ═══ LIST VIEW (Managers + Owner filtered) ═══ */
          <div className="scroll-table">
            <table className="data-table">
              <thead><tr><th>Date</th>{isOwner && <th>Hall</th>}<th>Description</th><th>Category</th><th>Added By</th><th style={{ textAlign: "right" }}>Amount</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} style={{ background: editing?.id === e.id ? "rgba(148, 163, 184, 0.20)" : "transparent" }}>
                    <td style={{ whiteSpace: "nowrap" }}>{fmtDate(e.date)}</td>
                    {isOwner && <td style={{ fontSize: 12 }}><Badge type="active">{halls.find((h) => h.id === e.hallId)?.name?.split(",")[0] || "—"}</Badge></td>}
                    <td style={{ fontWeight: 500 }}>{e.description}</td>
                    <td><Badge type="active">{e.category}</Badge></td>
                    <td style={{ color: "var(--slate)", fontSize: 12 }}>{e.addedBy}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(e.amount)}</td>
                    <td><div style={{ display: "flex", gap: 4 }}><button className="btn-icon" onClick={() => editEntry(e)}><Edit size={14} /></button><button className="btn-icon" onClick={() => deleteEntry(e)} style={{ color: "var(--red)" }}><Trash2 size={14} /></button></div></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={isOwner ? 7 : 6} style={{ textAlign: "center", padding: 30, color: "var(--slate)" }}>No expenses for this month{isOwner && filterHall !== "all" ? ` in ${halls.find((h) => h.id === filterHall)?.name?.split(",")[0]}` : ""}</td></tr>}
              </tbody>
              {filtered.length > 0 && (
                <tfoot><tr style={{ background: "rgba(148, 163, 184, 0.25)" }}>
                  <td colSpan={isOwner ? 5 : 4} style={{ padding: "10px 14px", fontWeight: 700, color: "var(--gold)" }}>MONTH TOTAL</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "var(--gold)", fontSize: 15, padding: "10px 14px" }}>{fmt(monthTotal)}</td>
                  <td></td>
                </tr></tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: MONTHLY EXPENSES (OWNER)
// ═══════════════════════════════════════════════
function MonthlyExpensesModule({ monthlyExpenses, setMonthlyExpenses, notify, addAudit, halls }) {
  const [form, setForm] = useState({ month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`, category: "Hall Rent", description: "", amount: 0, hallId: halls[0]?.id || "" });
  const [editing, setEditing] = useState(null);
  const [filterYear, setFilterYear] = useState(today.getFullYear());

  const categories = ["Hall Rent", "Electricity", "Internet", "Gas Bill", "Water Bill", "Taxes", "Insurance", "Salary Advances", "Maintenance", "Other"];

  const filtered = monthlyExpenses.filter((e) => e.month?.startsWith(String(filterYear))).sort((a, b) => b.month.localeCompare(a.month));
  const yearTotal = filtered.reduce((s, e) => s + (e.amount || 0), 0);

  const saveEntry = () => {
    if (!form.amount || Number(form.amount) <= 0) { notify("Enter valid amount", "error"); return; }
    if (editing) {
      setMonthlyExpenses((prev) => prev.map((e) => e.id === editing.id ? { ...e, ...form, amount: Number(form.amount) } : e));
      addAudit(`Updated monthly expense: ${form.category} — ${fmt(form.amount)}`, "Expense");
      notify("Updated");
      setEditing(null);
    } else {
      setMonthlyExpenses((prev) => [...prev, { id: genId(), ...form, amount: Number(form.amount) }]);
      addAudit(`Added monthly expense: ${form.category} ${form.month} — ${fmt(form.amount)}`, "Expense");
      notify("Monthly expense added");
    }
    setForm((f) => ({ ...f, description: "", amount: 0 }));
  };

  const deleteEntry = (e) => { setMonthlyExpenses((prev) => prev.filter((x) => x.id !== e.id)); notify("Deleted"); };
  const editEntry = (e) => { setForm({ month: e.month, category: e.category, description: e.description || "", amount: e.amount, hallId: e.hallId || "" }); setEditing(e); };

  // Group by month
  const byMonth = {};
  filtered.forEach((e) => { if (!byMonth[e.month]) byMonth[e.month] = []; byMonth[e.month].push(e); });

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={CreditCard} value={fmt(yearTotal)} label={`${filterYear} Total Fixed Costs`} />
        <StatCard icon={Calendar} value={Object.keys(byMonth).length} label="Months with Entries" />
        <StatCard icon={FileText} value={filtered.length} label="Total Entries" />
      </div>

      {/* Add/Edit Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><h3>{editing ? "✏️ Edit Monthly Expense" : "➕ Add Monthly Fixed Expense"}</h3></div>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Month</label><input type="month" className="form-input" style={{ margin: 0 }} value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Category</label><select className="form-input" style={{ margin: 0 }} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Hall</label><select className="form-input" style={{ margin: 0 }} value={form.hallId} onChange={(e) => setForm((f) => ({ ...f, hallId: e.target.value }))}><option value="">All Halls</option>{halls.map((h) => <option key={h.id} value={h.id}>{h.name.split(",")[0]}</option>)}</select></div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 140 }}><label>Description (optional)</label><input className="form-input" style={{ margin: 0 }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Details..." /></div>
            <div className="form-group" style={{ marginBottom: 0, width: 120 }}><label>Amount (PKR)</label><input type="number" className="form-input" style={{ margin: 0 }} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && saveEntry()} /></div>
            <button className="btn btn-gold" style={{ height: 42 }} onClick={saveEntry}>{editing ? "Update" : <><Plus size={14} /> Add</>}</button>
            {editing && <button className="btn btn-outline" style={{ height: 42 }} onClick={() => { setEditing(null); setForm((f) => ({ ...f, description: "", amount: 0 })); }}>Cancel</button>}
          </div>
        </div>
      </div>

      {/* Year filter */}
      <div className="card">
        <div className="card-header">
          <h3>Monthly Fixed Expenses</h3>
          <div style={{ display: "flex", gap: 6 }}>
            {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map((y) => (
              <button key={y} className={`tab-btn ${filterYear === y ? "active" : ""}`} onClick={() => setFilterYear(y)}>{y}</button>
            ))}
          </div>
        </div>

        {Object.keys(byMonth).length === 0 ? (
          <div className="empty-state"><CreditCard size={40} /><p>No monthly expenses for {filterYear}</p></div>
        ) : (
          Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)).map(([month, entries]) => {
            const mTotal = entries.reduce((s, e) => s + e.amount, 0);
            const mLabel = new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });
            return (
              <div key={month} style={{ marginBottom: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", background: "rgba(148, 163, 184, 0.18)", borderBottom: "1px solid rgba(148, 163, 184, 0.25)" }}>
                  <span style={{ fontWeight: 700, color: "var(--cream)", fontFamily: "'Playfair Display',serif" }}>{mLabel}</span>
                  <span style={{ fontWeight: 700, color: "var(--red)" }}>{fmt(mTotal)}</span>
                </div>
                <table className="data-table" style={{ margin: 0 }}>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id} style={{ background: editing?.id === e.id ? "rgba(148, 163, 184, 0.20)" : "transparent" }}>
                        <td style={{ width: 140 }}><Badge type="active">{e.category}</Badge></td>
                        <td style={{ color: "var(--slate)", fontSize: 12 }}>{halls.find((h) => h.id === e.hallId)?.name?.split(",")[0] || "All Halls"}</td>
                        <td style={{ fontWeight: 500 }}>{e.description || "—"}</td>
                        <td style={{ textAlign: "right", fontWeight: 600, width: 120 }}>{fmt(e.amount)}</td>
                        <td style={{ width: 70 }}><div style={{ display: "flex", gap: 4 }}><button className="btn-icon" onClick={() => editEntry(e)}><Edit size={13} /></button><button className="btn-icon" onClick={() => deleteEntry(e)} style={{ color: "var(--red)" }}><Trash2 size={13} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: NET PROFIT / LOSS (OWNER)
// ═══════════════════════════════════════════════
function NetProfitModule({ bookings, dailyExpenses, monthlyExpenses, packages, halls }) {
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [expandedMonth, setExpandedMonth] = useState(null);

  const confirmedBookings = bookings.filter((b) => b.status !== "cancelled");

  // Build monthly data
  const monthlyData = [];
  for (let m = 0; m < 12; m++) {
    const monthKey = `${viewYear}-${String(m + 1).padStart(2, "0")}`;
    const label = new Date(viewYear, m).toLocaleDateString("en-US", { month: "long" });

    // Program revenue & profit from event expenses
    const mBookings = confirmedBookings.filter((b) => { const d = new Date(b.date); return d.getFullYear() === viewYear && d.getMonth() === m; });
    const programRevenue = mBookings.reduce((s, b) => s + b.totalAmount - (b.discount || 0), 0);
    const programExpenses = mBookings.reduce((s, b) => s + (b.expenses || []).reduce((a, e) => a + (e.total || 0), 0), 0);
    const programProfit = programRevenue - programExpenses;

    // Daily expenses
    const mDaily = dailyExpenses.filter((e) => { const d = new Date(e.date); return d.getFullYear() === viewYear && d.getMonth() === m; });
    const dailyTotal = mDaily.reduce((s, e) => s + (e.amount || 0), 0);

    // Monthly fixed expenses
    const mMonthly = monthlyExpenses.filter((e) => e.month === monthKey);
    const monthlyTotal = mMonthly.reduce((s, e) => s + (e.amount || 0), 0);

    // Net
    const totalExpenses = dailyTotal + monthlyTotal;
    const netProfit = programProfit - totalExpenses;

    monthlyData.push({
      month: m, monthKey, label,
      bookingsCount: mBookings.length, programRevenue, programExpenses, programProfit,
      dailyTotal, monthlyTotal, totalExpenses, netProfit,
      mBookings, mDaily, mMonthly,
    });
  }

  const yearlyData = monthlyData.reduce((acc, m) => ({
    programRevenue: acc.programRevenue + m.programRevenue,
    programExpenses: acc.programExpenses + m.programExpenses,
    programProfit: acc.programProfit + m.programProfit,
    dailyTotal: acc.dailyTotal + m.dailyTotal,
    monthlyTotal: acc.monthlyTotal + m.monthlyTotal,
    totalExpenses: acc.totalExpenses + m.totalExpenses,
    netProfit: acc.netProfit + m.netProfit,
    bookingsCount: acc.bookingsCount + m.bookingsCount,
  }), { programRevenue: 0, programExpenses: 0, programProfit: 0, dailyTotal: 0, monthlyTotal: 0, totalExpenses: 0, netProfit: 0, bookingsCount: 0 });

  const activeMonths = monthlyData.filter((m) => m.bookingsCount > 0 || m.dailyTotal > 0 || m.monthlyTotal > 0);

  return (
    <>
      {/* Yearly Summary Cards */}
      <div className="stats-grid">
        <StatCard icon={TrendingUp} iconBg="var(--green-bg)" value={fmt(yearlyData.programRevenue)} label={`${viewYear} Program Revenue`} />
        <StatCard icon={FileText} iconBg="var(--red-bg)" value={fmt(yearlyData.totalExpenses + yearlyData.programExpenses)} label="Total All Expenses" />
        <StatCard icon={TrendingUp} iconBg={yearlyData.netProfit >= 0 ? "var(--green-bg)" : "var(--red-bg)"} value={fmt(yearlyData.netProfit)} label={`${viewYear} Net ${yearlyData.netProfit >= 0 ? "Profit" : "Loss"}`} />
        <StatCard icon={Calendar} value={yearlyData.bookingsCount} label="Total Programs" />
      </div>

      {/* Year Selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
        {[viewYear - 2, viewYear - 1, viewYear, viewYear + 1].map((y) => (
          <button key={y} onClick={() => setViewYear(y)} style={{ padding: "8px 20px", borderRadius: 8, border: `2px solid ${y === viewYear ? "var(--gold)" : "rgba(148, 163, 184, 0.30)"}`, background: y === viewYear ? "rgba(148, 163, 184, 0.30)" : "transparent", color: y === viewYear ? "var(--gold)" : "var(--slate)", fontSize: 14, fontWeight: y === viewYear ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>{y}</button>
        ))}
      </div>

      {/* Grand Yearly P&L Card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--slate)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>YEARLY PROFIT & LOSS — {viewYear}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 8, borderBottom: "1px solid rgba(148, 163, 184, 0.25)" }}>
              <span style={{ fontWeight: 600, color: "var(--cream)" }}>Program Revenue (from {yearlyData.bookingsCount} events)</span>
              <span style={{ fontWeight: 700, color: "var(--green)", fontSize: 16 }}>{fmt(yearlyData.programRevenue)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingLeft: 16 }}>
              <span style={{ color: "var(--slate)" }}>Program Material Costs (chicken, rice, etc.)</span>
              <span style={{ color: "var(--red)" }}>-{fmt(yearlyData.programExpenses)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingBottom: 4, borderBottom: "1px solid rgba(148, 163, 184, 0.25)" }}>
              <span style={{ fontWeight: 600, color: "var(--cream)" }}>= Gross Program Profit</span>
              <span style={{ fontWeight: 600, color: yearlyData.programProfit >= 0 ? "var(--green)" : "var(--red)" }}>{fmt(yearlyData.programProfit)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingLeft: 16 }}>
              <span style={{ color: "var(--slate)" }}>Daily Operational Expenses</span>
              <span style={{ color: "var(--red)" }}>-{fmt(yearlyData.dailyTotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingLeft: 16 }}>
              <span style={{ color: "var(--slate)" }}>Monthly Fixed Costs (rent, electricity, etc.)</span>
              <span style={{ color: "var(--red)" }}>-{fmt(yearlyData.monthlyTotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, paddingTop: 12, marginTop: 8, borderTop: "2px solid var(--gold)", fontFamily: "'Playfair Display',serif" }}>
              <span style={{ fontWeight: 700, color: "var(--cream)" }}>{yearlyData.netProfit >= 0 ? "✅ Net Profit" : "❌ Net Loss"}</span>
              <span style={{ fontWeight: 700, color: yearlyData.netProfit >= 0 ? "var(--green)" : "var(--red)" }}>{yearlyData.netProfit >= 0 ? "+" : ""}{fmt(yearlyData.netProfit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="card">
        <div className="card-header"><h3>Monthly Breakdown</h3></div>
        <div className="scroll-table">
          <table className="data-table">
            <thead><tr><th>Month</th><th style={{ textAlign: "right" }}>Events</th><th style={{ textAlign: "right" }}>Program Revenue</th><th style={{ textAlign: "right" }}>Program Cost</th><th style={{ textAlign: "right" }}>Daily Exp.</th><th style={{ textAlign: "right" }}>Monthly Exp.</th><th style={{ textAlign: "right" }}>Net P&L</th><th></th></tr></thead>
            <tbody>
              {monthlyData.map((m) => {
                const hasData = m.bookingsCount > 0 || m.dailyTotal > 0 || m.monthlyTotal > 0;
                const isExpanded = expandedMonth === m.month;
                return (
                  <React.Fragment key={m.month}>
                    <tr style={{ cursor: hasData ? "pointer" : "default", opacity: hasData ? 1 : 0.35 }} onClick={() => hasData && setExpandedMonth(isExpanded ? null : m.month)}>
                      <td style={{ fontWeight: 600 }}>{m.label}</td>
                      <td style={{ textAlign: "right" }}>{m.bookingsCount || "—"}</td>
                      <td style={{ textAlign: "right", color: "var(--green)" }}>{m.programRevenue > 0 ? fmt(m.programRevenue) : "—"}</td>
                      <td style={{ textAlign: "right", color: "var(--red)" }}>{m.programExpenses > 0 ? fmt(m.programExpenses) : "—"}</td>
                      <td style={{ textAlign: "right", color: "var(--red)" }}>{m.dailyTotal > 0 ? fmt(m.dailyTotal) : "—"}</td>
                      <td style={{ textAlign: "right", color: "var(--red)" }}>{m.monthlyTotal > 0 ? fmt(m.monthlyTotal) : "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, fontSize: 14, color: hasData ? (m.netProfit >= 0 ? "var(--green)" : "var(--red)") : "var(--slate)" }}>
                        {hasData ? `${m.netProfit >= 0 ? "+" : ""}${fmt(m.netProfit)}` : "—"}
                      </td>
                      <td style={{ width: 30 }}>{hasData && <ChevronRight size={14} style={{ color: "var(--slate)", transform: isExpanded ? "rotate(90deg)" : "none", transition: "0.2s" }} />}</td>
                    </tr>
                    {isExpanded && (
                      <tr><td colSpan={8} style={{ padding: 0 }}>
                        <div style={{ background: "rgba(15, 23, 42, 0.04)", padding: 16 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                            {/* Programs */}
                            <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: 12 }}>
                              <div style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>PROGRAMS ({m.bookingsCount})</div>
                              {m.mBookings.length > 0 ? m.mBookings.map((b) => (
                                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0" }}>
                                  <span style={{ color: "var(--cream)" }}>{b.customerName}</span>
                                  <span style={{ color: "var(--green)" }}>{fmt(b.totalAmount - (b.discount || 0))}</span>
                                </div>
                              )) : <div style={{ fontSize: 11, color: "var(--slate)" }}>No programs</div>}
                            </div>
                            {/* Daily Expenses */}
                            <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: 12 }}>
                              <div style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>DAILY EXPENSES</div>
                              {m.mDaily.length > 0 ? m.mDaily.slice(0, 8).map((e) => (
                                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0" }}>
                                  <span style={{ color: "var(--cream)" }}>{e.description}</span>
                                  <span style={{ color: "var(--red)" }}>{fmt(e.amount)}</span>
                                </div>
                              )) : <div style={{ fontSize: 11, color: "var(--slate)" }}>No daily expenses</div>}
                              {m.mDaily.length > 8 && <div style={{ fontSize: 10, color: "var(--slate)", marginTop: 4 }}>...and {m.mDaily.length - 8} more</div>}
                            </div>
                            {/* Monthly Fixed */}
                            <div style={{ background: "var(--navy-light)", borderRadius: 8, padding: 12 }}>
                              <div style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>MONTHLY FIXED</div>
                              {m.mMonthly.length > 0 ? m.mMonthly.map((e) => (
                                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0" }}>
                                  <span style={{ color: "var(--cream)" }}>{e.category}</span>
                                  <span style={{ color: "var(--red)" }}>{fmt(e.amount)}</span>
                                </div>
                              )) : <div style={{ fontSize: 11, color: "var(--slate)" }}>No fixed expenses</div>}
                            </div>
                          </div>
                        </div>
                      </td></tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot><tr style={{ background: "rgba(148, 163, 184, 0.25)" }}>
              <td style={{ fontWeight: 700, color: "var(--gold)", padding: "10px 14px" }}>YEARLY TOTAL</td>
              <td style={{ textAlign: "right", fontWeight: 600 }}>{yearlyData.bookingsCount}</td>
              <td style={{ textAlign: "right", fontWeight: 700, color: "var(--green)" }}>{fmt(yearlyData.programRevenue)}</td>
              <td style={{ textAlign: "right", fontWeight: 600, color: "var(--red)" }}>{fmt(yearlyData.programExpenses)}</td>
              <td style={{ textAlign: "right", fontWeight: 600, color: "var(--red)" }}>{fmt(yearlyData.dailyTotal)}</td>
              <td style={{ textAlign: "right", fontWeight: 600, color: "var(--red)" }}>{fmt(yearlyData.monthlyTotal)}</td>
              <td style={{ textAlign: "right", fontWeight: 700, fontSize: 15, color: yearlyData.netProfit >= 0 ? "var(--green)" : "var(--red)" }}>{yearlyData.netProfit >= 0 ? "+" : ""}{fmt(yearlyData.netProfit)}</td>
              <td></td>
            </tr></tfoot>
          </table>
        </div>
      </div>

      {/* Running Summary */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><h3>Running Summary</h3></div>
        <div style={{ padding: 16 }}>
          {(() => {
            let running = 0;
            return activeMonths.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {activeMonths.map((m) => {
                  running += m.netProfit;
                  return (
                    <div key={m.month} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0", borderBottom: "1px solid rgba(15, 23, 42, 0.05)" }}>
                      <span style={{ width: 100, fontSize: 13, fontWeight: 500, color: "var(--cream)" }}>{m.label}</span>
                      <span style={{ width: 100, fontSize: 12, textAlign: "right", color: m.netProfit >= 0 ? "var(--green)" : "var(--red)" }}>{m.netProfit >= 0 ? "+" : ""}{fmt(m.netProfit)}</span>
                      <div style={{ flex: 1, height: 6, background: "var(--navy-light)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, Math.abs(running) / (Math.max(1, yearlyData.programRevenue)) * 100)}%`, height: "100%", background: running >= 0 ? "var(--green)" : "var(--red)", borderRadius: 3 }} />
                      </div>
                      <span style={{ width: 120, fontSize: 13, fontWeight: 700, textAlign: "right", color: running >= 0 ? "var(--green)" : "var(--red)" }}>{running >= 0 ? "+" : ""}{fmt(running)}</span>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTop: "2px solid var(--gold)" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)", fontFamily: "'Playfair Display',serif" }}>Total Running {running >= 0 ? "Profit" : "Loss"}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: running >= 0 ? "var(--green)" : "var(--red)", fontFamily: "'Playfair Display',serif" }}>{running >= 0 ? "+" : ""}{fmt(running)}</span>
                </div>
              </div>
            ) : (
              <div className="empty-state"><TrendingUp size={40} /><p>No data yet for {viewYear}. Add bookings and expenses to see your running profit/loss.</p></div>
            );
          })()}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: REPORTS
// ═══════════════════════════════════════════════
function ReportsModule({ bookings, staff, vendors, halls, packages, allHalls }) {
  const [tab, setTab] = useState("revenue");

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = confirmed.reduce((s, b) => s + b.paidAmount, 0);
  const totalBilled = confirmed.reduce((s, b) => s + b.totalAmount, 0);
  const staffCost = staff.reduce((s, st) => s + st.salary, 0);
  const vendorCost = vendors.reduce((s, v) => s + v.rate, 0);
  const profit = totalRevenue - staffCost - vendorCost;

  const monthlyData = [];
  for (let m = 0; m < 6; m++) {
    const d = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const label = d.toLocaleDateString("en-US", { month: "short" });
    const rev = bookings.filter((b) => { const bd = new Date(b.date); return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear() && b.status === "confirmed"; }).reduce((s, b) => s + b.paidAmount, 0);
    monthlyData.unshift({ label, value: rev, color: "var(--gold)" });
  }

  const eventDist = EVENT_TYPES.map((t) => ({ label: t.substring(0, 4), value: bookings.filter((b) => b.eventType === t).length, color: ["var(--gold)", "var(--green)", "var(--blue)", "var(--red)", "var(--yellow)", "var(--slate)"][EVENT_TYPES.indexOf(t)] }));

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={TrendingUp} iconBg="var(--green-bg)" value={fmt(totalRevenue)} label="Total Revenue" />
        <StatCard icon={DollarSign} value={fmt(totalBilled)} label="Total Billed" />
        <StatCard icon={TrendingDown} iconBg="var(--red-bg)" value={fmt(staffCost + vendorCost)} label="Total Expenses" />
        <StatCard icon={BarChart3} iconBg={profit > 0 ? "var(--green-bg)" : "var(--red-bg)"} value={fmt(profit)} label="Net Profit" />
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === "revenue" ? "active" : ""}`} onClick={() => setTab("revenue")}>Revenue</button>
        <button className={`tab-btn ${tab === "events" ? "active" : ""}`} onClick={() => setTab("events")}>Events</button>
        <button className={`tab-btn ${tab === "halls" ? "active" : ""}`} onClick={() => setTab("halls")}>Hall Analysis</button>
        <button className={`tab-btn ${tab === "pnl" ? "active" : ""}`} onClick={() => setTab("pnl")}>P&L Statement</button>
      </div>

      {tab === "revenue" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><h3>Monthly Revenue (Last 6 Months)</h3></div>
            <BarChart data={monthlyData} />
            <div style={{ marginTop: 32 }} />
          </div>
          <div className="card">
            <div className="card-header"><h3>Event Type Distribution</h3></div>
            <BarChart data={eventDist} />
            <div style={{ marginTop: 32 }} />
          </div>
        </div>
      )}

      {tab === "events" && (
        <div className="card">
          <div className="card-header"><h3>Event-wise Revenue Breakdown</h3></div>
          <table className="data-table">
            <thead><tr><th>Event Type</th><th>Bookings</th><th>Revenue</th><th>Avg Guests</th><th>Avg Revenue</th></tr></thead>
            <tbody>
              {EVENT_TYPES.map((t) => {
                const evts = confirmed.filter((b) => b.eventType === t);
                const rev = evts.reduce((s, b) => s + b.paidAmount, 0);
                const avgGuests = evts.length ? Math.round(evts.reduce((s, b) => s + b.guests, 0) / evts.length) : 0;
                return (
                  <tr key={t}>
                    <td style={{ fontWeight: 500 }}>{t}</td>
                    <td>{evts.length}</td>
                    <td>{fmt(rev)}</td>
                    <td>{avgGuests}</td>
                    <td>{evts.length ? fmt(Math.round(rev / evts.length)) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "halls" && (
        <div className="grid-3">
          {halls.map((h) => {
            const hallBookings = confirmed.filter((b) => b.hallId === h.id);
            const rev = hallBookings.reduce((s, b) => s + b.paidAmount, 0);
            const occ = Math.round((hallBookings.length / Math.max(confirmed.length, 1)) * 100);
            return (
              <div key={h.id} className="card">
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: "var(--cream)", marginBottom: 14 }}>{h.name}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Capacity</span><span>{h.capacity} pax</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Bookings</span><span>{hallBookings.length}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Revenue</span><span style={{ color: "var(--gold)" }}>{fmt(rev)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Occupancy</span><span>{occ}%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${occ}%`, background: h.color }} /></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "pnl" && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="card-header"><h3>Profit & Loss Statement</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 14, borderBottom: "1px solid rgba(15, 23, 42, 0.08)" }}><span style={{ fontWeight: 600 }}>Revenue</span><span style={{ color: "var(--green)", fontWeight: 600 }}>{fmt(totalRevenue)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13, paddingLeft: 20 }}><span style={{ color: "var(--slate)" }}>Hall Rent Revenue</span><span>{fmt(confirmed.reduce((s, b) => s + (b.hallRent || 0), 0))}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13, paddingLeft: 20 }}><span style={{ color: "var(--slate)" }}>Catering Revenue</span><span>{fmt(confirmed.reduce((s, b) => s + b.guests * (b.customPricePerHead || packages.find((p) => p.id === b.packageId)?.pricePerHead || 0), 0))}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 14, borderBottom: "1px solid rgba(15, 23, 42, 0.08)", borderTop: "1px solid rgba(15, 23, 42, 0.08)", marginTop: 8 }}><span style={{ fontWeight: 600 }}>Expenses</span><span style={{ color: "var(--red)", fontWeight: 600 }}>{fmt(staffCost + vendorCost)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13, paddingLeft: 20 }}><span style={{ color: "var(--slate)" }}>Staff Salaries</span><span>{fmt(staffCost)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13, paddingLeft: 20 }}><span style={{ color: "var(--slate)" }}>Vendor Costs</span><span>{fmt(vendorCost)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontSize: 18, fontFamily: "'Playfair Display',serif", borderTop: "2px solid var(--gold)", marginTop: 12 }}>
              <span style={{ fontWeight: 700 }}>Net Profit</span>
              <span style={{ color: profit > 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>{fmt(profit)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: MULTI-HALL
// ═══════════════════════════════════════════════
function MultiHallModule({ bookings, halls, allHalls, setHalls, notify, addAudit, user }) {
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [hallForm, setHallForm] = useState({ name: "", capacity: 0, color: "#f97316" });

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const totalRev = confirmed.reduce((s, b) => s + b.paidAmount, 0);
  const isOwner = user?.role === "owner";

  const openEditHall = (h) => {
    setHallForm({ name: h.name, capacity: h.capacity, color: h.color });
    setEditModal(h);
  };

  const openAddHall = () => {
    setHallForm({ name: "", capacity: 0, color: "#f97316" });
    setAddModal(true);
  };

  const saveNewHall = () => {
    if (!hallForm.name.trim()) { notify("Please enter hall name", "error"); return; }
    if (hallForm.capacity <= 0) { notify("Please enter a valid capacity", "error"); return; }
    const newHall = {
      id: "h_" + Math.random().toString(36).substr(2, 9),
      name: hallForm.name.trim(),
      capacity: Number(hallForm.capacity),
      priceBase: 0,
      color: hallForm.color,
    };
    setHalls((prev) => [...prev, newHall]);
    addAudit(`Created new hall: ${hallForm.name}`, "Settings");
    notify(`✅ Hall "${hallForm.name}" added successfully`);
    setAddModal(false);
    setHallForm({ name: "", capacity: 0, color: "#f97316" });
  };

  const deleteHall = (h) => {
    const hallBookings = bookings.filter((b) => b.hallId === h.id);
    if (hallBookings.length > 0) {
      notify(`Cannot delete "${h.name}" — it has ${hallBookings.length} booking(s). Cancel or reassign them first.`, "error");
      return;
    }
    if (!window.confirm(`Delete "${h.name}"? This action cannot be undone.`)) return;
    setHalls((prev) => prev.filter((x) => x.id !== h.id));
    addAudit(`Deleted hall: ${h.name}`, "Settings");
    notify(`Hall "${h.name}" deleted`);
  };

  const saveHall = () => {
    if (!hallForm.name.trim()) { notify("Please enter hall name", "error"); return; }
    if (hallForm.capacity <= 0) { notify("Please enter a valid capacity", "error"); return; }
    setHalls((prev) => prev.map((h) => h.id === editModal.id ? { ...h, name: hallForm.name, capacity: Number(hallForm.capacity), color: hallForm.color } : h));
    addAudit(`Updated hall settings: ${hallForm.name} — Capacity: ${hallForm.capacity}`, "Settings");
    notify(`✅ Hall "${hallForm.name}" updated successfully`);
    setEditModal(null);
  };

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={Building2} value={halls.length} label="Total Halls" />
        <StatCard icon={DollarSign} iconBg="var(--green-bg)" value={fmt(totalRev)} label="Combined Revenue" />
        <StatCard icon={Calendar} value={confirmed.length} label="Total Bookings" />
      </div>

      {isOwner && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(148, 163, 184, 0.18)", border: "1px solid rgba(148, 163, 184, 0.30)", borderRadius: "var(--radius)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 280 }}>
            <Settings size={16} style={{ color: "var(--slate)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "var(--slate)" }}>
              {halls.length === 0
                ? <>No halls yet. Click <strong>+ Add Hall</strong> to create your first one.</>
                : <>Click <strong>Edit</strong> to change hall name, capacity, or color. Hall rent is set per booking.</>}
            </span>
          </div>
          <button className="btn btn-gold" onClick={openAddHall}>
            <Plus size={16} /> Add Hall
          </button>
        </div>
      )}

      {halls.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <Building2 size={48} style={{ color: "var(--slate)", opacity: 0.4, margin: "0 auto 16px" }} />
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--white)", marginBottom: 8 }}>No halls configured yet</h3>
          <p style={{ fontSize: 13, color: "var(--slate)", maxWidth: 420, margin: "0 auto 20px" }}>
            Add your first wedding hall to start managing bookings, expenses, and revenue. You can add as many halls as you need.
          </p>
          {isOwner && (
            <button className="btn btn-gold" onClick={openAddHall}>
              <Plus size={16} /> Add Your First Hall
            </button>
          )}
        </div>
      ) : (

      <div className="grid-3">
        {halls.map((h) => {
          const hb = confirmed.filter((b) => b.hallId === h.id);
          const rev = hb.reduce((s, b) => s + b.paidAmount, 0);
          const due = hb.reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount - b.discount), 0);
          const avgRent = hb.length > 0 ? Math.round(hb.reduce((s, b) => s + (b.hallRent || 0), 0) / hb.length) : 0;
          const upcoming = bookings.filter((b) => b.hallId === h.id && b.status !== "cancelled" && new Date(b.date) >= today).length;
          return (
            <div key={h.id} className="card" style={{ borderLeft: `3px solid ${h.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: "var(--cream)" }}>{h.name}</h3>
                {isOwner && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-icon" title="Edit" onClick={() => openEditHall(h)}>
                      <Edit size={13} />
                    </button>
                    <button className="btn-icon" title="Delete" onClick={() => deleteHall(h)} style={{ color: "var(--red)" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
                Capacity: <strong>{h.capacity}</strong> guests {avgRent > 0 && <> | Avg Rent: <strong style={{ color: "var(--gold)" }}>{fmt(avgRent)}</strong></>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Total Bookings</span><span style={{ fontWeight: 600 }}>{hb.length}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Revenue</span><span style={{ fontWeight: 600, color: "var(--green)" }}>{fmt(rev)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Outstanding</span><span style={{ fontWeight: 600, color: "var(--red)" }}>{fmt(due)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Upcoming Events</span><span style={{ fontWeight: 600 }}>{upcoming}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--slate)" }}>Revenue Share</span><span style={{ fontWeight: 600, color: "var(--gold)" }}>{totalRev > 0 ? Math.round((rev / totalRev) * 100) : 0}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${totalRev > 0 ? (rev / totalRev) * 100 : 0}%`, background: h.color }} /></div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {addModal && (
        <Modal title="✦ Add New Hall" onClose={() => setAddModal(false)} footer={<><button className="btn btn-outline" onClick={() => setAddModal(false)}>Cancel</button><button className="btn btn-gold" onClick={saveNewHall}>Add Hall</button></>}>
          <div className="form-group">
            <label>Hall Name *</label>
            <input className="form-input" value={hallForm.name} onChange={(e) => setHallForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Mashal Gathering Hall, Charsadda" autoFocus />
          </div>
          <div className="form-group">
            <label>Guest Capacity *</label>
            <input type="number" className="form-input" value={hallForm.capacity || ""} onChange={(e) => setHallForm((f) => ({ ...f, capacity: e.target.value }))} placeholder="e.g. 500" />
          </div>
          <div className="form-group">
            <label>Hall Color (for charts & calendar)</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {["#f97316", "#334155", "#0ea5e9", "#10b981", "#dc2626", "#d97706", "#7c3aed", "#0891b2"].map((c) => (
                <div key={c} onClick={() => setHallForm((f) => ({ ...f, color: c }))}
                  style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: "pointer", border: hallForm.color === c ? "3px solid var(--white)" : "2px solid rgba(15, 23, 42, 0.10)", boxShadow: hallForm.color === c ? "0 0 0 2px " + c : "none" }} />
              ))}
            </div>
          </div>
        </Modal>
      )}

      {editModal && (
        <Modal title={`⚙️ Hall Settings — ${editModal.name}`} onClose={() => setEditModal(null)} footer={<><button className="btn btn-outline" onClick={() => setEditModal(null)}>Cancel</button><button className="btn btn-gold" onClick={saveHall}>Save Changes</button></>}>
          <div style={{ background: "rgba(148, 163, 184, 0.20)", padding: 12, borderRadius: 8, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Info size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "var(--gold)" }}>Hall rent is now set individually per booking in the New Booking form, so you can negotiate different rates for each customer.</span>
          </div>

          <div className="form-group">
            <label>Hall Name</label>
            <input className="form-input" value={hallForm.name} onChange={(e) => setHallForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Mashal Gathering Hall, Charsadda" />
          </div>

          <div className="form-group">
            <label>Guest Capacity</label>
            <input type="number" className="form-input" value={hallForm.capacity} onChange={(e) => setHallForm((f) => ({ ...f, capacity: e.target.value }))} placeholder="e.g. 500" />
          </div>

          <div className="form-group">
            <label>Hall Color (for charts & calendar)</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["#C6A55C", "#4A6FA5", "#34D399", "#F87171", "#FBBF24", "#A78BFA", "#FB923C", "#7B8794"].map((c) => (
                <div key={c} onClick={() => setHallForm((f) => ({ ...f, color: c }))}
                  style={{
                    width: 32, height: 32, borderRadius: 8, background: c, cursor: "pointer",
                    border: hallForm.color === c ? "3px solid var(--white)" : "3px solid transparent",
                    boxShadow: hallForm.color === c ? "0 0 0 2px var(--gold)" : "none",
                    transition: "all 0.15s",
                  }} />
              ))}
            </div>
          </div>

          <div style={{ background: "var(--navy-light)", padding: 14, borderRadius: 8, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>PREVIEW</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "var(--slate)" }}>Hall Name</span>
              <span style={{ fontWeight: 600, color: "var(--cream)" }}>{hallForm.name || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--slate)" }}>Capacity</span>
              <span style={{ fontWeight: 600 }}>{hallForm.capacity || 0} guests</span>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: MOBILE & WHATSAPP
// ═══════════════════════════════════════════════
function MobileModule({ bookings, visibleHalls, halls }) {
  const upcoming = bookings.filter((b) => b.status !== "cancelled" && new Date(b.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  const pendingPayments = bookings.filter((b) => b.status !== "cancelled" && b.paidAmount < b.totalAmount - b.discount).slice(0, 5);

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={MessageSquare} value={upcoming.length} label="Pending Confirmations" />
        <StatCard icon={Bell} iconBg="var(--yellow-bg)" value={pendingPayments.length} label="Payment Reminders" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>📱 WhatsApp Booking Confirmation</h3></div>
          <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>Preview of automated messages sent to customers</p>
          {upcoming.slice(0, 2).map((b) => (
            <div key={b.id} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 6 }}>To: {b.customerName} ({b.customerPhone})</div>
              <div className="whatsapp-msg" style={{ marginLeft: 10 }}>
                ✅ <strong>Booking Confirmed</strong><br /><br />
                Dear {b.customerName},<br />
                Your booking at Jalal Khan is confirmed!<br /><br />
                📅 Date: {fmtDate(b.date)}<br />
                🏛️ Hall: {halls.find((h) => h.id === b.hallId)?.name}<br />
                ⏰ Slot: {SLOTS.find((s) => s.id === b.slotId)?.time}<br />
                🎉 Event: {b.eventType}<br />
                👥 Guests: {b.guests}<br /><br />
                Total: {fmt(b.totalAmount)}<br />
                Paid: {fmt(b.paidAmount)}<br />
                Balance: {fmt(Math.max(0, b.totalAmount - b.paidAmount - b.discount))}<br /><br />
                Thank you for choosing Jalal Khan! ✨
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><h3>🔔 Payment Reminder Messages</h3></div>
          <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>Automated reminders for outstanding payments</p>
          {pendingPayments.slice(0, 2).map((b) => {
            const due = Math.max(0, b.totalAmount - b.paidAmount - b.discount);
            return (
              <div key={b.id} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 6 }}>To: {b.customerName} ({b.customerPhone})</div>
                <div className="whatsapp-msg" style={{ marginLeft: 10 }}>
                  ⏳ <strong>Payment Reminder</strong><br /><br />
                  Dear {b.customerName},<br />
                  This is a friendly reminder about your pending payment for your upcoming event.<br /><br />
                  📅 Event Date: {fmtDate(b.date)}<br />
                  💰 Outstanding Balance: {fmt(due)}<br /><br />
                  Please clear the balance before the event date.<br />
                  Payment methods: Cash, Bank Transfer, Easypaisa, JazzCash<br /><br />
                  Thank you! 🙏
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 20 }}>
            <div className="card-header"><h3>Notification Settings</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Booking Confirmation", desc: "Send WhatsApp when booking is confirmed", on: true },
                { label: "Payment Reminder", desc: "Send reminder 3 days before event", on: true },
                { label: "Event Day Reminder", desc: "Send reminder on event day morning", on: true },
                { label: "Payment Receipt", desc: "Send receipt after payment", on: false },
                { label: "Feedback Request", desc: "Send feedback form after event", on: false },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                  <div><div style={{ fontSize: 13, fontWeight: 500 }}>{n.label}</div><div style={{ fontSize: 11, color: "var(--slate)" }}>{n.desc}</div></div>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: n.on ? "var(--green)" : "var(--navy-lighter)", cursor: "pointer", position: "relative" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, background: "white", position: "absolute", top: 2, left: n.on ? 20 : 2, transition: "left .2s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════
// MODULE: ADMIN & SECURITY
// ═══════════════════════════════════════════════
function AdminModule({ auditLog, user, setUser, users, setUsers, notify, addAudit, halls, permissions, setPermissions, downloadBackup, restoreBackup, factoryReset, bookings, dailyExpenses, monthlyExpenses, suppliers, storageMode, apiBase, authToken, setAuthToken }) {
  const isOwner = user?.role === "owner";
  const isCloud = storageMode === "cloud";
  const [tab, setTab] = useState(isOwner ? "data" : "roles");
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", username: "", email: "", password: "", role: "", hallId: null, active: true });
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", username: "", email: "", password: "", role: "manager", hallId: "" });
  const [profileModal, setProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", username: "", email: "", currentPassword: "", newPassword: "" });
  const restoreInputRef = useRef(null);

  // Cloud helpers
  const cloudFetch = async (path, opts = {}) => {
    const r = await fetch(apiBase + path, {
      ...opts,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + authToken, ...(opts.headers || {}) },
    });
    const json = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(json.error || ("HTTP " + r.status));
    return json;
  };

  const reloadUsers = async () => {
    if (!isCloud) return;
    try {
      const list = await cloudFetch("/users");
      setUsers(list.map((u) => ({ ...u, id: u._id || u.id })));
    } catch (e) { /* ignore */ }
  };

  // Last saved metadata
  const [lastSavedMeta, setLastSavedMeta] = useState(null);
  useEffect(() => {
    try {
      const m = localStorage.getItem("jalal_khan_whms_meta_v2");
      if (m) setLastSavedMeta(JSON.parse(m));
    } catch (e) {}
  }, [bookings, dailyExpenses, monthlyExpenses]);

  const openEdit = (u) => {
    setEditForm({ name: u.name || "", username: u.username || "", email: u.email || "", password: "", role: u.role || "manager", hallId: u.hallId || "", active: u.active !== false });
    setEditModal(u);
  };

  const saveEdit = async () => {
    if (!editForm.name || !editForm.username) { notify("Name and username required", "error"); return; }
    if (isCloud && !editForm.email) { notify("Email required in cloud mode", "error"); return; }

    if (isCloud) {
      try {
        const payload = {
          name: editForm.name,
          username: editForm.username,
          email: editForm.email,
          role: editForm.role,
          hallId: editForm.hallId || null,
          active: editForm.active,
        };
        if (editForm.password) payload.password = editForm.password;
        const updated = await cloudFetch("/users/" + editModal.id, { method: "PUT", body: JSON.stringify(payload) });
        addAudit(`Updated user: ${editModal.name} → ${updated.name}`, "Admin");
        notify(`User "${updated.name}" updated`);
        setEditModal(null);
        await reloadUsers();
      } catch (e) { notify("Update failed: " + e.message, "error"); }
      return;
    }

    // Local mode
    if (!editForm.password) { notify("Password required in local mode", "error"); return; }
    const duplicate = users.find((u) => u.id !== editModal.id && u.username === editForm.username);
    if (duplicate) { notify("Username already taken!", "error"); return; }
    setUsers((prev) => prev.map((u) => u.id === editModal.id ? { ...u, ...editForm } : u));
    if (editModal.id === user.id) setUser((prev) => ({ ...prev, ...editForm }));
    addAudit(`Updated user: ${editModal.name} → ${editForm.name}`, "Admin");
    notify(`User "${editForm.name}" updated`);
    setEditModal(null);
  };

  const openAdd = () => {
    setAddForm({ name: "", username: "", email: "", password: "", role: "manager", hallId: "" });
    setAddModal(true);
  };

  const saveAdd = async () => {
    if (!addForm.name || !addForm.username || !addForm.password) { notify("All fields required", "error"); return; }
    if (isCloud && !addForm.email) { notify("Email required", "error"); return; }
    if (addForm.password.length < 6) { notify("Password must be at least 6 characters", "error"); return; }

    if (isCloud) {
      try {
        const created = await cloudFetch("/users", { method: "POST", body: JSON.stringify({ ...addForm, hallId: addForm.hallId || null }) });
        addAudit(`Created user: ${created.name} (${created.role})`, "Admin");
        notify(`User "${created.name}" created`);
        setAddModal(false);
        await reloadUsers();
      } catch (e) { notify("Create failed: " + e.message, "error"); }
      return;
    }

    // Local mode
    if (users.find((u) => u.username === addForm.username)) { notify("Username already taken", "error"); return; }
    const newUser = { id: genId(), ...addForm, hallId: addForm.hallId || null };
    setUsers((prev) => [...prev, newUser]);
    addAudit(`Created user: ${newUser.name}`, "Admin");
    notify(`User "${newUser.name}" created`);
    setAddModal(false);
  };

  const deleteUser = async (u) => {
    if (u.id === user.id) { notify("You can't delete your own account", "error"); return; }
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;

    if (isCloud) {
      try {
        await cloudFetch("/users/" + u.id, { method: "DELETE" });
        addAudit(`Deleted user: ${u.name}`, "Admin");
        notify(`User "${u.name}" deleted`);
        await reloadUsers();
      } catch (e) { notify("Delete failed: " + e.message, "error"); }
      return;
    }
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    addAudit(`Deleted user: ${u.name}`, "Admin");
    notify(`User "${u.name}" deleted`);
  };

  const resetUserPassword = async (u) => {
    const newPass = prompt(`Reset password for "${u.name}".\nEnter new password (min 6 chars):`);
    if (!newPass) return;
    if (newPass.length < 6) { notify("Password must be at least 6 characters", "error"); return; }

    if (isCloud) {
      try {
        await cloudFetch("/users/" + u.id + "/reset-password", { method: "POST", body: JSON.stringify({ newPassword: newPass }) });
        addAudit(`Reset password for ${u.name}`, "Admin");
        notify(`Password reset for "${u.name}"`);
      } catch (e) { notify("Reset failed: " + e.message, "error"); }
      return;
    }
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, password: newPass } : x));
    addAudit(`Reset password for ${u.name}`, "Admin");
    notify(`Password reset for "${u.name}"`);
  };

  const toggleActive = async (u) => {
    if (u.id === user.id) { notify("You can't disable your own account", "error"); return; }
    const next = u.active === false;
    if (isCloud) {
      try {
        await cloudFetch("/users/" + u.id, { method: "PUT", body: JSON.stringify({ active: next }) });
        addAudit(`${next ? "Enabled" : "Disabled"} user: ${u.name}`, "Admin");
        notify(`${u.name} ${next ? "enabled" : "disabled"}`);
        await reloadUsers();
      } catch (e) { notify("Failed: " + e.message, "error"); }
      return;
    }
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, active: next } : x));
    addAudit(`${next ? "Enabled" : "Disabled"} user: ${u.name}`, "Admin");
  };

  // Owner edits their own profile (cloud mode)
  const openProfile = () => {
    setProfileForm({ name: user.name || "", username: user.username || "", email: user.email || "", currentPassword: "", newPassword: "" });
    setProfileModal(true);
  };

  const saveProfile = async () => {
    if (!profileForm.currentPassword) { notify("Enter your current password to confirm changes", "error"); return; }
    if (!isCloud) { notify("Profile editing requires cloud mode", "error"); return; }
    try {
      const payload = { currentPassword: profileForm.currentPassword };
      if (profileForm.name && profileForm.name !== user.name) payload.name = profileForm.name;
      if (profileForm.username && profileForm.username !== user.username) payload.username = profileForm.username;
      if (profileForm.email && profileForm.email !== user.email) payload.email = profileForm.email;
      if (profileForm.newPassword) {
        if (profileForm.newPassword.length < 6) { notify("New password must be at least 6 chars", "error"); return; }
        payload.newPassword = profileForm.newPassword;
      }
      const r = await fetch(apiBase + "/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + authToken },
        body: JSON.stringify(payload),
      });
      const json = await r.json();
      if (!r.ok) { notify(json.error || "Update failed", "error"); return; }
      // Update token if returned (email/username change)
      if (json.token) {
        try { localStorage.setItem("jh_token", json.token); } catch (e) {}
        setAuthToken(json.token);
      }
      setUser({ ...json.user, id: json.user._id || json.user.id });
      addAudit(`Updated own profile`, "Admin");
      notify("Profile updated successfully");
      setProfileModal(false);
    } catch (e) { notify("Failed: " + e.message, "error"); }
  };

  const cyclePermission = (role, mod) => {
    if (!isOwner) return;
    if (role === "owner") { notify("⚠️ Owner permissions cannot be changed", "error"); return; }
    const current = permissions[role][mod];
    const next = current === "full" ? "view" : current === "view" ? "none" : "full";
    setPermissions((prev) => ({ ...prev, [role]: { ...prev[role], [mod]: next } }));
    addAudit(`Changed ${role} permission for ${mod}: ${current} → ${next}`, "Admin");
    notify(`${role.charAt(0).toUpperCase() + role.slice(1)} — ${mod}: ${next === "none" ? "No Access" : next === "view" ? "View Only" : "Full Access"}`);
  };

  const setPermission = (role, mod, level) => {
    if (!isOwner) return;
    if (role === "owner") { notify("⚠️ Owner permissions cannot be changed", "error"); return; }
    setPermissions((prev) => ({ ...prev, [role]: { ...prev[role], [mod]: level } }));
    addAudit(`Set ${role} permission for ${mod}: ${level}`, "Admin");
    notify(`${role} — ${mod}: ${level === "none" ? "No Access" : level === "view" ? "View Only" : "Full Access"}`);
  };

  const resetPermissions = () => {
    setPermissions(PERMISSIONS);
    addAudit("Reset all permissions to defaults", "Admin");
    notify("Permissions reset to defaults");
  };

  // Module display names
  const moduleLabels = {
    booking: "Bookings", calendar: "Calendar", billing: "Billing & Finance", catering: "Catering & Menu",
    staff: "Staff/Vendors/Suppliers", inventory: "Inventory", reports: "Reports", multiHall: "Multi-Hall",
    mobile: "WhatsApp/Mobile", admin: "Admin & Security", settings: "Settings",
    dailyExpenses: "Daily Expenses", monthlyExpenses: "Monthly Expenses", netProfit: "Net Profit/Loss",
    crm: "CRM (Customers)",
  };

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={Shield} value={users.length} label="System Users" />
        <StatCard icon={Activity} value={auditLog.length} label="Audit Log Entries" />
        <StatCard icon={Lock} value="256-bit" label="Encryption" />
      </div>

      <div className="tabs">
        {isOwner && <button className={`tab-btn ${tab === "data" ? "active" : ""}`} onClick={() => setTab("data")}>💾 Data Backup</button>}
        <button className={`tab-btn ${tab === "roles" ? "active" : ""}`} onClick={() => setTab("roles")}>Roles & Permissions</button>
        <button className={`tab-btn ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>Users</button>
        <button className={`tab-btn ${tab === "audit" ? "active" : ""}`} onClick={() => setTab("audit")}>Audit Log</button>
      </div>

      {tab === "data" && isOwner && (
        <>
          {/* Storage mode indicator */}
          <div style={{ background: storageMode === "cloud" ? "rgba(52,211,153,0.08)" : "rgba(91,141,239,0.08)", border: `1px solid ${storageMode === "cloud" ? "rgba(52,211,153,0.3)" : "rgba(91,141,239,0.3)"}`, borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>{storageMode === "cloud" ? "🖥️" : "💾"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: storageMode === "cloud" ? "var(--green)" : "#5b8def" }}>
                {storageMode === "cloud" ? "🌐 Cloud Mode (Online + Multi-Device)" : "💾 Standalone Mode (Browser Storage)"}
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                {storageMode === "cloud"
                  ? `Data is stored in a secure online database. All devices logged in see the same data — updates appear within 5 seconds.`
                  : "Data is stored in this browser only. No server is running. Data won't sync to other devices."}
              </div>
            </div>
          </div>

          {/* Important info banner */}
          <div style={{ background: "linear-gradient(135deg, rgba(148, 163, 184, 0.28), rgba(15, 23, 42, 0.04))", border: "1px solid rgba(148, 163, 184, 0.55)", borderRadius: 10, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
              📦 How Your Data is Stored
            </div>
            <div style={{ fontSize: 13, color: "var(--cream)", lineHeight: 1.6 }}>
              {storageMode === "cloud" ? (
                <>
                  All data is saved to a file on your server: <code style={{ color: "var(--gold)", fontSize: 12 }}>data/database.json</code>.
                  When you receive an updated software version, just <strong>replace the code files</strong> — the <code style={{ color: "var(--gold)", fontSize: 12 }}>data/</code> folder is never touched.
                  <br /><br />
                  <strong style={{ color: "var(--gold)" }}>Daily auto-backups</strong> are saved to <code style={{ color: "var(--gold)", fontSize: 12 }}>data/backups/</code> (last 30 days).
                </>
              ) : (
                <>
                  All your data (bookings, expenses, suppliers, customers) is saved <strong>automatically in your browser</strong> on this computer.
                  When you receive an updated software file, just <strong>open the new file</strong> — your data stays safe because it lives in the browser, not in the file.
                </>
              )}
              <br /><br />
              <strong style={{ color: "var(--gold)" }}>⚠️ Always download a backup before:</strong>
              <ul style={{ margin: "6px 0 0 20px", padding: 0 }}>
                <li>Updating the software file</li>
                <li>Switching to a different computer or browser</li>
                <li>Clearing your browser data/cache</li>
              </ul>
            </div>
          </div>

          {/* Current data summary */}
          <div className="stats-grid" style={{ marginBottom: 16 }}>
            <StatCard icon={Calendar} value={bookings.length} label="Total Bookings" />
            <StatCard icon={FileText} value={dailyExpenses.length} label="Daily Expense Entries" />
            <StatCard icon={CreditCard} value={monthlyExpenses.length} label="Monthly Expense Entries" />
            <StatCard icon={Truck} value={suppliers.length} label="Suppliers" />
          </div>

          {/* Backup actions */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3>📥 Download Backup</h3></div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14 }}>
                Save all your data to a file on your computer. Keep this file safe — you can use it to restore your data later if needed.
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn-gold" onClick={downloadBackup}>
                  <Download size={16} /> Download Backup File
                </button>
                {lastSavedMeta && (
                  <span style={{ fontSize: 12, color: "var(--slate)" }}>
                    💾 Last auto-saved: {new Date(lastSavedMeta.lastSaved).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3>📤 Restore from Backup</h3></div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14 }}>
                Load data from a previous backup file. This <strong style={{ color: "var(--yellow)" }}>replaces all current data</strong> — make sure to download a backup of current data first if needed.
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  ref={restoreInputRef}
                  type="file"
                  accept=".json,application/json"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      restoreBackup(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                />
                <button className="btn btn-outline" onClick={() => restoreInputRef.current?.click()}>
                  <Upload size={16} /> Choose Backup File...
                </button>
                <span style={{ fontSize: 12, color: "var(--slate)" }}>
                  Select a file like: <code style={{ color: "var(--gold)", fontSize: 11 }}>jalal-khan-backup-YYYY-MM-DD.json</code>
                </span>
              </div>
            </div>
          </div>

          {/* Update workflow guide */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3>🔄 How to Update the Software Safely</h3></div>
            <div style={{ padding: 18 }}>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "var(--cream)", lineHeight: 1.9 }}>
                <li><strong>Download Backup</strong> using the button above (saves a <code style={{ color: "var(--gold)" }}>.json</code> file to your computer)</li>
                <li><strong>Replace the HTML file</strong> with the new version you received</li>
                <li><strong>Open the new HTML file</strong> in Chrome — your data is automatically loaded from the browser</li>
                <li><strong>Verify everything looks right</strong>. If it doesn't, use "Restore from Backup" above to recover</li>
              </ol>
              <div style={{ marginTop: 14, padding: 12, background: "var(--green-bg)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 8, fontSize: 12, color: "var(--green)" }}>
                ✅ <strong>Important:</strong> As long as you open the new HTML file <em>in the same browser on the same computer</em>, your data will load automatically. The file change does NOT affect the data.
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="card" style={{ border: "1px solid rgba(248,113,113,0.3)" }}>
            <div className="card-header" style={{ borderBottom: "1px solid rgba(248,113,113,0.2)" }}>
              <h3 style={{ color: "var(--red)" }}>⚠️ Danger Zone</h3>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                Reset everything to factory defaults. This deletes ALL your data: bookings, expenses, suppliers, and customizations. This cannot be undone.
              </div>
              <button className="btn" style={{ background: "var(--red-bg)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--red)" }} onClick={factoryReset}>
                <Trash2 size={14} /> Factory Reset (Delete All Data)
              </button>
            </div>
          </div>
        </>
      )}

      {tab === "roles" && (
        <div className="card">
          <div className="card-header">
            <h3>Role-Based Access Control (RBAC)</h3>
            {isOwner ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--gold)" }}>💡 Click any cell to cycle permissions</span>
                <button className="btn btn-sm btn-outline" onClick={resetPermissions}>↻ Reset to Defaults</button>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: "var(--slate)" }}>View only — owner can edit</span>
            )}
          </div>

          {/* Legend */}
          {isOwner && (
            <div style={{ padding: "12px 16px", display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, borderBottom: "1px solid rgba(148, 163, 184, 0.25)" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Badge type="confirmed">Full Access</Badge><span style={{ color: "var(--slate)" }}>Can view, create, edit, delete</span></div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Badge type="pending">View Only</Badge><span style={{ color: "var(--slate)" }}>Read-only access</span></div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}><Badge type="cancelled">No Access</Badge><span style={{ color: "var(--slate)" }}>Hidden from sidebar</span></div>
            </div>
          )}

          <div className="scroll-table">
            <table className="data-table">
              <thead><tr><th>Module</th><th style={{ textAlign: "center" }}>👑 Owner</th><th style={{ textAlign: "center" }}>👨‍💼 Manager</th><th style={{ textAlign: "center" }}>💰 Cashier</th></tr></thead>
              <tbody>
                {Object.keys(permissions.owner).map((mod) => (
                  <tr key={mod}>
                    <td style={{ fontWeight: 500 }}>{moduleLabels[mod] || mod}</td>
                    {["owner", "manager", "cashier"].map((role) => {
                      const perm = permissions[role][mod];
                      const isLocked = role === "owner";
                      return (
                        <td key={role} style={{ textAlign: "center" }}>
                          {isOwner && !isLocked ? (
                            <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                              <button onClick={() => setPermission(role, mod, "full")}
                                title="Full Access"
                                style={{ padding: "3px 8px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "inherit",
                                  background: perm === "full" ? "var(--green-bg)" : "var(--navy-light)",
                                  color: perm === "full" ? "var(--green)" : "var(--slate)",
                                  border: perm === "full" ? "1px solid rgba(52,211,153,0.4)" : "1px solid transparent",
                                }}>FULL</button>
                              <button onClick={() => setPermission(role, mod, "view")}
                                title="View Only"
                                style={{ padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "inherit",
                                  background: perm === "view" ? "var(--yellow-bg)" : "var(--navy-light)",
                                  color: perm === "view" ? "var(--yellow)" : "var(--slate)",
                                  border: perm === "view" ? "1px solid rgba(251,191,36,0.4)" : "1px solid transparent",
                                }}>VIEW</button>
                              <button onClick={() => setPermission(role, mod, "none")}
                                title="No Access"
                                style={{ padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "inherit",
                                  background: perm === "none" ? "var(--red-bg)" : "var(--navy-light)",
                                  color: perm === "none" ? "var(--red)" : "var(--slate)",
                                  border: perm === "none" ? "1px solid rgba(248,113,113,0.4)" : "1px solid transparent",
                                }}>NONE</button>
                            </div>
                          ) : (
                            <div style={{ opacity: isLocked ? 0.7 : 1 }}>
                              {perm === "full" ? <Badge type="confirmed">Full</Badge> : perm === "view" ? <Badge type="pending">View</Badge> : <Badge type="cancelled">None</Badge>}
                              {isLocked && <span style={{ fontSize: 9, color: "var(--gold)", marginLeft: 4 }}>🔒</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isOwner && (
            <div style={{ padding: 12, fontSize: 11, color: "var(--slate)", background: "rgba(15, 23, 42, 0.04)", borderTop: "1px solid rgba(148, 163, 184, 0.25)" }}>
              ℹ️ Owner permissions are locked to Full Access for all modules. Changes to Manager and Cashier permissions take effect immediately.
            </div>
          )}
        </div>
      )}

      {tab === "users" && (
        <div className="card">
          <div className="card-header">
            <h3>System Users</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {isOwner && isCloud && <button className="btn btn-sm btn-outline" onClick={openProfile}><Edit size={12} /> Edit My Profile</button>}
              {isOwner && <button className="btn btn-sm btn-gold" onClick={openAdd}><Plus size={12} /> Add User</button>}
            </div>
          </div>
          <table className="data-table">
            <thead><tr>
              <th>Name</th>
              <th>Username</th>
              {isCloud && <th>Email</th>}
              <th>Role</th>
              <th>Assigned Hall</th>
              <th>Status</th>
              {isOwner && <th>Actions</th>}
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ opacity: u.active === false ? 0.5 : 1 }}>
                  <td style={{ fontWeight: 500 }}>{u.name}{u.id === user.id && <span style={{ fontSize: 10, color: "var(--gold)", marginLeft: 6 }}>(you)</span>}</td>
                  <td>{u.username}</td>
                  {isCloud && <td style={{ fontSize: 12, color: "var(--slate)" }}>{u.email || "—"}</td>}
                  <td><Badge type={u.role === "owner" ? "confirmed" : u.role === "manager" ? "active" : "pending"}>{u.role === "owner" ? "👑 " : u.role === "manager" ? "👨‍💼 " : "💰 "}{u.role}</Badge></td>
                  <td>{u.hallId ? halls.find((h) => h.id === u.hallId)?.name : <span style={{ color: "var(--slate)" }}>All Halls</span>}</td>
                  <td>{u.active === false ? <Badge type="cancelled">Disabled</Badge> : <Badge type="confirmed">Active</Badge>}</td>
                  {isOwner && (
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <button className="btn-icon" title="Edit" onClick={() => openEdit(u)}><Edit size={13} /></button>
                        <button className="btn-icon" title="Reset password" onClick={() => resetUserPassword(u)}><Lock size={13} /></button>
                        {u.id !== user.id && (
                          <>
                            <button className="btn-icon" title={u.active === false ? "Enable" : "Disable"} onClick={() => toggleActive(u)} style={{ color: u.active === false ? "var(--green)" : "var(--yellow)" }}>
                              {u.active === false ? <Check size={13} /> : <X size={13} />}
                            </button>
                            <button className="btn-icon" title="Delete" onClick={() => deleteUser(u)} style={{ color: "var(--red)" }}><Trash2 size={13} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {isCloud && (
            <div style={{ padding: 12, fontSize: 11, color: "var(--slate)", background: "rgba(91,141,239,0.04)", borderTop: "1px solid rgba(91,141,239,0.1)" }}>
              💡 <strong>Cloud mode:</strong> Users sign in with their email or username + password. Passwords are securely hashed on the server.
            </div>
          )}
        </div>
      )}

      {tab === "audit" && (
        <div className="card">
          <div className="card-header"><h3>Activity Audit Log</h3></div>
          <table className="data-table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Module</th><th>Action</th></tr></thead>
            <tbody>
              {auditLog.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>{new Date(log.timestamp).toLocaleString("en-PK")}</td>
                  <td style={{ fontWeight: 500 }}>{log.user}</td>
                  <td><Badge type="active">{log.module}</Badge></td>
                  <td>{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editModal && (
        <Modal title={`Edit User — ${editModal.name}`} onClose={() => setEditModal(null)} footer={<><button className="btn btn-outline" onClick={() => setEditModal(null)}>Cancel</button><button className="btn btn-gold" onClick={saveEdit}>Save Changes</button></>}>
          <div className="form-group">
            <label>Full Name *</label>
            <input className="form-input" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input className="form-input" value={editForm.username} onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))} />
            </div>
            {isCloud && (
              <div className="form-group">
                <label>Email *</label>
                <input className="form-input" type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select className="form-input" value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value, hallId: e.target.value !== "manager" ? null : f.hallId }))}>
                <option value="owner">👑 Owner</option>
                <option value="manager">👨‍💼 Manager</option>
                <option value="cashier">💰 Cashier</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Hall</label>
              <select className="form-input" value={editForm.hallId || ""} onChange={(e) => setEditForm((f) => ({ ...f, hallId: e.target.value || null }))} disabled={editForm.role !== "manager"}>
                <option value="">All Halls</option>
                {halls.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{isCloud ? "New Password (leave blank to keep current)" : "Password *"}</label>
            <input className="form-input" type="password" value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} placeholder={isCloud ? "Leave blank to not change" : "Enter password"} />
          </div>
          {isCloud && editModal.id !== user.id && (
            <div className="form-group">
              <label>
                <input type="checkbox" checked={editForm.active} onChange={(e) => setEditForm((f) => ({ ...f, active: e.target.checked }))} style={{ marginRight: 8 }} />
                Active (can log in)
              </label>
            </div>
          )}
        </Modal>
      )}

      {addModal && (
        <Modal title="➕ Add New User" onClose={() => setAddModal(false)} footer={<><button className="btn btn-outline" onClick={() => setAddModal(false)}>Cancel</button><button className="btn btn-gold" onClick={saveAdd}>Create User</button></>}>
          <div style={{ background: "rgba(148, 163, 184, 0.20)", padding: 10, borderRadius: 6, marginBottom: 16, fontSize: 12, color: "var(--gold)" }}>
            💡 The new user will be able to log in immediately with the credentials you set below.
          </div>
          <div className="form-group">
            <label>Full Name *</label>
            <input className="form-input" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Bilal Shah" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input className="form-input" value={addForm.username} onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))} placeholder="e.g. bilal" />
            </div>
            {isCloud && (
              <div className="form-group">
                <label>Email *</label>
                <input className="form-input" type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} placeholder="bilal@example.com" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Password * (min 6 chars)</label>
            <input className="form-input" type="text" value={addForm.password} onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))} placeholder="Set initial password" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select className="form-input" value={addForm.role} onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value, hallId: e.target.value === "manager" ? f.hallId : "" }))}>
                <option value="manager">👨‍💼 Manager</option>
                <option value="cashier">💰 Cashier</option>
                <option value="owner">👑 Owner</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Hall</label>
              <select className="form-input" value={addForm.hallId} onChange={(e) => setAddForm((f) => ({ ...f, hallId: e.target.value }))} disabled={addForm.role !== "manager"}>
                <option value="">All Halls</option>
                {halls.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {profileModal && (
        <Modal title="👤 Edit My Profile" onClose={() => setProfileModal(false)} footer={<><button className="btn btn-outline" onClick={() => setProfileModal(false)}>Cancel</button><button className="btn btn-gold" onClick={saveProfile}>Save Changes</button></>}>
          <div style={{ background: "rgba(148, 163, 184, 0.20)", padding: 10, borderRadius: 6, marginBottom: 16, fontSize: 12, color: "var(--gold)" }}>
            🔒 Enter your <strong>current password</strong> at the bottom to confirm changes.
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input className="form-input" value={profileForm.username} onChange={(e) => setProfileForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" value={profileForm.email} onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input className="form-input" type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm((f) => ({ ...f, newPassword: e.target.value }))} placeholder="Leave blank to not change" />
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(15, 23, 42, 0.06)" }}>
            <div className="form-group">
              <label style={{ color: "var(--gold)" }}>Current Password * (required)</label>
              <input className="form-input" type="password" value={profileForm.currentPassword} onChange={(e) => setProfileForm((f) => ({ ...f, currentPassword: e.target.value }))} placeholder="Enter your current password" />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
