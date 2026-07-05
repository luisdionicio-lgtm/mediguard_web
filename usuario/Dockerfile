# Imagen de desarrollo local para el microservicio "usuario" (Spring Boot).
# Multi-stage: compila con Maven y ejecuta solo el jar resultante.
# No cambia application.properties ni ninguna lógica de la app.

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
