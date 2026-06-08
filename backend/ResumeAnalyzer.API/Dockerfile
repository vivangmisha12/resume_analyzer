# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["ResumeAnalyzer.API.csproj", "./"]
RUN dotnet restore "./ResumeAnalyzer.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "ResumeAnalyzer.API.csproj" -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

# Copy the build output
COPY --from=build /app/publish .

# Set environment variable to run on port 8080 (Render's default expected port)
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ResumeAnalyzer.API.dll"]
