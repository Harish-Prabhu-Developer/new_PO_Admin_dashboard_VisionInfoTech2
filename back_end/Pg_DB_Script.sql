-- User Table 
CREATE TABLE public.users (
    "sno" SERIAL PRIMARY KEY,
    "new_card_no" INTEGER,
    "emp_name" VARCHAR(150),
    "user_approval_name" VARCHAR(150),
    "signature" TEXT,

    "email_address" VARCHAR(150),
    "company_id" INTEGER,
    "status_entry" VARCHAR(10),
    "order_no" VARCHAR(50),
    "password_user" TEXT,

    "employee_signed_as" VARCHAR(150),

    "sales_pi_approval" BOOLEAN,
    "purchase_pi_approval" BOOLEAN,

    "otp" INTEGER,

    "apparels_dashboard" BOOLEAN,
    "po_approval_head" BOOLEAN,
    "overtime_approval" BOOLEAN,
    "expat_leave_encashment" BOOLEAN,
    "bonce_purchaseorder_approval" BOOLEAN,
    "bond_release_request_approval" BOOLEAN,
    "wastage_delivery_approval" BOOLEAN,
    "work_order_approval" BOOLEAN,
    "pfl_work_order_approval" BOOLEAN,
    "pprb_roll_cutt_templates" BOOLEAN,
    "expat_travel_leave_approval" BOOLEAN,

    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Dashboard Configuration Table
CREATE TABLE public.tbl_dashboard (
  "sno" SERIAL PRIMARY KEY,
  
  -- Display Info
  "card_title" VARCHAR(100) NOT NULL,    -- Matches your Frontend 'title' (e.g., 'PO Approval', 'Work Order Approval')       -- Matches your Frontend Lucide icon names (e.g., 'FileCheck', 'Wallet')
  "card_value" INTEGER DEFAULT 0,        -- The pending count (can be updated by background jobs or query counts)
  
  -- Logic & Permissions
  "permission_column" VARCHAR(100),      -- The EXACT column name in 'users' table that controls this card (e.g., 'po_approval_head')
  "route_slug" VARCHAR(100),             -- The URL path to navigate to (e.g., 'po-approval')
  
  -- Meta
  "status_master" VARCHAR(20) DEFAULT 'Active',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Header Table 
CREATE TABLE public.tbl_purchase_order_hdr (
  "sno" SERIAL,
  "po_ref_no" VARCHAR(50) NOT NULL,
  "po_date" TIMESTAMP,
  "purchase_type" VARCHAR(20),
  "company_id" INT,
  "supplier_id" INT,
  "po_store_id" INT,
  "remarks" VARCHAR(2000),
  "status_entry" VARCHAR(20),
  "created_by" VARCHAR(50),
  "created_date" TIMESTAMP,
  "created_mac_address" VARCHAR(50),
  "modified_by" VARCHAR(50),
  "modified_date" TIMESTAMP,
  "modified_mac_address" VARCHAR(50),
  "payment_term" VARCHAR(3000),
  "mode_of_payment" VARCHAR(25),
  "currency_type" VARCHAR(25),    
  "suplier_proforma_number" VARCHAR(100),
  "shipment_mode" VARCHAR(100),
  "price_terms" VARCHAR(150),
  "shipment_remarks" VARCHAR(2500),
  "total_production_hdr_amount" DECIMAL(15,2),
  "total_additional_cost_amount" DECIMAL(15,2),
  "vat_hdr_amount" DECIMAL(15,2),
  "total_final_production_hdr_amount" DECIMAL(15,2),
  "respond_by" VARCHAR(50),
  "respond_date" DATE,
  "respond_status" VARCHAR(50),
  "first_shipment_date" TIMESTAMP,
  "lc_apply_target_date" TIMESTAMP,
  "response_1_person" VARCHAR(50),
  "response_1_date" TIMESTAMP,
  "response_1_status" VARCHAR(50),
  "response_1_remarks" VARCHAR(5000),
  "response_1_mac_address" VARCHAR(50),
  "response_2_person" VARCHAR(50),
  "response_2_date" TIMESTAMP,
  "response_2_status" VARCHAR(50),
  "response_2_remarks" VARCHAR(5000),
  "response_2_mac_address" VARCHAR(50),
  "final_response_person" VARCHAR(50),
  "final_response_date" TIMESTAMP,
  "final_response_status" VARCHAR(50),
  "final_response_remarks" VARCHAR(5000),
  "requested_date" TIMESTAMP,
  "requested_by" VARCHAR(50),
  "requested_mac_address" VARCHAR(50),
  "stock_company_transfer_ref_no" VARCHAR(50),
  "loading_port_id" INT,
  "discharge_port_id" INT,
  "shipment_type" VARCHAR(50),
  "supplier_company_id" INT,
  "stock_store_id" INT,
  "imports_response_1_person" VARCHAR(50),
  "imports_response_1_date" TIMESTAMP,
  "imports_response_1_status" VARCHAR(50),
  "imports_response_1_remarks" VARCHAR(500),
  "imports_response_1_mac_address" VARCHAR(50),
  "company_onbehalf_of" INT,
  "purchase_head_response_person" VARCHAR(50),
  "purchase_head_response_date" TIMESTAMP,
  "purchase_head_response_status" VARCHAR(50),
  "purchase_head_response_remarks" VARCHAR(500),
  "purchase_head_response_mac_address" VARCHAR(50),
  "erp_pi_ref_no" VARCHAR(50),
  "price_for_cnf_fob" VARCHAR(20),
  PRIMARY KEY ("po_ref_no")
);

-- Detail 1 Table 
CREATE TABLE public.tbl_purchase_order_dtl (
  "sno" SERIAL,
  "po_ref_no" VARCHAR(50),
  "request_store_id" INT,
  "po_request_ref_no" VARCHAR(50),
  "proforma_invoice_ref_no" VARCHAR(50),
  "section_id" INT,
  "machine_id" INT,
  "main_category_id" INT,
  "sub_category_id" INT,
  "product_id" INT,
  "packing_type" VARCHAR(50),
  "no_pcs_per_packing" DECIMAL(15,2),
  "total_pcs" DECIMAL(15,4),
  "total_packing" DECIMAL(15,4),
  "rate_per_pcs" DECIMAL(15,6),
  "product_amount" DECIMAL(15,2),
  "discount_percentage" DECIMAL(15,2),
  "discount_amount" DECIMAL(15,2),
  "total_product_amount" DECIMAL(15,4),
  "vat_percentage" DECIMAL(15,2),
  "vat_amount" DECIMAL(15,4),
  "final_product_amount" DECIMAL(15,4),
  "remarks" VARCHAR(2000),
  "status_entry" VARCHAR(20),
  "created_by" VARCHAR(50),
  "created_date" TIMESTAMP,
  "created_mac_address" VARCHAR(50),
  "modified_by" VARCHAR(50),
  "modified_date" TIMESTAMP,
  "modified_mac_address" VARCHAR(50),
  "alternate_product_name" VARCHAR(500),
  "lc_needed_status" VARCHAR(50),
  "lc_apply_status" VARCHAR(50),
  "lc_applied_date" TIMESTAMP,
  "lc_no" VARCHAR(50),
  "sup_doc_file" BYTEA,
  "truck_id" INT,
  "response_1_person" VARCHAR(50),
  "response_1_date" TIMESTAMP,
  "response_1_status" VARCHAR(50),
  "response_1_remarks" VARCHAR(5000),
  "response_1_approved_total_packing" DECIMAL(15,2),
  "response_1_approved_total_pcs" DECIMAL(15,2),
  "response_2_person" VARCHAR(50),
  "response_2_date" TIMESTAMP,
  "response_2_status" VARCHAR(50),
  "response_2_remarks" VARCHAR(5000),
  "response_2_approved_total_packing" DECIMAL(15,2),
  "response_2_approved_total_pcs" DECIMAL(15,2),
  "final_response_person" VARCHAR(50),
  "final_response_date" TIMESTAMP,
  "final_response_status" VARCHAR(50),
  "final_response_remarks" VARCHAR(5000),
  "final_response_approved_total_packing" DECIMAL(15,2),
  "final_response_approved_total_pcs" DECIMAL(15,2),
  "trailer_id" INT,
  PRIMARY KEY ("sno")
);

-- Additional Cost Details Table (Detail 2)
CREATE TABLE public.tbl_purchase_order_additional_cost_details (
  "sno" SERIAL,
  "po_ref_no" VARCHAR(50),
  "additional_cost_type" VARCHAR(100),
  "amount" DECIMAL(15,2),
  "remarks" VARCHAR(1000),
  "status_master" VARCHAR(50),
  "created_by" VARCHAR(50),
  "created_date" TIMESTAMP,
  "created_mac_address" VARCHAR(50),
  "modified_by" VARCHAR(50),
  "modified_date" TIMESTAMP,
  "modified_mac_address" VARCHAR(50),
  PRIMARY KEY ("sno")
);
-- Conversation Details Table (Detail 3)
CREATE TABLE public.tbl_purchase_order_conversation_dtl (
  "sno" SERIAL,
  "po_ref_no" VARCHAR(50),
  "respond_person" VARCHAR(50),
  "discussion_details" TEXT,
  "response_status" VARCHAR(50),
  "status_entry" VARCHAR(50),
  "remarks" VARCHAR(50),
  "created_by" VARCHAR(50),
  "created_date" TIMESTAMP,
  "created_mac_address" VARCHAR(50),
  "modified_by" VARCHAR(50),
  "modified_date" TIMESTAMP,
  "modified_mac_address" VARCHAR(50),
  PRIMARY KEY ("sno")
);


-- File Upload Table (Detail 4)
CREATE TABLE public.tbl_purchase_order_files_upload (
  "sno" SERIAL,
  "po_ref_no" VARCHAR(50),
  "description_details" VARCHAR(100),
  "file_name" VARCHAR(150),
  "content_type" VARCHAR(50),
  "content_data" BYTEA,
  "status_master" VARCHAR(20),
  "created_by" VARCHAR(50),
  "created_date" TIMESTAMP,
  "created_mac_address" VARCHAR(50),
  "modified_by" VARCHAR(50),
  "modified_date" TIMESTAMP,
  "modified_mac_address" VARCHAR(50),
  "file_type" VARCHAR(50),
  PRIMARY KEY ("sno")
);

ALTER TABLE public.tbl_purchase_order_additional_cost_details ADD CONSTRAINT "fk_po_ref_no_add_cost" FOREIGN KEY ("po_ref_no") REFERENCES public.tbl_purchase_order_hdr ("po_ref_no");
ALTER TABLE public.tbl_purchase_order_conversation_dtl ADD CONSTRAINT "fk_po_ref_no_conv" FOREIGN KEY ("po_ref_no") REFERENCES public.tbl_purchase_order_hdr ("po_ref_no");
ALTER TABLE public.tbl_purchase_order_dtl ADD CONSTRAINT "fk_po_ref_no_po_dtl" FOREIGN KEY ("po_ref_no") REFERENCES public.tbl_purchase_order_hdr ("po_ref_no");
ALTER TABLE public.tbl_purchase_order_files_upload ADD CONSTRAINT "fk_upload_po_ref_no" FOREIGN KEY ("po_ref_no") REFERENCES public.tbl_purchase_order_hdr ("po_ref_no");

ALTER TABLE tbl_purchase_order_hdr
ADD CONSTRAINT uq_po_hdr_sno UNIQUE (sno);

ALTER TABLE tbl_purchase_order_hdr
ADD COLUMN created_by_user_id INT,
ADD COLUMN requested_by_user_id INT,
ADD COLUMN response_1_user_id INT,
ADD COLUMN response_2_user_id INT,
ADD COLUMN final_response_user_id INT;


ALTER TABLE tbl_purchase_order_hdr
ADD CONSTRAINT fk_po_created_by_user
FOREIGN KEY (created_by_user_id)
REFERENCES users (sno);

ALTER TABLE tbl_purchase_order_hdr
ADD CONSTRAINT fk_po_requested_user
FOREIGN KEY (requested_by_user_id)
REFERENCES users (sno);

ALTER TABLE tbl_purchase_order_dtl
ALTER COLUMN po_ref_no SET NOT NULL;

ALTER TABLE tbl_purchase_order_dtl
DROP CONSTRAINT fk_po_ref_no_po_dtl,
ADD CONSTRAINT fk_po_ref_no_po_dtl
FOREIGN KEY (po_ref_no)
REFERENCES tbl_purchase_order_hdr (po_ref_no)
ON DELETE CASCADE;

-- Seed Data for Users
INSERT INTO public.users (
    "emp_name","user_approval_name", "password_user", "email_address", "company_id", "status_entry", 
    "sales_pi_approval", "purchase_pi_approval", "po_approval_head", 
    "overtime_approval", "bonce_purchaseorder_approval", "bond_release_request_approval"
) VALUES 
('User1', 'User1', 'User1@123', 'user1@example.com', 1, 'Active', true, true, true, true, false, false),
('User2', 'User2', 'User2@123', 'user2@example.com', 1, 'Active', true, false, true, false, true, false),
('User3', 'User3', 'User3@123', 'user3@example.com', 1, 'Active', false, true, false, true, false, true),
('User4', 'User4', 'User4@123', 'user4@example.com', 2, 'Active', true, true, true, true, true, true),
('User5', 'User5', 'User5@123', 'user5@example.com', 2, 'Active', false, false, false, false, false, false),
('User6', 'User6', 'User6@123', 'user6@example.com', 2, 'Active', true, false, false, false, false, false),
('User7', 'User7', 'User7@123', 'user7@example.com', 3, 'Active', false, true, false, false, false, false),
('User8', 'User8', 'User8@123', 'user8@example.com', 3, 'Active', false, false, true, false, false, false),
('User9', 'User9', 'User9@123', 'user9@example.com', 3, 'Active', false, false, false, true, false, false),
('User10', 'User10', 'User10@123', 'user10@example.com', 3, 'Active', true, true, true, true, true, true);

-- Seed Data for Dashboard
INSERT INTO public.tbl_dashboard ("card_title", "card_value", "permission_column", "route_slug", "status_master") VALUES
('PO Approval', 25, 'po_approval_head', 'po-approval', 'Active'),
('Sales PI Approval', 8, 'sales_pi_approval', 'sales-pi-approval', 'Active'),
('Purchase PI Approval', 12, 'purchase_pi_approval', 'purchase-pi-approval', 'Active'),
('Overtime Approval', 5, 'overtime_approval', 'overtime-approval', 'Active'),
('Bond Release', 3, 'bond_release_request_approval', 'bond-release', 'Active');

-- Seed Data for Purchase Order Headers
INSERT INTO public.tbl_purchase_order_hdr (
    "po_ref_no", "po_date", "purchase_type", "company_id", "supplier_id", "po_store_id", 
    "total_final_production_hdr_amount", "currency_type", "requested_by", "requested_date", 
    "response_1_person", "response_1_status", "response_1_date",
    "response_2_person", "response_2_status", "response_2_date",
    "final_response_status", "created_by_user_id", "requested_by_user_id"
) VALUES
('PO-2026-001', NOW() - INTERVAL '2 days', 'DOMESTIC', 1, 101, 5, 50000.00, 'USD', 'User1', NOW() - INTERVAL '2 days', 'User2', 'APPROVED', NOW() - INTERVAL '1 day', NULL, 'PENDING', NULL, 'PENDING', 1, 1),
('PO-2026-002', NOW() - INTERVAL '5 days', 'IMPORT', 1, 102, 5, 12500.50, 'TSH', 'User3', NOW() - INTERVAL '5 days', 'User4', 'HOLD', NOW() - INTERVAL '3 days', 'User1', 'PENDING', NULL, 'HOLD', 3, 3),
('PO-2026-003', NOW() - INTERVAL '1 day', 'DOMESTIC', 2, 103, 6, 3000.00, 'USD', 'User5', NOW() - INTERVAL '1 day', NULL, 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 5, 5),
('PO-2026-004', NOW() - INTERVAL '10 days', 'IMPORT', 2, 101, 6, 75000.00, 'EUR', 'User2', NOW() - INTERVAL '10 days', 'User1', 'APPROVED', NOW() - INTERVAL '8 days', 'User4', 'APPROVED', NOW() - INTERVAL '5 days', 'APPROVED', 2, 2),
('PO-2026-005', NOW(), 'DOMESTIC', 3, 104, 7, 1500.00, 'USD', 'User6', NOW(), 'User7', 'REJECTED', NOW(), NULL, 'PENDING', NULL, 'REJECTED', 6, 6),
('PO-2026-006', NOW() - INTERVAL '12 days', 'DOMESTIC', 1, 105, 5, 2000.00, 'USD', 'User2', NOW() - INTERVAL '12 days', 'User1', 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 2, 2),
('PO-2026-007', NOW() - INTERVAL '15 days', 'IMPORT', 2, 101, 6, 50000.00, 'EUR', 'User4', NOW() - INTERVAL '15 days', 'User2', 'APPROVED', NOW() - INTERVAL '14 days', 'User5', 'PENDING', NULL, 'PENDING', 4, 4),
('PO-2026-008', NOW() - INTERVAL '20 days', 'DOMESTIC', 3, 106, 7, 1200.00, 'TSH', 'User3', NOW() - INTERVAL '20 days', 'User9', 'REJECTED', NOW() - INTERVAL '18 days', NULL, 'PENDING', NULL, 'REJECTED', 3, 3),
('PO-2026-009', NOW() - INTERVAL '3 days', 'IMPORT', 1, 102, 5, 15000.00, 'USD', 'User4', NOW() - INTERVAL '3 days', 'User1', 'APPROVED', NOW() - INTERVAL '2 days', 'User8', 'APPROVED', NOW() - INTERVAL '1 day', 'APPROVED', 4, 4),
('PO-2026-010', NOW() - INTERVAL '24 hours', 'DOMESTIC', 2, 103, 6, 500.00, 'TSH', 'User1', NOW() - INTERVAL '24 hours', NULL, 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 1, 1),
('PO-2026-011', NOW() - INTERVAL '8 days', 'IMPORT', 3, 101, 7, 8000.00, 'USD', 'User2', NOW() - INTERVAL '8 days', 'User10', 'HOLD', NOW() - INTERVAL '6 days', NULL, 'PENDING', NULL, 'HOLD', 2, 2),
('PO-2026-012', NOW() - INTERVAL '4 days', 'DOMESTIC', 1, 104, 5, 3000.00, 'USD', 'User3', NOW() - INTERVAL '4 days', 'User1', 'APPROVED', NOW() - INTERVAL '2 days', 'User6', 'PENDING', NULL, 'PENDING', 3, 3),
('PO-2026-013', NOW() - INTERVAL '9 days', 'IMPORT', 2, 105, 6, 12000.00, 'EUR', 'User5', NOW() - INTERVAL '9 days', 'User4', 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 5, 5),
('PO-2026-014', NOW() - INTERVAL '1 day', 'DOMESTIC', 3, 106, 7, 450.00, 'TSH', 'User6', NOW() - INTERVAL '1 day', 'User10', 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 6, 6),
('PO-2026-015', NOW() - INTERVAL '18 days', 'IMPORT', 1, 101, 5, 25000.00, 'USD', 'User7', NOW() - INTERVAL '18 days', 'User1', 'APPROVED', NOW() - INTERVAL '16 days', 'User8', 'APPROVED', NOW() - INTERVAL '15 days', 'APPROVED', 7, 7),
('PO-2026-016', NOW() - INTERVAL '6 days', 'DOMESTIC', 2, 102, 6, 1800.00, 'USD', 'User8', NOW() - INTERVAL '6 days', 'User4', 'APPROVED', NOW() - INTERVAL '5 days', 'User1', 'PENDING', NULL, 'PENDING', 8, 8),
('PO-2026-017', NOW() - INTERVAL '11 days', 'IMPORT', 3, 103, 7, 60000.00, 'EUR', 'User9', NOW() - INTERVAL '11 days', 'User10', 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 9, 9),
('PO-2026-018', NOW() - INTERVAL '2 days', 'DOMESTIC', 1, 104, 5, 900.00, 'TSH', 'User10', NOW() - INTERVAL '2 days', 'User1', 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 10, 10),
('PO-2026-019', NOW() - INTERVAL '14 days', 'IMPORT', 2, 105, 6, 30000.00, 'USD', 'User1', NOW() - INTERVAL '14 days', 'User4', 'APPROVED', NOW() - INTERVAL '13 days', 'User2', 'APPROVED', NOW() - INTERVAL '12 days', 'APPROVED', 1, 1),
('PO-2026-020', NOW() - INTERVAL '5 days', 'DOMESTIC', 3, 106, 7, 2200.00, 'USD', 'User2', NOW() - INTERVAL '5 days', 'User7', 'REJECTED', NOW() - INTERVAL '4 days', NULL, 'PENDING', NULL, 'REJECTED', 2, 2),
('PO-2026-021', NOW() - INTERVAL '7 days', 'IMPORT', 1, 101, 5, 11000.00, 'EUR', 'User3', NOW() - INTERVAL '7 days', 'User1', 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 3, 3),
('PO-2026-022', NOW() - INTERVAL '3 days', 'DOMESTIC', 2, 102, 6, 600.00, 'TSH', 'User4', NOW() - INTERVAL '3 days', 'User6', 'HOLD', NOW() - INTERVAL '1 day', NULL, 'PENDING', NULL, 'HOLD', 4, 4),
('PO-2026-023', NOW() - INTERVAL '13 days', 'IMPORT', 3, 103, 7, 14000.00, 'USD', 'User5', NOW() - INTERVAL '13 days', 'User9', 'APPROVED', NOW() - INTERVAL '12 days', 'User10', 'PENDING', NULL, 'PENDING', 5, 5),
('PO-2026-024', NOW() - INTERVAL '1 month', 'DOMESTIC', 1, 104, 5, 250000.00, 'TSH', 'User6', NOW() - INTERVAL '1 month', 'User1', 'PENDING', NULL, NULL, 'PENDING', NULL, 'PENDING', 6, 6),
('PO-2026-025', NOW() - INTERVAL '2 days', 'IMPORT', 2, 105, 6, 5500.00, 'USD', 'User7', NOW() - INTERVAL '2 days', 'User8', 'APPROVED', NOW() - INTERVAL '2 hours', 'User4', 'APPROVED', NOW() - INTERVAL '1 hour', 'APPROVED', 7, 7);

-- Seed Data for Purchase Order Details
INSERT INTO public.tbl_purchase_order_dtl (
    "po_ref_no", "product_id", "alternate_product_name", "total_pcs", "rate_per_pcs", "total_product_amount"
) VALUES
('PO-2026-001', 1001, 'Office Chairs', 100, 50.00, 5000.00),
('PO-2026-001', 1002, 'Office Desks', 20, 200.00, 4000.00),
('PO-2026-002', 2001, 'Industrial Solvent', 500, 25.00, 12500.00),
('PO-2026-003', 3001, 'Paper Reams', 1000, 3.00, 3000.00),
('PO-2026-004', 4001, 'Heavy Machinery X', 1, 75000.00, 75000.00),
('PO-2026-005', 5001, 'Laptops', 2, 750.00, 1500.00),
('PO-2026-006', 1003, 'Monitor Stand', 50, 40.00, 2000.00),
('PO-2026-007', 4002, 'Assembly Line Bot', 1, 50000.00, 50000.00),
('PO-2026-008', 3002, 'Toner Cartridges', 12, 100.00, 1200.00),
('PO-2026-009', 2002, 'Acid Barrels', 30, 500.00, 15000.00),
('PO-2026-010', 3003, 'Staplers', 100, 5.00, 500.00),
('PO-2026-011', 5002, 'Server Rack', 2, 4000.00, 8000.00),
('PO-2026-012', 1004, 'Cabinets', 10, 300.00, 3000.00),
('PO-2026-013', 4003, 'Conveyor Belt', 4, 3000.00, 12000.00),
('PO-2026-014', 3004, 'Pens Box', 50, 9.00, 450.00),
('PO-2026-015', 5003, 'Networking Switch', 5, 5000.00, 25000.00),
('PO-2026-016', 1005, 'Whiteboards', 6, 300.00, 1800.00),
('PO-2026-017', 4004, 'Hydraulic Press', 1, 60000.00, 60000.00),
('PO-2026-018', 3005, 'Notepads', 300, 3.00, 900.00),
('PO-2026-019', 4005, 'Forklift', 1, 30000.00, 30000.00),
('PO-2026-020', 1006, 'Meeting Table', 2, 1100.00, 2200.00),
('PO-2026-021', 2003, 'Lubricant Oil', 200, 55.00, 11000.00),
('PO-2026-022', 3006, 'Markers', 200, 3.00, 600.00),
('PO-2026-023', 5004, 'Workstations', 7, 2000.00, 14000.00),
('PO-2026-024', 2004, 'Raw Plastic Granules', 10000, 25.00, 250000.00),
('PO-2026-025', 1007, 'Ergo Chairs', 11, 500.00, 5500.00);


-- Seed Data for Additional Cost Details
INSERT INTO public.tbl_purchase_order_additional_cost_details (
    "po_ref_no", "additional_cost_type", "amount", "remarks"
) VALUES
('PO-2026-002', 'Shipping', 500.00, 'Sea Freight'),
('PO-2026-004', 'Installation', 2000.00, 'On-site setup included'),
('PO-2026-007', 'Insurance', 1200.00, 'Transit Insurance'),
('PO-2026-009', 'Handling', 350.00, 'Special handling required'),
('PO-2026-013', 'Import Tax', 2500.00, 'Duty Fees'),
('PO-2026-017', 'Setup Fee', 5000.00, 'Engineer Visit'),
('PO-2026-024', 'Transport', 1500.00, 'Trucking');

-- Seed Data for Conversation Details
INSERT INTO public.tbl_purchase_order_conversation_dtl (
    "po_ref_no", "respond_person", "discussion_details", "response_status", "created_date"
) VALUES
('PO-2026-002', 'User4', 'Please clarify the delivery timeline.', 'QUERY', NOW() - INTERVAL '4 days'),
('PO-2026-002', 'User3', 'Delivery expected within 4 weeks.', 'REPLY', NOW() - INTERVAL '3 days'),
('PO-2026-007', 'User2', 'Is the installation manual included?', 'QUERY', NOW() - INTERVAL '14 days'),
('PO-2026-019', 'User1', 'Urgent requirement, please prioritize.', 'NOTE', NOW() - INTERVAL '13 days'),
('PO-2026-025', 'User8', 'Approved subject to final quality check.', 'REPLY', NOW() - INTERVAL '2 hours');

-- Seed Data for File Uploads
INSERT INTO public.tbl_purchase_order_files_upload (
    "po_ref_no", "file_name", "file_type", "description_details"
) VALUES
('PO-2026-001', 'invoice_001.pdf', 'invoice', 'Proforma Invoice'),
('PO-2026-004', 'specs_machinery.pdf', 'specifications', 'Technical Specs'),
('PO-2026-007', 'blueprint_bot.png', 'image', 'Blueprint'),
('PO-2026-013', 'customs_decl.pdf', 'document', 'Customs Declaration'),
('PO-2026-023', 'layout_plan.pdf', 'document', 'Office Layout');
-- Notifications Table
CREATE TABLE public.tbl_notifications (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES public.users(sno) ON DELETE CASCADE,
  "title" VARCHAR(200) NOT NULL,
  "message" TEXT NOT NULL,
  "type" VARCHAR(50) DEFAULT 'info', -- success, info, warning, error
  "read" BOOLEAN DEFAULT FALSE,
  "link" VARCHAR(255),
  "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data for Notifications
INSERT INTO public.tbl_notifications ("user_id", "title", "message", "type", "read", "link", "date") VALUES
(1, 'New Order Received', 'Order #PO-2024-001 has been submitted for approval.', 'success', false, '/dashboard/PurchaseOrder', '2026-01-21 11:25:11'),
(1, 'System Maintenance', 'Scheduled maintenance will start in 30 minutes.', 'info', false, NULL, '2026-01-21 11:05:11'),
(1, 'Approval Pending', 'Purchase Order #8821 requires your approval.', 'warning', false, '/dashboard/PurchaseOrder', '2026-01-21 09:30:11'),
(1, 'Connection Lost', 'Lost connection to the inventory server. Retrying...', 'error', true, NULL, '2026-01-20 15:30:11'),
(1, 'Weekly Report Ready', 'Your weekly analytics report is ready for download.', 'success', true, '/dashboard/Reports', '2026-01-20 10:00:00'),
(2, 'New Order Received', 'Order #PO-2024-002 has been submitted for approval.', 'success', false, '/dashboard/PurchaseOrder', '2026-01-21 11:30:00');
