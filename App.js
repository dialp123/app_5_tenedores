import React from "react";
//import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseApp } from "./app/utils/Firebase";
import { LogBox } from "react-native";

//navegacion de componentes entre screens
import Navigation from "./app/navigations/Navigations";

LogBox.ignoreAllLogs();

export default function App() {
  return <Navigation />;
}
