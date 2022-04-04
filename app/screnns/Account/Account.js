import React, { useEffect, useState } from "react";
import * as firebase from "firebase";
import UserLogged from "./UserLogged";
import UserGuest from "./UserGuest";

import Loading from "../../component/Loading";

export default function Account() {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      !user ? setLogin(false) : setLogin(true);
    });
  }, []);

  if (login === null)
    return <Loading isVisible={true} text="Cargando..."></Loading>;
  return login ? <UserLogged /> : <UserGuest />;
}
