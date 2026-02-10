-- Comprehensive User Account Creation for Britium Express
-- All accounts use @britiumexpress.com domain emails
-- Default password: BritiumExpress2026!

-- First, ensure we have the proper user management tables
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    branch_location VARCHAR(100),
    phone VARCHAR(20),
    employee_id VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user permissions table for detailed access control
CREATE TABLE IF NOT EXISTS public.user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    module VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit log table for tracking all user actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert comprehensive user accounts
INSERT INTO public.user_profiles (email, full_name, role, department, branch_location, phone, employee_id, permissions) VALUES

-- SUPER ADMIN ACCOUNTS
('superadmin@britiumexpress.com', 'Aung Kyaw Moe', 'super_admin', 'IT Administration', 'Head Office - Yangon', '+95-9-111111111', 'SA001', 
 '{"all_modules": true, "system_config": true, "user_management": true, "financial_reports": true, "audit_logs": true}'),

('ceo@britiumexpress.com', 'Daw Thida Win', 'super_admin', 'Executive', 'Head Office - Yangon', '+95-9-111111112', 'CEO001', 
 '{"all_modules": true, "executive_dashboard": true, "strategic_reports": true, "company_settings": true}'),

-- ADMIN ACCOUNTS
('admin.yangon@britiumexpress.com', 'Ko Zaw Min Oo', 'admin', 'Operations', 'Yangon Main Branch', '+95-9-222222221', 'AD001', 
 '{"user_management": true, "operations": true, "reports": true, "settings": true, "bulk_upload": true}'),

('admin.mandalay@britiumexpress.com', 'Ma Hnin Ei Phyu', 'admin', 'Operations', 'Mandalay Branch', '+95-9-222222222', 'AD002', 
 '{"user_management": true, "operations": true, "reports": true, "branch_management": true}'),

('admin.naypyitaw@britiumexpress.com', 'Ko Thant Zin Oo', 'admin', 'Operations', 'Nay Pyi Taw Branch', '+95-9-222222223', 'AD003', 
 '{"user_management": true, "operations": true, "reports": true, "government_liaison": true}'),

-- BRANCH MANAGER ACCOUNTS
('manager.yangon@britiumexpress.com', 'Ko Kyaw Soe Naing', 'manager', 'Branch Management', 'Yangon Main Branch', '+95-9-333333331', 'BM001', 
 '{"branch_operations": true, "staff_management": true, "local_reports": true, "customer_service": true}'),

('manager.mandalay@britiumexpress.com', 'Ma Khin Mar Aye', 'manager', 'Branch Management', 'Mandalay Branch', '+95-9-333333332', 'BM002', 
 '{"branch_operations": true, "staff_management": true, "local_reports": true, "regional_coordination": true}'),

('manager.naypyitaw@britiumexpress.com', 'Ko Min Thura', 'manager', 'Branch Management', 'Nay Pyi Taw Branch', '+95-9-333333333', 'BM003', 
 '{"branch_operations": true, "staff_management": true, "government_services": true, "vip_handling": true}'),

('manager.bago@britiumexpress.com', 'Ma Nilar Win', 'manager', 'Branch Management', 'Bago Branch', '+95-9-333333334', 'BM004', 
 '{"branch_operations": true, "staff_management": true, "rural_logistics": true}'),

('manager.mawlamyine@britiumexpress.com', 'Ko Aung Naing Win', 'manager', 'Branch Management', 'Mawlamyine Branch', '+95-9-333333335', 'BM005', 
 '{"branch_operations": true, "staff_management": true, "port_coordination": true}'),

-- ACCOUNTANT ACCOUNTS
('accountant.head@britiumexpress.com', 'Ma Thuzar Aung', 'accountant', 'Finance', 'Head Office - Yangon', '+95-9-444444441', 'AC001', 
 '{"financial_management": true, "reports": true, "voucher_management": true, "audit_support": true}'),

('accountant.yangon@britiumexpress.com', 'Ko Zaw Linn Oo', 'accountant', 'Finance', 'Yangon Main Branch', '+95-9-444444442', 'AC002', 
 '{"branch_accounting": true, "daily_reports": true, "cash_management": true}'),

('accountant.mandalay@britiumexpress.com', 'Ma Aye Myat Mon', 'accountant', 'Finance', 'Mandalay Branch', '+95-9-444444443', 'AC003', 
 '{"branch_accounting": true, "regional_reports": true, "expense_management": true}'),

-- WAREHOUSE STAFF ACCOUNTS
('warehouse.yangon@britiumexpress.com', 'Ko Thura Aung', 'warehouse', 'Warehouse Operations', 'Yangon Warehouse', '+95-9-555555551', 'WH001', 
 '{"warehouse_operations": true, "inventory_management": true, "qr_scanning": true, "sorting": true}'),

('warehouse.mandalay@britiumexpress.com', 'Ko Myo Min Thant', 'warehouse', 'Warehouse Operations', 'Mandalay Warehouse', '+95-9-555555552', 'WH002', 
 '{"warehouse_operations": true, "inventory_management": true, "regional_distribution": true}'),

('warehouse.supervisor@britiumexpress.com', 'Ma Khaing Zar Chi', 'warehouse', 'Warehouse Operations', 'Head Warehouse - Yangon', '+95-9-555555553', 'WHS001', 
 '{"warehouse_supervision": true, "staff_management": true, "quality_control": true, "reporting": true}'),

-- RIDER ACCOUNTS
('rider.yangon01@britiumexpress.com', 'Ko Aung Myo Thant', 'rider', 'Delivery', 'Yangon Zone 1', '+95-9-666666661', 'RD001', 
 '{"delivery_operations": true, "mobile_app": true, "customer_interaction": true, "cash_collection": true}'),

('rider.yangon02@britiumexpress.com', 'Ko Zin Min Htet', 'rider', 'Delivery', 'Yangon Zone 2', '+95-9-666666662', 'RD002', 
 '{"delivery_operations": true, "mobile_app": true, "route_optimization": true}'),

('rider.mandalay01@britiumexpress.com', 'Ko Thant Sin Aung', 'rider', 'Delivery', 'Mandalay Zone 1', '+95-9-666666663', 'RD003', 
 '{"delivery_operations": true, "mobile_app": true, "regional_delivery": true}'),

('rider.supervisor@britiumexpress.com', 'Ko Kyaw Zin Latt', 'rider', 'Delivery', 'Head Office - Yangon', '+95-9-666666664', 'RDS001', 
 '{"rider_supervision": true, "route_planning": true, "performance_monitoring": true, "training": true}'),

-- CUSTOMER SERVICE ACCOUNTS
('cs.head@britiumexpress.com', 'Ma Ei Thandar Aung', 'customer_service', 'Customer Service', 'Head Office - Yangon', '+95-9-777777771', 'CS001', 
 '{"customer_support": true, "complaint_management": true, "service_quality": true, "training": true}'),

('cs.yangon@britiumexpress.com', 'Ma Hnin Thway Thway', 'customer_service', 'Customer Service', 'Yangon Call Center', '+95-9-777777772', 'CS002', 
 '{"customer_support": true, "call_handling": true, "ticket_management": true}'),

('cs.mandalay@britiumexpress.com', 'Ko Htet Aung Kyaw', 'customer_service', 'Customer Service', 'Mandalay Branch', '+95-9-777777773', 'CS003', 
 '{"customer_support": true, "regional_support": true, "local_language_support": true}'),

-- MARKETER ACCOUNTS
('marketing.head@britiumexpress.com', 'Ko Wai Yan Aung', 'marketer', 'Marketing', 'Head Office - Yangon', '+95-9-888888881', 'MK001', 
 '{"marketing_campaigns": true, "analytics": true, "social_media": true, "partnerships": true}'),

('marketing.digital@britiumexpress.com', 'Ma Shwe Yi Mon', 'marketer', 'Marketing', 'Head Office - Yangon', '+95-9-888888882', 'MK002', 
 '{"digital_marketing": true, "content_creation": true, "seo": true, "online_advertising": true}'),

('marketing.regional@britiumexpress.com', 'Ko Nay Lin Aung', 'marketer', 'Marketing', 'Regional Offices', '+95-9-888888883', 'MK003', 
 '{"regional_marketing": true, "local_partnerships": true, "event_management": true}'),

-- HR ACCOUNTS
('hr.head@britiumexpress.com', 'Ma Khin Sandar Win', 'hr', 'Human Resources', 'Head Office - Yangon', '+95-9-999999991', 'HR001', 
 '{"hr_management": true, "recruitment": true, "payroll": true, "employee_relations": true}'),

('hr.recruitment@britiumexpress.com', 'Ko Thura Zaw', 'hr', 'Human Resources', 'Head Office - Yangon', '+95-9-999999992', 'HR002', 
 '{"recruitment": true, "onboarding": true, "training_coordination": true}'),

-- QA ACCOUNTS
('qa.head@britiumexpress.com', 'Ma Myat Noe Khin', 'qa', 'Quality Assurance', 'Head Office - Yangon', '+95-9-101010101', 'QA001', 
 '{"quality_control": true, "testing": true, "process_improvement": true, "compliance": true}'),

('qa.operations@britiumexpress.com', 'Ko Aung Thiha', 'qa', 'Quality Assurance', 'Operations Center', '+95-9-101010102', 'QA002', 
 '{"operational_qa": true, "service_monitoring": true, "customer_feedback": true}'),

-- DISPATCH CONTROLLER ACCOUNTS
('dispatch.head@britiumexpress.com', 'Ko Zaw Win Naing', 'dispatch', 'Dispatch Control', 'Control Center - Yangon', '+95-9-121212121', 'DC001', 
 '{"dispatch_control": true, "route_optimization": true, "real_time_tracking": true, "emergency_response": true}'),

('dispatch.night@britiumexpress.com', 'Ma Thant Zin Moe', 'dispatch', 'Dispatch Control', 'Control Center - Yangon', '+95-9-121212122', 'DC002', 
 '{"night_operations": true, "emergency_dispatch": true, "24_7_monitoring": true}'),

-- BUSINESS INTELLIGENCE ACCOUNTS
('bi.analyst@britiumexpress.com', 'Ko Hein Htet Aung', 'bi_analyst', 'Business Intelligence', 'Head Office - Yangon', '+95-9-131313131', 'BI001', 
 '{"data_analysis": true, "reporting": true, "dashboard_management": true, "predictive_analytics": true}'),

('bi.senior@britiumexpress.com', 'Ma Aye Chan Myae', 'bi_analyst', 'Business Intelligence', 'Head Office - Yangon', '+95-9-131313132', 'BI002', 
 '{"advanced_analytics": true, "machine_learning": true, "strategic_insights": true, "executive_reporting": true}');

-- Create detailed permissions for each module
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

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Users can view their permissions" ON public.user_permissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = user_permissions.user_id 
            AND up.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id ON public.user_profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create function to log user actions
CREATE OR REPLACE FUNCTION public.log_user_action()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Comprehensive user accounts created successfully!' as message,
       COUNT(*) as total_accounts_created
FROM public.user_profiles;