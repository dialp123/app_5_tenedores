//opciones de actulizacionde informacion de la cuenta

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import { map } from "lodash";

//ListItem == permite agregar una lista de componentes y recorrer cada uno mediante un array

export default function AccountOptions(props) {
  const { userInfo, toastRef } = props;

  //selecciona el componente a mostrar
  const selectComponent = (key) => {
    console.log(key);
  };
  const menuOptions = generateOptions(selectComponent);

  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem
          key={index}
          bottomDivider
          containerStyle={styles.menuItems}
          onPress={menu.onPress}
        >
          <Icon
            type={menu.iconType}
            name={menu.iconNameLeft}
            color={menu.iconColorLef}
          ></Icon>
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type={menu.iconType}
            name={menu.iconNameRight}
            color={menu.iconColorLef}
          ></Icon>
        </ListItem>
      ))}
    </View>
  );
}

function generateOptions(selectComponent) {
  return [
    {
      title: "Cambiar nombre",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLef: "#ccc",
      iconNameRight: "chevron-right",
      onPress: () => selectComponent("displayName"),
    },
    {
      title: "Cambiar email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLef: "#ccc",
      iconNameRight: "chevron-right",
      onPress: () => selectComponent("mail"),
    },
    {
      title: "Cambiar contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLef: "#ccc",
      iconNameRight: "chevron-right",
      onPress: () => selectComponent("password"),
    },
  ];
}

const styles = StyleSheet.create({
  menuItems: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
});
