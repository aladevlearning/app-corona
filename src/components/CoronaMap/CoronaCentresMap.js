import { decode } from 'html-entities';
import maplibregl from 'maplibre-gl';
import { createMap, drawPoints } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { renderToString } from 'react-dom/server';
import InfoPopup from '../InfoPopup/InfoPopup';
import SearchField from "../SearchField/SearchField";
import Spinner from '../Spinner/Spinner';

const CoronaCentresMap = () => {
  const mapRef = useRef(null); // Reference to the map DOM element
  let [map, setMap] = useState(null);
  let [loading, setLoading] = useState(true);
  let [showSearch, setShowSearch] = useState(false);

  // Wrapping our code in a useEffect allows us to run initializeMap after the div has been rendered into the DOM
  useEffect(() => {
    let map;
    async function initializeMap() {
      // We only want to initialize the underlying maplibre map after the div has been rendered
      if (mapRef.current != null) {
        map = await createMap({
          container: mapRef.current,
          center: [10.11565295, 56.71684027],
          zoom: isMobile ? 5 : 6,
          minZoom: isMobile ? 5 : 6,
          minPitch: 5
        });
        setMap(map);

        map.addControl(new maplibregl.NavigationControl());
        map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          })
        );
        let covidKortCentresResponse;
        try {
          covidKortCentresResponse = await getTestCenterList();
        } catch (e) {
          covidKortCentresResponse = { centres: [] }
        }

        let cphMedCentresResponse;
        try {
          cphMedCentresResponse = await getAdditionalInfo();
        } catch (e) {
          cphMedCentresResponse = { result: [] }
        }


        setLoading(false);
        addLocations(
          map,
          covidKortCentresResponse,
          cphMedCentresResponse
        )
      }
    }
    initializeMap();

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (map != null) map.remove();
    };
  }, []);

  function addLocations(map, covidKortCentresResponse, cphMedCentresResponse) {

    const { centres } = covidKortCentresResponse;
    const { locations } = cphMedCentresResponse.results;

    const cphMedLocationMap = buildCphMedMap(locations)

    const coordinates = centres.map(centre => {
      const { longitude, latitude, type } = centre;

      const key = `${longitude.toString().substring(0, 8)}-${latitude.toString().substring(0, 8)}`;

      if (cphMedLocationMap.has(key)) {
        centre.waitingTime = cphMedLocationMap.get(key).description
          .replace('Estimeret kø: ', '')
          .substring(0, 20);;
      }

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        id: `${key}-${type}`,
        properties: centre
      }
    })


    map.on("load", () => {
      setShowSearch(true);
      drawPoints("mySourceName", // Arbitrary source name
        coordinates, // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
        map,
        {
          showCluster: true,
          unclusteredOptions: {
            showMarkerPopup: true,
            popupRender: (selectedFeature) => {
              return decode(renderToString(<InfoPopup selectedFeature={selectedFeature} centres={centres} />));
            }
          },
          clusterOptions: {
            fillColor: "#36D7B7",
            showCount: true,
            smThreshold: 10,
            borderWidth: 1,
            smCircleSize: isMobile ? 10 : 20,
            mdThreshold: 30,
            mdCircleSize: isMobile ? 20 : 50,
            lgThreshold: 40,
            lgCircleSize: isMobile ? 30 : 80,
            xlThreshold: 50,
            xlCircleSize: isMobile ? 75 : 80
          }
        }
      );
    });
  }

  function getTestCenterList() {
    return fetch('https://covid-19-kort.dk/testcentre.json')
      .then(data => data.json())
  }

  function getAdditionalInfo() {
    return fetch('https://api.storepoint.co/v1/1614b4269b6d23/locations')
      .then(data => data.json())
  }

  function buildCphMedMap(locations) {
    let cphMedLocationMap = new Map();
    locations.forEach(location => {
      const { loc_long, loc_lat } = location;

      let normalizedLongitude = loc_long.toString();
      if (normalizedLongitude.length > 8) {
        normalizedLongitude = normalizedLongitude.substring(0, 8)
      }

      let normalizedLatitude = loc_lat.toString();
      if (normalizedLatitude.length > 8) {
        normalizedLatitude = normalizedLatitude.substring(0, 8)
      }
      cphMedLocationMap.set(`${normalizedLongitude}-${normalizedLatitude}`, location);
    });

    return cphMedLocationMap;
  }
  return <>

    <Spinner loading={loading} />

    {showSearch &&
      <>
        <section className="search-section">
          <SearchField map={map} />
        </section>
      </>}
    <div ref={mapRef} id="map" />
  </>
}


export default CoronaCentresMap;