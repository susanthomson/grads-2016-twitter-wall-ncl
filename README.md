# Twitter Wall ~ Newcastle Graduates 2016
This project is a TwitterWall created by the Newcastle 2016 graduates. 

## Technologies:
Backend: .NET Core 1.0.  
Frontend: Angular 2.0 with TypeScript. D3.js is also used for visualising the tweets.  
For deployment, Docker is used.

## Requirements:
Node.js
.NET Core 1.0.1

## How to install this awesome project:
1) First, clone the repo.  

2) Next, run "npm install". This should install any dependencies and also run the neccesary gulp tasks.

3) Now, you need to edit the configuration file for your twitter account.  
* First, go to https://apps.twitter.com and login with your twitter credentials.
* Create a new application.
* Within your new application, click on the 'Keys and Access Tokens' tab.
* Copy the relevant keys into /Utility/Config.example.json (you may need to generate your access tokens beforehand)
* Finally, rename the Config.example.json file to Config.json
	
4) You need to also setup the database. Simply run "dotnet update-database" in a terminal under TwitterWall/src/TwitterWall

5) Finally, run "dotnet restore" and then "dotnet run" to run the server.

## Tests:
The project currently uses xUnit for backend testing. To run these tests, use "dotnet test".
For frontend, Karma and Jasmine are used. To run the frontend tests, use "npm test".

## Demo:
You can see a live version at: http://twitter-wall-ncl.herokuapp.com

## Contributors:
* Ben Lambert
* Justas Miknys
* Marcus Redgrave-Close
