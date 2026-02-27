
## Quick Start (Local / Docker)

1. Clone repository
   

2. Create  from example (DO NOT commit )
   

3. Start services with Docker Compose
   #0 building with "default" instance using docker driver

#1 [backend internal] load build definition from Dockerfile
#1 transferring dockerfile: 483B done
#1 DONE 0.0s

#2 [backend internal] load metadata for docker.io/library/eclipse-temurin:17-jdk
#2 ...

#3 [backend internal] load metadata for docker.io/library/eclipse-temurin:17-jre
#3 DONE 0.7s

#2 [backend internal] load metadata for docker.io/library/eclipse-temurin:17-jdk
#2 DONE 0.7s

#4 [backend internal] load .dockerignore
#4 transferring context: 145B done
#4 DONE 0.0s

#5 [backend builder 1/7] FROM docker.io/library/eclipse-temurin:17-jdk@sha256:b624cb9175b71aaeb654dd9def666035332d5abf70318537c1a46e61564dbecd
#5 DONE 0.0s

#6 [backend stage-1 1/3] FROM docker.io/library/eclipse-temurin:17-jre@sha256:ff692acf872589e72ca71b416b3e949ec19f35ebe8abb5365d2f31bce298e762
#6 DONE 0.0s

#7 [backend internal] load build context
#7 transferring context: 3.33kB done
#7 DONE 0.0s

#8 [backend builder 4/7] COPY gradle/ gradle/
#8 CACHED

#9 [backend stage-1 2/3] WORKDIR /app
#9 CACHED

#10 [backend builder 3/7] COPY gradlew gradlew.bat settings.gradle build.gradle ./
#10 CACHED

#11 [backend builder 7/7] RUN ./gradlew bootJar --no-daemon -x test
#11 CACHED

#12 [backend builder 2/7] WORKDIR /app
#12 CACHED

#13 [backend builder 5/7] RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true
#13 CACHED

#14 [backend builder 6/7] COPY src/ src/
#14 CACHED

#15 [backend stage-1 3/3] COPY --from=builder /app/build/libs/*.jar app.jar
#15 CACHED

#16 [backend] exporting to image
#16 exporting layers done
#16 writing image sha256:2a4e1cdc282974ea121dd7e857f01e57a59a85d59888b41353565d2a46505707 done
#16 naming to docker.io/library/antibudget-backend done
#16 DONE 0.0s

#17 [backend] resolving provenance for metadata file
#17 DONE 0.0s

#18 [frontend internal] load build definition from Dockerfile
#18 transferring dockerfile: 334B done
#18 DONE 0.0s

#19 [frontend internal] load metadata for docker.io/library/nginx:alpine
#19 DONE 0.0s

#20 [frontend internal] load metadata for docker.io/library/node:20-alpine
#20 DONE 0.0s

#21 [frontend internal] load .dockerignore
#21 transferring context: 74B done
#21 DONE 0.0s

#22 [frontend stage-1 1/3] FROM docker.io/library/nginx:alpine
#22 DONE 0.0s

#23 [frontend builder 1/6] FROM docker.io/library/node:20-alpine
#23 DONE 0.0s

#24 [frontend internal] load build context
#24 transferring context: 947B done
#24 DONE 0.0s

#25 [frontend builder 5/6] COPY . .
#25 CACHED

#26 [frontend builder 2/6] WORKDIR /app
#26 CACHED

#27 [frontend builder 6/6] RUN npm run build
#27 CACHED

#28 [frontend builder 3/6] COPY package.json package-lock.json ./
#28 CACHED

#29 [frontend builder 4/6] RUN npm ci
#29 CACHED

#30 [frontend stage-1 2/3] COPY --from=builder /app/dist /usr/share/nginx/html
#30 CACHED

#31 [frontend stage-1 3/3] COPY nginx.conf /etc/nginx/conf.d/default.conf
#31 CACHED

#32 [frontend] exporting to image
#32 exporting layers done
#32 writing image sha256:c759ad5c61774fd3e66ef6f2f8e77acb05b488d0c240f9bff31c06b9aef5515d done
#32 naming to docker.io/library/antibudget-frontend done
#32 DONE 0.0s

#33 [frontend] resolving provenance for metadata file
#33 DONE 0.0s

4. Open the app
   - Frontend: http://localhost:3000
   - Backend (Swagger): http://localhost:18081/swagger-ui/index.html

Notes:
- For production, inject  via secret manager / CI secrets. Do not commit secrets to git.
- See DEPLOY.md for detailed deployment and secret management instructions.
