import React from "react";
//import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseApp } from "./app/utils/Firebase";
import { LogBox } from "react-native";
import { encode, decode } from "base-64";

//navegacion de componentes entre screens
import Navigation from "./app/navigations/Navigations";

//ignorar todos los logs
LogBox.ignoreAllLogs();

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  return <Navigation />;
}
