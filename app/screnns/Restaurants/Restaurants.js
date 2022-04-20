import React, { useEffect, useReducer, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-fast-toast";

import ListRestaurants from "../../component/Restaurants/ListRestaurants";

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  //contiene la informacion del usuario logeado
  const [user, setUser] = useState(null);
  //array de restaurantes a mostrar
  const [restaurants, setRestaurants] = useState([]);
  //totalde restaurantes que se tiene en firestore
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  //limite de restaurates a mostrar
  const limitRestaurants = 7;
  //posicion inicialdesdedonde se muestran los restaurantes del array total de restaurantes
  const [startRestaurants, setStartRestaurants] = useState(null);
  //loading
  const [isLoading, setIsLoading] = useState(false);

  const toastRef = useRef();

  //verifica si el usuario esta logeado
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    //obtiene el size del array de todos los restaurantes en firestore
    db.collection("Restaurants")
      .get()
      .then((snap) => {
        setTotalRestaurants(snap.size);
      })
      .catch((e) => {
        toastRef.current.show(e.message);
      });

    const resultRestaurant = [];
    //obtiene los limitRestaurants de firestore ordenados por fecha de creacion
    // de manera desc, le agrega a cada uno como propiedad su id y los guarda en el estado restaurants
    db.collection("Restaurants")
      .orderBy("createAt", "desc")
      .limit(limitRestaurants)
      .get()
      .then((response) => {
        setStartRestaurants(response.docs[response.docs.length - 1]);
        response.forEach((doc) => {
          const restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurant.push(restaurant);
        });
        setRestaurants(resultRestaurant);
      })
      .catch((e) => {
        toastRef.current.show(e.message);
      });
  }, []);

  // cargar mas restaurantes en el flatlist al scrollear hasta el final
  const handleLoadMore = () => {
    const resultRestaurant = [];
    restaurants.length < totalRestaurants && setIsLoading(true); //si los restaurantes cargados es menor al total,cargar mas

    db.collection("Restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(limitRestaurants)
      .get()
      .then((response) => {
        console.log(response.docs.length);
        if (response.docs.length > 0) {
          setStartRestaurants(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurant.push(restaurant);
        });
        setRestaurants([...restaurants, ...resultRestaurant]);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      ></ListRestaurants>
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
      <Toast ref={toastRef} placement="bottom" opacity={20} offset={70}></Toast>
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
