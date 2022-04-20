import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Input, Button } from "react-native-elements";
import { map, size } from "lodash";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/storage";
import uuid from "random-uuid-v4";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
//import AwesomeAlert from "react-native-awesome-alerts";

import Map from "./Map";
import { ImageRestaurant, UploadImage } from "./addImageRestaurant";
//ImageRestaurant:muestra la imagen principal del restaurante
//UploadImage:pedir permisos de galeria, seleccionar y cargar las imagenes en un estado y mostrarlas en un avatar
// uuid:usado para generar ids random

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;

  //contener informacion del restaurante a guardar
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddres, setRestaurantAddres] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  //contener imagenes guardadas
  const [imagesSelected, setImagesSelected] = useState([]);
  //controla a visibilidad del modal que contiene el google maps
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  //contiene la direccion del restaurante
  const [locationRestaurant, setLocationRestaurant] = useState(null);
  //contiene los errores al llenar el formulario
  const [errorInput, setErrorInput] = useState({});

  //Valida la informacion de los formularios, sube las imagenes al storage y registra toda la informacion necesaria para crear un restaurante en Cloud Firestore
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
      toastRef.current.show("Seleccionar minimo una imagen de presentacion", {
        duration: 1500,
      });
    } else if (!locationRestaurant) {
      toastRef.current.show(
        "Seleccionar ubicacion del restaurante en google maps"
      );
      errorTemp = {
        iconMapColor: "red",
      };
    } else {
      setIsLoading(true);
      uploadImageStorage().then((response) => {
        db.collection("Restaurants")
          .add({
            name: restaurantName,
            address: restaurantAddres,
            description: restaurantDescription,
            location: locationRestaurant,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantyVoting: 0,
            createBy: firebase.auth().currentUser.uid,
            createAt: new Date(), //fecha de creacion:fecha actual
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate("Restauranst");
          })
          .catch((e) => {
            console.log(e.errorMessage);
            setIsLoading(false);
          });
      });
    }

    setErrorInput(errorTemp);
  };

  //sube imagenes seleccionadas al storage de firebase
  const uploadImageStorage = async () => {
    const imageBlob = [];
    //dado que se tiene demaciadas sentencias asincronas,con el promise se espera hasta que se ejecuten todas las sentencias antes decontinuar compilando
    await Promise.all(
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
              imageBlob.push(photoUrl);
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

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 0,
  },
  textArea: {
    height: 50,
    width: "100%",
    marginTop: 10,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
});
