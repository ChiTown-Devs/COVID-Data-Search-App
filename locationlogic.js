
$("#currentLocation").on("click", function() {

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
})
})

function retrieveCounty(zipCode) {
const countyKey = "D7K6W4KICQXNF9IXO9DY"
const zipurl = "https://api.zip-codes.com/ZipCodesAPI.svc/1.0/GetZipCodeDetails/" + zipCode + "?key=" + countyKey;




const dataSettings = {
url: zipurl,
method: "GET",
}

$.ajax(dataSettings).done(function (response) {
console.log(response)
let county = (response.item.CountyName).toLowerCase();
let countyName = county.charAt(0).toUpperCase() + county.slice(1)
console.log(countyName)
let stateAbbrName = response.item.State;
let stateName = statesFullName[statesAbbrev.indexOf(stateAbbrName)]


covidCall(stateName, countyName);
})
}

