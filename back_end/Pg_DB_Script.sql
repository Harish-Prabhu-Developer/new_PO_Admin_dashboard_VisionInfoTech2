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