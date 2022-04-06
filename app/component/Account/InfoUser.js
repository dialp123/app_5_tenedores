//informacion del usuario, foto de perfil, correo y nombre, esta seccion permite actualizar la foto de perfil

import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import DefaultAvatar from "../../../assets/img/avatar-default.jpg";

//Avatar -- elemento de foto de perfil
//MeadiaLibrary permite conceder permisos android, especificar dichos permisos en app.json en seccion android
//Image Picker permite abrir la galaeria de imagenes; launchImageLibraryAsync lanza la galeria de imagenes
//blob() -- Los Blobs representan datos que no necesariamente se encuentran en un formato nativo de JavaScript.

export default function InfoUser(props) {
  const {
    userInfo: { uid, photoURL, displayName, email },
    toastRef,
    setLoading,
    setLoadingText,
  } = props;

  const changeAvatar = async () => {
    //pedir permiso de almacenamiento
    const resultPermissions = await MediaLibrary.requestPermissionsAsync();

    //status: estado del permiso, denegado o aceptado
    if (resultPermissions.status === "denied") {
      toastRef.current.show("Permiso denegado");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show("Cambio de imagen cancelado");
      } else {
        uploadImage(result.uri)
          .then(() => {
            updatePhotoUrl();
          })
          .catch(() => {
            toastRef.current.show("Error al actualizar foto de perfil");
          });
      }
    }
  };

  // sube la imagen a storage firebase
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    setLoadingText("Actualizando");
    setLoading(true);
    const ref = firebase.storage().ref().child(`Avatar/${uid}`);
    return ref.put(blob);
  };

  //obtiene la imagen de storage firebase y la actualiza en el perfil
  const updatePhotoUrl = () => {
    //obtiene la foto
    firebase
      .storage()
      .ref(`Avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        // actualiza foto del ususario
        await firebase
          .auth()
          .currentUser.updateProfile(update)
          .then(() => {
            toastRef.current.show("Foto de perfil actualizada");
            setLoading(false);
          });
      })
      .catch(() => {
        toastRef.current.show("Error al actulaizar foto de perfil");
        setLoading(false);
      });
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        containerStyle={styles.userInfoAvatar}
        source={
          Platform.OS === ("android" || "ios")
            ? {
                uri: photoURL ? photoURL : DefaultAvatar,
              }
            : photoURL
            ? photoURL
            : DefaultAvatar
        }
      >
        <Avatar.Accessory size={23} onPress={changeAvatar} />
      </Avatar>
      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "anonimo"}
        </Text>
        <Text>{email ? email : "Social login"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30,
  },
  userInfoAvatar: {
    marginRight: 20,
    backgroundColor: "#e3e3e3",
  },
  displayName: {
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom: 10,
  },
});
