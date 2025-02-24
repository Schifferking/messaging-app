

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :email, presence: { message: "enter an email" }
  validates :email, uniqueness: { message: "email entered is already used, enter another one" }
  validates :email, format: { with: /\A[\w.+-]+@\w+\.\w+\z/, message: "enter a valid email address" }

  validates :password, presence: { message: "enter a password" }
  validates :password, length: { minimum: 8 }
  validate :password_score_cannot_be_equal_or_lower_than_two
  validate :password_cannot_be_different_from_password_confirmation

  has_many :sent_messages, foreign_key: "sender_id", class_name: "Message"
  has_many :received_messages, foreign_key: "receiver_id", class_name: "Message"

  def password_score_cannot_be_equal_or_lower_than_two
    if Zxcvbn.zxcvbn(password)["score"] <= 2
      errors.add(:password, "score can't be equal or lower than two")
    end
  end

  def password_cannot_be_different_from_password_confirmation
    if password != password_confirmation
      errors.add(:password, "can't be different from password_confirmation")
    end
  end

  # query users id, email except current user
  scope :data_list, ->(excluded_user) { excluding(excluded_user).select(:id, :email) }
end
