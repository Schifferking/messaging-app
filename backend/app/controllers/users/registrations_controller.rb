# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionFix
  respond_to :json

  def index
    users_data = User.excluding(current_user).map do |user|
      if user.avatar.attached?
        user.as_json(only: %i[id email]).merge(
          avatar_path: url_for(user.avatar)
        )
      else
        user.as_json(only: %i[id email])
      end
    end
    render json: {
      status: { code: 200, message: 'Fetched users data.' },
      data: { users: users_data }
    }, status: :ok
  end

  def show
    @user = User.find_by(id: params[:id])
    if @user
      user_data = @user.as_json(only: %i[email])
      user_data = user_data.merge(avatar_path: url_for(@user.avatar)) if @user.avatar.attached?
      render json: {
        status: { code: 200, message: 'Fetched user data.' },
        data: { user_data: user_data }
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: "Couldn't fetch user." }
      }, status: :unprocessable_entity
    end
  end

  def update
    @user = current_user
    if @user.update_without_password(params_update)
      render json: {
        status: { code: 200, message: 'Updated user data.' }
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: "Couldn't update user data." }
      }, status: :unprocessable_entity
    end
  end

  private

  def params_update
    params.permit(:avatar, :id)
  end

  def respond_with(resource, _opts = {})
    if request.method == 'POST' && resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    elsif request.method == 'DELETE'
      render json: {
        status: { code: 200, message: 'Account deleted successfully.' }
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
