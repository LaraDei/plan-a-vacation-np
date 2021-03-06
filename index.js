'use strict';

// put your own value below!
const apiKey = 'QoYtDawIqtesWYYLyG28ryi7JkZfcnaWL5fzCUfY'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${params[key].replace(/ /g, '')}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  
  $('#results-list').empty();

  for (let i = 0; i < responseJson.data.length; i++){    
    let address = '';
    if(!responseJson.data[i].addresses[0]){
      address = responseJson.data[i].states
    } else {address =`${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}`
    }
    // // for each object in the data array, add a list item to the results 
    //list with the title, address, description, and url
    
    $('#results-list').append(
      `<li><h3><a href='${responseJson.data[i].url}'>${responseJson.data[i].fullName}</a></h3>
      <p>${address}</p>
      <p>${responseJson.data[i].description}</p>
      </li>`
    )
    
};
  //display the results section  
  $('#results').removeClass('hidden');
};

function cleanObj(params){
   for(var key in params){
     if(params[key].length === 0){
       delete params[key];
     }
   }
    return params;
}

function getParks(states, maxResults, searchTerm) {
  const params = {
    limit: maxResults,
    api_key: apiKey,
    stateCode: states,
    q: searchTerm,
  };


  const queryString = formatQueryParams(cleanObj(params))
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson =>  {
      if(responseJson.data.length === 0) {
        $('#js-error-message').text(`Sorry! Looks like there aren't any results matching ${searchTerm} in ${states}. Please try again.`)
      } 
      displayResults(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
      $('#results-list').empty();
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#js-error-message').empty();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const searchStates = $('#js-search-state').val();
    getParks(searchStates, maxResults, searchTerm);
  });
}

$(watchForm);