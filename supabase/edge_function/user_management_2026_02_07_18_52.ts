import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  department: string
  branch_location: string
  phone: string
  employee_id: string
  status: string
  permissions: any
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

    const { action, email, password, role, userData } = await req.json()

    switch (action) {
      case 'login':
        return await handleLogin(supabaseClient, email, password)
      
      case 'get_user_profile':
        return await getUserProfile(supabaseClient, email)
      
      case 'get_all_users':
        return await getAllUsers(supabaseClient)
      
      case 'update_user_status':
        return await updateUserStatus(supabaseClient, email, userData.status)
      
      case 'get_users_by_role':
        return await getUsersByRole(supabaseClient, role)
      
      case 'verify_permissions':
        return await verifyPermissions(supabaseClient, email, userData.module, userData.action)
      
      case 'log_user_action':
        return await logUserAction(supabaseClient, userData)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleLogin(supabaseClient: any, email: string, password: string) {
  try {
    // First check if user exists in our user_profiles table
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
          error: 'User not found or inactive',
          message: 'Please contact administrator for account activation'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For demo purposes, we'll use a default password
    // In production, this should integrate with proper authentication
    const defaultPassword = 'BritiumExpress2026!'
    
    if (password !== defaultPassword) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid credentials',
          message: 'Incorrect password'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log successful login
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: userProfile.id,
        action: 'LOGIN',
        table_name: 'auth',
        new_values: { email, login_time: new Date().toISOString() }
      })

    return new Response(
      JSON.stringify({
        success: true,
        user: userProfile,
        message: 'Login successful',
        dashboard_url: getDashboardUrl(userProfile.role)
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function getUserProfile(supabaseClient: any, email: string) {
  try {
    const { data: userProfile, error } = await supabaseClient
      .from('user_profiles')
      .select(`
        *,
        user_permissions (
          module,
          permissions
        )
      `)
      .eq('email', email)
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, user: userProfile }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function getAllUsers(supabaseClient: any) {
  try {
    const { data: users, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .order('role', { ascending: true })
      .order('full_name', { ascending: true })

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Group users by role for better organization
    const usersByRole = users.reduce((acc: any, user: UserProfile) => {
      if (!acc[user.role]) {
        acc[user.role] = []
      }
      acc[user.role].push(user)
      return acc
    }, {})

    return new Response(
      JSON.stringify({ 
        success: true, 
        users,
        usersByRole,
        totalUsers: users.length,
        summary: generateUserSummary(users)
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function getUsersByRole(supabaseClient: any, role: string) {
  try {
    const { data: users, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('role', role)
      .eq('status', 'active')
      .order('full_name', { ascending: true })

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, users }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function updateUserStatus(supabaseClient: any, email: string, status: string) {
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('email', email)
      .select()

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, user: data[0] }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function verifyPermissions(supabaseClient: any, email: string, module: string, action: string) {
  try {
    const { data: userProfile, error } = await supabaseClient
      .from('user_profiles')
      .select(`
        *,
        user_permissions!inner (
          module,
          permissions
        )
      `)
      .eq('email', email)
      .eq('user_permissions.module', module)
      .single()

    if (error || !userProfile) {
      return new Response(
        JSON.stringify({ success: false, hasPermission: false }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const permissions = userProfile.user_permissions[0]?.permissions || {}
    const hasPermission = permissions[action] === true || userProfile.role === 'super_admin'

    return new Response(
      JSON.stringify({ success: true, hasPermission, permissions }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function logUserAction(supabaseClient: any, actionData: any) {
  try {
    const { data, error } = await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: actionData.user_id,
        action: actionData.action,
        table_name: actionData.table_name,
        record_id: actionData.record_id,
        old_values: actionData.old_values,
        new_values: actionData.new_values,
        ip_address: actionData.ip_address,
        user_agent: actionData.user_agent
      })

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Action logged successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

function getDashboardUrl(role: string): string {
  const dashboardUrls: { [key: string]: string } = {
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
  
  return dashboardUrls[role] || '/dashboard'
}

function generateUserSummary(users: UserProfile[]) {
  const summary = users.reduce((acc: any, user: UserProfile) => {
    // Count by role
    acc.byRole[user.role] = (acc.byRole[user.role] || 0) + 1
    
    // Count by department
    acc.byDepartment[user.department] = (acc.byDepartment[user.department] || 0) + 1
    
    // Count by branch
    acc.byBranch[user.branch_location] = (acc.byBranch[user.branch_location] || 0) + 1
    
    // Count by status
    acc.byStatus[user.status] = (acc.byStatus[user.status] || 0) + 1
    
    return acc
  }, {
    byRole: {},
    byDepartment: {},
    byBranch: {},
    byStatus: {}
  })
  
  return summary
}