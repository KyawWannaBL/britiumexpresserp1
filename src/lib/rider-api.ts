import { supabase } from '@/integrations/supabase/client';

// Types for Rider System
export interface Rider {
  id: string;
  user_id?: string;
  rider_code: string;
  full_name: string;
  phone: string;
  email?: string;
  nrc_number?: string;
  address?: string;
  emergency_contact?: string;
  vehicle_type: string;
  vehicle_number?: string;
  license_number?: string;
  zone: string;
  status: 'active' | 'inactive' | 'suspended';
  duty_status: 'on_duty' | 'off_duty' | 'break';
  rating: number;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  cod_balance: number;
  wallet_balance: number;
  today_earnings: number;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RiderTask {
  id: string;
  task_code: string;
  rider_id: string;
  type: 'pickup' | 'delivery' | 'return';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'normal' | 'express' | 'urgent';
  customer_name: string;
  customer_phone: string;
  pickup_address?: string;
  delivery_address: string;
  cod_amount: number;
  delivery_fee: number;
  sla_time?: string;
  notes?: string;
  special_instructions?: string;
  is_fragile: boolean;
  weight_kg?: number;
  dimensions?: string;
  proof_photo_url?: string;
  signature_data?: string;
  completion_notes?: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RiderTransaction {
  id: string;
  rider_id: string;
  task_id?: string;
  transaction_type: 'cod_collection' | 'delivery_fee' | 'cod_remittance' | 'wallet_withdrawal' | 'bonus' | 'penalty';
  amount: number;
  description: string;
  reference_number?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface RiderLocation {
  id: string;
  rider_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  battery_level?: number;
  is_online: boolean;
  created_at: string;
}

export interface RiderNotification {
  id: string;
  rider_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'task_assigned' | 'payment';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// Rider API Class
export class RiderAPI {
  // Get rider profile by user ID
  static async getRiderProfile(userId?: string): Promise<Rider | null> {
    try {
      const { data, error } = await supabase
        .from('riders_2026_02_04_14_23')
        .select('*')
        .eq('user_id', userId || (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching rider profile:', error);
      return null;
    }
  }

  // Update rider profile
  static async updateRiderProfile(riderId: string, updates: Partial<Rider>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('riders_2026_02_04_14_23')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', riderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating rider profile:', error);
      return false;
    }
  }

  // Update duty status
  static async updateDutyStatus(riderId: string, dutyStatus: 'on_duty' | 'off_duty' | 'break'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('riders_2026_02_04_14_23')
        .update({ duty_status: dutyStatus, updated_at: new Date().toISOString() })
        .eq('id', riderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating duty status:', error);
      return false;
    }
  }

  // Get rider tasks
  static async getRiderTasks(riderId: string, status?: string, type?: string): Promise<RiderTask[]> {
    try {
      let query = supabase
        .from('rider_tasks_2026_02_04_14_23')
        .select('*')
        .eq('rider_id', riderId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching rider tasks:', error);
      return [];
    }
  }

  // Get single task
  static async getTask(taskId: string): Promise<RiderTask | null> {
    try {
      const { data, error } = await supabase
        .from('rider_tasks_2026_02_04_14_23')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  }

  // Update task status
  static async updateTaskStatus(
    taskId: string, 
    status: RiderTask['status'], 
    updates?: Partial<RiderTask>
  ): Promise<boolean> {
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString(),
        ...updates
      };

      // Set timestamps based on status
      if (status === 'in_progress' && !updates?.started_at) {
        updateData.started_at = new Date().toISOString();
      } else if (status === 'completed' && !updates?.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('rider_tasks_2026_02_04_14_23')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  }

  // Get rider transactions
  static async getRiderTransactions(riderId: string, limit = 50): Promise<RiderTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('rider_transactions_2026_02_04_14_23')
        .select('*')
        .eq('rider_id', riderId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching rider transactions:', error);
      return [];
    }
  }

  // Add transaction
  static async addTransaction(transaction: Omit<RiderTransaction, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rider_transactions_2026_02_04_14_23')
        .insert([transaction]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  }

  // Update rider location
  static async updateLocation(riderId: string, location: Omit<RiderLocation, 'id' | 'rider_id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rider_locations_2026_02_04_14_23')
        .insert([{ rider_id: riderId, ...location }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      return false;
    }
  }

  // Get rider notifications
  static async getNotifications(riderId: string, unreadOnly = false): Promise<RiderNotification[]> {
    try {
      let query = supabase
        .from('rider_notifications_2026_02_04_14_23')
        .select('*')
        .eq('rider_id', riderId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markNotificationRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rider_notifications_2026_02_04_14_23')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Get rider statistics
  static async getRiderStats(riderId: string): Promise<{
    pending: number;
    completed: number;
    failed: number;
    cod: number;
    todayEarnings: number;
  }> {
    try {
      // Get task counts
      const { data: tasks } = await supabase
        .from('rider_tasks_2026_02_04_14_23')
        .select('status, cod_amount')
        .eq('rider_id', riderId);

      // Get today's earnings
      const today = new Date().toISOString().split('T')[0];
      const { data: transactions } = await supabase
        .from('rider_transactions_2026_02_04_14_23')
        .select('amount, transaction_type')
        .eq('rider_id', riderId)
        .gte('created_at', today + 'T00:00:00.000Z')
        .lt('created_at', today + 'T23:59:59.999Z');

      const stats = {
        pending: tasks?.filter(t => ['pending', 'assigned', 'in_progress'].includes(t.status)).length || 0,
        completed: tasks?.filter(t => t.status === 'completed').length || 0,
        failed: tasks?.filter(t => t.status === 'failed').length || 0,
        cod: tasks?.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.cod_amount || 0), 0) || 0,
        todayEarnings: transactions?.filter(t => t.transaction_type === 'delivery_fee').reduce((sum, t) => sum + t.amount, 0) || 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching rider stats:', error);
      return { pending: 0, completed: 0, failed: 0, cod: 0, todayEarnings: 0 };
    }
  }

  // Complete delivery with proof
  static async completeDelivery(
    taskId: string,
    proofData: {
      proofPhotoUrl?: string;
      signatureData?: string;
      completionNotes?: string;
      codCollected?: boolean;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rider_tasks_2026_02_04_14_23')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          proof_photo_url: proofData.proofPhotoUrl,
          signature_data: proofData.signatureData,
          completion_notes: proofData.completionNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      // If COD was collected, add transaction
      if (proofData.codCollected) {
        const task = await this.getTask(taskId);
        if (task && task.cod_amount > 0) {
          await this.addTransaction({
            rider_id: task.rider_id,
            task_id: taskId,
            transaction_type: 'cod_collection',
            amount: task.cod_amount,
            description: `COD collected from ${task.customer_name} - Order ${task.task_code}`,
            reference_number: `COD-${task.task_code}`,
            status: 'completed'
          });

          // Add delivery fee transaction
          if (task.delivery_fee > 0) {
            await this.addTransaction({
              rider_id: task.rider_id,
              task_id: taskId,
              transaction_type: 'delivery_fee',
              amount: task.delivery_fee,
              description: `Delivery fee earned - Order ${task.task_code}`,
              reference_number: `FEE-${task.task_code}`,
              status: 'completed'
            });
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error completing delivery:', error);
      return false;
    }
  }

  // Report failed delivery
  static async reportFailedDelivery(
    taskId: string,
    reason: string,
    notes?: string,
    proofPhotoUrl?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rider_tasks_2026_02_04_14_23')
        .update({
          status: 'failed',
          completion_notes: `Failed: ${reason}. ${notes || ''}`,
          proof_photo_url: proofPhotoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reporting failed delivery:', error);
      return false;
    }
  }
}

export default RiderAPI;