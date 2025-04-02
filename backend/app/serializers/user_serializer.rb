class UserSerializer
  include JSONAPI::Serializer
  attributes :avatar, :id, :email, :created_at
end
