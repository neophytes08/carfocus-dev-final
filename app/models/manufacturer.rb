class Manufacturer < ActiveRecord::Base
  belongs_to :product_order
  belongs_to :stock
  validates :name, :address, :contact_no, presence: true;
end
