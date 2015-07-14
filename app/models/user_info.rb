class UserInfo < ActiveRecord::Base
  belongs_to :user, :polymorphic => true
  has_many :inventory
  has_many :logs
  has_attached_file :image, :styles => { :medium => "300x300>" }
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/
end
