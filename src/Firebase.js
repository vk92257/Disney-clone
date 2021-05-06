import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyAF8BWTjQaDEdLwEJ6LqEw4b279dOHI6Qw",
    authDomain: "ancient-folio-268007.firebaseapp.com",
    databaseURL: "https://ancient-folio-268007.firebaseio.com",
    projectId: "ancient-folio-268007",
    storageBucket: "ancient-folio-268007.appspot.com",
    messagingSenderId: "914723289628",
    appId: "1:914723289628:web:7f15cdd19ca3ab3b0a3dd9",
    measurementId: "G-6BH8V2ZLTK"
  };

  const firebaseApp=firebase.initializeApp(firebaseConfig);
 const db = firebaseApp.firestore();
 const auth = firebase.auth();
 const provider = new  firebase.auth.GoogleAuthProvider();
 const storage = firebase.storage();
  export {auth,provider,storage};
  export default db;
