# Deployment & Secrets (AntiBudget)

This file explains how to safely provide secrets (like DB passwords) and how to run the project locally or with Docker Compose.

## Required environment variables
-  — PostgreSQL password for  user (required in runtime).

## Local development (recommended)
1. Copy  to  and fill in values (do NOT commit ):
   
2. Start services with Docker Compose:
   
3. The backend will read the DB password from  environment variable.

## Docker Compose (production-ish)
- Use the  file or an external secret manager to inject  into the Compose environment.
- Example  uses  so set the variable in your environment or  file.

## Kubernetes (recommended for production)
1. Create a Kubernetes secret:
   
2. Reference it in your Deployment manifest:
   

## CI/CD (e.g. GitHub Actions)
- Store  in repository or organization secrets and inject as an environment variable in the workflow:
  

## Important notes
- DO NOT commit  or any file containing secrets to git.
- If a secret was accidentally committed, rotate the secret immediately and remove it from git history using  or BFG.

