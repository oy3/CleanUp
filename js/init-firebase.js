// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC3bISlZP1sDWp59W82Aa9Q8GnG4pQ8t1w",
    authDomain: "cleanup-8cdaa.firebaseapp.com",
    databaseURL: "https://cleanup-8cdaa.firebaseio.com",
    projectId: "cleanup-8cdaa",
    storageBucket: "cleanup-8cdaa.appspot.com",
    messagingSenderId: "969353976159",
    appId: "1:969353976159:web:279707e571352ebb103eea",
    measurementId: "G-DW7BH5BETE"
};
// Initialize Firebase
var defaultProject = firebase.initializeApp(firebaseConfig);

// Make auth and firestore references
var auth = defaultProject.auth();
var db = defaultProject.firestore();
var storage = defaultProject.storage();

// Update firestore settings
db.settings({});