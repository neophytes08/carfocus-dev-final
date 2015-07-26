# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150725104302) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "banks", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "bank_name"
    t.integer  "total_cash"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "banks", ["user_id"], name: "index_banks_on_user_id", using: :btree

  create_table "categories", force: :cascade do |t|
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "category_name"
  end

  create_table "customer_infos", force: :cascade do |t|
    t.string   "fullname"
    t.string   "contact_no"
    t.string   "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "direct_purchases", force: :cascade do |t|
    t.integer  "stock_id"
    t.string   "or_no"
    t.string   "in_charge"
    t.float    "cash_onhand"
    t.string   "store_name"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "direct_purchases", ["stock_id"], name: "index_direct_purchases_on_stock_id", using: :btree

  create_table "estimations", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "customer_id"
    t.string   "car_model"
    t.string   "plate_no"
    t.string   "color"
    t.boolean  "approved"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "car_brand"
    t.string   "engine_type"
    t.string   "chasis_no"
    t.boolean  "job_status"
  end

  add_index "estimations", ["customer_id"], name: "index_estimations_on_customer_id", using: :btree
  add_index "estimations", ["user_id"], name: "index_estimations_on_user_id", using: :btree

  create_table "expenses", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "cash_borrowed"
    t.integer  "cash_beginning"
    t.integer  "bank_id"
    t.integer  "cash_withdrawal"
    t.integer  "cash_on_hand"
    t.text     "purpose"
    t.integer  "amount"
    t.integer  "group_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "expenses", ["bank_id"], name: "index_expenses_on_bank_id", using: :btree
  add_index "expenses", ["group_id"], name: "index_expenses_on_group_id", using: :btree
  add_index "expenses", ["user_id"], name: "index_expenses_on_user_id", using: :btree

  create_table "insurance_companies", force: :cascade do |t|
    t.string   "name"
    t.string   "insured_parts"
    t.integer  "amount"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "inventories", force: :cascade do |t|
    t.datetime "transaction_date"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "user_id"
  end

  add_index "inventories", ["user_id"], name: "index_inventories_on_user_id", using: :btree

  create_table "logs", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "action"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "logs", ["user_id"], name: "index_logs_on_user_id", using: :btree

  create_table "manufacturers", force: :cascade do |t|
    t.string   "name"
    t.string   "address"
    t.string   "contact_no"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "part_needs", force: :cascade do |t|
    t.integer  "estimation_id"
    t.integer  "stock_id"
    t.string   "product_details"
    t.string   "product_name"
    t.integer  "quantity"
    t.float    "price"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "part_needs", ["estimation_id"], name: "index_part_needs_on_estimation_id", using: :btree
  add_index "part_needs", ["stock_id"], name: "index_part_needs_on_stock_id", using: :btree

  create_table "payment_insurances", force: :cascade do |t|
    t.integer  "payment_id"
    t.string   "company_name"
    t.string   "insured_parts"
    t.float    "amount"
    t.boolean  "payment_status"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "payment_insurances", ["payment_id"], name: "index_payment_insurances_on_payment_id", using: :btree

  create_table "payment_personals", force: :cascade do |t|
    t.integer  "payment_id"
    t.string   "payment_type"
    t.float    "amount"
    t.boolean  "payment_status"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "payment_personals", ["payment_id"], name: "index_payment_personals_on_payment_id", using: :btree

  create_table "payments", force: :cascade do |t|
    t.integer  "customer_id"
    t.integer  "estimation_id"
    t.string   "payment_method"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "payments", ["customer_id"], name: "index_payments_on_customer_id", using: :btree
  add_index "payments", ["estimation_id"], name: "index_payments_on_estimation_id", using: :btree

  create_table "product_orders", force: :cascade do |t|
    t.integer  "stock_id"
    t.integer  "manufacturer_id"
    t.string   "product_type"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "product_orders", ["manufacturer_id"], name: "index_product_orders_on_manufacturer_id", using: :btree
  add_index "product_orders", ["stock_id"], name: "index_product_orders_on_stock_id", using: :btree

  create_table "service_details", force: :cascade do |t|
    t.integer  "service_id"
    t.string   "service_description"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.float    "service_amount"
    t.integer  "estimation_id"
  end

  add_index "service_details", ["estimation_id"], name: "index_service_details_on_estimation_id", using: :btree
  add_index "service_details", ["service_id"], name: "index_service_details_on_service_id", using: :btree

  create_table "services", force: :cascade do |t|
    t.string   "service_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "stocks", force: :cascade do |t|
    t.integer  "inventory_id"
    t.integer  "category_id"
    t.string   "product_name"
    t.string   "product_details"
    t.float    "price"
    t.integer  "quantity"
    t.string   "classification_table"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "stocks", ["category_id"], name: "index_stocks_on_category_id", using: :btree
  add_index "stocks", ["inventory_id"], name: "index_stocks_on_inventory_id", using: :btree

  create_table "user_infos", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "firstname"
    t.string   "lastname"
    t.string   "address"
    t.string   "contact"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  add_index "user_infos", ["user_id"], name: "index_user_infos_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "user_type"
    t.string   "username"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
