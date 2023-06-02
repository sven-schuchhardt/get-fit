![GetFIT-Logo](./readme_images/Logo.png)

# GetFIT - Fitness App

With GetFIT, users can optimally design and organize their personal fitness training behavior.
Key Features are: 
 - User management
 - Create personal training plans in different sports
 - Document training experience 
 - Track personal progress
 - Get the latest sports news
- Suggested exercises of the day

## Introduction

GetFit is a plattform that is potentially a home for every existing sports category out there. An overview of exercises organized in sport categories allows an user to discover and learn more about exercises and their details. 

Exercises provide informations like pictures or gifs to the exercise, videos for improving and understanding performing the exercise and more information about like description, targeted muscles and so on.

To make working out simple, GetFit provides the possibility to create an own exercise plan. User now can create their own exercise plan on provided exercises. To further improve training sessions of users and help them track there progress, GetFit provides diary feature to every created exercise plan. Tracking information about training sessions gets easier and provides bases for GetFit to show users with graphs their progress

In this version user can create an exercise plan in the category weighttraining and manage der exercise and diary entries.


## Installing / Getting started
Additional information or tagline

A quick introduction of the minimal setup you need to get a hello world up &
running.

To start the application locally, the repository must first be locally cloned:

- Git Clone with HTTPS:
git clone https://code.fbi.h-da.de/istsvscuc/fwe-fitnessapp.git


- Git Clone with SSH:
git clone git@code.fbi.h-da.de:istsvscuc/fwe-fitnessapp.git



### Initial Configuration

Some projects require initial configuration (e.g. access tokens or keys, npm i).
This is the section where you would document those requirements.

### Environments
The following keys must be written into an .env file and this must be in the same directory as 
[docker-compose.yml](./docker-compose.yml)

#### RadipAPI
You will get the key if you have subscribed one of the APIs below.

```sh
API_KEY =""
```

#### Database
```sh
MONGO_USER = ""
MONGO_PASSWORD = ""
MONGO_URL = ""
```

#### Run server || run tests
`start: backend start`
`test: run tests`

```sh
SCRIPT = 
```

#### Firebase Admin SDK
You have to generate the private key file, which contains all the necessary data.
`Project settings -> Service accounts -> Generate new private key`

```sh
TYPE = ""
PROJECT_ID = ""
PRIVATE_KEY_ID = ""
PRIVATE_KEY = ""
CLIENT_EMAIL = ""
CLIENT_ID = ""
AUTH_URI = ""
TOKEN_URI = ""
AUTH_PROVIDER_X509_CERT_URL = ""
CLIENT_X509_CERT_URL = ""
```

#### Firebase Client
You need to add a new web application to get the necessary keys.
`Add app -> Web -> Register app -> Add Firebase SDK -> firebaseConfig`

```sh
APIKEY = ""
AUTHDOMAIN = ""
STORAGEBUCKET = ""
MESSAGINGSENDERID = ""
APPID = ""
MEASUREMENTID = ""
```

## Developing

To start developing the project further:
Change to project directory:

cd fwe-fitnessapp


Run setup.sh to start the docker container:
>[Docker](https://www.docker.com/) needs to be running for this

setup.sh

## Techstack
* Docker
* Docker-Compose
* TypeScript

### Frontend
* React
* Material-UI
* TypeScript
* Vite

### Backend
* Node
* MikroORM
* Express
* MongoDB
* Firebase (only tests)
* Firebase Admin SDK

## Api Reference

### Frontend
* [News API for showing news section on Home Page](https://newsapi.org/s/google-news-api)

### Backend
* [Youtube Search and Download](https://rapidapi.com/h0p3rwe/api/youtube-search-and-download)
    * Endpoints:
        * Search videos/channels/playlists
* [ExerciseDB API Documentation](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
    * Endpoints:
        * List of bodyparts
        * List of target muscles
        * List of all exercises
        * List of equipment
* [yoga_api.json](https://github.com/rebeccaestes/yoga_api/blob/master/yoga_api.json)

### Route

### Frontend

every route that requires a logged in user requires the access token

| Route | Description | 
| -------- | -------- | 
| getWeightTrainingExerciseAll     | provides all weighttraining exercises related to specific user if user is logged in  
| getWithoutAuthWeightTrainingExercisesAllDefault | provides all default exercise that are in the database for non logged in users
|postWeightTrainingExercise| creates an exercise only if an user is logged in
|getWeightTrainingExercisePlanAll| returns all weighttraining exerciseplans for an logged in user
|putUserUpdateActivePlanId| sets the active exercise plan to the given plan id
|postWeightTrainingExercisePlan | only creates title and description for an exercise plan
|putWeightTrainingExercisePlanAddExercises| only for adding exercises to an weighttraining exercise plan
|postWeightTrainingExercisePlan and putWeightTrainingExercisePlanAddExercises are splitted to allow smaller transaction between backend and database



### Backend


| Route | Operation |Description | 
| -------- | -------- | -------- | 
| /withoutAuth/weightTrainingExercises/allDefault    | GET |  A route that is used to get all the default weight training exercises     | 
| /withoutAuth/yogaExercises/allDefault   | GET  |  A route that is used to get all the default yoga exercises     | 
| /auth/register | POST | Creating a new user |
| /user | GET | A route that is used to get the user data of the logged in user|
| /user/updateInformation | PUT | A route that updating the user information |
| /user/updateActivePlan | PUT | A route that updating the user's active plan |
| /user | DELETE | A route that deleting the user |
| /weightTrainingExercisePlan/one | GET | Get a single WeightTrainingExercisePlan by id |
| /weightTrainingExercisePlan/allByUser | GET | Get all the exercise plans for a user. |
| /weightTrainingExercisePlan/allCreatedByUser | GET | Returns all the exercise plans created by the user|
| /weightTrainingExercisePlan/allDefaultByUser | GET | Get all the default exercise plans for a user|
| /weightTrainingExercisePlan | POST | Create a new exercise plan |
| /weightTrainingExercisePlan/addExercise| PUT | Add an exercise to an exercise plan |
| /weightTrainingExercisePlan/updateExercise | PUT | Updae an exercise in an exercise plan |
| /weightTrainingExercisePlan/removeExercise | PUT | remove an exercise from an exercise plan |
| /weightTrainingExercisePlan | DELETE | Delete a new exercise plan |
| /weightTrainingExercise/one | GET | Get a single weight training exercise by id |
| /weightTrainingExercise/all | GET | Get all weight training exercises |
| /weightTrainingExercise | POST | Create a new weight training exercise |
| /weightTrainingExercise/updateBodyPart | PUT | Update the body part of a weight training exercise |
| /weightTrainingExercise/updateExercise | PUT | Updating the exercise |
| /weightTrainingExercise | DELETE | Delete a weight training exercise |
| /bodyPart/multi/ | GET | A get request that takes an array of bodyPart names and returns the bodyParts with those names |
| /bodyPart/all | GET | A get request that returns all the bodyParts in the database |
| /bodyPart/ | GET | Create a new bodyPart |
| /bodyPart/ | PUT | Update a bodyPart |
| /bodyPart/ | DELETE | Delete a bodyPart |
| /weightTrainingExerciseDiaryEntry/getSummarizedDataLastSevenDays | GET | Get the last 7 days of diary entries for the user |
| /weightTrainingExerciseDiaryEntry/byDatePlanUser | GET | Getting a diary entry by date, plan and user |
| /weightTrainingExerciseDiaryEntry | POST | Create a new WeightTrainingExerciseDiaryEntry |
| /weightTrainingExerciseDiaryEntry/updateDiaryEntry | PUT | Update a diary entry |
| /weightTrainingExerciseDiaryEntry/addRepetitionAndAmount | PUT | Add a new weight training exercise to a diary entry |
| /weightTrainingExerciseDiaryEntry/updateRepetitionAndAmount | PUT | Update the amount and repetitions of a diary entry |
| /weightTrainingExerciseDiaryEntry | DELETE |  Delete a diary entry |















