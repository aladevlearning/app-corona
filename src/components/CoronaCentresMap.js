import { decode } from 'html-entities';
import maplibregl from 'maplibre-gl';
import { createMap, drawPoints } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { renderToString } from 'react-dom/server';
import InfoPopup from './InfoPopup/InfoPopup';
import SearchField from "./SearchField/SearchField";
import Spinner from './Spinner';

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
          zoom: isMobile ? 5 : 6
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
        const response = await getTestCenterList();
        setLoading(false);
        const { centres } = response;
        addLocations(
          map,
          centres
        )
      }
    }
    initializeMap();

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (map != null) map.remove();
    };
  }, []);

  function addLocations(map, centres) {

    const coordinates = centres.map(centre => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [centre.longitude, centre.latitude]
        },
        id: centre.longitude + "-" + centre.latitude + "-" + centre.type,
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
            smCircleSize: isMobile ? 15 : 30,
            mdThreshold: 30,
            mdCircleSize: isMobile ? 25 : 50,
            lgThreshold: 40,
            lgCircleSize: isMobile ? 40 : 80,
            xlThreshold: 50,
            xlCircleSize: isMobile ? 75 : 80,
            onClick: (e, a, b, c) => {
              console.log('clicl', e, a, b, c)
            }
          },
        }
      );
    });
  }

  function getTestCenterList() {
    return fetch('https://covid-19-kort.dk/testcentre.json')
      .then(data => data.json())
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