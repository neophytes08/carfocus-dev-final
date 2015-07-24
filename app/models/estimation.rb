class Estimation < ActiveRecord::Base
  has_many :customer_info
  # validates :user_id, :customer_id, :payment_type, :car_model, :car_brand, :plate_no, :color, :unsurance_id, :service_id, :approved, presence: true
end
