# ---- Build Stage ----
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY gradlew gradlew.bat settings.gradle build.gradle ./
COPY gradle/ gradle/
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# ---- Run Stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 18081
ENTRYPOINT ["java", "-jar", "app.jar"]
