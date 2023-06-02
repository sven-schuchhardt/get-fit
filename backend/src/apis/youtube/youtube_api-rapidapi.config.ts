let options = {
  method: 'GET',
  url: 'https://youtube-search-and-download.p.rapidapi.com/search',
  params: {query: '', hl: 'en', type: 'v', sort: 'r'},
  headers: {
    'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
  }
};

export let rapidApiOptions = options;