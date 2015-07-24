require 'test_helper'

class UserInfosControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

end
