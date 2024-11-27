// Import the functions you need from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2bnVlprwEDxb-t0yfCui5wpI5_LbKhf8",
  authDomain: "crmdronefag.firebaseapp.com",
  projectId: "crmdronefag",
  storageBucket: "crmdronefag.appspot.com",  // fixed the typo here
  messagingSenderId: "805041383422",
  appId: "1:805041383422:web:325d2ebea31b66270fc2af",
  measurementId: "G-DCJWE8G3RV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display drones (from Firestore)
async function getDrones() {
  const dronesCollection = collection(db, "drones");
  const droneSnapshot = await getDocs(dronesCollection);
  const droneList = droneSnapshot.docs.map(doc => doc.data());
  
  console.log("Drones fetched from Firestore:", droneList);
  return droneList;
}

// Example of adding a new drone to Firestore
async function addDrone(droneData) {
  try {
    const dronesCollection = collection(db, "drones");
    const docRef = await addDoc(dronesCollection, droneData);
    console.log("Drone added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding drone: ", e);
  }
}

// Export the functions for use in other files
export { getDrones, addDrone };
