// Importar as ferramentas essenciais
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// O Passaporte
const firebaseConfig = {
    apiKey: "AIzaSyA38HODHxddGTv4Ms2mIW0ANWah6yRAtHI",
    authDomain: "dmw-tracker-guild.firebaseapp.com",
    projectId: "dmw-tracker-guild",
    storageBucket: "dmw-tracker-guild.firebasestorage.app",
    messagingSenderId: "568813831697",
    appId: "1:568813831697:web:49e88ca3f73579cc81d3b0"
};

// Liga os motores
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exportar TUDO
export { db, auth, provider, signInWithPopup, signOut, onAuthStateChanged };