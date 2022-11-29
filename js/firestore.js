import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js"


const firebaseConfig = {
    apiKey: "AIzaSyBtqVLuVnfcXX9DNMCzxramm8XpBb-l54E",
    authDomain: "pwanotifications-7fb83.firebaseapp.com",
    projectId: "pwanotifications-7fb83",
    storageBucket: "pwanotifications-7fb83.appspot.com",
    messagingSenderId: "597178611271",
    appId: "1:597178611271:web:ddc5e5f09707b68a862362"
  };

  // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    export { app }
