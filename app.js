// Import the functions you need from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2bnVlprwEDxb-t0yfCui5wpI5_LbKhf8",
  authDomain: "crmdronefag.firebaseapp.com",
  projectId: "crmdronefag",
  storageBucket: "crmdronefag.appspot.com",
  messagingSenderId: "805041383422",
  appId: "1:805041383422:web:325d2ebea31b66270fc2af",
  measurementId: "G-DCJWE8G3RV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch and display drones (from Firestore)
async function getDrones() {
  const dronesCollection = collection(db, "droner");  // Reference to 'droner' collection
  const droneSnapshot = await getDocs(dronesCollection);
  const droneList = droneSnapshot.docs.map(doc => doc.data());  // Mapping Firestore data

  console.log("Drones fetched from Firestore:", droneList);
  renderDroneList(droneList);  // Call the render function to display the drones
}

// Function to render drone list in the table
function renderDroneList(drones) {
  const tableBody = document.getElementById("droneListTable").getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';  // Clear existing content

  drones.forEach(drone => {
    const row = tableBody.insertRow();

    row.insertCell(0).textContent = drone.name || '-';
    row.insertCell(1).textContent = drone.regNum || '-';
    row.insertCell(2).textContent = drone.lastMaintenance || '-';
    row.insertCell(3).textContent = drone.isLoaned || '-';
    row.insertCell(4).textContent = drone.loanedTo || '-';
    row.insertCell(5).textContent = drone.loanedDate || '-';
    row.insertCell(6).textContent = drone.returnDate || '-';
  });
}

// Function to add a new drone to Firestore
async function addDrone(droneData) {
  try {
    const dronesCollection = collection(db, "droner");  // Reference to 'droner' collection
    const docRef = await addDoc(dronesCollection, droneData);  // Add the document to Firestore
    console.log("Drone added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding drone: ", e);
  }
}

// Export the functions for use in other files
export { getDrones, addDrone };
