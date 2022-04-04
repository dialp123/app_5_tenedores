import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";
//Overlay: ventana emergente
//Activity indicator: animacion loading
//uppercase: texto siempre en mayusculas

export default function Loading(props) {
  const { isVisible, text } = props;

  return (
    <Overlay isVisible={isVisible} overlayStyle={styles.overlay}>
      <View style={styles.view}>
        <ActivityIndicator size="large" color="#00a680"></ActivityIndicator>
        {
          text && <Text style={styles.text}>{text}</Text> //si text existe muestre el texto
        }
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 100,
    width: 200,
    backgroundColor: "#fff",
    borderColor: "#00a680",
    borderWidth: 2,
    borderRadius: 10,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#00a680",
    textTransform: "uppercase",
    marginTop: 10,
  },
});
