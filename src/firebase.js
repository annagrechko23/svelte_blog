
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import firebase from 'firebase/app';
import { authState } from 'rxfire/auth';
import { collectionData } from 'rxfire/firestore';
import { map } from 'rxjs/operators';

const app = firebase.initializeApp({
    apiKey: "AIzaSyB2sUgFri6bGvmdfKQvt93AWAs8JexvGP8",
    authDomain: "blog-9d071.firebaseapp.com",
    databaseURL: "https://blog-9d071.firebaseio.com",
    projectId: "blog-9d071",
    storageBucket: "blog-9d071.appspot.com",
    messagingSenderId: "273300064612",
    appId: "1:273300064612:web:63fb84c8cc479180f09271",
    measurementId: "G-PQKXL9R75B"
});
const firestore = firebase.firestore(app);
const storage = firebase.storage();


export { app, firestore, storage, collectionData };

export default firebase;