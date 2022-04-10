import * as firebase from "firebase";

export function reauthentication(password) {
  //optiene el usuaior actua logeado
  const user = firebase.auth().currentUser;
  // pide las credenciales del usuario logeado
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  // reautentica las credenciales optenidas
  return user.reauthenticateWithCredential(credentials);
}
