import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
}

interface LoginRequest {
  email: string;
  password: string;
}

interface PasswordChangeRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  branch_location: string;
  phone: string;
  employee_id: string;
  status: string;
  must_change_password: boolean;
  first_login: boolean;
  last_login: string | null;
  permissions: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (method === 'POST') {
      const body = await req.json()

      switch (action) {
        case 'login': {
          const { email, password }: LoginRequest = body

          // Get user profile with password check
          const { data: userProfile, error: profileError } = await supabaseClient
            .from('user_profiles')
            .select('*')
            .eq('email', email)
            .eq('status', 'active')
            .single()

          if (profileError || !userProfile) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Invalid email or password',
                requiresPasswordChange: false
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401
              }
            )
          }

          // Check password (in production, use proper hashing)
          if (userProfile.password_hash !== password) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Invalid email or password',
                requiresPasswordChange: false
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401
              }
            )
          }

          // Update last login time
          await supabaseClient
            .from('user_profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', userProfile.id)

          // Check if password change is required
          const requiresPasswordChange = userProfile.must_change_password || userProfile.first_login

          // Get user permissions
          const { data: permissions } = await supabaseClient
            .from('user_permissions')
            .select('module, permissions')
            .eq('user_id', userProfile.id)

          const userPermissions = permissions?.reduce((acc, perm) => {
            acc[perm.module] = perm.permissions
            return acc
          }, {} as Record<string, any>) || {}

          return new Response(
            JSON.stringify({
              success: true,
              user: {
                id: userProfile.id,
                email: userProfile.email,
                fullName: userProfile.full_name,
                role: userProfile.role,
                department: userProfile.department,
                branchLocation: userProfile.branch_location,
                phone: userProfile.phone,
                employeeId: userProfile.employee_id,
                permissions: userPermissions,
                mustChangePassword: userProfile.must_change_password,
                firstLogin: userProfile.first_login
              },
              requiresPasswordChange,
              dashboardUrl: getDashboardUrl(userProfile.role)
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
        }

        case 'change-password': {
          const { email, oldPassword, newPassword }: PasswordChangeRequest = body

          // Validate new password
          if (!newPassword || newPassword.length < 8) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'New password must be at least 8 characters long' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
              }
            )
          }

          // Get user profile
          const { data: userProfile, error: profileError } = await supabaseClient
            .from('user_profiles')
            .select('*')
            .eq('email', email)
            .eq('status', 'active')
            .single()

          if (profileError || !userProfile) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'User not found' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404
              }
            )
          }

          // Check old password
          if (userProfile.password_hash !== oldPassword) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Current password is incorrect' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401
              }
            )
          }

          // Update password and reset flags
          const { error: updateError } = await supabaseClient
            .from('user_profiles')
            .update({
              password_hash: newPassword,
              must_change_password: false,
              first_login: false,
              last_password_change: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', userProfile.id)

          if (updateError) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Failed to update password' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            )
          }

          // Log password change
          await supabaseClient
            .from('password_changes')
            .insert({
              user_id: userProfile.id,
              old_password_hash: oldPassword,
              new_password_hash: newPassword,
              reason: userProfile.first_login ? 'first_login_change' : 'user_initiated'
            })

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Password updated successfully',
              dashboardUrl: getDashboardUrl(userProfile.role)
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
        }

        case 'check-password-requirement': {
          const { email } = body

          const { data: userProfile, error } = await supabaseClient
            .from('user_profiles')
            .select('must_change_password, first_login')
            .eq('email', email)
            .eq('status', 'active')
            .single()

          if (error || !userProfile) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'User not found' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404
              }
            )
          }

          return new Response(
            JSON.stringify({
              success: true,
              requiresPasswordChange: userProfile.must_change_password || userProfile.first_login
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
        }

        default:
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid action' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400
            }
          )
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Helper function to get dashboard URL based on role
function getDashboardUrl(role: string): string {
  const dashboardMap: Record<string, string> = {
    'super_admin': '/admin/dashboard',
    'admin': '/admin/dashboard',
    'manager': '/manager/dashboard',
    'accountant': '/accounting/dashboard',
    'warehouse': '/warehouse/dashboard',
    'rider': '/rider/dashboard',
    'customer_service': '/customer-service/dashboard',
    'marketer': '/marketer/dashboard',
    'hr': '/hr/dashboard',
    'qa': '/qa/dashboard',
    'dispatch': '/dispatch/dashboard',
    'bi_analyst': '/bi/dashboard'
  }
  
  return dashboardMap[role] || '/dashboard'
}