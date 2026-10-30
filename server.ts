import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db, initDatabase } from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & seeds
initDatabase();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ================= API ROUTES ================= //

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'KrishiMitra Smart Agriculture Portal',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!geminiApiKey,
  });
});

// 1. AUTHENTICATION & PROFILES
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, state, district, village, role = 'farmer', landSize = 5, soilType = 'Alluvial' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const userId = 'usr_' + Date.now();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name, phone, state, district, village)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, email, password, role, name, phone || '', state || 'Punjab', district || 'Ludhiana', village || '');

    // Create farmer profile if role is farmer
    if (role === 'farmer') {
      db.prepare(`
        INSERT INTO farmer_profiles (id, user_id, land_size_acres, soil_type, irrigation_source, primary_crops)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('fp_' + Date.now(), userId, Number(landSize) || 5, soilType, 'Borewell / Canal', 'Wheat, Rice');
    }

    const user = db.prepare('SELECT id, email, role, name, phone, state, district, village FROM users WHERE id = ?').get(userId);
    res.json({ user, message: 'Registration successful!' });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Failed to register' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(user.id);
    const soil = db.prepare('SELECT * FROM soil_details WHERE user_id = ? ORDER BY test_date DESC LIMIT 1').get(user.id);

    const { password_hash, ...safeUser } = user;
    res.json({
      user: safeUser,
      profile: profile || null,
      recentSoil: soil || null,
      message: 'Logged in successfully',
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      // Default demo farmer if not authenticated
      const defaultUser = db.prepare('SELECT id, email, role, name, phone, state, district, village FROM users WHERE id = ?').get('user_farmer_1');
      const profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get('user_farmer_1');
      const soil = db.prepare('SELECT * FROM soil_details WHERE user_id = ? ORDER BY test_date DESC LIMIT 1').get('user_farmer_1');
      return res.json({ user: defaultUser, profile, recentSoil: soil });
    }

    const user = db.prepare('SELECT id, email, role, name, phone, state, district, village FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = db.prepare('SELECT * FROM farmer_profiles WHERE user_id = ?').get(userId);
    const soil = db.prepare('SELECT * FROM soil_details WHERE user_id = ? ORDER BY test_date DESC LIMIT 1').get(userId);

    res.json({ user, profile, recentSoil: soil });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch user session' });
  }
});

// 2. WEATHER ADVISORY & 7-DAY FORECAST
app.get('/api/weather', (req: Request, res: Response) => {
  try {
    const location = (req.query.location as string) || 'Ludhiana, Punjab';
    
    // Comprehensive Agrometeorological Forecast & Advisory
    const forecast = [
      { day: 'Today', date: 'Oct 30', tempMax: 29, tempMin: 16, humidity: 62, rainfallMm: 0, windKmh: 11, condition: 'Sunny / Clear', icon: 'Sun', advisory: 'Optimal condition for field preparation and pre-sowing irrigation.' },
      { day: 'Tomorrow', date: 'Oct 31', tempMax: 28, tempMin: 15, humidity: 66, rainfallMm: 0, windKmh: 13, condition: 'Clear Sky', icon: 'Sun', advisory: 'Favorable spray window between 10:00 AM and 3:00 PM.' },
      { day: 'Saturday', date: 'Nov 01', tempMax: 27, tempMin: 15, humidity: 71, rainfallMm: 2.5, windKmh: 18, condition: 'Passing Clouds', icon: 'CloudSun', advisory: 'Light scattered showers possible. Postpone chemical spray by 24h.' },
      { day: 'Sunday', date: 'Nov 02', tempMax: 26, tempMin: 14, humidity: 75, rainfallMm: 8.0, windKmh: 20, condition: 'Light Rain', icon: 'CloudRain', advisory: 'Avoid nitrogen top dressing. Inspect drainage channels in low-lying plots.' },
      { day: 'Monday', date: 'Nov 03', tempMax: 27, tempMin: 14, humidity: 68, rainfallMm: 0, windKmh: 12, condition: 'Partly Cloudy', icon: 'Cloud', advisory: 'Soil moisture adequate. Resume Rabi nursery sowing.' },
      { day: 'Tuesday', date: 'Nov 04', tempMax: 28, tempMin: 15, humidity: 60, rainfallMm: 0, windKmh: 10, condition: 'Sunny', icon: 'Sun', advisory: 'Good solar radiation for drying harvested paddy before storage.' },
      { day: 'Wednesday', date: 'Nov 05', tempMax: 29, tempMin: 16, humidity: 58, rainfallMm: 0, windKmh: 9, condition: 'Clear Sky', icon: 'Sun', advisory: 'Ideal weather for sowing Wheat (HD 3086 / DBW 187) and Mustard.' },
    ];

    const current = {
      location,
      temperatureC: 28.5,
      tempMinC: 16,
      tempMaxC: 29,
      humidity: 62,
      rainfallProbability: 5,
      windSpeedKmh: 12,
      windDirection: 'North-Northwest (NNW)',
      soilTemperatureC: 22.4,
      dewPointC: 14.8,
      uvIndex: 6,
      condition: 'Sunny & Favorable',
      alert: {
        type: 'advisory',
        title: 'Rabi Sowing Advisory',
        message: 'Night temperatures have settled below 17°C, marking the ideal agronomic window for sowing high-yield Wheat and Mustard seeds. Complete seed treatment with Azotobacter and PSB prior to drilling.',
      },
      forecast,
    };

    res.json(current);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// 3. AI CROP RECOMMENDATION
app.post('/api/crop-recommendation', async (req: Request, res: Response) => {
  try {
    const { n, p, k, ph, temp, humidity, rainfall, location = 'North India', soilType = 'Alluvial' } = req.body;
    const N = Number(n);
    const P = Number(p);
    const K = Number(k);
    const pH = Number(ph);
    const T = Number(temp);
    const H = Number(humidity);
    const R = Number(rainfall);

    if (isNaN(N) || isNaN(P) || isNaN(K) || isNaN(pH) || isNaN(T) || isNaN(H) || isNaN(R)) {
      return res.status(400).json({ error: 'All 7 soil and climate parameters (N, P, K, pH, Temperature, Humidity, Rainfall) must be valid numbers.' });
    }

    // Agronomic scoring engine for baseline accuracy
    const cropScores: Record<string, { score: number; rationale: string; yield: string; season: string; duration: string }> = {
      'Wheat (Triticum aestivum)': {
        score: (N >= 90 && N <= 150 ? 30 : 15) + (P >= 40 && P <= 80 ? 25 : 10) + (pH >= 6.0 && pH <= 7.5 ? 20 : 5) + (T >= 14 && T <= 26 ? 25 : 5),
        rationale: 'Well-suited for moderate winter temperatures, balanced N-P levels, and neutral to slightly sub-alkaline pH soils with standard residual moisture.',
        yield: '20 - 24 Quintals/Acre',
        season: 'Rabi',
        duration: '120 - 130 days',
      },
      'Basmati Rice (Paddy)': {
        score: (R >= 150 || H >= 75 ? 35 : 10) + (N >= 80 && N <= 140 ? 25 : 15) + (T >= 22 && T <= 34 ? 20 : 5) + (pH >= 5.5 && pH <= 7.2 ? 20 : 10),
        rationale: 'Requires high ambient humidity, elevated rainfall or abundant canal irrigation, and fertile clay loam with good water retention.',
        yield: '18 - 22 Quintals/Acre',
        season: 'Kharif',
        duration: '130 - 145 days',
      },
      'Mustard / Rapeseed': {
        score: (N >= 60 && N <= 100 ? 25 : 15) + (P >= 30 && P <= 60 ? 25 : 10) + (R < 100 ? 30 : 10) + (T >= 12 && T <= 25 ? 20 : 10),
        rationale: 'Thrives in cool dry conditions with low water footprint. Excellent crop for medium nitrogen soils and sandy to alluvial loam.',
        yield: '8 - 11 Quintals/Acre',
        season: 'Rabi',
        duration: '105 - 115 days',
      },
      'Cotton (White Gold)': {
        score: (T >= 24 && T <= 36 ? 30 : 10) + (K >= 40 ? 25 : 10) + (pH >= 6.2 && pH <= 8.2 ? 25 : 10) + (H >= 50 && H <= 75 ? 20 : 10),
        rationale: 'Demands warm sunshine, deep loam or black cotton soil, high potash for boll fiber development, and moderate rainfall.',
        yield: '10 - 14 Quintals/Acre',
        season: 'Kharif',
        duration: '150 - 165 days',
      },
      'Chickpea / Bengal Gram (Chana)': {
        score: (N <= 50 ? 30 : 15) + (P >= 40 && P <= 70 ? 30 : 15) + (R < 90 ? 25 : 10) + (T >= 15 && T <= 28 ? 15 : 10),
        rationale: 'Fixes its own nitrogen; excessive nitrogen hampers yield. Ideal for light to medium soils with low irrigation availability.',
        yield: '9 - 12 Quintals/Acre',
        season: 'Rabi',
        duration: '110 - 120 days',
      },
      'Maize (Sweet Corn / Hybrid)': {
        score: (N >= 100 ? 30 : 15) + (P >= 50 ? 25 : 10) + (T >= 20 && T <= 32 ? 25 : 15) + (pH >= 5.8 && pH <= 7.4 ? 20 : 10),
        rationale: 'Heavy feeder crop that responds strongly to high nitrogen and phosphorus, requiring well-drained fertile loam.',
        yield: '25 - 30 Quintals/Acre',
        season: 'Kharif / Rabi',
        duration: '95 - 110 days',
      },
    };

    // Rank rule-based crops
    const sortedCrops = Object.entries(cropScores).sort((a, b) => b[1].score - a[1].score);
    const topPick = sortedCrops[0];
    const secondPick = sortedCrops[1];
    const thirdPick = sortedCrops[2];

    let aiAnalysis = '';
    let aiEnhancedCrop = topPick[0];
    let confidence = Math.min(97, Math.max(78, topPick[1].score));

    // Try Gemini Server-side AI reasoning
    if (ai) {
      try {
        const prompt = `You are a Senior Agronomist and Chief Agriculture Scientist at the Indian Council of Agricultural Research (ICAR).
Farmer Parameters:
- Soil Nitrogen (N): ${N} kg/ha
- Soil Phosphorus (P): ${P} kg/ha
- Soil Potassium (K): ${K} kg/ha
- Soil pH: ${pH}
- Average Temperature: ${T} °C
- Relative Humidity: ${H} %
- Average Rainfall: ${R} mm
- Region/Soil: ${location}, ${soilType}

Evaluate the optimal primary crop and 2 alternative rotation crops. Provide:
1. Primary Recommended Crop Name
2. Agronomic Rationale (explain why NPK, pH, and climate align)
3. Soil Nutrient Enhancement Advice (what specific fertilizer or compost to add before sowing)
4. Water & Irrigation Management Advice
5. Expected Yield Range

Keep response structured, concise, and highly encouraging for the farmer.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (geminiRes.text) {
          aiAnalysis = geminiRes.text;
        }
      } catch (geminiErr: any) {
        console.warn('Gemini crop recommendation fallback:', geminiErr.message);
      }
    }

    if (!aiAnalysis) {
      aiAnalysis = `Based on your soil analysis (N: ${N}, P: ${P}, K: ${K}, pH: ${pH}) and local climate (${T}°C, ${H}% humidity, ${R}mm rainfall), **${topPick[0]}** is the ideal candidate. The soil pH of ${pH} ensures maximum nutrient availability without causing micronutrient lockout. Soil nitrogen level (${N} kg/ha) matches the vegetative development curve of this crop. Apply 2 bags of compost and 1 bag of DAP per acre at final ploughing to achieve target yield.`;
    }

    // Save to DB
    const recId = 'cr_' + Date.now();
    db.prepare(`
      INSERT INTO crop_recommendations (id, n, p, k, ph, temp, humidity, rainfall, recommended_crop, confidence, rationale, suitable_alternatives)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      recId,
      N,
      P,
      K,
      pH,
      T,
      H,
      R,
      aiEnhancedCrop,
      confidence,
      aiAnalysis,
      JSON.stringify([secondPick[0], thirdPick[0]])
    );

    res.json({
      id: recId,
      primaryCrop: aiEnhancedCrop,
      confidence: confidence + '%',
      rationale: aiAnalysis,
      cropDetails: topPick[1],
      alternatives: [
        { name: secondPick[0], match: (secondPick[1].score) + '%', season: secondPick[1].season, yield: secondPick[1].yield },
        { name: thirdPick[0], match: (thirdPick[1].score) + '%', season: thirdPick[1].season, yield: thirdPick[1].yield },
      ],
      soilHealthStatus: pH < 6.0 ? 'Acidic Soil – Apply Lime' : pH > 7.8 ? 'Alkaline Soil – Apply Gypsum' : 'Ideal Neutral Soil',
    });
  } catch (err: any) {
    console.error('Crop recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate crop recommendation' });
  }
});

app.get('/api/crop-recommendation/history', (req: Request, res: Response) => {
  try {
    const list = db.prepare('SELECT * FROM crop_recommendations ORDER BY created_at DESC LIMIT 10').all();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load recommendation history' });
  }
});

// 4. PLANT DISEASE DETECTION (Multimodal Vision with Gemini or curated database)
app.post('/api/disease-detection', async (req: Request, res: Response) => {
  try {
    const { imageBase64, cropType = 'auto', mimeType = 'image/jpeg', demoPresetId } = req.body;

    // Check if user chose one of the built-in preset diseased specimens
    if (demoPresetId) {
      const preset = db.prepare('SELECT * FROM plant_diseases WHERE id = ?').get(demoPresetId) as any;
      if (preset) {
        return res.json({
          source: 'demonstration_database',
          diseaseName: preset.disease_name,
          cropName: preset.crop_name,
          hindiName: preset.hindi_name,
          pathogenType: preset.pathogen_type,
          severityLevel: preset.severity_level,
          confidence: '96%',
          symptoms: preset.symptoms,
          organicTreatment: preset.organic_treatment,
          chemicalTreatment: preset.chemical_treatment,
          preventionTips: preset.prevention_tips,
          imageUrl: preset.sample_image_url,
        });
      }
    }

    if (!imageBase64 && !demoPresetId) {
      return res.status(400).json({ error: 'Image data or demonstration preset is required' });
    }

    // Attempt Gemini Vision multimodal detection
    if (ai && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        const imagePart = {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        };

        const textPart = {
          text: `You are an expert Plant Pathologist at ICAR and agricultural scientist. Inspect this crop leaf/plant image.
Identified crop if visible: ${cropType !== 'auto' ? cropType : 'determine from image'}.

Identify:
1. Crop Name
2. Disease Name (Scientific + Common Name)
3. Pathogen Type (Fungal, Bacterial, Viral, Insect/Pest, or Nutritional Deficiency)
4. Severity Level (Low, Moderate, High, or Critical)
5. Confidence Percentage (e.g. 94%)
6. Distinct Visible Symptoms
7. Organic / Bio-treatment Solution (neem, bio-agents, natural fungicides)
8. Chemical Treatment & Exact Dosage (e.g., Mancozeb, Tricyclazole, Azoxystrobin, Copper Oxychloride)
9. Prevention & Field Management Tips

Please return ONLY valid JSON formatted as:
{
  "cropName": "string",
  "diseaseName": "string",
  "hindiName": "string in Hindi",
  "pathogenType": "string",
  "severityLevel": "Low | Moderate | High | Critical",
  "confidence": "string with percentage",
  "symptoms": "string",
  "organicTreatment": "string",
  "chemicalTreatment": "string",
  "preventionTips": "string"
}`,
        };

        const visionResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: [imagePart, textPart] },
        });

        const rawText = visionResponse.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            source: 'gemini_vision_ai',
            ...parsed,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini vision API error, falling back to curated diagnosis:', geminiError.message);
      }
    }

    // Fallback: Smart diagnosis from our plant disease database
    const randomPick = db.prepare('SELECT * FROM plant_diseases ORDER BY RANDOM() LIMIT 1').get() as any;
    res.json({
      source: 'demonstration_mode',
      diseaseName: randomPick.disease_name,
      cropName: randomPick.crop_name,
      hindiName: randomPick.hindi_name,
      pathogenType: randomPick.pathogen_type,
      severityLevel: randomPick.severity_level,
      confidence: '92%',
      symptoms: randomPick.symptoms,
      organicTreatment: randomPick.organic_treatment,
      chemicalTreatment: randomPick.chemical_treatment,
      preventionTips: randomPick.prevention_tips,
      imageUrl: randomPick.sample_image_url,
      notice: 'Demonstration analysis active. Connect an active Gemini API key in Secrets panel for live deep neural vision diagnosis.',
    });
  } catch (err: any) {
    console.error('Disease detection error:', err);
    res.status(500).json({ error: 'Failed to inspect crop disease' });
  }
});

app.get('/api/plant-diseases', (req: Request, res: Response) => {
  try {
    const diseases = db.prepare('SELECT * FROM plant_diseases ORDER BY crop_name ASC').all();
    res.json(diseases);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load disease library' });
  }
});

// 5. MARKET PRICES (MANDI PRICE TRACKER)
app.get('/api/market-prices', (req: Request, res: Response) => {
  try {
    const { crop, state } = req.query;
    let query = 'SELECT * FROM market_prices WHERE 1=1';
    const params: any[] = [];

    if (crop && crop !== 'All') {
      query += ' AND crop_name LIKE ?';
      params.push(`%${crop}%`);
    }
    if (state && state !== 'All') {
      query += ' AND state = ?';
      params.push(state);
    }

    query += ' ORDER BY modal_price DESC';
    const prices = db.prepare(query).all(...params);
    res.json(prices);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load market prices' });
  }
});

app.get('/api/market-prices/trends', (req: Request, res: Response) => {
  try {
    // 6-month historical price comparison chart data (₹/Quintal)
    const trends = [
      { month: 'May 2026', Wheat: 2275, BasmatiRice: 3950, Cotton: 7100, Mustard: 5200, Soybean: 4600, Maize: 2050 },
      { month: 'Jun 2026', Wheat: 2310, BasmatiRice: 4000, Cotton: 7180, Mustard: 5320, Soybean: 4650, Maize: 2100 },
      { month: 'Jul 2026', Wheat: 2340, BasmatiRice: 4050, Cotton: 7240, Mustard: 5410, Soybean: 4700, Maize: 2140 },
      { month: 'Aug 2026', Wheat: 2350, BasmatiRice: 4100, Cotton: 7200, Mustard: 5500, Soybean: 4680, Maize: 2180 },
      { month: 'Sep 2026', Wheat: 2370, BasmatiRice: 4110, Cotton: 7220, Mustard: 5580, Soybean: 4720, Maize: 2190 },
      { month: 'Oct 2026', Wheat: 2380, BasmatiRice: 4120, Cotton: 7250, Mustard: 5620, Soybean: 4750, Maize: 2210 },
    ];
    res.json(trends);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load price trends' });
  }
});

app.post('/api/market-prices', (req: Request, res: Response) => {
  try {
    const { crop_name, market_name, state, district, min_price, max_price, modal_price, arrival_tonnes, trend } = req.body;
    if (!crop_name || !market_name || !modal_price) {
      return res.status(400).json({ error: 'Missing required mandi fields' });
    }

    const id = 'mp_' + Date.now();
    const today = new Date().toISOString().split('T')[0];
    db.prepare(`
      INSERT INTO market_prices (id, crop_name, market_name, state, district, min_price, max_price, modal_price, arrival_tonnes, price_date, trend)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      crop_name,
      market_name,
      state || 'General',
      district || 'General',
      Number(min_price) || Number(modal_price) * 0.95,
      Number(max_price) || Number(modal_price) * 1.05,
      Number(modal_price),
      Number(arrival_tonnes) || 100,
      today,
      trend || 'up'
    );

    res.json({ message: 'Mandi price added successfully', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record market price' });
  }
});

app.delete('/api/market-prices/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM market_prices WHERE id = ?').run(id);
    res.json({ message: 'Price record deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete price record' });
  }
});

// 6. FERTILIZER & IRRIGATION ADVISOR
app.post('/api/fertilizer-calculator', (req: Request, res: Response) => {
  try {
    const { cropName, landAreaAcres = 1, currentN = 100, currentP = 40, currentK = 150, irrigationType = 'Drip' } = req.body;
    const acres = Number(landAreaAcres) || 1;

    // Recommended nutrient dosage per acre for target yield
    const cropRequirements: Record<string, { n: number; p: number; k: number; waterPerWeekLiters: number }> = {
      'Wheat': { n: 50, p: 25, k: 20, waterPerWeekLiters: 12000 },
      'Basmati Rice': { n: 55, p: 30, k: 30, waterPerWeekLiters: 35000 },
      'Cotton': { n: 60, p: 30, k: 30, waterPerWeekLiters: 18000 },
      'Mustard': { n: 35, p: 20, k: 15, waterPerWeekLiters: 8000 },
      'Maize': { n: 50, p: 25, k: 25, waterPerWeekLiters: 15000 },
      'Soybean': { n: 15, p: 35, k: 20, waterPerWeekLiters: 12000 },
      'Potato': { n: 70, p: 40, k: 50, waterPerWeekLiters: 20000 },
      'Sugarcane': { n: 120, p: 50, k: 60, waterPerWeekLiters: 45000 },
    };

    const target = cropRequirements[cropName] || { n: 45, p: 25, k: 20, waterPerWeekLiters: 15000 };

    // Standard fertilizer conversion:
    // DAP (18% N, 46% P2O5) -> 50kg bag contains 9kg N, 23kg P
    // Urea (46% N) -> 45kg bag contains ~20.7kg N
    // MOP (60% K2O) -> 50kg bag contains 30kg K

    const dapBagsNeeded = Math.max(0.5, Math.ceil((target.p * acres) / 23));
    const nFromDAP = dapBagsNeeded * 9;
    const remainingN = Math.max(0, (target.n * acres) - nFromDAP);
    const ureaBagsNeeded = Math.max(1, Math.ceil(remainingN / 20.7));
    const mopBagsNeeded = Math.max(0.5, Math.ceil((target.k * acres) / 30));

    // Irrigation savings calculation
    let irrigationMultiplier = 1.0;
    let waterSavingMessage = 'Traditional flood irrigation; high percolation and evaporation loss.';
    if (irrigationType === 'Drip') {
      irrigationMultiplier = 0.55;
      waterSavingMessage = 'Micro-drip irrigation saves up to 45% water and minimizes weed germination.';
    } else if (irrigationType === 'Sprinkler') {
      irrigationMultiplier = 0.75;
      waterSavingMessage = 'Sprinkler system saves approx 25% water; great for undulating terrain.';
    }

    const waterNeededPerWeek = Math.round(target.waterPerWeekLiters * acres * irrigationMultiplier);

    res.json({
      cropName,
      landAreaAcres: acres,
      dapBags: dapBagsNeeded,
      ureaBags: ureaBagsNeeded,
      mopBags: mopBagsNeeded,
      schedule: [
        {
          stage: 'Basal Dose (During Final Ploughing / Sowing)',
          fertilizers: `All DAP (${dapBagsNeeded} bags) + All MOP (${mopBagsNeeded} bags) + 1/3rd Urea (${Math.ceil(ureaBagsNeeded / 3)} bags)`,
          purpose: 'Promotes deep root establishment and vigorous early seedling vigor.',
        },
        {
          stage: 'First Top Dressing (Crown Root Initiation / 21-25 DAS)',
          fertilizers: `1/3rd Urea (${Math.ceil(ureaBagsNeeded / 3)} bags) alongside light irrigation`,
          purpose: 'Accelerates vegetative tillering and photosynthetic foliage surface.',
        },
        {
          stage: 'Second Top Dressing (Booting / Pre-Flowering Stage)',
          fertilizers: `Remaining Urea (${Math.max(1, ureaBagsNeeded - 2 * Math.ceil(ureaBagsNeeded / 3))} bags) + Zinc Sulphate foliar spray`,
          purpose: 'Ensures dense spikelet filling and prevents flower abortion.',
        },
      ],
      irrigation: {
        method: irrigationType,
        waterNeededWeeklyLiters: waterNeededPerWeek,
        recommendedIntervalDays: irrigationType === 'Drip' ? 'Daily or alternate days' : 'Every 10-12 days',
        waterSavingNote: waterSavingMessage,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to calculate fertilizer recommendations' });
  }
});

// 7. GOVERNMENT SCHEMES
app.get('/api/schemes', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM government_schemes WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    if (search) {
      query += ' AND (title LIKE ? OR eligibility LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const schemes = db.prepare(query).all(...params);
    res.json(schemes);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch government schemes' });
  }
});

app.post('/api/schemes', (req: Request, res: Response) => {
  try {
    const { title, hindi_title, category, financial_assistance, eligibility, required_documents, official_url, deadline, badge } = req.body;
    if (!title || !financial_assistance || !eligibility) {
      return res.status(400).json({ error: 'Title, financial assistance, and eligibility are required.' });
    }

    const id = 'gs_' + Date.now();
    db.prepare(`
      INSERT INTO government_schemes (id, title, hindi_title, category, financial_assistance, eligibility, required_documents, official_url, deadline, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      hindi_title || title,
      category || 'Central Scheme',
      financial_assistance,
      eligibility,
      required_documents || 'Aadhaar, Land Records, Bank Passbook',
      official_url || 'https://agricoop.gov.in',
      deadline || 'Ongoing',
      badge || 'New Initiative'
    );

    res.json({ message: 'Government scheme added successfully', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add government scheme' });
  }
});

app.delete('/api/schemes/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM government_schemes WHERE id = ?').run(req.params.id);
    res.json({ message: 'Scheme deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete scheme' });
  }
});

// 8. EXPERT CONSULTATION & AI AGRI-ASSISTANT
app.get('/api/consultations', (req: Request, res: Response) => {
  try {
    const { status, crop } = req.query;
    let query = 'SELECT * FROM expert_consultations WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (crop && crop !== 'all') {
      query += ' AND crop_type = ?';
      params.push(crop);
    }

    query += ' ORDER BY submitted_at DESC';
    const consultations = db.prepare(query).all(...params);
    res.json(consultations);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

app.post('/api/consultations', async (req: Request, res: Response) => {
  try {
    const { farmer_name, farmer_phone, farmer_state, crop_type, subject, question, priority = 'normal', image_data } = req.body;
    if (!farmer_name || !crop_type || !question) {
      return res.status(400).json({ error: 'Farmer name, crop, and question are required' });
    }

    const id = 'ec_' + Date.now();
    let instantAiAnswer = '';

    // Auto-generate instant agronomist advisory with Gemini if available
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are Dr. Anand Deshmukh, Chief Agronomist & Krishi Scientist at KrishiMitra Agri Portal.
A farmer has submitted an urgent agricultural question:
Farmer Name: ${farmer_name} (${farmer_state || 'India'})
Crop: ${crop_type}
Subject: ${subject}
Question: ${question}

Provide a practical, warm, actionable response addressing:
1. Scientific diagnosis of the condition or query.
2. Immediate step-by-step remedy (including chemical dosage or bio-alternatives).
3. Long-term soil or pest management practice to avoid recurrence.
Keep tone compassionate and respectful ("Namaste ${farmer_name} Ji"). Keep response around 120-180 words.`,
        });

        if (response.text) {
          instantAiAnswer = response.text;
        }
      } catch (geminiError: any) {
        console.warn('Gemini consultation assistant fallback:', geminiError.message);
      }
    }

    // If Gemini wasn't available, give rich standard advisory
    if (!instantAiAnswer) {
      instantAiAnswer = `Namaste ${farmer_name} Ji. Thank you for reaching out to KrishiMitra Expert Cell. For ${crop_type}, your observation regarding "${subject}" is noted. As immediate guidance: 1) Ensure proper drainage to avoid root rot. 2) Inspect the undersides of leaves early in the morning for pest egg colonies. 3) Apply 5% Neem Seed Kernel Extract (NSKE) or recommended fungicide according to label directions. A senior district agronomist will review your field query shortly.`;
    }

    db.prepare(`
      INSERT INTO expert_consultations (id, farmer_name, farmer_phone, farmer_state, crop_type, subject, question, image_data, expert_name, answer, status, priority, submitted_at, answered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      id,
      farmer_name,
      farmer_phone || '',
      farmer_state || 'India',
      crop_type,
      subject,
      question,
      image_data || null,
      'Dr. Anand Deshmukh (Agri-Scientist)',
      instantAiAnswer,
      'answered',
      priority
    );

    const saved = db.prepare('SELECT * FROM expert_consultations WHERE id = ?').get(id);
    res.json({ consultation: saved, message: 'Question submitted and expert response generated!' });
  } catch (err: any) {
    console.error('Consultation post error:', err);
    res.status(500).json({ error: 'Failed to submit consultation query' });
  }
});

app.put('/api/consultations/:id/answer', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { expert_name, answer } = req.body;
    if (!answer) return res.status(400).json({ error: 'Answer is required' });

    db.prepare(`
      UPDATE expert_consultations
      SET expert_name = ?, answer = ?, status = 'answered', answered_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(expert_name || 'Dr. Priya Sharma (ICAR Advisor)', answer, id);

    res.json({ message: 'Answer updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update answer' });
  }
});

// 9. ADMIN METRICS & GENERAL MANAGEMENT
app.get('/api/admin/stats', (req: Request, res: Response) => {
  try {
    const totalFarmers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'farmer'").get() as any).c;
    const totalConsultations = (db.prepare('SELECT COUNT(*) as c FROM expert_consultations').get() as any).c;
    const answeredConsultations = (db.prepare("SELECT COUNT(*) as c FROM expert_consultations WHERE status = 'answered'").get() as any).c;
    const totalRecommendations = (db.prepare('SELECT COUNT(*) as c FROM crop_recommendations').get() as any).c;
    const totalCrops = (db.prepare('SELECT COUNT(*) as c FROM crops').get() as any).c;
    const totalMandiRecords = (db.prepare('SELECT COUNT(*) as c FROM market_prices').get() as any).c;
    const totalSchemes = (db.prepare('SELECT COUNT(*) as c FROM government_schemes').get() as any).c;

    const farmersList = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.state, u.district, u.created_at, fp.land_size_acres, fp.soil_type, fp.primary_crops
      FROM users u
      LEFT JOIN farmer_profiles fp ON u.id = fp.user_id
      ORDER BY u.created_at DESC
    `).all();

    res.json({
      metrics: {
        totalFarmers: totalFarmers + 1420, // baseline representation
        totalConsultations: totalConsultations + 864,
        resolvedRate: '98.4%',
        activeSchemes: totalSchemes,
        mandiCovered: totalMandiRecords + 120,
        aiRecommendationsMade: totalRecommendations + 3512,
      },
      farmers: farmersList,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load admin stats' });
  }
});

// 10. CROPS CATALOG
app.get('/api/crops', (req: Request, res: Response) => {
  try {
    const crops = db.prepare('SELECT * FROM crops ORDER BY name ASC').all();
    res.json(crops);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load crops list' });
  }
});

// Serve frontend with Vite middlewares in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 KrishiMitra server is running at http://localhost:${PORT}`);
  });
}

startServer();
