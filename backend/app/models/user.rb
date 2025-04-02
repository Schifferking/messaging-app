class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :email, presence: { message: 'enter an email' }
  validates :email, uniqueness: { message: 'email entered is already used, enter another one' }
  validates :email, format: { with: /\A[\w.+-]+@\w+\.\w+\z/, message: 'enter a valid email address' }

  validates :password, presence: { message: 'enter a password' }, if: :should_validate_password?
  validates :password, length: { minimum: 8 }, if: :should_validate_password?
  validate :password_score_cannot_be_equal_or_lower_than_two, if: :should_validate_password?
  validate :password_cannot_be_different_from_password_confirmation, if: :should_validate_password?

  has_many :sent_messages, foreign_key: 'sender_id', class_name: 'Message'
  has_many :received_messages, foreign_key: 'receiver_id', class_name: 'Message'

  has_one_attached :avatar

  private

  def password_score_cannot_be_equal_or_lower_than_two
    return unless Zxcvbn.zxcvbn(password)['score'] <= 2

    errors.add(:password, "score can't be equal or lower than two")
  end

  def password_cannot_be_different_from_password_confirmation
    return unless password != password_confirmation

    errors.add(:password, "can't be different from password_confirmation")
  end

  def should_validate_password?
    new_record? || password.present?
  end
end
