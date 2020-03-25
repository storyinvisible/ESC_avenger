angular.module("sample").component("rbxContacts", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope) {
    $scope.isConnected = false;

    $scope.nbContacts = 0;

    $scope.contacts = [];

    var listeners = [];

    this.$onInit = function() {
      var ctrl = $scope;
      $scope.isConnectedUser = false;

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONSTARTED,
          onStarted
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.presence.RAINBOW_ONCONTACTPRESENCECHANGED,
          onContactPresenceChangeEvent
        )
      );

      // Subscribe to Contact information change connection changes
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactInformationChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactsInformationChanged
        )
      );

      $scope.sendMessage = function() {
        rainbowSDK.contacts.searchByName("RT Li", 1).then(function(usersFound) {
          if(usersFound.length > 0) {
              // At least one user has been found
              usersFound.forEach(function(user) {
                  // Do something with each contact returned
                  console.log("Jessie, contact found");
                  rainbowSDK.im.sendMessageToConversation(user.conversation, "Hello, I'm your agent!");
                  rainbowSDK.im.sendMessageToConversation(user.conversation, "My name is Jessie");
              });
          }
          else {
              // No contact returned
              console.log("Jessie, no contact found")
          }
        });
      }
      
      // if(this.item.id === rainbowSDK.contacts.getConnectedUser().id) {
			// 	console.log("Remove button");
			// 	$scope.isConnectedUser = true;
			// }
    };

    this.$onDestroy = function() {
      var listener = listeners.pop();
      while (listener) {
        listener();
        listener = listeners.pop();
      }
    };

    var onContactInformationChangeEvent = function onContactInformationChangeEvent(
      event
    ) {
      console.log("DEMO :: Contact information changed to ", event.detail);
    };

    var onContactPresenceChangeEvent = function onContactPresenceChangeEvent(
      event
    ) {
      console.log("DEMO :: presence changed to ", event.detail);
    };

    var countNumberOfContacts = function countNumberOfContacts() {
      $scope.nbContacts = Object.keys($scope.contacts).length;
    };

    var onStarted = function onReady() {
      $scope.contacts = rainbowSDK.contacts.getAll();
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else {
        $scope.isConnected = false;
        $scope.nbContacts = 0;
        $scope.contacts = {};
      }
    };

    var onContactsInformationChanged = function onContactsInformationChanged(
      event
    ) {
      var contact = event.detail;
      if (!(contact.id in $scope.contacts)) {
        $scope.contacts[contact.id] = contact;
        countNumberOfContacts();
      } else {
        // Track changes
      }
    };
  },
  templateUrl: "./src/js/components/contacts/contactsCmp.template.html"
});

