//opciones de actulizacionde informacion de la cuenta

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import { map } from "lodash";

import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";

//ListItem == permite agregar una lista de componentes y recorrer cada uno mediante un array

export default function AccountOptions(props) {
  const { userInfo, toastRef, setReloadUserInfo } = props;

  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);
  //selecciona el componente a mostrar
  const selectComponent = (key) => {
    switch (key) {
      case "displayName":
        setRenderComponent(
          <ChangeDisplayNameForm
            displayName={userInfo.displayName}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          ></ChangeDisplayNameForm>
        );
        setShowModal(true);
        break;
      case "mail":
        setRenderComponent(<Text>Cambiando el email</Text>);
        setShowModal(true);
        break;
      case "password":
        setRenderComponent(<Text>CAmbiando contraseña</Text>);
        setShowModal(true);
        break;
      default:
        setRenderComponent(null);
        break;
    }
  };

  const menuOptions = generateOptions(selectComponent);

  return (
    <View>
      {
        //foreach
        map(menuOptions, (menu, index) => (
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
        ))
      }
      <Modal isVisible={showModal} setIsVisible={setShowModal}>
        <Text>{renderComponent}</Text>
      </Modal>
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
