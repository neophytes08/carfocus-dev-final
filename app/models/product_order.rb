class ProductOrder < ActiveRecord::Base
  belongs_to :stocks
  # validates :stock_id, :manufacturer_id, :product_type, presence: true
end
