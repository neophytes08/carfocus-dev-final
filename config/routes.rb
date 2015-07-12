Rails.application.routes.draw do

  get 'customers/index'

  get 'customers/show'

  get 'categories/index'

  get 'services/index'

  resources :user, :categories, :manufacturers
  resources :inventories, except: :show
  resources :services, except: :show
  resources :job_orders, except: :show
  resources :customers, except: :show
  devise_for :users
    
  devise_scope :user do

    authenticated :user do
      root 'user#index', as: :authenticated_root
      # get '*path' => 'application#index'
      get '/user/settings' => 'user#settings', as: 'user_settings'

      post '/inventories/createInventory' => 'inventories#createInventory'

      # submit routes
      post '/inventories/submitDirectPurchase' => 'inventories#submitDirectPurchase'
      post '/inventories/submitProductOrder' => 'inventories#submitProductOrder'
      post '/manufacturers/submitManufacturer' => 'manufacturers#submitManufacturer'
      post '/job_orders/submitJobOrder' => 'job_orders#submitJobOrder'
      post '/customers/submitCustomerInfo' => 'customers#submitCustomerInfo'
      # get list
      get '/inventories/getInventoryStocks' => 'inventories#getInventoryStocks'
      get '/inventories/getProductOrderList' => 'inventories#getProductOrderList'
      get '/inventories/getManufacturerList' => 'inventories#getManufacturerList'
      get '/inventories/getDirectPurchases' => 'inventories#getDirectPurchases'
      get '/services/getServices' => 'services#getServices'
      get '/customers/getCustomerInfo' => 'customers#getCustomerInfo'
      #update routes
      post '/inventories/:id/updateInventoryStocks' => 'inventories#updateInventoryStocks'
      post '/inventories/:id/updateProductOrder' => 'inventories#updateProductOrder'
      post '/inventories/:id/updateDirectPurchase' => 'inventories#updateDirectPurchase'

      # delete routes
      get '/inventories/:id/deleteProductOrder' => 'inventories#deleteProductOrder'
      get '/inventories/:id/deleteDirectPurchase' => 'inventories#deleteDirectPurchase'  
      get 'inventories/:id/deleteInventoryStock' => 'inventories#deleteInventoryStock'
      # end of on stock routes
    end

    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end

  end
  
end
