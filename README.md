# Twitter Wall ~ Newcastle Graduates 2016 (work in progress)
This project is a TwitterWall created by the Newcastle 2016 graduates. 

As this project is a work in progress, you may/will encounter some bugs.

# Technologies:
Backend: .NET Core 1.0, Docker (for deployment)
Frontend: Angular 2.0 with TypeScript

# Requirements:
Node.js
.NET Core 1.0.1

# How to install this awesome project:
First, clone the repo.

Next, run "npm install". This should install any dependencies and also run the neccesary gulp tasks.

Now, you need to edit the configuration file for your twitter account. 
    1) First, go to https://apps.twitter.com and login with your twitter credentials.
    2) Create a new application.
    3) Within your new application, click on the 'Keys and Access Tokens' tab.
    4) Copy the relevant keys into /Twitter/StreamConfig.json.example (you may need to generate your access tokens beforehand)
    5) Finally, rename the StreamConfig.json.example file to StreamConfig.json

Finally, run "dotnet restore" and then "dotnet run" to run the server.

# Tests:
The project currently uses xUnit for backend testing. To run these tests, use "dotnet test".
For frontend, Karma (I know right...) and Jasmine are used. To run the frontend tests, use "npm test".

# Demo:
You can see a live version at: http://twitter-wall-ncl.herokuapp.com

# Contributors:
Ben Lambert
Justas Miknys
Marcus Redgrave-Close