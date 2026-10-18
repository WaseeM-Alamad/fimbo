FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/Fimbo.Api/Fimbo.Api.csproj ./Fimbo.Api/
RUN dotnet restore ./Fimbo.Api/Fimbo.Api.csproj

COPY backend/Fimbo.Api/ ./Fimbo.Api/
WORKDIR /src/Fimbo.Api

RUN dotnet publish Fimbo.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Fimbo.Api.dll"]
