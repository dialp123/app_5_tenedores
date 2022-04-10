// formulario donde se realiza al cambio de contraseña del usuario logeado

import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import * as firebase from "firebase";

import { reauthentication } from "../../utils/Api";

export default function ChangePasswordForm(props) {
  const { setShowModal, toastRef } = props;

  const [formData, setFormData] = useState(defaultValue);
  //estado de si e ven las contraseñas que se digitan
  const [showPassword, setShowPassword] = useState(defaultShowPassword);
  //estado de errores en el input de contraseñas
  const [errorPassword, setErrorPassword] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = async () => {
    let errorTemp = {};
    setErrorPassword({});
    if (
      !formData.password ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      errorTemp = {
        password: !formData.password && "Todos los campos son abligatorios",
        newPassword:
          !formData.newPassword && "Todos los campos son abligatorios",
        repeatNewPassword:
          !formData.repeatNewPassword && "Todos los campos son abligatorios",
      };
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      errorTemp = {
        newPassword: "Las contraseñas no coinciden",
        repeatNewPassword: "Las contraseñas no coinciden",
      };
    } else if (size(formData.newPassword) < 6) {
      errorTemp = {
        newPassword: "La nueva contraseña debe ser mayor a 6 caracteres",
        repeatNewPassword: "La nueva contraseña debe ser mayor a 6 caracteres",
      };
    } else {
      setIsLoading(true);
      await reauthentication(formData.password)
        .then(async () => {
          await firebase
            .auth()
            .currentUser.updatePassword(formData.newPassword)
            .then(() => {
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut(); //serrar sesion
            })
            .catch(() => {
              errorTemp = {
                other: "Error al actualizar la contraseña",
              };
              setIsLoading(false);
            });
        })
        .catch((e) => {
          setIsLoading(false);
          errorTemp = { password: "La contraseña no es correcta" };
        });
    }
    setErrorPassword(errorTemp);
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña actual"
        style={styles.input}
        password={true}
        secureTextEntry={showPassword.current ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword.current ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => {
            setShowPassword({
              ...showPassword,
              current: !showPassword.current,
            });
          },
        }}
        onChange={(e) => {
          onChange(e, "password");
        }}
        errorMessage={errorPassword.password}
      ></Input>
      <Input
        placeholder="Nueva contraseña"
        style={styles.input}
        password={true}
        secureTextEntry={showPassword.new ? false : true}
        rightIcon={{
          type: "material-community",
          name: "eye-outline",
          color: "#c2c2c2",
          onPress: () => {
            setShowPassword({
              ...showPassword,
              new: !showPassword.new,
            });
          },
        }}
        onChange={(e) => {
          onChange(e, "newPassword");
        }}
        errorMessage={errorPassword.newPassword}
      ></Input>
      <Input
        placeholder="Repetir nueva contraseña"
        style={styles.input}
        password={true}
        secureTextEntry={showPassword.newRepeat ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword.newRepeat ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => {
            setShowPassword({
              ...showPassword,
              newRepeat: !showPassword.repeatNewPassword,
            });
          },
        }}
        onChange={(e) => {
          onChange(e, "repeatNewPassword");
        }}
        errorMessage={errorPassword.repeatNewPassword}
      ></Input>
      <Button
        title="Actulizar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      ></Button>
      <Text>{errorPassword.other}</Text>
    </View>
  );
}

function defaultValue() {
  return {
    password: "",
    newPassword: "",
    repeatNewPassword: "",
  };
}

function defaultShowPassword() {
  return {
    current: false,
    new: false,
    newRepeat: false,
  };
}

const styles = StyleSheet.create({
  view: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
