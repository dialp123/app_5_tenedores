import react from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Restaurants from "../screnns/Restaurants/Restaurants";
import AddRestaurant from "../screnns/Restaurants/AddRestaurant";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Restauranst"
        component={Restaurants}
        options={{ title: "Restaurantes" }}
      ></Stack.Screen>
      <Stack.Screen
        name="Add-restaurant"
        component={AddRestaurant}
        options={{ title: "Añadir nuevo restaurante" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
