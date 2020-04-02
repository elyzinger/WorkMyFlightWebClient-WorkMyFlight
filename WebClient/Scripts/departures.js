﻿setInterval(function () {
    window.location.reload(1);
}, 300000);
//swal.fire('Departure Page',
//    'Showing',
//'success')
let status = '';
let flights = new Array();
function CheckStatusForDelay(DepartureTime, status) {
   
        sqlDateStr = DepartureTime.toLocaleString().replace('T', ' '); // as for MySQL 
        sqlDateStr = sqlDateStr.replace(/:| /g, "-");
    let YMDhms = sqlDateStr.split("-");
    jsDate = new Date();
        jsDate.setFullYear(parseInt(YMDhms[0]), parseInt(YMDhms[1]) - 1,
            parseInt(YMDhms[2]));
        jsDate.setHours(parseInt(YMDhms[3]), parseInt(YMDhms[4]),
        parseInt(YMDhms[5]), 0/*msValue*/);
    if (status == 'DELAYED') {
        let randomMin = Math.floor((Math.random() * 10 + 1) * 6);
        let randomHours = Math.floor(Math.random() * 10 + 1);
        while (randomMin <= 30 && randomMin > 60) {
            randomMin = Math.floor((Math.random() * 10 + 1) * 6);          
        }
        while (randomHours >= 3) {
            randomHours = Math.floor(Math.random() * 10 + 1);          
        }
        jsDate.setMinutes(jsDate.getMinutes() + randomMin);
        jsDate.setHours(jsDate.getHours() + randomHours);
        return jsDate;
    }
    return jsDate;
}
function GetRandomStatus() {
    let rangePerc = Math.floor(Math.random() * 10 + 1);
    if (rangePerc <= 2) {
       return status = 'DELAYED';
    }
   return status = 'ON TIME' ;
}
function DepartureStatusColor(status) {

    if (status == 'ON TIME') {
        statusColor = 'greenDepart';
    }
    else if (status == 'DELAYED')
    {
        statusColor = 'redDepart';
    }
    return statusColor;
}
if (navigator.onLine) {

    let lastOnLine = new Date();
    lastOnLine.setHours(lastOnLine.getHours() + 3);
    lastOnLine = lastOnLine.toUTCString().replace('GMT', ' ');
    jsonDate = JSON.stringify(lastOnLine);
    localStorage.setItem('lastOnLineDeparture', jsonDate);

    $(document).ready(() => {
        $tableFlights = $("#flightsTable")
        $.ajax({
            url: "/api/AnonymousFacade/GetDeparturesNow"

        })
            .then((data) => {
                console.log(data)
                $tableFlights.append(`<tr>
                        <th>AIR LINE NAME</th>
                        <th>FLIGHT ID</th>
                        <th>ORIGIN COUNTRY NAME</th>
                        <th>DESTINATION COUNTRY NAME</th>
                        <th>DEPARTURE TIME</th>
                        <th>STATUS</th>
                        </tr>`)

                $.each(data, (i, oneFlight) => {
                    oneFlight.DepartureTime = oneFlight.DepartureTime.toLocaleString().replace('T', ' ');
                    oneFlight.status = GetRandomStatus();
                    statusColor = DepartureStatusColor(oneFlight.status);
                    oneFlight.DepartureTime = CheckStatusForDelay(oneFlight.DepartureTime, oneFlight.status)
                    oneFlight.DepartureTime.setHours(oneFlight.DepartureTime.getHours() + 3);
                    oneFlight.DepartureTime = oneFlight.DepartureTime.toUTCString().replace('GMT', ' ');

                    flights.push(oneFlight);
                    
                    $tableFlights.append(
                        `<tr><td> ${oneFlight.AirlineName} </td>
                             <td>${oneFlight.ID}</td>
                             <td>${oneFlight.OriginCountryName}</td>
                             <td>${oneFlight.DestinationCountryName}</td>
                             <td>${oneFlight.DepartureTime}</td>
                             <td class="${statusColor}">${oneFlight.status}</td></tr>`)


                })
                jsonFlights = JSON.stringify(flights);
                localStorage.setItem('departureFlights', jsonFlights);
            })
            .catch((err) => { console.log(err) })

    })
}
else 
{
    let lastDate = JSON.parse(localStorage['lastOnLineDeparture']);
    swal.fire('No Connection', 'LastOnLine : ' + lastDate);
    //'Last OnLine',
    flightsStorage = JSON.parse(localStorage['departureFlights']);
    console.log(flightsStorage);
    $tableFlights = $("#flightsTable");
    $tableFlights.append(`
                        <tr>
                        <th>AIR LINE NAME</th>
                        <th>FLIGHT ID</th>
                        <th>ORIGIN COUNTRY NAME</th>
                        <th>DESTINATION COUNTRY NAME</th>
                        <th>DEPARTURE TIME</th>
                        <th>STATUS</th>
                        </tr>`)

    $.each(flightsStorage, (i, oneFlight) => {

        statusColor = DepartureStatusColor(oneFlight.status);

        $tableFlights.append(
            `<tr><td> ${oneFlight.AirlineName} </td>
                             <td>${oneFlight.ID}</td>
                             <td>${oneFlight.OriginCountryName}</td>
                             <td>${oneFlight.DestinationCountryName}</td>
                             <td>${oneFlight.DepartureTime}</td>
                             <td class="${statusColor}">${oneFlight.status}</td></tr>`)

    })

}