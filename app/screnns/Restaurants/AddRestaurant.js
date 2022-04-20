import React, { useRef, useState, useEffect } from "react";
import { ScrollView } from "react-native";
import Toast from "react-native-fast-toast";
import * as firebase from "firebase";

import Loading from "../../component/Loading";
import AddRestaurantForm from "../../component/Restaurants/AddRestaurantForm";

export default function AddRestaurant(props) {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  return (
    <ScrollView>
      <AddRestaurantForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
      ></AddRestaurantForm>
      <Toast ref={toastRef} placement="bottom" opacity={20} offset={70}></Toast>
      <Loading isVisible={isLoading} text="Creando restaurante"></Loading>
    </ScrollView>
  );
}
