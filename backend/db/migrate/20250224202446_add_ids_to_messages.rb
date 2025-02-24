class AddIdsToMessages < ActiveRecord::Migration[7.0]
  def change
    add_reference :messages, :sender, null: false
    add_reference :messages, :receiver, null: false
  end
end
