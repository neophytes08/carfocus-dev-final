class AddAttachmentImageToUserInfos < ActiveRecord::Migration
  def self.up
    change_table :user_infos do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :user_infos, :image
  end
end
