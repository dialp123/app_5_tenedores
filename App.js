import React from "react";
//import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseApp } from "./app/utils/Firebase";
import { LogBox, Settings } from "react-native";

//navegacion de componentes entre screens
import Navigation from "./app/navigations/Navigations";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  return <Navigation />;
}
