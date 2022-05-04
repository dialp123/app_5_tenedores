import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { rest, size } from "lodash";

export default function ListRestaurants(props) {
  const { restaurants, handleLoadMore, isLoading } = props;
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {size(restaurants) > 0 ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )} //componente que se renderiza en cada iteracion de restaurants y se pasa la informacion de cada posicion delarray
          key={(item, index) => {
            //obligatorio de Flat list
            item.key;
          }}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading}></FooterList>}
        ></FlatList>
      ) : (
        <View styles={styles.loaderRestaurants}>
          <ActivityIndicator size="large" color="#00a680"></ActivityIndicator>
          <Text style={{ textAlign: "center" }}>Cargando</Text>
        </View>
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { id, images, name, description, address } = restaurant.item;
  const imageRestaurant = images[0];

  const goRestaurant = () => {
    navigation.navigate("Restaurant", {
      idRestaurant: id,
      nameRestaurant: name,
    });
  };

  return (
    <TouchableOpacity onPress={goRestaurant}>
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#ffff" />} //si no hay imagne que muestre un activy indicator
            source={
              imageRestaurant
                ? { uri: imageRestaurant }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageRestaurant}
          ></Image>
        </View>
        <View>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantAddress}>{address}</Text>
          <Text style={styles.restaurantDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading === true) {
    return (
      <View style={styles.loaderRestaurants}>
        <ActivityIndicator size="large" color="#00a680"></ActivityIndicator>
      </View>
    );
  } else {
    return (
      <View style={styles.notFountRestaurants}>
        <Text>No quedan mas restaurantes</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  viewRestaurant: {
    flexDirection: "row",
    margin: 10,
  },
  viewRestaurantImage: {
    marginRight: 15,
  },
  imageRestaurant: {
    width: 80,
    height: 80,
  },
  restaurantName: {
    fontWeight: "bold",
  },
  restaurantAddress: {
    paddingTop: 2,
    color: "grey",
  },
  restaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  notFountRestaurants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
