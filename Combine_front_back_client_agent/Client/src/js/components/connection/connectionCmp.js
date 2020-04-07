angular.module("sample").component("rbxConnection", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope) {
    $scope.isConnected = false;

    $scope.isLoading = false;

    $scope.state = rainbowSDK.connection.getState();

    $scope.hosts = [
      {
        id: 0,
        value: "sandbox",
        name: "Rainbow Sandbox"
      },
      {
        id: 1,
        value: "rainbow",
        name: "Rainbow Official"
      }
    ];

    $scope.specialities = [
      {
        id: 0,
        value: "finance",
        name: "finance"
      },
      {
        id: 1,
        value: "technical",
        name: "technical"
      },
      {
        id: 2,
        value: "management",
        name: "management"
      },
      {
        id: 3,
        value: "HR",
        name: "HR"
      },
    ];

    $scope.selectedItem = $scope.hosts[0];
    $scope.selectedSpeciality = $scope.specialities[0];

    var handlers = [];

    $scope.signin = function() {
      $scope.isLoading = true;

      saveToStorage();

      var data1={
        speciality: $scope.selectedSpeciality,
        FirstName: $scope.user.firstname,
        LastName: $scope.user.lastname, 
      }

      var user_detail={}
      var post_message={
        type: 'GET',
        data: data1,
        contentType: 'application/json',
        url:'http://localhost:3007/getUserAccount',
        async: false,
        dataType: 'json',
      };
      var user_detail={}
      post_message.success = function(data){
        console.log("Sucess");
        console.log(JSON.stringify(data));
        user_detail=data;
      }

      $.ajax(post_message);

      switch ($scope.selectedItem.value) {
        case "rainbow":
          rainbowSDK.connection
            .signinOnRainbowOfficial(user_detail.email, user_detail.password)
            //.signinOnRainbowOfficial("664276@qq.com", "Asd@123456")
            .then(function(account) {
              console.log("[DEMO] :: Successfully signed!");
              $scope.isLoading = false;
              $scope.isConnected = true;
            })
            .catch(function(err) {
              console.log("[DEMO] :: Error when sign-in", err);
              $scope.isLoading = false;
              $scope.isConnected = false;
            });
          $scope.createConversation = function() {
              rainbowSDK.conversations.openConversationForContact($scope.$ctrl.item)
              .then(function(conversation) {
                console.log("**************Create coversation when connecting")
              }).catch(function() {
                console.log("ERROR");
              });
            };
          break;
        default:
          rainbowSDK.connection
            .signin($scope.user.name, $scope.user.password)
            //.signin("li.jiaxi97@gmail.com", "P#uc9O6nLf(6")
            .then(function(account) {
              console.log("[DEMO] :: Successfully signed!");
              $scope.isLoading = false;
              $scope.isConnected = true;
            })
            .catch(function(err) {
              console.log("[DEMO] :: Error when sign-in", err);
              $scope.isLoading = false;
              $scope.isConnected = false;
            });
          break;
      }
    };

    $scope.signout = function() {
      $scope.isLoading = true;
      rainbowSDK.connection.signout().then(function() {
        $scope.isLoading = false;
        $scope.isConnected = false;
      });
    };

    var saveToStorage = function() {
      sessionStorage.connection = angular.toJson($scope.user);
      sessionStorage.host = angular.toJson($scope.selectedItem);
    };

    var readFromStorage = function() {
      if (sessionStorage.connection) {
        $scope.user = angular.fromJson(sessionStorage.connection);
      } else {
        // $scope.user = { name: "", password: "" };
      }

      if (sessionStorage.host) {
        $scope.selectedItem =
          $scope.hosts[angular.fromJson(sessionStorage.host).id];
      } else {
        $scope.selectedItem = $scope.hosts[0];
      }
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      $scope.state = rainbowSDK.connection.getState();
    };

    this.$onInit = function() {
      // Subscribe to XMPP connection change
      handlers.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );
    };

    this.$onDestroy = function() {
      var handler = handlers.pop();
      while (handler) {
        handler();
        handler = handlers.pop();
      }
    };

    var initialize = function() {
      readFromStorage();
    };

    initialize();
  },
  templateUrl: "./src/js/components/connection/connectionCmp.template.html"
});
