//modal donde se observa el mapa de google maps y se selecciona la direccion del restaurante
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Button } from "react-native-elements";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";

//Location: usadopara pedir permiso de la location del usuario y capturar sus coordenadas

export default function Map(props) {
  const { isVisibleMap, setIsVisibleMap, toastRef, setLocationRestaurant } =
    props;
  const [location, setLocation] = useState(null);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Localizacion seleccionada");
    setIsVisibleMap(false);
  };

  useEffect(() => {
    (async () => {
      const resultPermission =
        await Location.requestForegroundPermissionsAsync();

      if (resultPermission.status !== "granted") {
        toastRef.current.show(
          "Aceptar manualmente los permisos de localizacion para poder agregar la direccion del restaurante",
          3000
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    })();
  }, []);

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => {
              //region:coordenadas donde apunta el centro de la ventana del mapView
              setLocation(region);
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable //marcador mobible
            ></MapView.Marker>
          </MapView>
        )}
        <View style={styles.mapBtn}>
          <Button
            title="Guardar Ubicacion"
            containerStyle={styles.viewMapContainerSelect}
            buttonStyle={styles.viewMapBtnSelect}
            onPress={confirmLocation}
          ></Button>
          <Button
            title="Cancelar"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          ></Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    height: 550,
  },
  mapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapContainerSelect: {
    paddingRight: 5,
  },
  viewMapBtnSelect: {
    backgroundColor: "#00a680",
  },
});
