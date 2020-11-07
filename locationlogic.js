
$("#currentLocation").on("click", function() {
	//Needs a link to where it was copied from
	const geoSettings = {
		"async": true,
		"crossDomain": true,
		"url": "https://telize-v1.p.rapidapi.com/geoip",
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "79f7ca8118msh020414b1e09c65cp1220e3jsn80b7757a036d",
			"x-rapidapi-host": "telize-v1.p.rapidapi.com"
		}
	};

	$.ajax(geoSettings).done(function (response) {
		let zipCode = response.postal_code;
		
		retrieveCounty(zipCode)
	});
});

function retrieveCounty(zipCode) {
	const countyKey = "D7K6W4KICQXNF9IXO9DY"
	const zipurl = "https://api.zip-codes.com/ZipCodesAPI.svc/1.0/GetZipCodeDetails/" + zipCode + "?key=" + countyKey;

	//AJAX call to retrieve county COVID info
	const dataSettings = {
	url: zipurl,
	method: "GET"
	};

	$.ajax(dataSettings).done(function (response) {
		//console.log(response);
		let countyName = response.item.CountyName;
		let stateAbbrName = response.item.State;
		let stateName = statesFullName[statesAbbrev.indexOf(stateAbbrName)];

		console.log(stateName, countyName)

		covidCall(stateName, countyName);
	});
}

