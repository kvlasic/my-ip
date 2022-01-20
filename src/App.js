import "./App.css";
import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { DateTime } from "luxon";

function App() {
  const [ip, setIp] = useState({});
  const [country, setCountry] = useState([]);

  // promise -> then
  // setBlabla(newValue) - useEffect(()=>[blabla])

  // fetch information about IP-Address and Location
  useEffect(() => {
    fetch(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${process.env.REACT_APP_API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => setIp(response));
  }, []);

  useEffect(() => {
    if (ip.location) {
      fetch(`https://countries.trevorblades.com/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
            country(code: "${ip.location.country}"){
                name
                native
                continent {name}
                capital
                currency
                languages {
                  name
                }
              }
            }
            `,
        }),
      })
        .then((response) => response.json())
        .then((response) => setCountry(response.data.country));
    }
  }, [ip]);
  // save coordinates in variables
  const latitude = ip?.location?.lat;
  const longitude = ip?.location?.lng;

  // fetch country information
  // useEffect(() => {
  //   ;
  // }, []);

  console.log(country);

  // render
  return (
    <div className="App">
      <div className="container">
        <div className="card">
          <h1>IP information</h1>
          <div className="info">
            <p>Your IPv4 Address is: {ip?.ip}</p>
            <p>
              Location: {ip?.location?.city}, {ip?.location?.region},{" "}
              {ip?.location?.country}
            </p>
            <p>ISP: {ip?.isp}</p>
          </div>
        </div>
        <div className="card">
          <h1>Country information</h1>
          <div className="info">
            <p>Continent: {country?.continent?.name}</p>
            <p>
              Name: {country?.name}{" "}
              <img
                src={`https://flagcdn.com/16x12/${ip?.location?.country.toLowerCase()}.png`}
                width="16"
                height="12"
                alt={country?.name}
              ></img>
            </p>
            <p>Native name: {country?.native}</p>
            <p>Capital: {country?.capital}</p>
            <p>Currency: {country?.currency}</p>
          </div>
        </div>
      </div>
      <div className="map-container container">
        {latitude && (
          <Map defaultCenter={[latitude, longitude]} defaultZoom={11}>
            <Marker width={50} anchor={[latitude, longitude]} />
          </Map>
        )}
      </div>
    </div>
  );
}

// ipInfo.location.lat & ipInfo.location.lng => https://pigeon-maps.js.org/docs/installation

export default App;
