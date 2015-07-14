class Stock < ActiveRecord::Base
  has_many :direct_purchases, dependent: :destroy
  has_many :product_orders, dependent: :destroy
  # has_many :manufacturers
  # validates :inventory_id, :category_id, :product_name, :product_details, :price, :quantity, :classification_table, presence: true
end
