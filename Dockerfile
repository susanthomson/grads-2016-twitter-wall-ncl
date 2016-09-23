FROM microsoft/dotnet:latest

RUN ["mkdir", "/tmp/app"]
COPY TwitterWall/src/TwitterWall /tmp/app
WORKDIR /tmp/app

RUN ["dotnet", "restore"]
RUN ["dotnet", "publish", "-o", "/app"]

WORKDIR /app

EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000

CMD dotnet /app/app.dll
