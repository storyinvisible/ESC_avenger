angular.module('sample').component('rbxContact', {
    bindings: {
        item: '<'
    },
    controller : function(rainbowSDK, $scope) {

		this.$onInit = function () {
			var ctrl = $scope;

			$scope.isConnectedUser = false;

			$scope.createConversation = function() {
				rainbowSDK.conversations.openConversationForContact($scope.$ctrl.item)
				.then(function(conversation) {
					console.log("Jessie, createConversation");	
					//rainbowSDK.im.sendMessageToConversation($scope.conversation, "Hello this is agent");
					//conversation.sendExistingMessage("Hello, this is agent");
					console.log("Jessie, sendMessageToConversation");	
				}).catch(function() {
					console.log("ERROR");
				});
			};

			$scope.closeConversation = function() {
				rainbowSDK.conversations.closeConversation($scope.$ctrl.item.conversation).then(function(conversation) {
					console.log("Jessie, closeConversation");
					//add connection to server
					var data1={
						conversationInfo: conversation.contact
						// name:$scope.user.name,
						// speciality:$scope.selectedSpeciality.name
					  };
					 
					  var post_message={
						type: 'POST',
						//data: JSON.stringify($scope.selectedSpeciality.name),
						data: JSON.stringify(data1),
						contentType: 'application/json',
						url:'http://localhost:8080/endconversation',
						async: false,
						dataType: 'json',
						};
					  var user_detail={}
					  post_message.success = function(data){
						console.log("Jessie, Success");
						console.log(JSON.stringify(data));
						user_detail=data;
					  }
					 
					  $.ajax(post_message)
				}).catch(function() {
					console.log("ERROR");
				});
			}

			if(this.item.id === rainbowSDK.contacts.getConnectedUser().id) {
				console.log("Remove button");
				$scope.isConnectedUser = true;
			}
		}
    },
    templateUrl: './src/js/components/contacts/contactCmp.template.html' 
});