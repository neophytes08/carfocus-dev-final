class Manufacturer < ActiveRecord::Base
  belongs_to :product_order
  validates :name, :address, :contact_no, presence: true;
end
