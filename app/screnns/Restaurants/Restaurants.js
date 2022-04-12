import React, { useEffect, useReducer, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import Toast from "react-native-fast-toast";

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  return (
    <View style={styles.viewBody}>
      <Text>Restauranst......</Text>
      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#00a680"
          reverse
          containerStyle={styles.btnContainer}
          onPress={() => {
            navigation.navigate("Add-restaurant");
          }}
        ></Icon>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black", //color de la sombra
    shadowOffset: { width: 2, height: 2 }, //posicion de la sombra respecto al contenedor del button
    shadowOpacity: 0.5,
  },
});
