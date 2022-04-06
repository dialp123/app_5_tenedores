//renderiza en el modal la intefaz que permite cambiar de nombre

import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import * as firebase from "firebase";

//onCnange : detecta los cambios en el input

export default function ChangeDisplayNameForm(props) {
  const { displayName, setShowModal, toastRef, setReloadUserInfo } = props;

  const input = React.createRef();
  const [newDisplayName, setNewDisplayName] = useState(null);
  const [error, setError] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);

  // se ejecuta cuando se presiona el boton
  const onSubmit = () => {
    setError(null);
    if (!newDisplayName) {
      setError("El Nombre no puede estar vacio.");
    } else if (displayName === newDisplayName) {
      setError("El nombre no puede ser igual al actual.");
    } else {
      setIsLoading(true);
      const update = {
        displayName: newDisplayName,
      };
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          setIsLoading(false);
          setReloadUserInfo(true);
          setShowModal(false);
        })
        .catch((e) => {
          setError(e.message);
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        ref={input}
        placeholder="Nombre y apellidos" //texto que se muestra si el input esta vacio
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        defaultValue={displayName || ""} //pintar display name, pero si este es nullpintar string vacio
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        errorMessage={error}
      ></Input>
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainerStyle}
        buttonStyle={styles.btnStyle}
        onPress={onSubmit}
        loading={IsLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  btnContainerStyle: {
    width: "100%",
  },
  btnStyle: {
    backgroundColor: "#00a680",
  },
});
