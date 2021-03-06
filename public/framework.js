var contactSearchCallback;

window.Framework = {
    config: {
        name:"testApp",
        clientIds: {
            'mypurecloud.com': 'bd13529b-865c-4ffd-8f07-e055a9eb5a76',
            'mypurecloud.ie': '',
            'mypurecloud.com.au': '',
            'mypurecloud.jp': ''
        },
        customInteractionAttributes: ['PT_URLPop', 'PT_SearchValue', 'PT_TransferContext'],
        settings: {
            embedWebRTCByDefault: true,
            hideWebRTCPopUpOption: false,
            enableCallLogs: true,
            enableTransferContext: true,
            hideCallLogSubject: true,
            hideCallLogContact: false,
            hideCallLogRelation: false
        }
    },

    initialSetup: function () {
        window.PureCloud.subscribe([
            {
                type: 'Interaction', 
                callback: function (category, interaction) {
                    window.parent.postMessage(JSON.stringify({type:"interactionSubscription", data:{category:category, interaction:interaction}}) , "*");
                }  
            },
            {
                type: 'UserAction', 
                callback: function (category, data) {
                    window.parent.postMessage(JSON.stringify({type:"userActionSubscription", data:{category:category, data:data}}) , "*");
                }  
            }
        ]);

        window.addEventListener("message", function(event) {
            var message = JSON.parse(event.data);
            if(message){
                if(message.type == "clickToDial"){
                    window.PureCloud.clickToDial(message.data);
                } else if(message.type == "addAssociation"){
                    window.PureCloud.addAssociation(message.data);
                }else if(message.type == "addAttribute"){
                    window.PureCloud.addCustomAttributes(message.data);
                }else if(message.type == "addTransferContext"){
                    window.PureCloud.addTransferContext(message.data);
                }else if(message.type == "sendContactSearch"){
                    if(contactSearchCallback) {
                        contactSearchCallback(message.data);
                    }
                }else if(message.type == "updateUserStatus"){
                    window.PureCloud.User.updateStatus(message.data);
                }else if(message.type == "updateInteractionState"){
                    window.PureCloud.Interaction.updateState(message.data);
                }
            }

        });
    },
    screenPop: function (searchString, interaction) {
        window.parent.postMessage(JSON.stringify({type:"screenPop", data:{searchString:searchString, interactionId:interaction}}) , "*");
    },
    processCallLog: function (callLog, interaction, eventName, onSuccess, onFailure) {
        window.parent.postMessage(JSON.stringify({type:"processCallLog" , data:{callLog:callLog, interactionId:interaction, eventName:eventName}}) , "*");
        var success = true;
        if (success) {
            onSuccess({
                id: callLog.id || Date.now()
            });
        } else {
            onFailure();
        }
    },
    openCallLog: function(callLog, interaction){
        window.parent.postMessage(JSON.stringify({type:"openCallLog" , data:{callLog:callLog, interaction:interaction}}) , "*");
    },
    contactSearch: function(searchString, onSuccess, onFailure) {
        contactSearchCallback = onSuccess;
        window.parent.postMessage(JSON.stringify({type:"contactSearch" , data:{searchString:searchString}}) , "*");
    }
};