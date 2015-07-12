class ServiceDetail < ActiveRecord::Base

  validates :serice_id, :service_details, :price, :customer_id, :estimation_id, presence: true
end
