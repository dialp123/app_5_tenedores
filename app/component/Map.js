import MapView from "react-native-maps";
import React from "react";
import openMap from "react-native-open-maps";

export default function Map(props) {
  const { location, name, height } = props;

  // abre aplicacion de mapas andriod o appel
  const openAppMap = () => {
    openMap({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 19,
      query: name,
    });
  };
  return (
    <MapView
      style={{ height: height, width: "100%" }}
      initialRegion={location}
      onPress={openAppMap}
    >
      <MapView.Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      ></MapView.Marker>
    </MapView>
  );
}
