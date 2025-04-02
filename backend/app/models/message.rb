class Message < ApplicationRecord
  belongs_to :sender, class_name: 'User'
  belongs_to :receiver, class_name: 'User'

  def self.chat_history(sender_id, receiver_id)
    joins(:sender)
      .where(sender_id: sender_id, receiver_id: receiver_id)
      .or(Message.where(sender_id: receiver_id, receiver_id: sender_id))
      .select(:content, :id, 'users.email', :sender_id)
  end
end
