import "./App.css";
import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";

function App() {
  const [ipInfo, setIpInfo] = useState([]);

  useEffect(() => {
    fetch(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${process.env.REACT_APP_API_KEY}`
    )
      .then((response) => response.json())
      .then((response) => setIpInfo(response));
  }, []);

  const latitude = ipInfo?.location?.lat;
  const longitude = ipInfo?.location?.lng;

  return (
    <div className="App">
      <p>Your IPv4 Address is: {ipInfo.ip}</p>
      <p>
        Location: {ipInfo?.location?.city}, {ipInfo?.location?.region},{" "}
        {ipInfo?.location?.country}
      </p>
      <p>ISP: {ipInfo.isp}</p>
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
