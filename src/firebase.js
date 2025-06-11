// Importa as funções necessárias dos SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Adicione os SDKs para os produtos do Firebase que você deseja usar
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuração do Firebase da sua aplicação web
const firebaseConfig = {
  apiKey: "AIzaSyAn5jpM9WqAhQYoxYWXWc-tGyIJNXhmyVo",
  authDomain: "gamevaulttt.firebaseapp.com",
  projectId: "gamevaulttt",
  storageBucket: "gamevaulttt.appspot.com", // Corrigido para .appspot.com, que é o padrão
  messagingSenderId: "933822178478",
  appId: "1:933822178478:web:c19535409d3a97665b393f"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços do Firebase para serem usados em outros lugares
export const auth = getAuth(app);
export const db = getFirestore(app);
