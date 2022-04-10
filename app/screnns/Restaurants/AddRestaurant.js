import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-fast-toast";

import Loading from "../../component/Loading";
import AddRestaurantForm from "../../component/Restaurants/AddRestaurantForm";

export default function AddRestaurant(props) {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  return (
    <View>
      <AddRestaurantForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
      ></AddRestaurantForm>
      <Toast ref={toastRef} position="center" opacity={0.9}></Toast>
      <Loading isVisible={isLoading} text="Creando restaurante"></Loading>
    </View>
  );
}
