//Arrays containing full names, abbreviations, and twitter handles for all 50 states and DC
const statesFullName = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
const statesAbbrev = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL','GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const statesTwitter = ['ALPublicHealth', 'Alaska_DHSS', 'AZDHS', 'ADHPIO', 'CAPublicHealth', 'CDPHE', 'CTDPH', 'Delaware_DHSS', '_DCHealth', 'HealthyFla', 'GaDPH', 'HIgov_Health', 'IDHW', 'IDPH', 'StateHealthIN', 'IAPublicHealth', 'KDHE', 'KYHealthAlerts', 'LADeptHealth', 'MEPublicHealth', 'MDHealthDept', 'MassDPH', 'MichiganHHS', 'mnhealth', 'msdh', 'HealthyLivingMo', 'DPHHSMT', 'NEDHHS', 'DhhsNevada', 'NHPubHealth', 'NJDeptofHealth', 'NMDOH', 'nycHealthy', 'NCDHHS', 'NDDOH', 'OHdeptofhealth', 'HealthyOklahoma', 'OHAOregon', 'PAHealthDept', 'RIHEALTH', 'scdhec', 'SDDOH', 'TNDeptofHealth', 'TexasDSHS', 'UtahDepOfHealth', 'healthvermont', 'VDHgov', 'WADeptHealth', 'WV_DHHR', 'DHSWI', 'health_wyoming'];

//Function to 'GET' COVID data
const covidCall = (stateName, countyName) => {
    let county = '';
    //If there is a county argument, the name is formatted to remove the word 'county' and get properly cased.
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
            cities.forEach(city => {
                if (city.name === county) {
                    let cityFips = String(city.fips).split('')
                    if (cityFips.length < 5) {
                        cityFips.splice(0,0,"0")
                    }
                    let joinFips = cityFips.join("")
                    $('.iframecontainer').html('')
                    $('.iframecontainer').append(`<iframe src='https://bao.arcgis.com/covid-19/jhu/county/${joinFips}.html'></iframe>`)
                };
            });
        } else {
            let state = response.data[0];
        };

        //Renders twitter feed of the state's DOH
        let handle = statesTwitter[statesFullName.indexOf(stateName)];

        $('.twitter-container').html(`<a class="twitter-timeline" data-lang="en" data-width="300" data-height="500" data-theme="dark" href="https://twitter.com/${handle}?ref_src=twsrc%5Etfw">Tweets by ${handle}</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`);
    });
};