import maplibregl from 'maplibre-gl';
import { createMap, drawPoints, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { Geo } from "aws-amplify"

const Map = () => {
  const mapRef = useRef(null); // Reference to the map DOM element
  let [map, setMap] = useState(null);


  // Wrapping our code in a useEffect allows us to run initializeMap after the div has been rendered into the DOM
  useEffect(() => {
    let map;
    async function initializeMap() {
      // We only want to initialize the underlying maplibre map after the div has been rendered
      if (mapRef.current != null) {
        map = await createMap({
          container: mapRef.current,
          center: [10.11565295, 56.71684027],
          zoom: 6
        });
        setMap(map);
        //  const geocoder = createAmplifyGeocoder();
        // document.getElementById("search").appendChild(geocoder.onAdd());

        //  map.addControl(geocoder);
        map.addControl(new maplibregl.NavigationControl());
        map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          })
        );
        const response = await getTestCenterList();
        const { centres } = response;
        addLocations(
          map,
          centres.map(centre => {
            return {
              coordinates: [centre.longitude, centre.latitude],
              title: centre.testcenterName,
              address: centre.address,
            }
          })
        )
      }
    }
    initializeMap();

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (map != null) map.remove();
    };
  }, []);

  function addLocations(map, centers) {
    map.on("load", () => {
      drawPoints("mySourceName", // Arbitrary source name
        centers, // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
        map,
        {
          showCluster: true,
          unclusteredOptions: {
            showMarkerPopup: true,
          },
          clusterOptions: {
            showCount: true,
            /*  smCircleSize: 20,
              mdCircleSize: 20,
              clusterMaxZoom: 10,
              smThreshold: 1,
              mdThreshold: 14,
              lgThreshold: 16,
              lgCircleSize: 30,
              xlCircleSize: 50*/
            smThreshold: 10,
            smCircleSize: 30,
            mdThreshold: 30,
            mdCircleSize: 50,
            lgThreshold: 40,
            lgCircleSize: 80,
            xlThreshold: 50,
            xlCircleSize: 150,
          },
        }
      );
    });
  }

  function getTestCenterList() {
    return fetch('https://covid-19-kort.dk/testcentre.json')
      .then(data => data.json())
  }

  async function onSearch(event) {
    const response = await Geo.searchByText(event.target.value);
    console.log(response)
  }

  return <>
    <section className="search-section">
      <input type="search" onBlur={(event) => onSearch(event)} />
    </section>

    <div ref={mapRef} id="map" />;
  </>
}


export default Map;