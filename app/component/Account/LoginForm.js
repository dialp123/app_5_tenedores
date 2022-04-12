import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty, size } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

import { validateEmail } from "../../utils/Validations";
import Loading from "../Loading";

export default function LoginForm(props) {
  const { toastRef } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue);
  const [loadingState, setLoadingState] = useState(false);

  const navigation = useNavigation();

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    if (isEmpty(formData.mail) || isEmpty(formData.password)) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(formData.mail)) {
      toastRef.current.show("Correo electronico invalido");
    } else if (size(formData.password) < 6) {
      toastRef.current.show("Contraseña minimo 6 caracteres");
    } else {
      setLoadingState(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.mail, formData.password)
        .then(() => {
          setLoadingState(false);
          navigation.navigate("Account");
        })
        .catch((e) => {
          setLoadingState(false);
          toastRef.current.show(e.message);
        });
    }
  };

  return (
    <View style={styles.formConatiner}>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.inoutForm}
        onChange={(e) => {
          onChange(e, "mail");
        }}
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
        containerStyle={styles.inoutForm}
        password={true}
        secureTextEntry={showPassword ? false : true}
        onChange={(e) => {
          onChange(e, "password");
        }}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          ></Icon>
        }
      ></Input>
      <Button
        title="Iniciasr Sesion"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnlogin}
        onPress={() => {
          onSubmit();
        }}
      ></Button>
      <Loading isVisible={loadingState} text="Iniciando Sesion"></Loading>
    </View>
  );
}

function defaultFormValue() {
  return {
    mail: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  formConatiner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inoutForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
  },
  btnlogin: {
    backgroundColor: "#00a680",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});
