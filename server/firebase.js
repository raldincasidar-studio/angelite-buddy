// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmbwnQszGXChIw4dtEFQw4z4m1Y4ISimg",
    authDomain: "angelite-buddy-9780a.firebaseapp.com",
    projectId: "angelite-buddy-9780a",
    storageBucket: "angelite-buddy-9780a.appspot.com",
    messagingSenderId: "119114439258",
    appId: "1:119114439258:web:4fe1386907a177f990d663",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
