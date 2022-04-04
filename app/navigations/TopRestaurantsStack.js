import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopRestaurants from "../screnns/TopRestaurants";

const Stack = createStackNavigator();

export default function TopRestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Top-restaurants"
        component={TopRestaurants}
        options={{ title: "Los mejores restaurantes" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
