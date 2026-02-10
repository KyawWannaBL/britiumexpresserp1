import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
}

interface AuthRequest {
  action: 'login' | 'register' | 'update_profile' | 'change_password' | 'get_user'
  firebase_uid?: string
  email?: string
  full_name?: string
  phone?: string
  role?: string
  user_data?: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, firebase_uid, email, full_name, phone, role, user_data } = await req.json() as AuthRequest

    switch (action) {
      case 'login': {
        if (!firebase_uid || !email) {
          return new Response(
            JSON.stringify({ error: 'Firebase UID and email are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if user exists in our database
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('firebase_uid', firebase_uid)
          .single()

        if (userError && userError.code !== 'PGRST116') {
          throw userError
        }

        if (existingUser) {
          // Update last login
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              last_login_at: new Date().toISOString(),
              status: 'active'
            })
            .eq('firebase_uid', firebase_uid)

          if (updateError) throw updateError

          return new Response(
            JSON.stringify({ 
              success: true, 
              user: existingUser,
              message: 'Login successful'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // Check if this is a predefined admin account
          const predefinedAdmins = [
            'md@britiumexpress.com',
            'sai@britiumexpress.com', 
            'gm@britiumexpress.com',
            'hod@britiumexpress.com'
          ]

          if (predefinedAdmins.includes(email)) {
            // Update the predefined admin with Firebase UID
            const { data: updatedUser, error: updateError } = await supabase
              .from('users')
              .update({ 
                firebase_uid,
                last_login_at: new Date().toISOString(),
                status: 'active'
              })
              .eq('email', email)
              .select()
              .single()

            if (updateError) throw updateError

            return new Response(
              JSON.stringify({ 
                success: true, 
                user: updatedUser,
                message: 'Admin login successful',
                force_password_change: updatedUser.force_password_change
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          } else {
            return new Response(
              JSON.stringify({ error: 'User not found. Please contact administrator.' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      }

      case 'register': {
        if (!firebase_uid || !email || !full_name) {
          return new Response(
            JSON.stringify({ error: 'Firebase UID, email, and full name are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            firebase_uid,
            email,
            full_name,
            phone,
            role: role || 'customer',
            status: 'active',
            last_login_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) throw createError

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: newUser,
            message: 'Registration successful'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update_profile': {
        if (!firebase_uid) {
          return new Response(
            JSON.stringify({ error: 'Firebase UID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const updateData: any = {}
        if (full_name) updateData.full_name = full_name
        if (phone) updateData.phone = phone
        if (user_data) Object.assign(updateData, user_data)
        
        updateData.updated_at = new Date().toISOString()

        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('firebase_uid', firebase_uid)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: updatedUser,
            message: 'Profile updated successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'change_password': {
        if (!firebase_uid) {
          return new Response(
            JSON.stringify({ error: 'Firebase UID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            password_changed_at: new Date().toISOString(),
            force_password_change: false,
            updated_at: new Date().toISOString()
          })
          .eq('firebase_uid', firebase_uid)

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Password changed successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get_user': {
        if (!firebase_uid) {
          return new Response(
            JSON.stringify({ error: 'Firebase UID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data: user, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            user_permissions (*),
            user_branch_assignments (
              *,
              branches (*)
            )
          `)
          .eq('firebase_uid', firebase_uid)
          .single()

        if (userError) throw userError

        return new Response(
          JSON.stringify({ 
            success: true, 
            user
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Auth function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})