import React, { useRef } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-fast-toast";

//KeyboardAwareScrollView: Desplaza hacia arriba el bloque del formulario cuando se depliega el teclado del movil
//Toast: notificaciones flotantes
//useRef: permite llamar un componente desde otrocomponente, en este caso llamar Toast desde RegisterForm

import RegisterForm from "../../component/Account/RegisterForm";

export default function Register(props) {
  const toastRef = useRef();

  return (
    <KeyboardAwareScrollView>
      <Image
        source={require("../../../assets/img/tenedores-letras-icono-logo.png")}
        resizeMode="contain"
        style={styles.logo}
      ></Image>
      <View style={styles.viewForm}>
        <RegisterForm toastRef={toastRef}></RegisterForm>
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9}></Toast>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  viewForm: {
    marginLeft: 40,
    marginRight: 40,
  },
});
