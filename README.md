# 🌾 KrishiMitra – Smart Agriculture & Farmer Support Portal (कृषि मित्र)

> **Domain:** Agriculture Technology & AI Agronomy  
> **Project Type:** Smart Crop Advisory, Leaf Disease Detection & Farmer Support System  
> **Demo Platform:** AI Studio Full-Stack Web Application  

KrishiMitra is a comprehensive, production-grade agricultural portal built to empower Indian farmers with intelligent crop recommendations, rapid plant leaf disease diagnosis, real-time APMC mandi market price discovery, agro-meteorological weather forecasts, fertilizer dosage calculators, and direct government scheme linkages.

---

## 🌟 Key Modules & Functional Capabilities

### 1. 🏠 Agricultural Landing Page & Live Ticker
- Hero section with real-world farming context and verified ICAR agronomy badges.
- Real-time **APMC Mandi Price Ticker** streaming live prices of staple crops (Wheat, Basmati Rice, Cotton, Mustard, Soybean, Maize).
- Key impact statistics: 1,420+ farmers, 18,500+ acres guided, 96.8% diagnostic accuracy, ₹4.2 Cr in schemes linked.
- Farmer testimonials from Punjab, Madhya Pradesh, and Maharashtra.

### 2. 🔐 Farmer Authentication & Profile Management
- Secure user registration and login with roles (`farmer`, `admin`, `expert`).
- Farmer profiling: Land size in acres, soil classification (Alluvial, Black Cotton, Red Loam, etc.), irrigation source, and primary crop cycle.
- **1-Click Quick Demo Evaluation**:
  - **Ramesh Kumar Patel** (Progressive Farmer from Punjab)
  - **Dr. Priya Sharma** (Director of Agri-Extension / Admin)
  - **Dr. Anand Deshmukh** (Senior Plant Pathologist / Expert)

### 3. 📊 Smart Farmer Dashboard
- Current agro-meteorological weather and active warnings.
- **Soil Health Card Summary**: Nitrogen (N), Phosphorus (P), Potassium (K), and pH gauges with status assessments.
- Live Mandi Price Watchlist with market trends (Bullish / Bearish / Stable).
- Quick diagnostic shortcuts and personalized seasonal advisories.

### 4. 🧠 AI Crop Recommendation Module
- Allows input of **7 key agronomic parameters**:
  - Nitrogen ($N$ in kg/ha)
  - Phosphorus ($P$ in kg/ha)
  - Potassium ($K$ in kg/ha)
  - Soil pH ($4.5 - 9.0$)
  - Ambient Temperature (°C)
  - Relative Humidity (%)
  - Seasonal Rainfall (mm)
- **1-Click Demo Scenarios**:
  - Punjab Rabi Wheat
  - Bengal Kharif Rice
  - Gujarat Black Soil Cotton
  - Rajasthan Low-Rainfall Mustard
- Dual evaluation pipeline:
  - **ICAR-aligned agronomic decision matrix**
  - **Gemini 3.8 Flash AI reasoning** for in-depth agronomic explanations, expected yield estimates, and rotation candidates.
- Automatically stores past queries in the SQLite database.

### 5. 🔬 Plant Disease Diagnosis & Treatment
- **Leaf Image Upload**: Drag-and-drop, camera snapshot, or click to test from **6 curated specimen cards**:
  - Tomato Early Blight (*Alternaria solani*)
  - Rice Blast (*Magnaporthe oryzae*)
  - Wheat Stripe Rust (*Puccinia striiformis*)
  - Potato Late Blight (*Phytophthora infestans*)
  - Cotton Bacterial Blight (*Xanthomonas axonopodis*)
  - Maize Fall Armyworm (*Spodoptera frugiperda*)
- Diagnostic Report details:
  - Scientific Name & Hindi Translation
  - Pathogen Type (Fungal, Bacterial, Viral, Pest)
  - Severity Rating Badge (Low, Moderate, High, Critical)
  - Observed Foliage Symptoms
  - **Organic & Biological Remedies** (Neem seed kernel extract, Trichoderma viride, buttermilk spray)
  - **Chemical Treatments with Exact Dosages** (e.g., Mancozeb 75% WP @ 2.5g/L, Azoxystrobin, Propiconazole)
  - Long-term field sanitation and crop rotation guidelines.
- Searchable **Plant Disease Catalog** to browse common diseases without uploading.

### 6. 🌦️ Agro-Meteorological Weather & Spray Advisor
- Multi-region weather switcher across major agricultural belts (Punjab, Haryana, Maharashtra, Rajasthan, Karnataka, UP, MP).
- Current conditions: Air temperature, humidity, rainfall probability, wind velocity, soil temperature at 5cm depth, and UV index.
- **7-Day Predictive Weather Outlook** with daily operational advice (safe spray windows, drainage precautions, grain drying conditions).

### 7. 📈 APMC Mandi Price Intelligence
- Live market price tracker for Wheat, Rice, Cotton, Mustard, Soybean, Maize, Chana, Onion, Tomato, Potato.
- Displays Minimum, Maximum, and Modal (trading) prices in ₹/Quintal along with daily arrival volume in tonnes.
- Interactive **6-Month Price Trend Comparison Chart** built with Recharts.
- Filter by crop name and state with real-time text search.
- Price record insertion for admin users.

### 8. 🧪 Fertilizer & Irrigation Scheduler
- Calculates exact **50kg bag counts** for **Urea (46% N)**, **DAP (18-46-0)**, and **MOP (Potash 60%)** tailored to crop acreage.
- Detailed split-application schedule:
  - Basal Sowing Dose
  - First Top Dressing (Crown Root Initiation)
  - Second Top Dressing (Booting / Pre-Flowering)
- Water management calculator comparing **Drip (45% water saved)**, **Sprinkler (25% saved)**, and traditional **Flood irrigation**.

### 9. 🏛️ Government Schemes & Subsidies Portal
- Covers flagship Indian welfare initiatives:
  - **PM-KISAN** (₹6,000/yr direct income transfer)
  - **PMFBY** (Pradhan Mantri Fasal Bima Yojana crop insurance)
  - **PM-KUSUM** (Up to 60% solar pump subsidies)
  - **Soil Health Card Scheme** (12-parameter free soil tests)
  - **Kisan Credit Card (KCC)** (Subsidized loan at 4% effective interest)
  - **e-NAM** (National Agriculture Market digital trading)
- Interactive **Farmer Eligibility Checker Modal** based on landholding size and Aadhaar status.
- Official direct application links and document checklists.

### 10. 📞 Expert Consultation & 24x7 Helpline
- Verified agronomist and plant pathologist profiles.
- **Ask an Agri-Expert submission form** with crop type and urgency tagging.
- Automated **AI Scientific Assistant** powered by Gemini 3.8 Flash providing immediate diagnosis while routing the ticket to regional agricultural scientists.
- Community consultation archive with filterable questions.

### 11. 🛡️ Admin Management Dashboard
- High-level platform metrics: Registered farmers, consultations resolved, active schemes, mandi coverage.
- Registered farmer directory with contact details, land size, and soil type.
- Scheme publisher tool to post new state or central agricultural subsidies.
- Consultation ticket responder to reply directly to farmer inquiries.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Motion |
| **Backend** | Node.js, Express 4.x, tsx |
| **Database** | SQLite 3 via `better-sqlite3` (WAL mode, persistent storage) |
| **AI Integration** | `@google/genai` TypeScript SDK (model: `gemini-3.8-flash`) |
| **Build System** | Vite 8 with Express server middleware |

---

## 🗄️ Database Architecture

The SQLite database (`data/krishimitra.db`) is structured with 10 tables:
1. `users` – User accounts, authentication credentials, and contact info.
2. `farmer_profiles` – Landholding acreage, soil types, and farming experience.
3. `crops` – Agronomic parameters, optimal NPK, pH thresholds, and expected yields.
4. `soil_details` – Soil test laboratory recordings.
5. `crop_recommendations` – History of AI recommendations and evaluations.
6. `plant_diseases` – Disease encyclopedia with symptoms, organic and chemical remedies.
7. `weather_records` – Historical and localized weather benchmarks.
8. `market_prices` – Daily APMC mandi price recordings and arrival volumes.
9. `government_schemes` – Subsidies, eligibility criteria, and application links.
10. `expert_consultations` – Farmer questions and expert answers.

---

## 🚀 Local Installation & Execution

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Steps
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd krishimitra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   PORT=3000
   ```

4. Run the Development Server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. Build for Production:
   ```bash
   npm run build
   npm start
   ```

---

## 🇮🇳 Farmer Support Helpline
- **Kisan Call Centre Toll-Free:** `1800-180-1551` (6:00 AM – 10:00 PM, All 22 Regional Languages)
- **Crop Insurance Helpline (PMFBY):** `14447`
