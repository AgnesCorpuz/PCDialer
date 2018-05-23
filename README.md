# PureCloud Dialer #

### What is this repository for? ###

This is a sample project using PureCloud Embeddable Framework and PureCloud SDK. This project is written in Node JS using Express and Mongo DB as the database.

### PureCloud Embeddable Framework ###

Different functions of the PureCloud Embeddable Framework are used in this project such as Click to Dial, Screen Pop Up and Process Call Logs. Visit this [site](https://developer.mypurecloud.com/api/embeddable-framework/) for more information about Embeddable Framework. For details how to create your own framework.js file, click [here](https://developer.mypurecloud.com/api/embeddable-framework/create-file.html).


### PureCloud SDK ###

This application show how PureCloud Platform APIs is called from the client. Outbound APIs are called in this project such as creating a contact list, adding contacts to a contact list and creating a campaign.

#### PureCloud Javascript SDK ####

For details on how to integrate with [PureCloud SDK](https://developer.mypurecloud.com/api/rest/client-libraries/javascript/), client libraries are provided which wrap the REST calls in a simple to use interface. 
There are two ways of using the Javascript SDK for web app:

1. Client-Side Usage
  * Local file or CDN reference
  * Uses Implicit Grant Authentication
2. Server-Side Usage
  * Uses NodeJS
  * Uses Client Credentials Authentication

This demo uses NodeJS and Client Credentials for Authentication.

#### Overview ####

These are the functionalities that directly make calls to the PureCloud API for Outbound Dialing:
1. Creation of Contact List ([/api/v2/outbound/contactlist](https://developer.mypurecloud.com/api/rest/v2/outbound/index.html#postOutboundContactlists)) 
2. Adding Contacts to the Contact List ([/api/v2/outbound/contactlists/{contactListId}](https://developer.mypurecloud.com/api/rest/v2/outbound/index.html#putOutboundContactlistsContactlistId))
3. Creation of Campaign ([/api/v2/outbound/campaigns](https://developer.mypurecloud.com/api/rest/v2/outbound/index.html#postOutboundCampaigns)) - For the creation of the Campaign it’s also required to pull up the Queues and the Contact Lists from the org.
4. Getting Progress of Campaign ([/api/v2/outbound/campaigns/{campaignId}/progress](https://developer.mypurecloud.com/api/rest/v2/outbound/index.html#getOutboundCampaignsCampaignIdProgress))

#### Testing API Calls ####

PureCloud has an [API Explorer](https://developer.mypurecloud.com/developer-tools/#/api-explorer) to test API calls in the currently logged in org instance.

### How do I get set up? ###

#### Prerequisites ####

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Purecloud OAuth Client Id](https://developer.mypurecloud.com/api/rest/authorization/use-implicit-grant.html) (Implicit Grant) – This will be used by Embedded Framework
* [PureCloud OAuth Client ID (Client Credentials)](https://developer.mypurecloud.com/api/rest/authorization/use-client-credentials.html) – This will be used by Platform API SDK
* [MongoDB](http://mongodb.com/)

##### Development Machine Set Up #####
Open Command Prompt and run:
```
windows: "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath C:\...\PCDialer\data
osx: mongod --dbpath C:\...\PCDialer\data
```

Open another Instance of Command Prompt and run:
```
"C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe"
```

Update framework.js file:
Copy and paste the Client ID (Implicit Grant) depending on the location to be used by the embedded agent interface.

Update config.js file:
Copy and paste the Client ID and Secret (Client Credentials) to be used by the Platform API SDK.

#### Viewing the page locally ####
Open Command Prompt to C:\...\PCDialer:
```
npm install
```

```
mac: run "sudo node app.js " in a terminal window
windows: run "node app.js: in a command prompt with elevated privileges. 

open web browser to https://localhost/

```