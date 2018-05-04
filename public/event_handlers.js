// document.getElementById("clickToDial").addEventListener("click", clickToDial);
// document.getElementById("addAssociation").addEventListener("click", addAssociation);
// document.getElementById("addAttribute").addEventListener("click", addAttribute);
// document.getElementById('addTransferContext').addEventListener("click", addTransferContext);
window.addEventListener("message", function(event) {
    var message = JSON.parse(event.data);
    if(message){
        if(message.type == "screenPop"){
            //document.getElementById("screenPopPayload").value = event.data;
            //window.location.href = "";
            console.log('PWA' + event.data);
            //alert(message.data.searchString);
            window.location.href = "https://localhost/search/" + message.data.searchString;
            //console.log('PWAHAHA' + event.data);
        } else if(message.type == "processCallLog"){
            addCallLogs(message.data);
        } else if(message.type == "openCallLog"){
            //document.getElementById("openCallLogPayLoad").value = event.data;
        } else if(message.type == "interactionSubscription"){
            //document.getElementById("interactionSubscriptionPayload").value = event.data;
        } else if(message.type == "userActionSubscription"){
            //document.getElementById("userActionSubscriptionPayload").value = event.data;
        }
    }
});

function clickToDial(num) {
    console.log('process click to dial');
    document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
        type: 'clickToDial',
        data: { number: num, autoPlace: true }
    }), "*");
}

function addAssociation() {
    console.log('process add association');
    document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
        type: 'addAssociation',
        data: JSON.parse(document.getElementById("associationPayload").value)
    }), "*");
}

function addAttribute() {
    console.log('process add attribute');
    document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
        type: 'addAttribute',
        data: JSON.parse(document.getElementById("attributePayload").value)
    }), "*");
}

function addTransferContext() {
    console.log('process add Transfer Context');
    document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
        type: 'addTransferContext',
        data: JSON.parse(document.getElementById("transferContextPayload").value)
    }), "*");
}

function addCallLogs(callLogs) {
    if((callLogs.callLog.notes).length > 0)
    {
        var log = {
            "InteractionId": callLogs.interactionId.id,
            "Name": callLogs.interactionId.name, 
            "Number": callLogs.interactionId.phone, 
            "ConnectedTime": callLogs.interactionId.connectedTime, 
            "CallLogId" : callLogs.callLog.id, 
            "Notes": callLogs.callLog.notes
        }
        
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: "POST",
            data: log,
            url: "/addCallLogs",
            dataType: "JSON"
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {          
              $.getJSON( '/callLogs'); 
            }
        });
    }    
}