# 🔥 AgniNet — Community-Powered Fire Response

> **Team Zenith (S07)**  
> Khushi Makhija (26BCE11380), Antara Gupta (26BHI10093), Priyanka Mhaske (26BCE10372), Sneha Kesarwani (26MEI10001)

AgniNet is an **offline-first fire-reporting and response platform** designed to connect rural communities directly with district fire and disaster authorities. It pairs real-time **ground-truth citizen reports** with **NASA FIRMS satellite thermal hotspot detection** to detect fires earlier, eliminate duplicates, and accelerate emergency response.

---

## 🌟 Key Features

1. **Figma Pixel-Perfect Interface:**
   - Welcome / Role Selection screen (`Local / Citizen` vs `Official / Authority`)
   - Create Account / Register screen with role toggle and device persistence
   - Multi-Language Selection (English, हिन्दी / Hindi, मराठी / Marathi, தமிழ் / Tamil)
   - Citizen Home with connection status, "Report a Fire" hero card, safety tips, and "My Reports" feed
   - Citizen Reporting form with photo upload & preview, GPS detection, map-pin picker, and note
   - Offline Confirmation (`Saved on your device`) & Online Confirmation (`Your report is on its way`)
   - Official Dashboard with 4 real-time KPI metrics (26 reports, 3 incidents, 2 awaiting, 1 responding), live alert banner, and priority incident queue
   - Incident Details Screen with "Priority 01 Highest report count", grouped reports, interactive mini-map, and status progression (`New` → `Responding` → `Resolved`)
   - Previous History Archive with period statistics, search by landmark/ID, status & date filters, and pagination

2. **NASA FIRMS Satellite Integration:**
   - Ingests thermal anomaly and active fire detections from VIIRS / MODIS satellites.
   - Extracts latitude, longitude, brightness temperature, fire radiative power (FRP in MW), and confidence.
   - Dual-marker Leaflet map displaying satellite hotspots in red flame badges and citizen ground reports in terracotta pulsing markers.
   - Built-in fallback cache for reliable offline hackathon presentations.

3. **Offline-First Resilience:**
   - Works seamlessly when internet connectivity drops to zero.
   - Saves citizen reports locally into **IndexedDB** and `localStorage`.
   - Automatically synchronizes queued reports to district authorities as soon as cellular or Wi-Fi reconnects.
   - Includes a built-in "Connected / Offline" simulator button in the top bar to test live sync on demand.

4. **SMS Fallback Gateway Simulation:**
   - For remote rural areas or basic 2G keypad phones (e.g., Nokia feature phones).
   - Simulates sending a short SMS to district emergency code `1077`.
   - Ingests, clusters, and returns an automated confirmation SMS.

---

## 🚀 Quick Start (Running the Website)

### One-Click Launch (Windows)
Double-click [`run.bat`](file:///C:/Users/Localadmin/.gemini/antigravity/scratch/agninet/run.bat) in the project directory. It starts both the backend API and frontend Vite dev server automatically.

### Manual Terminal Launch

**1. Start the Backend API (Port 5000):**
```bash
cd C:\Users\Localadmin\.gemini\antigravity\scratch\agninet
node server/server.js
```

**2. Start the Frontend Dev Server (Port 5173):**
```bash
cd C:\Users\Localadmin\.gemini\antigravity\scratch\agninet
npx vite --port 5173
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 📁 Project Structure

```
agninet/
├── public/
│   ├── assets/
│   │   ├── agninet-logo.jpg      # Authentic AgniNet Logo from Figma
│   │   ├── fire-sample-1.jpg     # Sample citizen photo evidence
│   │   └── fire-sample-2.jpg
│   └── uploads/                  # User-uploaded fire photos
├── server/
│   ├── db.js                     # SQLite database schema & Figma baseline seeds
│   ├── firmsService.js           # NASA FIRMS satellite API integration + caching
│   ├── server.js                 # Express REST API (incidents, reports, sync, SMS)
│   └── agninet.sqlite            # Local SQLite database file
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation, status indicator & role toggle
│   │   ├── Sidebar.jsx           # Official dashboard dark sidebar
│   │   ├── LeafletMap.jsx        # OpenStreetMap & Leaflet dual-layer fire map
│   │   ├── LanguageModal.jsx     # English, Hindi, Marathi, Tamil selector
│   │   └── SMSFallbackModal.jsx  # 2G / Keypad phone SMS emergency reporting
│   ├── pages/
│   │   ├── WelcomeScreen.jsx     # Initial role selection
│   │   ├── RegisterScreen.jsx    # Account registration
│   │   ├── CitizenHome.jsx       # Citizen home screen with reports list
│   │   ├── ReportFire.jsx        # Multi-step fire reporting form
│   │   ├── OfflineConfirmation.jsx # Saved on device screen
│   │   ├── OnlineConfirmation.jsx  # Submitted screen with celebratory confetti
│   │   ├── OfficialDashboard.jsx # Authority live fire watch overview
│   │   ├── IncidentDetail.jsx    # Drill-down into specific incident (AGN-101)
│   │   ├── PreviousHistory.jsx   # Archive with search & filters
│   │   └── InteractiveMapView.jsx# Dedicated full satellite & citizen map
│   ├── services/
│   │   ├── api.js                # Backend API client
│   │   ├── offlineStorage.js     # IndexedDB & localStorage sync engine
│   │   └── translations.js       # Complete 4-language dictionary
│   ├── App.jsx                   # Central state & routing
│   ├── main.jsx                  # React DOM mount point
│   └── index.css                 # Global Tailwind v4 styles & Leaflet pulse pins
├── .env                          # Server environment settings & NASA API key
├── package.json                  # Dependencies & scripts
├── run.bat                       # Single-click launcher
└── vite.config.js                # Vite build & proxy config
```

---

## 🧪 Step-by-Step Testing Guide for Hackathon Judges

### 1. Test Citizen Reporting (Online Mode)
1. Navigate to **[http://localhost:5173](http://localhost:5173)**.
2. Select **"Local / Citizen"** → Click **"Create account"**.
3. On the Citizen Home screen, click the big terracotta card **"Report a Fire"**.
4. Upload an image or use the camera, verify auto-detected location, add an optional note, and click **"Submit report"**.
5. Observe the **"Your report is on its way"** green confirmation screen with Report ID (e.g. `AGN-028`).
6. Click **"Back to home"** to see your report listed under **"MY REPORTS"**.

### 2. Test Offline-First Reporting & Automatic Sync
1. On the top navigation bar, click the **"● Connected"** pill to toggle it into **"● Offline"** mode (simulates signal loss in remote rural areas).
2. Click **"Report a Fire"**, enter a location, and submit.
3. Observe the screen displays the beige **"Saved on your device."** confirmation screen (`Waiting for internet`).
4. Click **"Back to home"** — your report shows `Waiting for internet`.
5. Now click the **"● Offline"** pill to simulate network reconnection.
6. Notice the green toast banner: **"📶 Reconnected! Automatically synced pending fire reports to district officials."**

### 3. Test Official Authority Dashboard
1. Click **"Official View"** in the top navigation bar (or sign in as Official).
2. Review the 4 KPI cards matching the Figma numbers:
   - **Citizen reports:** 26
   - **Reported incidents:** 3
   - **Awaiting response:** 2
   - **Response underway:** 1
3. Click on row `01 Rampur market (AGN-101)` to open the **Incident Details** view.
4. Review the grouped reports feed (`AGN-028`, `AGN-027`, `AGN-025`) and click **"View photo"** to inspect evidence.
5. In the **Response status** card, click **"Mark as Responding →"**. Notice the status updates to `Responding` in real-time. Then click **"Mark as Resolved"** to archive it into Previous History!

### 4. Test Satellite & Citizen Dual Map
1. In the Official sidebar, click **"Live Satellite & Citizen Map"**.
2. Inspect the interactive Leaflet map:
   - Red flame markers represent **NASA FIRMS satellite thermal hotspots**.
   - Terracotta circular badges show **citizen-reported fires with report counts**.
3. Toggle individual layers on and off using the map legend.
4. Click **"Locate my position (GPS)"** to test browser geolocation.

### 5. Test SMS Fallback Gateway
1. Click **"SMS Fallback (Basic phone / 2G)"** in the citizen home or official sidebar.
2. Type a simulated message: `FIRE Rampur near water tank smoke rising`.
3. Click **"Send Emergency SMS to 1077"**.
4. Watch the simulated SMS gateway acknowledge receipt, create a priority incident report, and reply with an emergency guidance SMS.
