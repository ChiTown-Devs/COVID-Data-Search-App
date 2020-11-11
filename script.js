const statesFullName = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
const statesAbbrev = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL','GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const covidCall = (stateName, countyName) => {
    let county = '';
    if (countyName) {
        let countyArray = countyName.toLowerCase().split(' ');
        countyArray.includes('county') ? countyArray.pop() : countyArray;
        for (let i = 0; i < countyArray.length; i++) {
            countyArray[i] = countyArray[i].charAt(0).toUpperCase() + countyArray[i].slice(1).toLowerCase(); 
        };
        county = countyArray.join(' ');
    };

    const url = `https://covid-19-statistics.p.rapidapi.com/reports?iso=USA&region_name=US&q=US%20${stateName}`;
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
        if (county) {
            //Array of counties within the state
            let cities = response.data[0].region.cities;
            //Loop that looks for the user's county
            //console.log(cities)
            cities.forEach(city => {
                if (city.name === county) {
                    console.log(city.name, city.confirmed, city.confirmed_diff, city.deaths, city.deaths_diff);
                };
            });
        } else {
            let state = response.data[0];
            console.log(state);
        };
    });
};