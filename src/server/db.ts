import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path
const dbDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'krishimitra.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'farmer', -- 'farmer' | 'admin' | 'expert'
      name TEXT NOT NULL,
      phone TEXT,
      state TEXT,
      district TEXT,
      village TEXT,
      language TEXT DEFAULT 'en',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS farmer_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      land_size_acres REAL DEFAULT 5,
      soil_type TEXT DEFAULT 'Alluvial Soil',
      irrigation_source TEXT DEFAULT 'Borewell & Canal',
      primary_crops TEXT DEFAULT 'Wheat, Rice, Mustard',
      experience_years INTEGER DEFAULT 12,
      cattle_count INTEGER DEFAULT 4,
      kisan_credit_card INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS crops (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      hindi_name TEXT,
      season TEXT NOT NULL, -- Kharif, Rabi, Zaid
      soil_types TEXT NOT NULL,
      water_requirement TEXT NOT NULL, -- Low, Medium, High
      growth_duration_days INTEGER NOT NULL,
      optimal_n INTEGER NOT NULL,
      optimal_p INTEGER NOT NULL,
      optimal_k INTEGER NOT NULL,
      optimal_ph_min REAL NOT NULL,
      optimal_ph_max REAL NOT NULL,
      expected_yield_quintal REAL NOT NULL,
      market_demand TEXT DEFAULT 'High',
      image_url TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS soil_details (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_date TEXT NOT NULL,
      n REAL NOT NULL,
      p REAL NOT NULL,
      k REAL NOT NULL,
      ph REAL NOT NULL,
      organic_carbon REAL DEFAULT 0.65,
      electrical_conductivity REAL DEFAULT 0.42,
      status TEXT DEFAULT 'Medium Fertility',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS crop_recommendations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      farmer_name TEXT,
      n REAL NOT NULL,
      p REAL NOT NULL,
      k REAL NOT NULL,
      ph REAL NOT NULL,
      temp REAL NOT NULL,
      humidity REAL NOT NULL,
      rainfall REAL NOT NULL,
      recommended_crop TEXT NOT NULL,
      confidence REAL NOT NULL,
      rationale TEXT,
      suitable_alternatives TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS plant_diseases (
      id TEXT PRIMARY KEY,
      crop_name TEXT NOT NULL,
      disease_name TEXT NOT NULL,
      hindi_name TEXT,
      pathogen_type TEXT NOT NULL, -- Fungal, Bacterial, Viral, Pest
      symptoms TEXT NOT NULL,
      organic_treatment TEXT NOT NULL,
      chemical_treatment TEXT NOT NULL,
      prevention_tips TEXT NOT NULL,
      severity_level TEXT DEFAULT 'Moderate',
      sample_image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS weather_records (
      id TEXT PRIMARY KEY,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      temp_c REAL NOT NULL,
      temp_min_c REAL NOT NULL,
      temp_max_c REAL NOT NULL,
      humidity INTEGER NOT NULL,
      rainfall_mm REAL NOT NULL,
      wind_kmh REAL NOT NULL,
      condition TEXT NOT NULL,
      advisory TEXT NOT NULL,
      alert TEXT
    );

    CREATE TABLE IF NOT EXISTS market_prices (
      id TEXT PRIMARY KEY,
      crop_name TEXT NOT NULL,
      market_name TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      min_price REAL NOT NULL,
      max_price REAL NOT NULL,
      modal_price REAL NOT NULL,
      arrival_tonnes REAL NOT NULL,
      price_date TEXT NOT NULL,
      trend TEXT DEFAULT 'up' -- up, down, stable
    );

    CREATE TABLE IF NOT EXISTS government_schemes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      hindi_title TEXT,
      category TEXT NOT NULL, -- Subsidies, Insurance, Credit, Machinery, Solar
      financial_assistance TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      required_documents TEXT NOT NULL,
      official_url TEXT NOT NULL,
      deadline TEXT DEFAULT 'Ongoing',
      badge TEXT DEFAULT 'Central Scheme'
    );

    CREATE TABLE IF NOT EXISTS expert_consultations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      farmer_name TEXT NOT NULL,
      farmer_phone TEXT,
      farmer_state TEXT,
      crop_type TEXT NOT NULL,
      subject TEXT NOT NULL,
      question TEXT NOT NULL,
      image_data TEXT,
      expert_name TEXT,
      answer TEXT,
      status TEXT DEFAULT 'pending', -- pending, answered
      priority TEXT DEFAULT 'normal', -- normal, urgent
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      answered_at DATETIME
    );
  `);

  // Seed default data if tables are empty
  seedDatabase();
}

function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    // 1. Users
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name, phone, state, district, village, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'user_farmer_1',
      'ramesh@krishimitra.org',
      'farmer123',
      'farmer',
      'Ramesh Kumar Patel',
      '+91 98765 43210',
      'Punjab',
      'Ludhiana',
      'Kalanpur',
      'en'
    );

    insertUser.run(
      'user_admin_1',
      'admin@krishimitra.org',
      'admin123',
      'admin',
      'Dr. Priya Sharma (Agri-Director)',
      '+91 94123 78901',
      'Delhi',
      'New Delhi',
      'Pusa Institute',
      'en'
    );

    insertUser.run(
      'user_expert_1',
      'dr.swaminathan@krishimitra.org',
      'expert123',
      'expert',
      'Dr. Anand Deshmukh (Plant Pathologist)',
      '+91 98220 11223',
      'Maharashtra',
      'Pune',
      'Agri Research Centre',
      'en'
    );

    // 2. Farmer Profile
    db.prepare(`
      INSERT INTO farmer_profiles (id, user_id, land_size_acres, soil_type, irrigation_source, primary_crops, experience_years, cattle_count, kisan_credit_card)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'fp_1',
      'user_farmer_1',
      8.5,
      'Alluvial Loam',
      'Tube-well & Canal',
      'Wheat, Basmati Rice, Mustard, Sugarcane',
      18,
      5,
      1
    );

    // 3. Soil Details
    db.prepare(`
      INSERT INTO soil_details (id, user_id, test_date, n, p, k, ph, organic_carbon, electrical_conductivity, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'sd_1',
      'user_farmer_1',
      '2026-09-15',
      142.5,
      38.0,
      195.0,
      6.8,
      0.72,
      0.38,
      'Good Fertility (Slight Nitrogen Deficit)',
      'Recommended top-dressing with Urea during vegetative stage. Add organic compost to maintain microbial activity.'
    );
  }

  // Check crops
  const cropCount = db.prepare('SELECT COUNT(*) as count FROM crops').get() as { count: number };
  if (cropCount.count === 0) {
    const insertCrop = db.prepare(`
      INSERT INTO crops (id, name, hindi_name, season, soil_types, water_requirement, growth_duration_days, optimal_n, optimal_p, optimal_k, optimal_ph_min, optimal_ph_max, expected_yield_quintal, market_demand, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const cropsData = [
      ['crop_1', 'Wheat (Gehun)', 'गेहूं', 'Rabi', 'Alluvial, Clay Loam', 'Medium', 125, 120, 60, 40, 6.0, 7.5, 22.5, 'Very High', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80', 'Major staple crop in northern India. High nutritional value with reliable MSP procurement.'],
      ['crop_2', 'Basmati Rice (Dhan)', 'चावल / धान', 'Kharif', 'Clay Loam, Heavy Clay', 'High', 135, 100, 50, 50, 5.5, 7.0, 20.0, 'Very High', 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80', 'Premium aromatic paddy suitable for irrigated plains. High export demand.'],
      ['crop_3', 'Cotton (Kapas)', 'कपास', 'Kharif', 'Black Cotton Soil, Deep Alluvium', 'Medium', 160, 150, 60, 60, 6.5, 8.0, 12.0, 'High', 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80', 'Major commercial cash crop. Requires warm climate with minimal frost exposure.'],
      ['crop_4', 'Mustard (Sarson)', 'सरसों', 'Rabi', 'Sandy Loam, Light Alluvial', 'Low', 110, 80, 40, 40, 6.0, 7.5, 9.5, 'High', 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80', 'Dominant oilseed crop requiring minimal water. Excellent companion crop with wheat.'],
      ['crop_5', 'Maize (Makka)', 'मक्का', 'Kharif/Rabi', 'Well-drained Loam, Silt Loam', 'Medium', 100, 120, 60, 50, 5.8, 7.2, 28.0, 'High', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80', 'Versatile cereal used for food, feed, and starch manufacturing. Quick crop cycle.'],
      ['crop_6', 'Soybean', 'सोयाबीन', 'Kharif', 'Black Soil, Well-drained Loam', 'Medium', 95, 30, 80, 40, 6.0, 7.5, 11.0, 'High', 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80', 'Leguminous oilseed that naturally fixes atmospheric nitrogen. Low input costs.'],
      ['crop_7', 'Chickpea / Gram (Chana)', 'चना', 'Rabi', 'Sandy Loam, Loam', 'Low', 115, 25, 50, 30, 6.0, 8.0, 10.5, 'High', 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80', 'Vital pulse crop. Drought resistant with strong market support and high protein content.'],
      ['crop_8', 'Sugarcane (Ganna)', 'गन्ना', 'Annual', 'Deep Rich Loamy Soil', 'Very High', 330, 250, 100, 120, 6.5, 7.5, 380.0, 'Very High', 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=600&q=80', 'High return commercial cash crop linked with local cooperative sugar mills.']
    ];

    for (const crop of cropsData) {
      insertCrop.run(...crop);
    }
  }

  // Check plant diseases
  const diseaseCount = db.prepare('SELECT COUNT(*) as count FROM plant_diseases').get() as { count: number };
  if (diseaseCount.count === 0) {
    const insertDisease = db.prepare(`
      INSERT INTO plant_diseases (id, crop_name, disease_name, hindi_name, pathogen_type, symptoms, organic_treatment, chemical_treatment, prevention_tips, severity_level, sample_image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const diseases = [
      [
        'dis_1',
        'Tomato',
        'Early Blight (Alternaria solani)',
        'टमाटर का अगेती झुलसा',
        'Fungal',
        'Concentric dark brown circular rings (target-like spots) on older leaves. Foliage yellows around spots and drops prematurely.',
        'Apply Neem seed kernel extract (5%), spray Trichoderma viride (10g/L), spray fermented butter-milk (chaas) solution.',
        'Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L at first appearance of symptoms.',
        'Maintain crop rotation with non-solanaceous crops, avoid overhead sprinkler irrigation, practice mulch cover.',
        'High',
        'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'dis_2',
        'Rice / Paddy',
        'Blast (Magnaporthe oryzae)',
        'धान का झोंका रोग',
        'Fungal',
        'Spindle-shaped lesions with gray-white centers and brown margins on leaves. Neck rot causing drooping of panicles with empty grains.',
        'Seed treatment with Pseudomonas fluorescens (10g/kg seed), spray Jeevamrutha or cow urine mixture (10%).',
        'Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L during nursery and booting stage.',
        'Avoid excessive nitrogen fertilizer application, maintain balanced NPK ratio, plant certified resistant varieties.',
        'Critical',
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'dis_3',
        'Wheat',
        'Yellow / Stripe Rust (Puccinia striiformis)',
        'गेहूं का पीला रतुआ',
        'Fungal',
        'Bright yellow pustules arranged in linear stripes along leaf veins. Powdery yellow dust sticks to fingers upon touch.',
        'Foliar spray of garlic-chilli extract, dust with wood ash in early morning dew, foliar spray of botanical bio-fungicides.',
        'Spray Propiconazole 25% EC (Tilt) @ 1ml/L water immediately upon observing initial patches.',
        'Sow recommended resistant varieties like HD 2967, PBW 550; inspect fields in cool, humid foggy weather.',
        'Critical',
        'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'dis_4',
        'Potato',
        'Late Blight (Phytophthora infestans)',
        'आलू का पछेती झुलसा',
        'Oomycete / Fungal',
        'Water-soaked dark lesions appearing at tips and margins of leaves, white cottony mildew under leaf surfaces in humid weather.',
        'Spray copper-rich Bordeaux mixture (1%), apply wood ash and neem cake mixture to ridges.',
        'Preventive spray of Mancozeb 75% WP @ 2g/L. Curative spray of Cymoxanil 8% + Mancozeb 64% WP @ 2.5g/L.',
        'Use certified disease-free seed tubers, avoid waterlogging, earth up rows adequately to prevent tuber infection.',
        'Critical',
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'dis_5',
        'Cotton',
        'Bacterial Blight / Angular Leaf Spot',
        'कपास का जीवाणु झुलसा',
        'Bacterial',
        'Angular water-soaked lesions bounded by leaf veinlets, black arm symptom on stems, boll rot with dark sunken spots.',
        'Seed delinting with cow dung slurry, spray with agnihotra ash water, copper oxychloride organic blends.',
        'Spray Streptocycline 100ppm (1g in 10L water) combined with Copper Oxychloride 50% WP @ 25g in 10L water.',
        'Acid delinting of seeds before sowing, field sanitation and prompt destruction of infected crop residues.',
        'Moderate',
        'https://images.unsplash.com/photo-1594488554746-8868c2f1f58b?auto=format&fit=crop&w=600&q=80'
      ],
      [
        'dis_6',
        'Maize',
        'Fall Armyworm (Spodoptera frugiperda)',
        'मक्का का सैनिक कीट',
        'Pest / Larvae',
        'Window-paning of leaves, extensive pinhole damage in leaf whorls, prominent sawdust-like frass inside the whorl.',
        'Release Trichogramma egg parasitoids @ 50,000/acre, apply dry sand/sawdust mixed with lime into whorls.',
        'Spray Chlorantraniliprole 18.5% SC @ 0.4ml/L or Emamectin Benzoate 5% SG @ 0.5g/L directly into whorls.',
        'Deep summer ploughing, intercropping with pulses (Cowpea), erect bird perches @ 10/acre.',
        'High',
        'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
      ]
    ];

    for (const d of diseases) {
      insertDisease.run(...d);
    }
  }

  // Check market prices
  const marketCount = db.prepare('SELECT COUNT(*) as count FROM market_prices').get() as { count: number };
  if (marketCount.count === 0) {
    const insertPrice = db.prepare(`
      INSERT INTO market_prices (id, crop_name, market_name, state, district, min_price, max_price, modal_price, arrival_tonnes, price_date, trend)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const prices = [
      ['mp_1', 'Wheat', 'Khanna Mandi', 'Punjab', 'Ludhiana', 2275, 2450, 2380, 1450, '2026-10-29', 'up'],
      ['mp_2', 'Basmati Rice', 'Karnal Mandi', 'Haryana', 'Karnal', 3800, 4350, 4120, 890, '2026-10-29', 'up'],
      ['mp_3', 'Cotton (Medium Staple)', 'Rajkot APMC', 'Gujarat', 'Rajkot', 6800, 7550, 7250, 620, '2026-10-29', 'stable'],
      ['mp_4', 'Mustard', 'Alwar Mandi', 'Rajasthan', 'Alwar', 5350, 5800, 5620, 780, '2026-10-29', 'up'],
      ['mp_5', 'Soybean', 'Indore APMC', 'Madhya Pradesh', 'Indore', 4400, 4920, 4750, 1120, '2026-10-29', 'down'],
      ['mp_6', 'Maize', 'Davangere APMC', 'Karnataka', 'Davangere', 2050, 2320, 2210, 540, '2026-10-29', 'up'],
      ['mp_7', 'Chickpea (Chana)', 'Latur APMC', 'Maharashtra', 'Latur', 5600, 6200, 5950, 480, '2026-10-29', 'up'],
      ['mp_8', 'Onion', 'Lasalgaon APMC', 'Maharashtra', 'Nashik', 1600, 2600, 2150, 2200, '2026-10-29', 'down'],
      ['mp_9', 'Tomato', 'Kolar APMC', 'Karnataka', 'Kolar', 1400, 2200, 1850, 950, '2026-10-29', 'up'],
      ['mp_10', 'Potato', 'Agra Mandi', 'Uttar Pradesh', 'Agra', 1250, 1750, 1520, 1800, '2026-10-29', 'stable'],
      ['mp_11', 'Sugarcane', 'Muzaffarnagar APMC', 'Uttar Pradesh', 'Muzaffarnagar', 350, 390, 375, 3400, '2026-10-29', 'stable'],
      ['mp_12', 'Groundnut', 'Gondal APMC', 'Gujarat', 'Rajkot', 6200, 7100, 6750, 430, '2026-10-29', 'up']
    ];

    for (const p of prices) {
      insertPrice.run(...p);
    }
  }

  // Check government schemes
  const schemeCount = db.prepare('SELECT COUNT(*) as count FROM government_schemes').get() as { count: number };
  if (schemeCount.count === 0) {
    const insertScheme = db.prepare(`
      INSERT INTO government_schemes (id, title, hindi_title, category, financial_assistance, eligibility, required_documents, official_url, deadline, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const schemes = [
      [
        'gs_1',
        'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        'प्रधानमंत्री किसान सम्मान निधि',
        'Direct Income Support',
        '₹6,000 per year directly transferred in 3 equal installments of ₹2,000 into Aadhaar-seeded bank accounts.',
        'All landholding farmer families with cultivable landholding in their names. Institutional landholders excluded.',
        'Aadhaar Card, Land ownership deed (Khasra/Khatauni), Bank Passbook, Mobile Number linked with Aadhaar.',
        'https://pmkisan.gov.in',
        'Always Open',
        'Central Flagship'
      ],
      [
        'gs_2',
        'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
        'प्रधानमंत्री फसल बीमा योजना',
        'Crop Insurance',
        'Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest. Farmer premium only 1.5% - 2%.',
        'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
        'Sowing Certificate / Land Revenue Records, Aadhaar Card, Bank Account, Ration Card / ID Proof.',
        'https://pmfby.gov.in',
        'Kharif: July 31 | Rabi: Dec 31',
        'Risk Mitigation'
      ],
      [
        'gs_3',
        'PM-KUSUM (Solar Agriculture Pump Scheme)',
        'प्रधानमंत्री कुसुम सोलर पम्प योजना',
        'Solar Energy Subsidy',
        'Up to 60% subsidy for installation of stand-alone solar agriculture pumps and solarisation of grid-connected pumps.',
        'Individual farmers, Water User Associations, Primary Agriculture Credit Societies (PACS), and Farmer Producer Organisations.',
        'Land ownership documents, Electricity connection copy (if grid-tied), Bank account details, Aadhaar.',
        'https://mnre.gov.in',
        'State-wise Quota',
        'Renewable Power'
      ],
      [
        'gs_4',
        'Soil Health Card Scheme (SHC)',
        'मृदा स्वास्थ्य कार्ड योजना',
        'Soil Testing & Advisory',
        'Free soil testing every 2 years across 12 parameters (N, P, K, pH, EC, OC, Zn, Fe, Cu, Mn, B, S) with tailored crop dosage advice.',
        'All farmers with agricultural landholdings across all states and union territories.',
        'Aadhaar card, Land ownership details, Field geotag coordinates.',
        'https://soilhealth.dac.gov.in',
        'Continuous',
        'Soil Fertility'
      ],
      [
        'gs_5',
        'Kisan Credit Card (KCC) Scheme',
        'किसान क्रेडिट कार्ड योजना',
        'Institutional Credit',
        'Subsidized agricultural loans up to ₹3,00,000 at effective interest rate of 4% per annum upon prompt repayment.',
        'Owner cultivators, tenant farmers, oral lessees, sharecroppers, and SHGs of farmers.',
        'Duly filled application form, Identity proof, Address proof, Land cultivation proof.',
        'https://www.rbi.org.in',
        'Always Available',
        'Low Interest Loan'
      ],
      [
        'gs_6',
        'e-NAM (National Agriculture Market)',
        'राष्ट्रीय कृषि बाजार',
        'Digital Mandi Platform',
        'Pan-India electronic trading portal networking existing APMC mandis for transparent price discovery and direct online payments.',
        'Any registered farmer or trader selling agricultural produce at participating mandis.',
        'Mandi registration slip, Bank details for instant direct settlement, Aadhaar card.',
        'https://enam.gov.in',
        'Ongoing',
        'Market Linkage'
      ]
    ];

    for (const s of schemes) {
      insertScheme.run(...s);
    }
  }

  // Check expert consultations
  const expCount = db.prepare('SELECT COUNT(*) as count FROM expert_consultations').get() as { count: number };
  if (expCount.count === 0) {
    const insertExp = db.prepare(`
      INSERT INTO expert_consultations (id, user_id, farmer_name, farmer_phone, farmer_state, crop_type, subject, question, expert_name, answer, status, priority, submitted_at, answered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertExp.run(
      'ec_1',
      'user_farmer_1',
      'Ramesh Kumar Patel',
      '+91 98765 43210',
      'Punjab',
      'Wheat',
      'Yellow spots appearing along wheat leaves during cloudy foggy spell',
      'Respected sir, my HD-3086 wheat crop is 45 days old. Past 4 days there has been heavy fog and I noticed yellow linear dust patches on leaves. What immediate fungicide should I spray?',
      'Dr. Anand Deshmukh (Plant Pathologist)',
      'Namaste Ramesh Ji. The symptoms you described are typical of Yellow / Stripe Rust (Puccinia striiformis), triggered by prolonged fog and cool temperatures (10-18°C). Immediately spray Propiconazole 25% EC (brand name Tilt or similar) @ 1 ml per litre of water (200 ml in 200 L water per acre). Ensure good coverage of lower leaves in the afternoon once dew has dried up. Monitor the field every 4 days.',
      'answered',
      'urgent',
      '2026-10-27 10:14:00',
      '2026-10-27 14:30:00'
    );

    insertExp.run(
      'ec_2',
      'user_farmer_2',
      'Suresh Goud',
      '+91 97112 55443',
      'Telangana',
      'Cotton',
      'Pink Bollworm infestation control in flowering stage',
      'My Bt cotton field has pink bollworm larvae in rosette flowers. Pheromone trap catch is around 9 moths/trap/night. Please suggest integrated pest management.',
      'Dr. Harish Reddy (Agronomist & Pest Expert)',
      'Namaste Suresh Ji. 9 moths/night indicates economic threshold (ETL) is crossed. 1) Hand-pick and destroy rosette flowers containing larvae immediately. 2) Release egg parasitoid Trichogramma bactrae @ 60,000/acre at weekly intervals. 3) Spray Spinetoram 11.7% SC @ 170 ml/acre or Chlorantraniliprole 18.5% SC @ 60 ml/acre in 200 L water. Maintain pheromone traps for continuous monitoring.',
      'answered',
      'urgent',
      '2026-10-28 09:20:00',
      '2026-10-28 12:15:00'
    );
  }
}
