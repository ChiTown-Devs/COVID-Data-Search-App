//Function to retrieve geolocation info
$("#currentLocation").on("click", function() {
	$('#responseDiv').html('')
	//Settings copied from https://rapidapi.com/fcambus/api/telize?endpoint=5c082424e4b067d7d9560ca2
	const geoSettings = {
		"async": true,
		"crossDomain": true,
		"url": "https://telize-v1.p.rapidapi.com/geoip",
		"method": "GET",
		//API access authorization
		"headers": {
			"x-rapidapi-key": "79f7ca8118msh020414b1e09c65cp1220e3jsn80b7757a036d",
			"x-rapidapi-host": "telize-v1.p.rapidapi.com"
		}
	};

	//AJAX call to retrieve location
	$.ajax(geoSettings).done(function (response) {
		let zipCode = response.postal_code;
		
		//Calls zip code API function
		retrieveCounty(zipCode)
	});
});

//Function to retrieve the county name via zip code
function retrieveCounty(zipCode) {
	const countyKey = "D7K6W4KICQXNF9IXO9DY"
	const zipurl = "https://api.zip-codes.com/ZipCodesAPI.svc/1.0/GetZipCodeDetails/" + zipCode + "?key=" + countyKey;

	//Settings copied from https://api.zip-codes.com/ZipCodesAPI.svc/1.0/GetZipCodeDetails/
	const dataSettings = {
	url: zipurl,
	method: "GET"
	};

	//AJAX call to zip code API
	$.ajax(dataSettings).done(function (response) {
		let countyName = response.item.CountyName;
		let stateAbbrName = response.item.State;
		let stateName = statesFullName[statesAbbrev.indexOf(stateAbbrName)];

		//Calls COVID API function using state and county
		covidCall(stateName, countyName);
	});
};

//Function for making the covid call using a city rather than a county
const cityCall = (userCity, stateName) => {
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": `https://geocode-address-to-location.p.rapidapi.com/v1/geocode/search?text=${userCity} ${stateName}&limit=1&lang=en`,
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "79f7ca8118msh020414b1e09c65cp1220e3jsn80b7757a036d",
			"x-rapidapi-host": "geocode-address-to-location.p.rapidapi.com"
		}
	};

	//If there is a city entered, an AJAX call is made to retrieve the county of the city
	if (userCity) {
		$.ajax(settings).done(function (response) {
			let county = response.features[0].properties.county;
			covidCall(stateName, county);
		});
	} else {
		covidCall(stateName);
	};
};

//Event listener for user input
$('#queryCity').on('click', () => {
	$('#responseDiv').html('')
	let userCity = $('#city').val();
	let stateName = $('#states').val();

	//Searched city is stored
	storeCity(userCity, stateName);
	//Stored cities are re-rendered
	renderStoredCities();
	//City is converted to county and then covidCall is called within
	cityCall(userCity, stateName);
});

//Function for storing city locally
const storeCity = (city, state) => {
    //Retrieves previously stored cities
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    //If the storage was empty then an array is created with the first searched city
    if (storedCities) {
        //If the city is already in storage it is not pushed
        if (!storedCities.includes({'state': state,
        'city': city})) {
            storedCities.push({'state': state, 'city': city});
        };
    } else {
        storedCities = [{'state': state, 'city': city}];
    };
    //The stored array is updated
    localStorage.setItem('cities', JSON.stringify(storedCities));
};

//Renders the five most-recent searches as buttons
const renderStoredCities = () => {
	//Button container div is emptied
	$('.button-container').html('');
    let cities = JSON.parse(localStorage.getItem('cities'));
    for (let i = 0; cities.length > 5 ? i < 5 : i < cities.length; i++) {
		let cityName = '';
		//Used to move backwards through the array
		let city = cities.length - (i + 1);
		//If the stored object has a city then it is assigned to a variable
        if (cities[city].hasOwnProperty('city')) {
            cityName = cities[city].city;
        };
		let stateName = cities[city].state;
		//Creates new button
		let newButton = $('<a class="button city-button"></a>');
		//If there is a city stored then it is saved to a data attribute in the button
        if (cityName) {
			newButton.attr('data-city', cityName);
			//Formatting: 'city, state'
			cityName += ', ';
        };
        newButton.attr('data-state', stateName);
        newButton.text(`${cityName}${stateName}`);
		$('.button-container').append(newButton);
		
		//Click event to make a new search utilizing the data-attributes
		newButton.on('click', event => {
			let buttonCity = $(event.currentTarget).attr('data-city');
			let buttonState = $(event.currentTarget).attr('data-state');
			cityCall(buttonCity, buttonState);
		})
    };
};

//Initial button render
renderStoredCities();