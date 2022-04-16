import React from "react";
import { View, StyleSheet, Platform, Dimensions, Alert } from "react-native";
import { Image, Icon, Avatar } from "react-native-elements";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter } from "lodash";

//Dimensions: usado para capturar el ancho de la pantalla en pixeles
const widthScreen = Dimensions.get("window").width;

//muestra la imagen principal del restaurante
export function ImageRestaurant(props) {
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

//pedir permisos de galeria, seleccionar y cargar las imagenes en un estado y mostrarlas en un avatar
export function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected, errorInput } = props;

  //selccionar la imagen de la galeria
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
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  viewFoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
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
});
