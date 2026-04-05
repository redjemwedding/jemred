// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzMIXq4bJA3LxFAet4R9mV0PRNNuoHL6w",
  authDomain: "global-rosary.firebaseapp.com",
  databaseURL: "https://global-rosary-default-rtdb.firebaseio.com",
  projectId: "global-rosary"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
