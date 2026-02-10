import { supabase } from '@/integrations/supabase/client';

// Types for Warehouse System
export interface WarehouseStation {
  id: string;
  station_code: string;
  station_name: string;
  station_name_my?: string;
  address?: string;
  phone?: string;
  manager_name?: string;
  capacity: number;
  zone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WarehouseUser {
  id: string;
  user_id?: string;
  employee_code: string;
  full_name: string;
  full_name_my?: string;
  phone?: string;
  email?: string;
  role: 'warehouse_manager' | 'supervisor' | 'scanner' | 'sorter' | 'loader';
  station_id: string;
  shift?: 'morning' | 'afternoon' | 'night';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WarehouseParcel {
  id: string;
  tracking_number: string;
  qr_code: string;
  barcode?: string;
  
  // Sender Information
  sender_name: string;
  sender_phone?: string;
  sender_address?: string;
  
  // Receiver Information
  receiver_name: string;
  receiver_phone?: string;
  receiver_address?: string;
  
  // Package Details
  weight_kg?: number;
  dimensions?: string;
  package_type?: string;
  service_type?: string;
  cod_amount: number;
  declared_value: number;
  
  // Status and Location
  status: string;
  current_station_id?: string;
  sort_bin?: string;
  route_code?: string;
  manifest_id?: string;
  
  // Special Instructions
  special_instructions?: string;
  is_fragile: boolean;
  requires_signature: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  expected_delivery_date?: string;
  
  // Customer Acknowledgment
  customer_signature_url?: string;
  delivery_photo_url?: string;
  delivery_notes?: string;
}

export interface WarehouseOperation {
  id: string;
  operation_type: 'scan_in' | 'scan_out' | 'sort' | 'load' | 'unload' | 'transfer';
  parcel_id: string;
  station_id: string;
  user_id: string;
  
  // QR Code Scanning Details
  qr_code_scanned?: string;
  scan_method?: 'qr_scanner' | 'manual_entry' | 'barcode';
  scan_location?: string;
  
  // Operation Details
  from_status?: string;
  to_status?: string;
  from_location?: string;
  to_location?: string;
  sort_bin?: string;
  route_code?: string;
  
  // Additional Data
  notes?: string;
  photo_url?: string;
  signature_url?: string;
  
  // Timestamps
  created_at: string;
  
  // Mobile App Integration
  device_info?: any;
  gps_location?: any;
}

export interface WarehouseManifest {
  id: string;
  manifest_number: string;
  manifest_type: 'delivery' | 'transfer' | 'return';
  
  // Station Information
  origin_station_id: string;
  destination_station_id?: string;
  route_code?: string;
  
  // Vehicle and Driver
  vehicle_number?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_license?: string;
  
  // Status and Tracking
  status: 'draft' | 'finalized' | 'dispatched' | 'arrived' | 'completed';
  total_parcels: number;
  total_weight_kg: number;
  total_cod_amount: number;
  
  // QR Code for Manifest
  manifest_qr_code?: string;
  
  // Timestamps
  created_at: string;
  finalized_at?: string;
  dispatched_at?: string;
  arrived_at?: string;
  completed_at?: string;
  
  // Created by
  created_by: string;
}

export interface QRCode {
  id: string;
  qr_code: string;
  qr_type: 'parcel' | 'manifest' | 'station' | 'user';
  reference_id: string;
  reference_table: string;
  qr_data?: any;
  qr_image_url?: string;
  scan_count: number;
  last_scanned_at?: string;
  last_scanned_by?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface CustomerAcknowledgment {
  id: string;
  parcel_id: string;
  acknowledgment_type: 'pickup_received' | 'delivery_received' | 'damage_report';
  customer_name?: string;
  customer_phone?: string;
  customer_signature_url?: string;
  customer_photo_url?: string;
  delivery_location?: string;
  delivery_photo_url?: string;
  delivery_notes?: string;
  delivered_by?: string;
  delivery_method?: string;
  device_info?: any;
  gps_location?: any;
  app_version?: string;
  acknowledged_at: string;
  created_at: string;
}

// Warehouse API Class
export class WarehouseAPI {
  // Get warehouse user profile
  static async getWarehouseUser(userId?: string): Promise<WarehouseUser | null> {
    try {
      const { data, error } = await supabase
        .from('warehouse_users_2026_02_04_15_54')
        .select('*')
        .eq('user_id', userId || (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching warehouse user:', error);
      return null;
    }
  }

  // Get warehouse station
  static async getWarehouseStation(stationId: string): Promise<WarehouseStation | null> {
    try {
      const { data, error } = await supabase
        .from('warehouse_stations_2026_02_04_15_54')
        .select('*')
        .eq('id', stationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching warehouse station:', error);
      return null;
    }
  }

  // Get all stations
  static async getAllStations(): Promise<WarehouseStation[]> {
    try {
      const { data, error } = await supabase
        .from('warehouse_stations_2026_02_04_15_54')
        .select('*')
        .eq('is_active', true)
        .order('station_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stations:', error);
      return [];
    }
  }

  // Scan QR Code
  static async scanQRCode(qrCode: string): Promise<{
    success: boolean;
    data?: WarehouseParcel | WarehouseManifest;
    type?: string;
    message?: string;
  }> {
    try {
      // First, check if it's a valid QR code
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes_2026_02_04_15_54')
        .select('*')
        .eq('qr_code', qrCode)
        .eq('is_active', true)
        .single();

      if (qrError || !qrData) {
        return { success: false, message: 'Invalid or expired QR code' };
      }

      // Update scan count
      await supabase
        .from('qr_codes_2026_02_04_15_54')
        .update({
          scan_count: qrData.scan_count + 1,
          last_scanned_at: new Date().toISOString(),
          last_scanned_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', qrData.id);

      // Get the referenced data
      if (qrData.qr_type === 'parcel') {
        const { data: parcelData, error: parcelError } = await supabase
          .from('warehouse_parcels_2026_02_04_15_54')
          .select('*')
          .eq('id', qrData.reference_id)
          .single();

        if (parcelError) throw parcelError;
        return { success: true, data: parcelData, type: 'parcel' };
      } else if (qrData.qr_type === 'manifest') {
        const { data: manifestData, error: manifestError } = await supabase
          .from('warehouse_manifests_2026_02_04_15_54')
          .select('*')
          .eq('id', qrData.reference_id)
          .single();

        if (manifestError) throw manifestError;
        return { success: true, data: manifestData, type: 'manifest' };
      }

      return { success: false, message: 'Unsupported QR code type' };
    } catch (error) {
      console.error('Error scanning QR code:', error);
      return { success: false, message: 'Failed to scan QR code' };
    }
  }

  // Get parcels by station
  static async getParcelsByStation(stationId: string, status?: string): Promise<WarehouseParcel[]> {
    try {
      let query = supabase
        .from('warehouse_parcels_2026_02_04_15_54')
        .select('*')
        .eq('current_station_id', stationId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching parcels:', error);
      return [];
    }
  }

  // Update parcel status with operation logging
  static async updateParcelStatus(
    parcelId: string,
    newStatus: string,
    operationType: WarehouseOperation['operation_type'],
    additionalData?: {
      sortBin?: string;
      routeCode?: string;
      notes?: string;
      scanMethod?: string;
      scanLocation?: string;
      qrCodeScanned?: string;
    }
  ): Promise<boolean> {
    try {
      const user = await this.getWarehouseUser();
      if (!user) throw new Error('User not found');

      // Get current parcel data
      const { data: currentParcel, error: parcelError } = await supabase
        .from('warehouse_parcels_2026_02_04_15_54')
        .select('*')
        .eq('id', parcelId)
        .single();

      if (parcelError) throw parcelError;

      // Update parcel
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (additionalData?.sortBin) updateData.sort_bin = additionalData.sortBin;
      if (additionalData?.routeCode) updateData.route_code = additionalData.routeCode;

      const { error: updateError } = await supabase
        .from('warehouse_parcels_2026_02_04_15_54')
        .update(updateData)
        .eq('id', parcelId);

      if (updateError) throw updateError;

      // Log operation
      await supabase
        .from('warehouse_operations_2026_02_04_15_54')
        .insert([{
          operation_type: operationType,
          parcel_id: parcelId,
          station_id: user.station_id,
          user_id: user.id,
          qr_code_scanned: additionalData?.qrCodeScanned,
          scan_method: additionalData?.scanMethod || 'manual_entry',
          scan_location: additionalData?.scanLocation,
          from_status: currentParcel.status,
          to_status: newStatus,
          sort_bin: additionalData?.sortBin,
          route_code: additionalData?.routeCode,
          notes: additionalData?.notes
        }]);

      return true;
    } catch (error) {
      console.error('Error updating parcel status:', error);
      return false;
    }
  }

  // Get warehouse operations
  static async getOperations(stationId: string, limit = 50): Promise<WarehouseOperation[]> {
    try {
      const { data, error } = await supabase
        .from('warehouse_operations_2026_02_04_15_54')
        .select('*')
        .eq('station_id', stationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching operations:', error);
      return [];
    }
  }

  // Create manifest
  static async createManifest(manifestData: Omit<WarehouseManifest, 'id' | 'created_at' | 'manifest_number'>): Promise<string | null> {
    try {
      const user = await this.getWarehouseUser();
      if (!user) throw new Error('User not found');

      // Generate manifest number
      const manifestNumber = `MF${Date.now()}`;
      const manifestQRCode = `QR_${manifestNumber}`;

      const { data, error } = await supabase
        .from('warehouse_manifests_2026_02_04_15_54')
        .insert([{
          ...manifestData,
          manifest_number: manifestNumber,
          manifest_qr_code: manifestQRCode,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Create QR code entry
      await supabase
        .from('qr_codes_2026_02_04_15_54')
        .insert([{
          qr_code: manifestQRCode,
          qr_type: 'manifest',
          reference_id: data.id,
          reference_table: 'warehouse_manifests_2026_02_04_15_54',
          qr_data: {
            manifest_number: manifestNumber,
            type: 'manifest',
            created_at: data.created_at
          }
        }]);

      return data.id;
    } catch (error) {
      console.error('Error creating manifest:', error);
      return null;
    }
  }

  // Get manifests by station
  static async getManifestsByStation(stationId: string): Promise<WarehouseManifest[]> {
    try {
      const { data, error } = await supabase
        .from('warehouse_manifests_2026_02_04_15_54')
        .select('*')
        .eq('origin_station_id', stationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching manifests:', error);
      return [];
    }
  }

  // Add parcel to manifest
  static async addParcelToManifest(manifestId: string, parcelId: string): Promise<boolean> {
    try {
      const user = await this.getWarehouseUser();
      if (!user) throw new Error('User not found');

      // Add to manifest items
      const { error: itemError } = await supabase
        .from('warehouse_manifest_items_2026_02_04_15_54')
        .insert([{
          manifest_id: manifestId,
          parcel_id: parcelId,
          scanned_at: new Date().toISOString(),
          scanned_by: user.id
        }]);

      if (itemError) throw itemError;

      // Update parcel manifest_id
      const { error: parcelError } = await supabase
        .from('warehouse_parcels_2026_02_04_15_54')
        .update({
          manifest_id: manifestId,
          status: 'manifested',
          updated_at: new Date().toISOString()
        })
        .eq('id', parcelId);

      if (parcelError) throw parcelError;

      return true;
    } catch (error) {
      console.error('Error adding parcel to manifest:', error);
      return false;
    }
  }

  // Create customer acknowledgment
  static async createCustomerAcknowledgment(acknowledgmentData: Omit<CustomerAcknowledgment, 'id' | 'created_at' | 'acknowledged_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_acknowledgments_2026_02_04_15_54')
        .insert([acknowledgmentData]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating customer acknowledgment:', error);
      return false;
    }
  }

  // Get warehouse statistics
  static async getWarehouseStats(stationId: string): Promise<{
    totalParcels: number;
    inbound: number;
    sorting: number;
    sorted: number;
    manifested: number;
    outbound: number;
    todayOperations: number;
  }> {
    try {
      // Get parcel counts by status
      const { data: parcels } = await supabase
        .from('warehouse_parcels_2026_02_04_15_54')
        .select('status')
        .eq('current_station_id', stationId);

      // Get today's operations count
      const today = new Date().toISOString().split('T')[0];
      const { data: operations } = await supabase
        .from('warehouse_operations_2026_02_04_15_54')
        .select('id')
        .eq('station_id', stationId)
        .gte('created_at', today + 'T00:00:00.000Z')
        .lt('created_at', today + 'T23:59:59.999Z');

      const stats = {
        totalParcels: parcels?.length || 0,
        inbound: parcels?.filter(p => p.status === 'inbound_received').length || 0,
        sorting: parcels?.filter(p => p.status === 'sorting').length || 0,
        sorted: parcels?.filter(p => p.status === 'sorted').length || 0,
        manifested: parcels?.filter(p => p.status === 'manifested').length || 0,
        outbound: parcels?.filter(p => p.status === 'out_for_delivery').length || 0,
        todayOperations: operations?.length || 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching warehouse stats:', error);
      return {
        totalParcels: 0,
        inbound: 0,
        sorting: 0,
        sorted: 0,
        manifested: 0,
        outbound: 0,
        todayOperations: 0
      };
    }
  }
}

export default WarehouseAPI;