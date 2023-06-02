#!/bin/sh

docker container prune
docker rmi fwe-fitnessapp-backend:latest
docker rmi fwe-fitnessapp_backend:latest
docker rmi fwe-fitnessapp_frontend:latest
docker volume rm db-data
docker-compose up