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

ActiveRecord::Schema.define(version: 20150707150501) do

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
    t.integer  "category_id"
    t.string   "or_no"
    t.string   "in_charge"
    t.integer  "cash_on_hand"
    t.string   "product_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "inventory_id"
    t.integer  "price"
    t.integer  "quantity"
    t.string   "car_model"
    t.string   "car_brand"
    t.string   "store_name"
  end

  add_index "direct_purchases", ["category_id"], name: "index_direct_purchases_on_category_id", using: :btree
  add_index "direct_purchases", ["inventory_id"], name: "index_direct_purchases_on_inventory_id", using: :btree

  create_table "estimations", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "customer_id"
    t.string   "payment_type"
    t.string   "car_model"
    t.string   "plat_no"
    t.string   "color"
    t.integer  "insurance_id"
    t.integer  "service_id"
    t.text     "service_details"
    t.boolean  "approved"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "estimations", ["customer_id"], name: "index_estimations_on_customer_id", using: :btree
  add_index "estimations", ["insurance_id"], name: "index_estimations_on_insurance_id", using: :btree
  add_index "estimations", ["service_id"], name: "index_estimations_on_service_id", using: :btree
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
    t.integer  "user_id"
    t.integer  "category_id"
    t.date     "transaction_date"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "inventories", ["category_id"], name: "index_inventories_on_category_id", using: :btree
  add_index "inventories", ["user_id"], name: "index_inventories_on_user_id", using: :btree

  create_table "inventory_stocks", force: :cascade do |t|
    t.integer  "inventory_id"
    t.integer  "on_stock_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "inventory_stocks", ["inventory_id"], name: "index_inventory_stocks_on_inventory_id", using: :btree
  add_index "inventory_stocks", ["on_stock_id"], name: "index_inventory_stocks_on_on_stock_id", using: :btree

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

  create_table "on_stocks", force: :cascade do |t|
    t.integer  "category_id"
    t.string   "product_type"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "inventory_id"
    t.string   "product_name"
    t.text     "product_details"
    t.integer  "quantity"
    t.integer  "price"
  end

  add_index "on_stocks", ["category_id"], name: "index_on_stocks_on_category_id", using: :btree
  add_index "on_stocks", ["inventory_id"], name: "index_on_stocks_on_inventory_id", using: :btree

  create_table "product_orders", force: :cascade do |t|
    t.integer  "category_id"
    t.integer  "manufacturer_id"
    t.string   "product_name"
    t.integer  "quantity"
    t.integer  "price"
    t.string   "product_type"
    t.string   "product_details"
    t.integer  "inventory_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "product_orders", ["category_id"], name: "index_product_orders_on_category_id", using: :btree
  add_index "product_orders", ["inventory_id"], name: "index_product_orders_on_inventory_id", using: :btree
  add_index "product_orders", ["manufacturer_id"], name: "index_product_orders_on_manufacturer_id", using: :btree

  create_table "services", force: :cascade do |t|
    t.string   "service_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

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
