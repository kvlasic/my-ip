import "./App.css";
import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";

function App() {
  const [ip, setIp] = useState([]);
  const [country, setCountry] = useState([]);

  // fetch information about IP-Address and Location
  useEffect(() => {
    fetch(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=8.8.8.8`
    )
      .then((response) => response.json())
      .then((response) => setIp(response))
      .then(
        fetch(`https://countries.trevorblades.com/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query {
            country(code: "${ip?.location?.country}"){
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
          .then((response) => setCountry(response.data.country))
      );
  }, []);

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
        <div className="glass">
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
        <div className="glass">
          <h1>Country information</h1>
          <div className="info">
            <p>Continent: {country?.continent?.name}</p>
            <p>Name: {country?.name}</p>
            <p>Native name: {country?.native}</p>
            <p>Capital: {country?.capital}</p>
            <p>Currency: {country?.currency}</p>
          </div>
        </div>
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
