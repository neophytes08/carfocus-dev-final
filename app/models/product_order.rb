class ProductOrder < ActiveRecord::Base
  has_many :manufacturers

  def self.primay_key
    'product_order_' + super
  end
end
