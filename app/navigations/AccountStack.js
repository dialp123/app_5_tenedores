import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Account from "../screnns/Account/Account";
import Login from "../screnns/Account/Login";
import Register from "../screnns/Account/Register";

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ title: "Mi Cuenta" }}
      ></Stack.Screen>

      <Stack.Screen
        name="Login"
        component={Login}
        optios={{ title: "iniciar sesion" }}
      ></Stack.Screen>

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: "Registro" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
