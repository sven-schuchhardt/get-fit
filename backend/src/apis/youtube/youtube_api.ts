const axios = require("axios");
import { rapidApiOptions } from "./youtube_api-rapidapi.config";

async function getData(options: any, query: string) {
    options.params.query = query;
    
     return  await axios.request(options).then(function (response: { data: any; }) {
         console.log(response.data.contents[0].video.videoId);
         return response.data.contents[0].video.videoId;
     }).catch(function (error: any) {
         console.error(error);
    });
    
}

export const getLink = async function (name: string) {
    return await getData(rapidApiOptions, name);
}