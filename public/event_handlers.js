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

function createContactList() {
    var contactListName = document.getElementById("contactName").value;
    var columnName = "";
    var columnType = "";
    var postCounter = 0; //workaround for tracking the finished ajax requests before starting the pureclud request

    for(x=1; x<=6; x++){
        columnName = document.getElementById("input" + x).value;
        
        if(document.getElementById("input" + x + "cell").checked) {
            columnType = "cell";
        } else if (document.getElementById("input" + x + "home").checked) {
            columnType = "home";
        }

        var contactList = {
            "ContactListId": null,
            "ContactListName": contactListName,
            "ColumnName": columnName,
            "ColumnType": columnType
        }

        $.ajax({
            type: "POST",
            data: contactList,
            url: "/createContactList",
            dataType: "JSON"
        }).done(function(){
            // Counter for thread safety
            postCounter++;
            console.log(postCounter);
            if(postCounter === 5){ 
                window.location.reload(true);
            }
        })

        columnType = "";
    }

    //$.getJSON( '/contactlist');
}


function createContact() {
    var firstName = document.getElementById("FirstName").value;
    var lastName = document.getElementById("LastName").value;
    var cellPhone = document.getElementById("CellPhone").value;
    var homePhone = document.getElementById("HomePhone").value;
    var company = document.getElementById("Company").value;
    var email = document.getElementById("Email").value;
    var contactList = document.getElementById("ContactList").value;

    var contact = {
        "FirstName": firstName,
        "LastName": lastName,
        "CellPhone": cellPhone,
        "HomePhone": homePhone,
        "Company": company,
        "Email": email,
        "ContactList": contactList
    }

    $.ajax({
        type: "POST",
        data: contact,
        url: "/addcontact",
        dataType: "JSON"
    })

    window.location.reload(true);
}