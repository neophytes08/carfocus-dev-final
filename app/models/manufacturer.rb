class Manufacturer < ActiveRecord::Base
  belongs_to :product_order

  def self.primary_key
    'manufacturer_' + super
  end
end
