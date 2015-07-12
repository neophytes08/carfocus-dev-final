class Service < ActiveRecord::Base
  validates :service_name, presence: true
end
