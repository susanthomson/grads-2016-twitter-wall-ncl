# Twitter Wall ~ Newcastle Graduates 2016
This project is a TwitterWall created by the Newcastle 2016 graduates.  
  
See a live version at: http://twitter-wall-ncl.herokuapp.com

## Technologies:
Backend: .NET Core 1.0.  
Frontend: Angular 2.0 with TypeScript and D3.js.  
For deployment, Docker is used.

## Requirements:
Node.js
.NET Core 1.0.1

## Installation:
1) First, clone the repo and cd into Twitterwall/src/Twitterwall.  

2) Run "npm install".

3) Edit the configuration file for your twitter account.  
* Go to https://apps.twitter.com and login with your twitter credentials.
* Create a new application.
* Set the callback to http://address:port/api/login/callback, a separate app will be needed for production (only 1 callback allowed per app)
* Click on the 'Keys and Access Tokens' tab.
* Copy the relevant keys into /Utility/Config.example.json (you may need to generate your access tokens beforehand).
* Rename the Config.example.json file to Config.json.
	
4) To setup the database.
* Enter the connection string for the database in Config.json.  
* Run "dotnet ef database update" after the database has been created (see below).

5) Run "dotnet restore & dotnet run".

6) Add a user as an admin to the Users table. Fields required are the users handle and the type of "ADMIN" as well as the UserId, which can be found at http://mytwitterid.com/.

## Database:
The database used is PostgreSQL. The simplest way to set up the database is to download the pgAdmin program and create a new server. The parameters
for the connection string can all be seen during/after the database has been created.  
  
LocalDB can also be used, but requires a new set of migrations to be generated.

## Continuous Intergration:
* CircleCI is used for continuous intergration/deployment.
* Add a HEROKU\_APP\_NAME environment variable, with the value of the heroku app name.
* CircleCI also requires the other environment variables (see below).

## Production:
* Environment variables are used in the production environment instead of the config file.
* These environment variables are the same as the variables in the config file, and can be added through the web interface of both CircleCI and Heroku.
* Heroku provides a PostgreSQL database that can be used. You will need to update this database in the same way as before, 
but use the connection string for the remote database instead of a local database.

## Tests:
The project currently uses xUnit for backend testing. To run these tests, use "dotnet test".
For frontend, Karma and Jasmine are used. To run the frontend tests, use "npm test".

## Contributors:
* Ben Lambert
* Justas Miknys
* Marcus Redgrave-Close
