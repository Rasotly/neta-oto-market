# 1. Aşama: Derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Bağımlılıkları yükle
COPY ["NetaOtoMarket.API.csproj", "./"]
RUN dotnet restore "NetaOtoMarket.API.csproj"

# Projeyi derle ve yayınla
COPY . .
RUN dotnet publish "NetaOtoMarket.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Aşama: Çalıştırma (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "NetaOtoMarket.API.dll"]