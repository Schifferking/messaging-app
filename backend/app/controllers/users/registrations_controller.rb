# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionFix
  respond_to :json
  before_action :configure_registration_params, only: [:create]

  def index
    users_data = User.data_list(current_user)
    render json: {
      status: { code: 200, message: "Fetched users data." },
      data: { users: users_data }
    }, status: :ok
  end

  private

  def configure_registration_params
    devise_parameter_sanitizer.permit(:create, keys: [user: [:email, :password, :password_confirmation]])
  end

  def respond_with(resource, _opts = {})
    if request.method == "POST" && resource.persisted?
      render json: {
        status: { code: 200, message: "Signed up successfully." },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    elsif request.method == "DELETE"
      render json: {
        status: { code: 200, message: "Account deleted successfully." },
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
