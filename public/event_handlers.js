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
    var len = document.getElementById("InputTable").rows.length;
    var colsArray = [];
    var colTypeArray = [];

    var table = document.getElementById("InputTable");
    for (var i = 1, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            if(j == 0) {
                colsArray.push(table.rows[i].cells[j].children[0].value);
            } else if (j == 1) {
                if(table.rows[i].cells[j].children[0].checked) {
                    colTypeArray.push([table.rows[i].cells[0].children[0].value, "cell"]);
                }
            } else if (j == 2) {
                if(table.rows[i].cells[j].children[0].checked) {
                    colTypeArray.push([table.rows[i].cells[0].children[0].value, "home"]);
                }
            }       
        }  
    }

    var contactList = {
        "ContactListId": null,
        "ContactListName": contactListName,
        "ColumnName": colsArray.toString(),
        "ColumnType": colTypeArray.toString()
    }

    $.ajax({
        type: "POST",
        data: contactList,
        url: "/createContactList",
        dataType: "JSON"
    }).done(function(){
        window.location.reload(true);
    })
}

function insRow() {
    var tableRef = document.getElementById('InputTable').getElementsByTagName('tbody')[0];    
    var newRow  = tableRef.insertRow(tableRef.rows.length); 

    var cell0 = newRow.insertCell(0);
    var in0 = document.createElement("input");
    in0.setAttribute("type", "text");
    cell0.appendChild(in0);

    var cell1 = newRow.insertCell(1);
    var in1 = document.createElement("input");
    in1.setAttribute("type", "checkbox");
    cell1.appendChild(in1);

    var cell2 = newRow.insertCell(2);
    var in2 = document.createElement("input");
    in2.setAttribute("type", "checkbox");
    cell2.appendChild(in2);
  }

function createContact(contactListName) {
    var contact = {};

    $.ajax({
        type: "GET",
        url: "/contacts/" + contactListName,
        success:function(response){
            var list = response.list;
            var ColumnName = (list.map((entry) => entry.ColumnName)).toString().split(",")
            var col;

            for(var column in ColumnName) {
                col = ColumnName[column].replace(/\s+/g, '');
                contact[ColumnName[column]] = document.getElementById(col).value;
            }

            contact["ContactList"] = contactListName;

            $.ajax({
                type: "POST",
                data: contact,
                url: "/addcontact",
                dataType: "JSON"
            })

            window.location.reload(true);
        }
    })
}