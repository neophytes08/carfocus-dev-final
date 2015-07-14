class ProductOrder < ActiveRecord::Base
  belongs_to :stocks
  has_many :manufacturers
  # validates :stock_id, :manufacturer_id, :product_type, presence: true
end
