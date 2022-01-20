import "./App.css";
import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";

function App() {
  const [ip, setIp] = useState([]);
  const [country, setCountry] = useState([]);

  // fetch information about IP-Address and Location
  useEffect(() => {
    fetch(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${process.env.REACT_APP_API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => setIp(response));
  }, []);

  // save coordinates in variables
  const latitude = ip?.location?.lat;
  const longitude = ip?.location?.lng;

  // fetch country information
  useEffect(() => {
    fetch(`https://countries.trevorblades.com/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            country(code: "DE"){
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
  }, []);

  console.log(country);

  // render
  return (
    <div className="App">
      <div>
        <h1>IP information</h1>
        <p>Your IPv4 Address is: {ip.ip}</p>
        <p>
          Location: {ip?.location?.city}, {ip?.location?.region},{" "}
          {ip?.location?.country}
        </p>
        <p>ISP: {ip.isp}</p>
      </div>
      <div>
        <h1>Country information</h1>
        <p>Continent: {country?.continent?.name}</p>
        <p>Name: {country?.name}</p>
        <p>Native name: {country?.native}</p>
        <p>Capital: {country?.capital}</p>
        <p>Currency: {country?.currency}</p>
        {/* <p>Languages: {country?.languages[0]?.name}</p> */}
      </div>
      {latitude && (
        <Map
          height={600}
          defaultCenter={[latitude, longitude]}
          defaultZoom={11}
        >
          <Marker width={50} anchor={[latitude, longitude]} />
        </Map>
      )}
    </div>
  );
}

// ipInfo.location.lat & ipInfo.location.lng => https://pigeon-maps.js.org/docs/installation

export default App;
