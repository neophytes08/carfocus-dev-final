Rails.application.routes.draw do

  get 'user_infos/index'

  resources :categories
  resources :manufacturers, except: :show
  resources :users, except: :show
  resources :user_infos, except: :show 
  resources :inventories, except: :show
  resources :services, except: :show
  resources :job_orders, except: :show
  resources :customers, except: :show
  resources :logs, except: :show
  resources :estimations, except: :show
  devise_for :users
    
  devise_scope :user do

    authenticated :user do
      root 'users#index', as: :authenticated_root
      # get '*path' => 'application#index'
      get '/user_infos/settings' => 'user_infos#settings', as: 'users_settings'

      post '/inventories/createInventory' => 'inventories#createInventory'

      # submit routes
      post '/inventories/submitDirectPurchase' => 'inventories#submitDirectPurchase'
      post '/inventories/submitProductOrder' => 'inventories#submitProductOrder'
      post '/manufacturers/submitManufacturer' => 'manufacturers#submitManufacturer'
      post '/customers/submitCustomerInfo' => 'customers#submitCustomerInfo'
      post '/estimations/submitEstimation' => 'estimations#submitEstimation'
      post '/estimations/saveServiceDetails' => 'estimations#saveServiceDetails'
      post '/estimations/savePartNeeds' => 'estimations#savePartNeeds'
      post '/users/createUser' => 'users#createUser'
      post '/services/createService' => 'services#createService'

      # get list
      get '/inventories/getInventoryStocks' => 'inventories#getInventoryStocks'
      get '/inventories/getProductOrderList' => 'inventories#getProductOrderList'
      get '/manufacturers/getManufacturerList' => 'manufacturers#getManufacturerList'
      get '/inventories/getDirectPurchases' => 'inventories#getDirectPurchases'
      get '/services/getServices' => 'services#getServices'
      get '/customers/getCustomerInfo' => 'customers#getCustomerInfo'
      get '/inventories/getLatestInventory' => 'inventories#getLatestInventory'
      get '/logs/getLogs' => 'logs#getLogs'
      get '/inventories/getAvailableStockList' => 'inventories#getAvailableStockList'
      get 'estimations/getEstimationList' => 'estimations#getEstimationList'
      get '/services/:id/showCustomerServices' => 'services#showCustomerServices'
      get '/estimations/:id/readyForJobOrder' => 'estimations#readyForJobOrder'
      get '/job_orders/showJobOrder' => 'job_orders#showJobOrder'
      get '/job_orders/:id/jobDone' => 'job_orders#jobDone'
      get '/job_orders/:id/jobUnDone' => 'job_orders#jobUnDone'
      get '/users/getUserInfo' => 'users#getUserInfo'

      #update routes
      post '/inventories/:id/updateInventoryStocks' => 'inventories#updateInventoryStocks'
      post '/inventories/:id/updateProductOrder' => 'inventories#updateProductOrder'
      post '/inventories/:id/updateDirectPurchase' => 'inventories#updateDirectPurchase'
      post '/users/updateUser' => 'users#updateUser'
      post '/services/:id/updateService' => 'services#updateService'
      post '/manufacturers/:id/updateManufacturer' => 'manufacturers#updateManufacturer'
      # delete routes
      get '/inventories/:id/deleteProductOrder' => 'inventories#deleteProductOrder'
      get '/inventories/:id/deleteDirectPurchase' => 'inventories#deleteDirectPurchase'  
      get 'inventories/:id/deleteInventoryStock' => 'inventories#deleteInventoryStock'
      get '/services/:id/deleteService' => 'services#deleteService'
      get '/users/:id/deleteUser' => 'users#deleteUser'
      get '/users/:id/resetUser' => 'users#resetUser'
      get '/estimations/:id/deleteEstimation' => 'estimations#deleteEstimation'
      # end of on stock routes
    end

    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end

  end
  
end
