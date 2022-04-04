import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

import { validateEmail } from "../../utils/Validations";
import Loading from "../Loading";

//secureTextEntry: muestra u oculta el texto, true = oculta
//...formData: devuelve los valores que tiene el objeto, formData devuelve el objeto
//lodash: aggrega infinidad de funciones que permiten comparar, buscar, filtrar etc..elementos, strings, cadenas etc...

export default function RegisterForm(props) {
  const { toastRef } = props;

  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [formData, setformData] = useState(defaultFormValue);
  const [loadingState, setLoadingState] = useState(false);

  const onSubmit = () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword)
    ) {
      toastRef.current.show("todos los campos son abligarorios");
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("email no valido");
    } else if (formData.password != formData.repeatPassword) {
      toastRef.current.show("las contraseñas deben ser iguales");
    } else if (size(formData.password) < 6) {
      toastRef.current.show(
        "las contraseña tiene que tener almenos 6 caracteres"
      );
    } else {
      setLoadingState(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          setLoadingState(false);
          navigation.navigate("Account");
        })
        .catch((err) => {
          setLoadingState(false);
          toastRef.current.show(err.message);
        });
    }
  };

  const onChange = (e, type) => {
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, "email")}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          ></Icon>
        }
      ></Input>
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={showPassword ? false : true}
        onChange={(e) => onChange(e, "password")}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          ></Icon>
        }
      ></Input>
      <Input
        placeholder="Repetir Contraseña"
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={showRepeatPassword ? false : true}
        onChange={(e) => onChange(e, "repeatPassword")}
        rightIcon={
          <Icon
            type="material-community"
            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => {
              setShowRepeatPassword(!showRepeatPassword);
            }}
          ></Icon>
        }
      ></Input>
      <Button
        title={"Unirse"}
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      ></Button>
      <Loading isVisible={loadingState} text="Creando usuario"></Loading>
    </View>
  );
}

function defaultFormValue() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "#00a680",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});
