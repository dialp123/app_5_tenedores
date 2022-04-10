import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import * as firebase from "firebase";

import { validateEmail } from "../../utils/Validations";
import { reauthentication } from "../../utils/Api";

export default function ChangeEmailForm(props) {
  const { email, setShowModal, toastRef, setReloadUserInfo } = props;

  const [formData, setFormData] = useState(defaultValue);
  const [showPassword, setShowPassword] = useState(false);
  // estado del texto a mostrar si existe error al ingresar email o password
  const [formError, setFormError] = useState({});
  //loading del button
  const [loading, setLoading] = useState(false);

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    let errorTemp = {};
    setFormError({});

    if (!formData.email || !formData.password) {
      errorTemp = {
        email: !formData.email && "Todos los campos son abligatorios",
        password: !formData.password && "Todos los campos son obligatorios",
      };
    } else if (!validateEmail(formData.email)) {
      errorTemp = {
        email: "Formato de correo invalido",
      };
    } else if (formData.email === email) {
      errorTemp = {
        email: "El nuevo correo no puede ser igual al actual",
      };
    } else {
      setLoading(true);
      reauthentication(formData.password)
        .then((response) => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setReloadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente");
              setShowModal(false);
              setLoading(false);
            })
            .catch((e) => {
              toastRef.current.show("Error al actualizar el email");
              setLoading(false);
            });
        })
        .catch((e) => {
          setLoading(false);
          toastRef.current.show(e.message);
        });
    }
    setFormError(errorTemp);
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Correo electornico"
        containerStyle={styles.input}
        defaultValue={email || ""}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={formError.email}
      ></Input>
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => {
            setShowPassword(!showPassword);
          },
        }}
        errorMessage={formError.password}
        onChange={(e) => onChange(e, "password")}
      ></Input>
      <Button
        title="cambiar email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      ></Button>
    </View>
  );
}

function defaultValue() {
  return { email: "", password: "" };
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginBottom: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
