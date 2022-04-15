import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import {
  Input,
  Icon,
  Avatar,
  Image,
  Button,
  Text,
} from "react-native-elements";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter, result } from "lodash";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/storage";
import uuid from "random-uuid-v4";
//import AwesomeAlert from "react-native-awesome-alerts";

import Modal from "../Modal";

//Location: usadopara pedir permiso de la location del usuario y capturar sus coordenadas
//Dimensions: usado para capturar el ancho de la pantalla en pixeles
// uuid:usado para generarids random
const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;

  //contener informacion del restaurante a guardar
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddres, setRestaurantAddres] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  //contener imagenes guardadas
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);
  const [errorInput, setErrorInput] = useState({});
  const addRestaurant = () => {
    setErrorInput({});
    let errorTemp = {};

    if (!restaurantName || !restaurantAddres || !restaurantDescription) {
      errorTemp = {
        name: !restaurantName && "Agregar un nombre",
        addres: !restaurantAddres && "Agregar una direccion",
        description: !restaurantDescription && "Agregar una descripcion",
      };
    } else if (size(imagesSelected) == 0) {
      errorTemp = {
        iconImageBorder: 3,
        iconImageColor: "red",
      };
      toastRef.current.show("Seleccionar minimo una imagen de presentacion");
    } else if (!locationRestaurant) {
      toastRef.current.show(
        "Seleccionar ubicacion del restaurante en google maps"
      );
      errorTemp = {
        iconMapColor: "red",
      };
    } else {
      setIsLoading(true);
      uploadImageStorage.then((response) => {
        console.log(response);
        setIsLoading(false);
      });
    }

    setErrorInput(errorTemp);
  };

  //sube imagenes seleccionadas al storage de firebase
  const uploadImageStorage = async () => {
    const imageBlob = [];
    //dado que se tiene demaciadas sentencias asincronas,con el promise se espera hasta que se ejecuten todas las sentencias antes decontinuar compilando
    Promise.all(
      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const idImage = uuid(); //id aleatorio
        //sube a storage
        const ref = firebase.storage().ref("Restaurant").child(idImage);
        await ref.put(blob).then(async () => {
          //obtiene url de la imagen subida
          await firebase
            .storage()
            .ref(`Restaurant/${idImage}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(image);
            });
        });
      })
    );
    return imageBlob;
  };

  return (
    <ScrollView style={StyleSheet.scrollView}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]}></ImageRestaurant>
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddres={setRestaurantAddres}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
        errorInput={errorInput}
        locationRestaurant={locationRestaurant}
      ></FormAdd>
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
        errorInput={errorInput}
      ></UploadImage>
      <Button
        title="Crear restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      ></Button>
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        toastRef={toastRef}
        setLocationRestaurant={setLocationRestaurant}
      ></Map>
    </ScrollView>
  );
}

//muestra imagen principal al crear restaurante
function ImageRestaurant(props) {
  const { imageRestaurant } = props;
  imageRestaurant;
  return (
    <View style={styles.viewFoto}>
      <Image
        source={
          imageRestaurant
            ? Platform.OS === ("android" || "ios")
              ? {
                  uri: imageRestaurant,
                }
              : imageRestaurant
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      ></Image>
    </View>
  );
}

//Formulario para añadir nuevo restaurante
function FormAdd(props) {
  const {
    setRestaurantName,
    setRestaurantAddres,
    setRestaurantDescription,
    setIsVisibleMap,
    errorInput,
    locationRestaurant,
  } = props;
  return (
    <View styles={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={(e) => {
          setRestaurantName(e.nativeEvent.text);
        }}
        errorMessage={errorInput.name}
      ></Input>
      <Input
        placeholder="Direccion"
        containerStyle={styles.input}
        onChange={(e) => {
          setRestaurantAddres(e.nativeEvent.text);
        }}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant
            ? "#00a680"
            : errorInput.iconMapColor
            ? "red"
            : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
        errorMessage={errorInput.addres}
      ></Input>
      <Input
        placeholder="Descripcion de restaurante"
        multiline={true}
        containerStyle={styles.textArea}
        onChange={(e) => {
          setRestaurantDescription(e.nativeEvent.text);
        }}
        errorMessage={errorInput.description}
      ></Input>
    </View>
  );
}

// modal donde se muestra el mapa para seleccionar la ubicacion
function Map(props) {
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

      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        longitudeDelta: 0.001,
        latitudeDelta: 0.001,
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

function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected, errorInput } = props;

  //sleccionar la imagen de la galeria
  const imageSelect = async () => {
    //pedir permiso
    const resultPermissions = await MediaLibrary.requestPermissionsAsync();
    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es neceraio aceptar los permisos de galeria, si los has rechazado tienes que ir a ajustes y aceptarlos manualmente",
        3000
      );
    } else {
      //seleccion de imagen de la galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin selecionar ninguna imagen",
          2000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  //remueve imagen presionada
  const removeImage = (image) => {
    if (Platform.OS === "web") {
      const confirmResult = confirm("¿Desea eliminar la imagne?");
      if (confirmResult) {
        setImagesSelected(
          filter(imagesSelected, (imageUrl) => imageUrl !== image)
        );
      }
    } else {
      Alert.alert(
        "Eliminar imagen",
        "¿Desea eliminar la imagen?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: () => {
              setImagesSelected(
                filter(imagesSelected, (imageUrl) => imageUrl !== image)
              );
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.viewImage}>
      {size(imagesSelected) < 5 && (
        <Icon
          type="materia-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={[
            styles.containerIcon,
            {
              borderWidth: errorInput.iconImageBorder
                ? errorInput.iconImageBorder
                : 0,
              borderColor: errorInput.iconImageColor
                ? errorInput.iconImageColor
                : "grey",
            },
          ]}
          onPress={imageSelect}
        ></Icon>
      )}
      {map(imagesSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={
            Platform.OS === ("android" || "ios")
              ? {
                  uri: imageRestaurant,
                }
              : imageRestaurant
          }
          onPress={() => {
            removeImage(imageRestaurant);
          }}
        ></Avatar>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 50,
    width: "100%",
    padding: 0,
    marginTop: 20,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  containerIcon: {
    alignContent: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewFoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
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
