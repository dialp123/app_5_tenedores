import React from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Input, Icon, Avatar, Image, Button } from "react-native-elements";

export default function AddRestaurantForm() {
  return (
    <ScrollView style={StyleSheet.scrollView}>
      <FormAdd></FormAdd>
    </ScrollView>
  );
}
//Formulario para añadir nuevo restaurante
function FormAdd(props) {
  return (
    <View styles={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
      ></Input>
      <Input placeholder="Direccion" containerStyle={styles.input}></Input>
      <Input
        placeholder="Descripcion de restaurante"
        multiline={true}
        containerStyle={styles.textArea}
      ></Input>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 500,
    width: "100%",
    padding: 0,
    margin: 0,
  },
});
