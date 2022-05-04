import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Dimensions, View, Text } from "react-native";
import { AirbnbRating, ListItem, Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { map } from "lodash";

import Loading from "../../component/Loading";
import CarouselImage from "../../component/CarouselImage";
import Map from "../../component/Map";

const widthScreen = Dimensions.get("window").width;
//iniciliza la base de datos firestore
const db = firebase.firestore(firebaseApp);

export default function Restaurant(props) {
  const { navigation, route } = props;
  const { idRestaurant, nameRestaurant } = route.params;

  //guarda la informacion del restaurante
  const [restaurant, setRestaurant] = useState(null);
  //Puntuacion del restaurante
  const [rating, setRating] = useState(0);

  useEffect(() => {
    db.collection("Restaurants")
      .doc(idRestaurant)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = response.id;
        setRestaurant(data);
        setRating(data.rating);
      });
  }, []);

  navigation.setOptions({ title: nameRestaurant });

  if (!restaurant) return <Loading isVisible={true} text="Cargando"></Loading>;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <CarouselImage
        images={restaurant.images}
        width={widthScreen}
        height={250}
      ></CarouselImage>
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      ></TitleRestaurant>
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      ></RestaurantInfo>
    </ScrollView>
  );
}

//titulo del restaurante, rating y descriptcion
function TitleRestaurant(props) {
  const { name, description, rating } = props;

  return (
    <View styles={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <View style={styles.rating}>
          <AirbnbRating
            size={20}
            showRating={false}
            isDisabled={true}
            defaultRating={parseFloat(rating)}
          ></AirbnbRating>
        </View>
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

// mapa del ubicacion del restaurante y list de la informacion
function RestaurantInfo(props) {
  const { location, name, address } = props;

  //array para mostrar la informacion como un list item
  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.restaurantInfo}>
      <Text style={styles.restaaurantInfoTitle}>Informacion</Text>
      <Map location={location} name={name} height={100}></Map>
      {map(listInfo, (item, index) => (
        <ListItem key={index} containerStyle={styles.containerListItem}>
          <Icon
            name={item.iconName}
            type={item.iconType}
            color="#00a680"
          ></Icon>
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  viewRestaurantTitle: {},
  nameRestaurant: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginLeft: 10,
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 2,
  },
  restaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaaurantInfoTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 2,
  },
});
