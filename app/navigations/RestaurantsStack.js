import react from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screnns/Restaurants";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Restauranst"
        component={Restaurants}
        options={{ title: "Restaurantes" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
