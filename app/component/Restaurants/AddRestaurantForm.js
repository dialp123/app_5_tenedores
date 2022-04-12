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
import { map, size, filter } from "lodash";
import * as Location from "expo-location";
//import AwesomeAlert from "react-native-awesome-alerts";

import Modal from "../Modal";

//Dimensions: usado para capturar el ancho de la pantalla en pixeles

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;

  //contener informacion del restaurante a guardar
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddres, setRestaurantAddres] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  //contener iagenes guardadas
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);

  const addRestaurant = () => {
    //console.log(alertWeb.current);
  };

  return (
    <ScrollView style={StyleSheet.scrollView}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]}></ImageRestaurant>
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddres={setRestaurantAddres}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
      ></FormAdd>
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      ></UploadImage>
      <Button
        title="Crear restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      ></Button>
      <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap}></Map>
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
  } = props;

  return (
    <View styles={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={(e) => {
          setRestaurantName(e.nativeEvent.text);
        }}
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
          color: "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      ></Input>
      <Input
        placeholder="Descripcion de restaurante"
        multiline={true}
        containerStyle={styles.textArea}
        onChange={(e) => {
          setRestaurantDescription(e.nativeEvent.text);
        }}
      ></Input>
    </View>
  );
}

function Map(props) {
  const { isVisibleMap, setIsVisibleMap } = props;

  useEffect(() => {
    (async () => {
      const resultPermissions = Permissions.ask;
    })();
  }, []);

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <Text>mapa</Text>
    </Modal>
  );
}

function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

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
          containerStyle={styles.containerIcon}
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
    marginTop: 30,
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
});
