const set_text = (eID, eText) => {
    document.getElementById(eID).innerText = eText
};
const set_html = (eID, eHtml) => {
    document.getElementById(eID).innerHTML = eHtml
};
const set_value = (eID, eValue) => {
    document.getElementById(eID).value = eValue

}

const update_inputs = (inputID) => {
    const input = document.getElementById(inputID);

    if (inputID == 'weather_city' || inputID == 'saved_locations') {
        let selected = document.querySelector(`#${inputID} option:checked`)
        set_value('weather_other_city', input.value)
        set_value('weather_lat', selected.dataset.latitude)
        set_value('weather_lon', selected.dataset.longitude)
    } else if (inputID == 'weather_other_city') {
        //geolocate get lat lon...check to see if it exists in the drop down
    } else if (inputID == 'weather_lat') {
        //check if lat is set, then find city if it is
    } else if (inputID == 'weather_lon') {
        //check if lon is set, then find city if it is
    }
}

const get_time = (someTime) => {
    //gets local time
    const current_date = !someTime ? new Date() : new Date(someTime)
    return current_date.toLocaleTimeString().replace(/(\d+\:\d+)\:\d+/g, "$1");
}
const gmt_to_local = (gmtTimeStr) => {
    let extended_time = new Date(gmtTimeStr + ':00.000+00:00');
    return extended_time.toLocaleString()
}
const weather_from_code = (weatherCode) => {
    let desc;
    switch (weatherCode) {
        case 0:
            desc = "Clear sky";
            break;
        case 1:
        case 2:
        case 3:
            desc = "Mainly clear, partly cloudy, and overcast";
            break;

        case 45:
        case 48:
            desc = "Fog and depositing rime fog";
            break;

        case 51:
        case 53:
        case 55:
            desc = "Drizzle: Light, moderate, and dense intensity";
            break;

        case 56:
        case 57:
            desc = "Freezing Drizzle: Light and dense intensity";
            break;

        case 61:
        case 63:
        case 65:
            desc = "Rain: Slight, moderate and heavy intensity";
            break;

        case 66:
        case 67:
            desc = "Freezing Rain: Light and heavy intensity";
            break;

        case 71:
        case 73:
        case 75:
            desc = "Snow fall: Slight, moderate, and heavy intensity";
            break;

        case 77:
            desc = "Snow grains";
            break;

        case 80:
        case 81:
        case 82:
            desc = "Rain showers: Slight, moderate, and violent";
            break;

        case 85:
        case 86:
            desc = "Snow showers slight and heavy";
            break;

        case 95:
            desc = "Thunderstorm: Slight or moderate";
            break;

        case 96:
        case 99:
            desc = "Thunderstorm with slight and heavy hail";
            break;
        default:
            desc = "Unknown Weather Patterns"
    }
    return desc;
}


const fill_table_daily = (rawWeatherData) => {
    let weather_data = Object.assign({}, rawWeatherData);
    weather_data.hourly.local_time = weather_data.hourly.time.map(gmt_to_local);
    weather_data.hourly.weather_desc = weather_data.hourly.weathercode.map(weather_from_code);
    const weather_row = (localTime, locationTime, weatherDescription) => {
        const row = `
            <tr>
                <td>${localTime}</td>
                <td>${locationTime}</td>
                <td>${weatherDescription}</td>
            </tr>
        `;
        return row;
    }
    let weather_table = `
        <tr>
            <th>Your Time</th>
            <th>Location Time</th>
            <th>Weather Description</th>
        </tr>
     `;
    weather_table += weather_data.hourly.time.map((locationTime, index) => {
        return weather_row(get_time(weather_data.hourly.local_time[index]), get_time(locationTime), weather_data.hourly.weather_desc[index])
    }).join('');
    set_html('weather_display', weather_table);
}
const fill_table_hourly = (rawWeatherData) => {
    let weather_data = Object.assign({}, rawWeatherData);
    weather_data.hourly.local_time = weather_data.hourly.time.map(gmt_to_local);
    weather_data.hourly.weather_desc = weather_data.hourly.weathercode.map(weather_from_code);
    const weather_row = (localTime, locationTime, weatherDescription) => {
        const row = `
            <tr>
                <td>${localTime}</td>
                <td>${locationTime}</td>
                <td>${weatherDescription}</td>
            </tr>
        `;
        return row;
    }
    let weather_table = `
        <tr>
            <th>Your Time</th>
            <th>Location Time</th>
            <th>Weather Description</th>
        </tr>
     `;
    weather_table += weather_data.hourly.time.map((locationTime, index) => {
        return weather_row(get_time(weather_data.hourly.local_time[index]), get_time(locationTime), weather_data.hourly.weather_desc[index])
    }).join('');
    set_html('weather_display', weather_table);
}
const get_weather = () => {
    //gets the weather from external api

    //build that api link
    const lat = document.getElementById('weather_lat').value;
    const lon = document.getElementById('weather_lon').value;
    const type = 'hourly'; //document.getElementById('weather_period_daily').checked ? 'daily' : 'hourly';
    const meteo_link = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toString()}&longitude=${lon.toString()}&${type}=weathercode`;
    if (typeof lat != 'undefined' && typeof lon != 'undefined') {
        //fetch it
       fetch(meteo_link)
            .then((rawData) => rawData.json())
            .then(fill_table_hourly);

    } else {
        alert('choose a city, or set valid latitude/longitude')
    }

}
const get_lat_lon = () => {
    //gets the latitude and longitude from an address
}
const get_map = () => {
    //gets the google map
}
const format_response = () => {
    //gets the response and formats it into something that can be loaded on the page
}

const update = () => {
    //updates the page based on input
}
const get_saved_items = ()=>{
    let location_list = localStorage.getItem("saved_locations");
    let has_saved_items = location_list != null && typeof location_list != 'undefined'
    if(has_saved_items){
        location_list = JSON.parse(location_list)
    let saved_options = location_list.map(locationItem=>{
        const location_option = `
                <option data-latitude="${locationItem.lat}" data-longitude="${locationItem.lon}" >${locationItem.city}</option>
        `
        return location_option;
    }).join('')
        set_html('saved_locations', saved_options);
    }
    return has_saved_items
}
const save_location = ()=>{
    let location_list = localStorage.getItem("saved_locations");
    let has_saved_items = location_list != null && typeof location_list != 'undefined'
    if(has_saved_items){
        location_list = JSON.parse(location_list)
    } else {
        location_list = []
    }
    location_list.push({
        city:document.getElementById('weather_other_city').value,
        lat:document.getElementById('weather_lat').value,
        lon:document.getElementById('weather_lon').value,
    })
    localStorage.setItem('saved_locations', JSON.stringify(location_list));
    get_saved_items();
}

const map_key = "AIzaSyC0Xh7VVztAFZVpiJGaoWkVlkB_qFM9_JY";
(() => {
    setInterval(set_text('weather_time_current', 'Current Time:' + get_time()), 60000);
    if(get_saved_items()) update_inputs('saved_items')
    else update_inputs('weather_city')
    get_weather()
})();