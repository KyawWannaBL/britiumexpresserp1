-- Recreate Britium Express User Accounts with New Specifications
-- Default Password: P@ssw0rd1
-- Password must be changed after first login

-- Clear existing user data
TRUNCATE public.user_profiles CASCADE;
TRUNCATE public.user_permissions CASCADE;

-- Add password change tracking columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Insert updated user accounts with new names and specifications
INSERT INTO public.user_profiles (email, full_name, role, department, branch_location, phone, employee_id, permissions, password_hash, must_change_password, first_login) VALUES

-- SUPER ADMIN ACCOUNT (1)
('md@britiumexpress.com', 'Ko Kyaw Wanna', 'super_admin', 'Executive Management', 'Head Office - Yangon', '+95-9-111111111', 'SA001', 
 '{"all_modules": true, "system_config": true, "user_management": true, "financial_reports": true, "audit_logs": true}', 
 'P@ssw0rd1', true, true),

-- ADMIN ACCOUNTS (3)
('sai@britiumexpress.com', 'Ko Nyan Win Htun', 'admin', 'Operations', 'Head Office - Yangon', '+95-9-222222221', 'AD001', 
 '{"user_management": true, "operations": true, "reports": true, "settings": true, "bulk_upload": true}', 
 'P@ssw0rd1', true, true),

('gm@britiumexpress.com', 'Ma Moe Myint San', 'admin', 'General Management', 'Head Office - Yangon', '+95-9-222222222', 'AD002', 
 '{"user_management": true, "operations": true, "reports": true, "branch_management": true}', 
 'P@ssw0rd1', true, true),

('hod@britiumexpress.com', 'Ko Zun Min Htwe', 'admin', 'Head of Department', 'Head Office - Yangon', '+95-9-222222223', 'AD003', 
 '{"user_management": true, "operations": true, "reports": true, "department_management": true}', 
 'P@ssw0rd1', true, true),

-- BRANCH MANAGER ACCOUNTS (5)
('manager.yangon@britiumexpress.com', 'Ko Kyaw Soe Naing', 'manager', 'Branch Management', 'Yangon Main Branch', '+95-9-333333331', 'BM001', 
 '{"branch_operations": true, "staff_management": true, "local_reports": true, "customer_service": true}', 
 'P@ssw0rd1', true, true),

('manager.mandalay@britiumexpress.com', 'Ma Khin Mar Aye', 'manager', 'Branch Management', 'Mandalay Branch', '+95-9-333333332', 'BM002', 
 '{"branch_operations": true, "staff_management": true, "local_reports": true, "regional_coordination": true}', 
 'P@ssw0rd1', true, true),

('manager.naypyitaw@britiumexpress.com', 'Ko Thiha', 'manager', 'Branch Management', 'Nay Pyi Taw Branch', '+95-9-333333333', 'BM003', 
 '{"branch_operations": true, "staff_management": true, "government_services": true, "vip_handling": true}', 
 'P@ssw0rd1', true, true),

('manager.bago@britiumexpress.com', 'Ma Nilar Win', 'manager', 'Branch Management', 'Bago Branch', '+95-9-333333334', 'BM004', 
 '{"branch_operations": true, "staff_management": true, "rural_logistics": true}', 
 'P@ssw0rd1', true, true),

('manager.mawlamyine@britiumexpress.com', 'Ko Aung Naing Win', 'manager', 'Branch Management', 'Mawlamyine Branch', '+95-9-333333335', 'BM005', 
 '{"branch_operations": true, "staff_management": true, "port_coordination": true}', 
 'P@ssw0rd1', true, true),

-- ACCOUNTANT ACCOUNTS (3)
('sr_accountant@britiumexpress.com', 'Ma Moe Moe Khaing', 'accountant', 'Finance', 'Head Office - Yangon', '+95-9-444444441', 'AC001', 
 '{"financial_management": true, "reports": true, "voucher_management": true, "audit_support": true}', 
 'P@ssw0rd1', true, true),

('cashier1_ygn@britiumexpress.com', 'Ma Shwe Poe Eain', 'accountant', 'Finance', 'Yangon Main Branch', '+95-9-444444442', 'AC002', 
 '{"branch_accounting": true, "daily_reports": true, "cash_management": true}', 
 'P@ssw0rd1', true, true),

('cashier2_ygn@britiumexpress.com', 'Ma Zar', 'accountant', 'Finance', 'Yangon Main Branch', '+95-9-444444443', 'AC003', 
 '{"branch_accounting": true, "cash_handling": true, "daily_transactions": true}', 
 'P@ssw0rd1', true, true),

-- WAREHOUSE STAFF ACCOUNTS (3)
('warehouse.yangon@britiumexpress.com', 'Ko Thura Aung', 'warehouse', 'Warehouse Operations', 'Yangon Warehouse', '+95-9-555555551', 'WH001', 
 '{"warehouse_operations": true, "inventory_management": true, "qr_scanning": true, "sorting": true}', 
 'P@ssw0rd1', true, true),

('warehouse.mandalay@britiumexpress.com', 'Ko Myo Min Thant', 'warehouse', 'Warehouse Operations', 'Mandalay Warehouse', '+95-9-555555552', 'WH002', 
 '{"warehouse_operations": true, "inventory_management": true, "regional_distribution": true}', 
 'P@ssw0rd1', true, true),

('warehouse.supervisor@britiumexpress.com', 'Ma Khaing Zar Chi', 'warehouse', 'Warehouse Operations', 'Head Warehouse - Yangon', '+95-9-555555553', 'WHS001', 
 '{"warehouse_supervision": true, "staff_management": true, "quality_control": true, "reporting": true}', 
 'P@ssw0rd1', true, true),

-- RIDER ACCOUNTS (4)
('rider.yangon01@britiumexpress.com', 'Ko Aung Myo Thant', 'rider', 'Delivery', 'Yangon Zone 1', '+95-9-666666661', 'RD001', 
 '{"delivery_operations": true, "mobile_app": true, "customer_interaction": true, "cash_collection": true}', 
 'P@ssw0rd1', true, true),

('rider.yangon02@britiumexpress.com', 'Ko Zin Min Htet', 'rider', 'Delivery', 'Yangon Zone 2', '+95-9-666666662', 'RD002', 
 '{"delivery_operations": true, "mobile_app": true, "route_optimization": true}', 
 'P@ssw0rd1', true, true),

('rider.mandalay01@britiumexpress.com', 'Ko Thant Sin Aung', 'rider', 'Delivery', 'Mandalay Zone 1', '+95-9-666666663', 'RD003', 
 '{"delivery_operations": true, "mobile_app": true, "regional_delivery": true}', 
 'P@ssw0rd1', true, true),

('rider.supervisor@britiumexpress.com', 'Ko Kyaw Zin Latt', 'rider', 'Delivery', 'Head Office - Yangon', '+95-9-666666664', 'RDS001', 
 '{"rider_supervision": true, "route_planning": true, "performance_monitoring": true, "training": true}', 
 'P@ssw0rd1', true, true),

-- CUSTOMER SERVICE ACCOUNTS (3)
('cs.head@britiumexpress.com', 'Ma Ei Thandar Aung', 'customer_service', 'Customer Service', 'Head Office - Yangon', '+95-9-777777771', 'CS001', 
 '{"customer_support": true, "complaint_management": true, "service_quality": true, "training": true}', 
 'P@ssw0rd1', true, true),

('cs.yangon@britiumexpress.com', 'Ma Hnin Thway Thway', 'customer_service', 'Customer Service', 'Yangon Call Center', '+95-9-777777772', 'CS002', 
 '{"customer_support": true, "call_handling": true, "ticket_management": true}', 
 'P@ssw0rd1', true, true),

('cs.mandalay@britiumexpress.com', 'Ko Htet Aung Kyaw', 'customer_service', 'Customer Service', 'Mandalay Branch', '+95-9-777777773', 'CS003', 
 '{"customer_support": true, "regional_support": true, "local_language_support": true}', 
 'P@ssw0rd1', true, true),

-- MARKETING ACCOUNTS (3)
('marketing.head@britiumexpress.com', 'Ko Wai Yan Aung', 'marketer', 'Marketing', 'Head Office - Yangon', '+95-9-888888881', 'MK001', 
 '{"marketing_campaigns": true, "analytics": true, "social_media": true, "partnerships": true}', 
 'P@ssw0rd1', true, true),

('marketing.digital@britiumexpress.com', 'Ma Shwe Yi Mon', 'marketer', 'Marketing', 'Head Office - Yangon', '+95-9-888888882', 'MK002', 
 '{"digital_marketing": true, "content_creation": true, "seo": true, "online_advertising": true}', 
 'P@ssw0rd1', true, true),

('marketing.regional@britiumexpress.com', 'Ko Nay Lin Aung', 'marketer', 'Marketing', 'Regional Offices', '+95-9-888888883', 'MK003', 
 '{"regional_marketing": true, "local_partnerships": true, "event_management": true}', 
 'P@ssw0rd1', true, true),

-- HR ACCOUNTS (2)
('hr.head@britiumexpress.com', 'Ma Khin Sandar Win', 'hr', 'Human Resources', 'Head Office - Yangon', '+95-9-999999991', 'HR001', 
 '{"hr_management": true, "recruitment": true, "payroll": true, "employee_relations": true}', 
 'P@ssw0rd1', true, true),

('hr.recruitment@britiumexpress.com', 'Ko Thura Zaw', 'hr', 'Human Resources', 'Head Office - Yangon', '+95-9-999999992', 'HR002', 
 '{"recruitment": true, "onboarding": true, "training_coordination": true}', 
 'P@ssw0rd1', true, true),

-- QA ACCOUNTS (2)
('qa.head@britiumexpress.com', 'Ma Myat Noe Khin', 'qa', 'Quality Assurance', 'Head Office - Yangon', '+95-9-101010101', 'QA001', 
 '{"quality_control": true, "testing": true, "process_improvement": true, "compliance": true}', 
 'P@ssw0rd1', true, true),

('qa.operations@britiumexpress.com', 'Ko Aung Thiha', 'qa', 'Quality Assurance', 'Operations Center', '+95-9-101010102', 'QA002', 
 '{"operational_qa": true, "service_monitoring": true, "customer_feedback": true}', 
 'P@ssw0rd1', true, true),

-- DISPATCH CONTROLLER ACCOUNTS (2)
('dispatch.head@britiumexpress.com', 'Ko Zaw Win Naing', 'dispatch', 'Dispatch Control', 'Control Center - Yangon', '+95-9-121212121', 'DC001', 
 '{"dispatch_control": true, "route_optimization": true, "real_time_tracking": true, "emergency_response": true}', 
 'P@ssw0rd1', true, true),

('dispatch.night@britiumexpress.com', 'Ma Thant Zin Moe', 'dispatch', 'Dispatch Control', 'Control Center - Yangon', '+95-9-121212122', 'DC002', 
 '{"night_operations": true, "emergency_dispatch": true, "24_7_monitoring": true}', 
 'P@ssw0rd1', true, true),

-- BUSINESS INTELLIGENCE ACCOUNTS (2)
('bi.analyst@britiumexpress.com', 'Ko Hein Htet Aung', 'bi_analyst', 'Business Intelligence', 'Head Office - Yangon', '+95-9-131313131', 'BI001', 
 '{"data_analysis": true, "reporting": true, "dashboard_management": true, "predictive_analytics": true}', 
 'P@ssw0rd1', true, true),

('bi.senior@britiumexpress.com', 'Ma Aye Chan Myae', 'bi_analyst', 'Business Intelligence', 'Head Office - Yangon', '+95-9-131313132', 'BI002', 
 '{"advanced_analytics": true, "machine_learning": true, "strategic_insights": true, "executive_reporting": true}', 
 'P@ssw0rd1', true, true);

-- Create detailed permissions for each user and module
INSERT INTO public.user_permissions (user_id, module, permissions) 
SELECT 
    up.id,
    'dashboard',
    CASE 
        WHEN up.role = 'super_admin' THEN '{"view": true, "edit": true, "delete": true, "export": true, "admin": true}'
        WHEN up.role = 'admin' THEN '{"view": true, "edit": true, "delete": true, "export": true}'
        WHEN up.role = 'manager' THEN '{"view": true, "edit": true, "export": true}'
        WHEN up.role = 'accountant' THEN '{"view": true, "edit": true, "export": true}'
        ELSE '{"view": true, "edit": false, "export": false}'
    END::jsonb
FROM public.user_profiles up;

-- Add shipments permissions
INSERT INTO public.user_permissions (user_id, module, permissions) 
SELECT 
    up.id,
    'shipments',
    CASE 
        WHEN up.role IN ('super_admin', 'admin') THEN '{"view": true, "create": true, "edit": true, "delete": true, "approve": true, "export": true}'
        WHEN up.role = 'manager' THEN '{"view": true, "create": true, "edit": true, "approve": true, "export": true}'
        WHEN up.role = 'warehouse' THEN '{"view": true, "edit": true, "scan": true, "sort": true}'
        WHEN up.role = 'rider' THEN '{"view": true, "update_status": true, "collect_payment": true}'
        ELSE '{"view": true}'
    END::jsonb
FROM public.user_profiles up;

-- Add financial permissions
INSERT INTO public.user_permissions (user_id, module, permissions) 
SELECT 
    up.id,
    'financial',
    CASE 
        WHEN up.role IN ('super_admin', 'accountant') THEN '{"view": true, "create": true, "edit": true, "approve": true, "export": true, "audit": true}'
        WHEN up.role = 'admin' THEN '{"view": true, "create": true, "edit": true, "export": true}'
        WHEN up.role = 'manager' THEN '{"view": true, "export": true}'
        ELSE '{"view": false}'
    END::jsonb
FROM public.user_profiles up;

-- Create password change tracking table
CREATE TABLE IF NOT EXISTS public.password_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    old_password_hash VARCHAR(255),
    new_password_hash VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by UUID REFERENCES public.user_profiles(id),
    reason VARCHAR(255) DEFAULT 'user_initiated'
);

-- Create function to check password change requirement
CREATE OR REPLACE FUNCTION public.check_password_change_required(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    must_change BOOLEAN;
BEGIN
    SELECT must_change_password INTO must_change
    FROM public.user_profiles
    WHERE email = user_email AND status = 'active';
    
    RETURN COALESCE(must_change, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update password
CREATE OR REPLACE FUNCTION public.update_user_password(
    user_email TEXT,
    old_password TEXT,
    new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
    password_updated BOOLEAN := false;
BEGIN
    -- Get user record
    SELECT * INTO user_record
    FROM public.user_profiles
    WHERE email = user_email AND status = 'active';
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check old password (in production, this should use proper hashing)
    IF user_record.password_hash = old_password THEN
        -- Update password and reset flags
        UPDATE public.user_profiles
        SET 
            password_hash = new_password,
            must_change_password = false,
            first_login = false,
            last_password_change = NOW(),
            updated_at = NOW()
        WHERE email = user_email;
        
        -- Log password change
        INSERT INTO public.password_changes (user_id, old_password_hash, new_password_hash, reason)
        VALUES (user_record.id, old_password, new_password, 'first_login_change');
        
        password_updated := true;
    END IF;
    
    RETURN password_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new table
ALTER TABLE public.password_changes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for password changes
CREATE POLICY "Users can view their own password changes" ON public.password_changes
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_password_change ON public.user_profiles(must_change_password);
CREATE INDEX IF NOT EXISTS idx_user_profiles_first_login ON public.user_profiles(first_login);
CREATE INDEX IF NOT EXISTS idx_password_changes_user_id ON public.password_changes(user_id);

-- Show summary of created accounts
SELECT 
    'SUCCESS: User accounts recreated with new specifications!' as status,
    COUNT(*) as total_accounts,
    role,
    COUNT(*) as count_by_role
FROM public.user_profiles 
GROUP BY role
ORDER BY role;