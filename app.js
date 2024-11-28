// Import the functions you need from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";

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

// Function to render drone list in the table
function renderDroneList(drones) {
  const tableBody = document.getElementById("droneListTable").getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Clear previous content

  drones.forEach((drone, index) => {
    const row = tableBody.insertRow();

    row.insertCell(0).textContent = drone.name || '-';
    row.insertCell(1).textContent = drone.regNum || '-';
    row.insertCell(2).textContent = drone.lastMaintenance || '-';
    row.insertCell(3).textContent = drone.isLoaned || '-';
    row.insertCell(4).textContent = drone.loanedTo || '-';
    row.insertCell(5).textContent = drone.loanedDate || '-';
    row.insertCell(6).textContent = drone.returnDate || '-';
    row.insertCell(7).textContent = drone.group || '-'; // Display group

    // Add an edit button
    const editCell = row.insertCell(8);
    const editButton = document.createElement("button");
    editButton.textContent = "Rediger";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editDrone(drone.id, index));
    editCell.appendChild(editButton);
  });
}

// Fetch drones from Firestore
async function fetchDrones() {
  const dronesCollection = collection(db, "drones");
  const droneSnapshot = await getDocs(dronesCollection);
  const drones = droneSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderDroneList(drones);
}

// Edit drone details
async function editDrone(droneId, rowIndex) {
  const droneRow = document.getElementById("droneListTable").rows[rowIndex + 1];

  document.getElementById("editName").value = droneRow.cells[0].textContent;
  document.getElementById("editRegNum").value = droneRow.cells[1].textContent;
  document.getElementById("editLastMaintenance").value = droneRow.cells[2].textContent;
  document.getElementById("editIsLoaned").value = droneRow.cells[3].textContent;
  document.getElementById("editLoanedTo").value = droneRow.cells[4].textContent;
  document.getElementById("editLoanedDate").value = droneRow.cells[5].textContent;
  document.getElementById("editReturnDate").value = droneRow.cells[6].textContent;
  document.getElementById("editGroup").value = droneRow.cells[7].textContent;

  // Store the droneId for later use when updating the Firestore document
  document.getElementById("editDroneBtn").setAttribute("data-drone-id", droneId);

  // Show the edit section
  document.getElementById("editDroneSection").style.display = "block";
  document.getElementById("droneListSection").style.display = "none";
}

// Update drone in Firestore
document.getElementById("editDroneBtn").addEventListener("click", async function() {
  const droneId = document.getElementById("editDroneBtn").getAttribute("data-drone-id");

  const updatedDrone = {
    name: document.getElementById("editName").value,
    regNum: document.getElementById("editRegNum").value,
    lastMaintenance: document.getElementById("editLastMaintenance").value,
    isLoaned: document.getElementById("editIsLoaned").value,
    loanedTo: document.getElementById("editLoanedTo").value,
    loanedDate: document.getElementById("editLoanedDate").value,
    returnDate: document.getElementById("editReturnDate").value,
    group: document.getElementById("editGroup").value // Update group
  };

  const droneDoc = doc(db, "drones", droneId);
  await updateDoc(droneDoc, updatedDrone);

  alert("Drone oppdatert!");
  fetchDrones(); // Re-fetch drones after update

  document.getElementById("editDroneSection").style.display = "none";
  document.getElementById("droneListSection").style.display = "block";
});

// Add new drone to Firestore
document.getElementById("addDroneForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const newDrone = {
    name: document.getElementById("name").value,
    regNum: document.getElementById("regNum").value,
    lastMaintenance: document.getElementById("lastMaintenance").value,
    isLoaned: document.getElementById("isLoaned").value,
    loanedTo: document.getElementById("loanedTo").value,
    loanedDate: document.getElementById("loanedDate").value,
    returnDate: document.getElementById("returnDate").value,
    group: document.getElementById("group").value // Include group
  };

  try {
    await addDoc(collection(db, "drones"), newDrone);
    alert("Drone lagt til!");
    fetchDrones(); // Re-fetch drones after adding
  } catch (error) {
    alert("Det oppsto en feil: " + error.message);
  }
});

// Initialize app
document.getElementById("viewDronesBtn").addEventListener("click", fetchDrones);

// Show add drone form
document.getElementById("addDroneBtn").addEventListener("click", function() {
  document.getElementById("addDroneSection").style.display = "block";
  document.getElementById("droneListSection").style.display = "none";
});
