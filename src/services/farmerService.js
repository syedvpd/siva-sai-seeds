import { supabase } from '../lib/supabase';

// Fallback seed assets for visual display
const CROP_FALLBACK_IMAGES = {
  Cotton: '/assets/crops/cotton.png',
  Maize: '/assets/crops/maize.png',
  Groundnut: '/assets/crops/groundnut.png',
  Bajra: '/assets/crops/bajra.png',
  Rice: '/assets/crops/onb_mandi_prices_1784644862143.png',
  Wheat: '/assets/crops/onb_track_crop_1784644792435.png',
  Sugarcane: '/assets/crops/onb_weather_water_1784644824818.png',
  default: '/assets/crops/image.png'
};

/**
 * Helper to securely resolve the currently authenticated farmer from Supabase session.
 * Never trusts a client-supplied farmer_id or user_id.
 */
async function getAuthenticatedFarmer() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Authentication required. Please log in.');
  }

  // Fetch the farmer profile linked to this authenticated auth.users record
  const { data: profile, error: profError } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('app_user_id', user.id)
    .maybeSingle();

  if (profError) {
    console.error('[FarmerService] Profile resolution error:', profError.message);
  }

  return {
    authUser: user,
    profile: profile || null,
    farmerId: profile?.id || null,
    userId: user.id
  };
}

export const farmerService = {
  // ─── PROFILE ───────────────────────────────────────────────
  async getProfile() {
    const { userId } = await getAuthenticatedFarmer();
    const { data, error } = await supabase
      .from('farmer_profiles')
      .select('*')
      .eq('app_user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[FarmerService] getProfile error:', error.message);
      throw error;
    }
    return data;
  },

  async updateProfile(profileData) {
    const { userId } = await getAuthenticatedFarmer();
    
    // Prevent client from overriding system/ownership columns
    const safeData = { ...profileData };
    delete safeData.id;
    delete safeData.app_user_id;
    delete safeData.created_at;

    const { data, error } = await supabase
      .from('farmer_profiles')
      .update(safeData)
      .eq('app_user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  },

  async requestBankChange(bankForm) {
    const { userId, farmerId } = await getAuthenticatedFarmer();
    const { data, error } = await supabase.from('bank_change_requests').insert({
      app_user_id: userId,
      farmer_id: farmerId,
      bank_name: bankForm.bank_name,
      account_number: bankForm.account_number,
      ifsc_code: bankForm.ifsc_code,
      status: 'pending'
    }).select().single();

    if (error) throw error;
    return { success: true, message: 'Bank change request submitted.', data };
  },

  // ─── CROPS ─────────────────────────────────────────────────
  async getCrops() {
    const { farmerId } = await getAuthenticatedFarmer();
    
    let query = supabase.from('crops').select('*').order('created_at', { ascending: false });
    if (farmerId) {
      query = query.eq('farmer_id', farmerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return data.map(c => ({
      ...c,
      crop_name: c.crop_name || `${c.crop_type} Field`,
      expected_harvest_date: c.harvest_date || c.expected_harvest_date,
      stage: c.status || 'Vegetative'
    }));
  },

  async registerCrop(cropData) {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) {
      throw new Error('Farmer profile not found. Please complete your registration.');
    }

    const newCrop = {
      farmer_id: farmerId, // strictly enforce authenticated farmer ID
      crop_type: cropData.crop_type,
      acres: parseFloat(cropData.acres) || 1,
      sowing_date: cropData.sowing_date || new Date().toISOString().split('T')[0],
      harvest_date: cropData.expected_harvest_date || null,
      status: cropData.status || 'Growing',
      notes: cropData.location || cropData.notes || 'Main Field'
    };

    const { data, error } = await supabase
      .from('crops')
      .insert([newCrop])
      .select()
      .single();

    if (error) throw error;
    return {
      success: true,
      crop: {
        ...data,
        crop_name: `${data.crop_type} Field`,
        expected_harvest_date: data.harvest_date,
        stage: data.status
      }
    };
  },

  // ─── SEEDS ─────────────────────────────────────────────────
  async getSeeds() {
    // Public catalog (active seeds available to any authenticated farmer)
    const { data, error } = await supabase
      .from('seeds')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    if (!data) return [];

    return data.map(s => ({
      ...s,
      image_url: s.image_url || CROP_FALLBACK_IMAGES[s.crop_type] || CROP_FALLBACK_IMAGES.default
    }));
  },

  async purchaseSeeds(purchaseData) {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) throw new Error('Farmer profile not found.');

    const { data, error } = await supabase
      .from('seed_purchases')
      .insert({
        farmer_id: farmerId, // strictly from session
        seed_id: purchaseData.seedId,
        quantity_kg: purchaseData.quantity,
        total_price: purchaseData.totalPrice,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return { 
      success: true, 
      orderId: `ORD-${data.id}`, 
      order: data,
      message: 'Order placed successfully!' 
    };
  },

  async getSeedPurchases() {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) return [];

    const { data, error } = await supabase
      .from('seed_purchases')
      .select('*, seeds(*)')
      .eq('farmer_id', farmerId) // strictly scoped
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ─── GRAIN SALES & MANDI RATES ────────────────────────────
  async getMarketRates() {
    // Public market rates
    const { data, error } = await supabase
      .from('market_rates')
      .select('*')
      .order('crop_type')
      .order('grade');

    if (error) throw error;
    return data || [];
  },

  async submitGrainSale(saleData) {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) throw new Error('Farmer profile not found.');

    const { data, error } = await supabase.from('grain_sales').insert({
      farmer_id: farmerId, // strictly from session
      crop_type: saleData.crop_type,
      grade: saleData.grade || 'A',
      quantity_kg: parseFloat(saleData.quantity_kg),
      price_per_kg: parseFloat(saleData.price_per_kg) || 0,
      status: 'pending'
    }).select().single();

    if (error) throw error;
    return { success: true, sale: data, message: 'Grain sale offer submitted successfully.' };
  },

  async getGrainSales() {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) return [];

    const { data, error } = await supabase
      .from('grain_sales')
      .select('*')
      .eq('farmer_id', farmerId) // strictly scoped
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ─── WAREHOUSES & BOOKINGS ────────────────────────────────
  async getWarehouses() {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getWarehouseSlots(warehouseId, date) {
    let query = supabase
      .from('warehouse_slots')
      .select('*')
      .order('start_time');

    if (warehouseId) query = query.eq('warehouse_id', warehouseId);
    if (date) query = query.eq('slot_date', date);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async bookDeliverySlot(bookingData) {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) throw new Error('Farmer profile not found.');

    const { data, error } = await supabase.rpc('create_booking_slot', {
      p_farmer_id: farmerId, // strictly from session
      p_booking_date: bookingData.booking_date,
      p_delivery_address: bookingData.delivery_address || 'Kalluru Farm',
      p_grain_type: bookingData.grain_type,
      p_warehouse_id: parseInt(bookingData.warehouse_id) || 1,
      p_quantity_kg: parseFloat(bookingData.quantity_kg),
      p_warehouse_slot_id: bookingData.warehouse_slot_id ? parseInt(bookingData.warehouse_slot_id) : null
    });

    if (error) throw error;
    return { success: true, booking: data };
  },

  async getBookingSlots() {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) return [];

    const { data, error } = await supabase
      .from('booking_slots')
      .select('*')
      .eq('farmer_id', farmerId) // strictly scoped
      .order('booking_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTransactions() {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) return [];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('farmer_id', farmerId) // strictly scoped
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getVisits() {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) return [];

    const { data, error } = await supabase
      .from('farm_visits')
      .select('*')
      .eq('farmer_id', farmerId) // strictly scoped
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getDashboard() {
    const { farmerId } = await getAuthenticatedFarmer();
    if (!farmerId) {
      return {
        activeCropsCount: 0,
        totalAcres: 0,
        pendingBookings: 0,
        recentEarnings: 0,
        crops: [],
        upcomingDeliveries: [],
        purchases: [],
        grainSales: []
      };
    }

    const [crops, bookings, purchases, grainSales] = await Promise.all([
      this.getCrops().catch(() => []),
      this.getBookingSlots().catch(() => []),
      this.getSeedPurchases().catch(() => []),
      this.getGrainSales().catch(() => [])
    ]);

    const activeCropsCount = crops.length;
    const totalAcres = crops.reduce((acc, c) => acc + (parseFloat(c.acres) || 0), 0);
    const pendingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
    const recentEarnings = grainSales
      .filter(s => s.status === 'approved' || s.status === 'completed')
      .reduce((acc, s) => acc + ((parseFloat(s.quantity_kg) || 0) * (parseFloat(s.price_per_kg) || 0)), 0);

    return {
      activeCropsCount,
      totalAcres,
      pendingBookings,
      recentEarnings,
      crops,
      upcomingDeliveries: bookings,
      purchases,
      grainSales
    };
  }
};

export default farmerService;
