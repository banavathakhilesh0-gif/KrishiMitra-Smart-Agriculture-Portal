export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'admin' | 'expert';
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  language?: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  land_size_acres: number;
  soil_type: string;
  irrigation_source: string;
  primary_crops: string;
  experience_years: number;
  cattle_count: number;
  kisan_credit_card: number;
}

export interface SoilDetail {
  id: string;
  user_id: string;
  test_date: string;
  n: number;
  p: number;
  k: number;
  ph: number;
  organic_carbon: number;
  electrical_conductivity: number;
  status: string;
  notes?: string;
}

export interface Crop {
  id: string;
  name: string;
  hindi_name: string;
  season: string;
  soil_types: string;
  water_requirement: string;
  growth_duration_days: number;
  optimal_n: number;
  optimal_p: number;
  optimal_k: number;
  optimal_ph_min: number;
  optimal_ph_max: number;
  expected_yield_quintal: number;
  market_demand: string;
  image_url: string;
  description: string;
}

export interface CropRecommendationResult {
  id: string;
  primaryCrop: string;
  confidence: string;
  rationale: string;
  cropDetails: {
    score: number;
    rationale: string;
    yield: string;
    season: string;
    duration: string;
  };
  alternatives: Array<{
    name: string;
    match: string;
    season: string;
    yield: string;
  }>;
  soilHealthStatus: string;
}

export interface PlantDisease {
  id?: string;
  crop_name?: string;
  cropName?: string;
  disease_name?: string;
  diseaseName?: string;
  hindi_name?: string;
  hindiName?: string;
  pathogen_type?: string;
  pathogenType?: string;
  symptoms: string;
  organic_treatment?: string;
  organicTreatment?: string;
  chemical_treatment?: string;
  chemicalTreatment?: string;
  prevention_tips?: string;
  preventionTips?: string;
  severity_level?: string;
  severityLevel?: string;
  sample_image_url?: string;
  imageUrl?: string;
  confidence?: string;
  source?: string;
  notice?: string;
}

export interface WeatherForecastDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfallMm: number;
  windKmh: number;
  condition: string;
  icon: string;
  advisory: string;
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  tempMinC: number;
  tempMaxC: number;
  humidity: number;
  rainfallProbability: number;
  windSpeedKmh: number;
  windDirection: string;
  soilTemperatureC: number;
  dewPointC: number;
  uvIndex: number;
  condition: string;
  alert: {
    type: string;
    title: string;
    message: string;
  };
  forecast: WeatherForecastDay[];
}

export interface MandiPrice {
  id: string;
  crop_name: string;
  market_name: string;
  state: string;
  district: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  arrival_tonnes: number;
  price_date: string;
  trend: 'up' | 'down' | 'stable';
}

export interface GovernmentScheme {
  id: string;
  title: string;
  hindi_title: string;
  category: string;
  financial_assistance: string;
  eligibility: string;
  required_documents: string;
  official_url: string;
  deadline: string;
  badge: string;
}

export interface ExpertConsultation {
  id: string;
  user_id?: string;
  farmer_name: string;
  farmer_phone?: string;
  farmer_state?: string;
  crop_type: string;
  subject: string;
  question: string;
  image_data?: string;
  expert_name?: string;
  answer?: string;
  status: 'pending' | 'answered';
  priority: 'normal' | 'urgent';
  submitted_at: string;
  answered_at?: string;
}
