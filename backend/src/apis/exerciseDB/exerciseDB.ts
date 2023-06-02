const axios = require("axios");
import { rapidApiOptions } from "./exerciseDB-rapidapi.config";

function getData(options: any) {
  return axios
    .request(options)
    .then((response: { data: any }) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
    });
}

export const getListOfEquipment = function () {
  rapidApiOptions.url =
    "https://exercisedb.p.rapidapi.com/exercises/equipmentList";

  return getData(rapidApiOptions);
};

export const getListOfExercises = function () {
  rapidApiOptions.url = "https://exercisedb.p.rapidapi.com/exercises";

  return getData(rapidApiOptions);
};

export const getListOfTargetMuscles = function () {
  rapidApiOptions.url =
    "https://exercisedb.p.rapidapi.com/exercises/targetList";

  return getData(rapidApiOptions);
};

export const getListOfBodyParts = function () {
  rapidApiOptions.url =
    "https://exercisedb.p.rapidapi.com/exercises/bodyPartList";

  return getData(rapidApiOptions);
};
