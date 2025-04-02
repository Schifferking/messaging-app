# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  include RackSessionFix
  respond_to :json
  before_action :configure_sign_in_params, only: [:create]

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:create, keys: [user: %i[email password]])
  end

  private

  # override respond_with to send jwt token to frontend
  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  # override to revoke jwt token
  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
