app
  .factory( "CarServer" , [
    "$http",
    function factory ( $http ) {
      var host = "http://128.199.117.211/";
      // var host = "http://localhost:3000";

      this.request  = function request ( method , path , callback , data ) {
        $http[ method ]( host + path , ( data || { } ) )
        .success( function ( response ) {
          callback( response );
        } );
      }

      return this;
    }
  ]);
