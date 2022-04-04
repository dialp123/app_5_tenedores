import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Favorites from "../screnns/Favorites";
import { StackActions } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorites"
        component={Favorites}
        options={{ title: "Restaurantes Favoritos" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
