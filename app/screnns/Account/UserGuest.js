//Screen de ususarios no logeados

import react from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

//StyleSheet: permite añadir stilos
//ScrollView: permite hacer scroll
//useNavigation: permite navegar hacia un screen especifico

export default function UserGuest() {
  const navigation = useNavigation();

  return (
    <ScrollView centerContent={true} style={styles.viewBody}>
      <Image
        style={styles.image}
        source={require("../../../assets/img/user-guest.jpg")}
        resizeMode="contain"
      />
      <Text style={styles.title}> Consulta tu perfil de 5 tenedores</Text>
      <Text style={styles.descripcion}>
        ¿Como describirias tu mejor restaurante? Busca y visualiza los mejores
        restaurantes de una forma sencilla , vota cual te ha gustado mas y
        comenta como ha sido tu experiencia
      </Text>
      <View style={styles.btnView}>
        <Button
          title="Ver tu perfil"
          buttonStyle={styles.btnStyle}
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("Login")}
        ></Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  descripcion: {
    textAlign: "center",
    marginBottom: 20,
  },
  btnView: {
    alignItems: "center",
  },
  btnStyle: {
    backgroundColor: "#00a680",
  },
  btnContainer: {
    width: "50%",
  },
});
