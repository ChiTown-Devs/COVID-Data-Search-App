//County to be taken from user
let county = 'Cook';
//State to be taken from user 
let state = 'Illinois';
//URL to use in AJAX call
const url = `https://covid-19-statistics.p.rapidapi.com/reports?iso=USA&region_name=US&q=US%20${state}`;

//Settings copied from https://rapidapi.com/axisbits-axisbits-default/api/covid-19-statistics?endpoint=apiendpoint_ef9e1955-666c-43ba-9b5c-4b463ae316dc
const settings = {
	"async": true,
	"crossDomain": true,
	"url": url,
    "method": "GET",
    //API access authorization
	"headers": {
		"x-rapidapi-key": "27050d1f2fmshfc0b823ac0ddb7dp1c3b8cjsncc4aa8aabe80",
		"x-rapidapi-host": "covid-19-statistics.p.rapidapi.com"
	}
};

//AJAX call to retrieve county COVID info
$.ajax(settings).done(function (response) {
    //console.log(response);
    //Array of counties within the state
    let cities = response.data[0].region.cities
    //Loop that looks for the user's county
    cities.forEach(city => {
        if (city.name === county) {
            console.log(city.name, city.confirmed, city.confirmed_diff, city.deaths, city.deaths_diff);
        }
    });
});