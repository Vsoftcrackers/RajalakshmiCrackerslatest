import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // Import the xlsx library to parse the file
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firestore functions
import { getApps, initializeApp } from "firebase/app"; // Initialize Firebase
import "./AdminGoldRate.css";

// Firebase config (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyD3Kc5IV2ZU3FgqAV0PLBGGj7YTLXTsV_o",
  authDomain: "crackers-shop-1ccee.firebaseapp.com",
  projectId: "crackers-shop-1ccee",
  storageBucket: "crackers-shop-1ccee.firebasestorage.app",
  messagingSenderId: "530523718936",
  appId: "1:530523718936:web:fa404d5ae610d804e30a6d",
  measurementId: "G-8JB07Y4M5J"
};

// Initialize Firebase only if it's not initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig); // Initialize the app only if it's not already initialized
} else {
  app = getApps()[0]; // If already initialized, use the existing app
}

const db = getFirestore(app); // Initialize Firestore

const AdminProducts = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      console.log("Sheet Names:", workbook.SheetNames);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      console.log("Sheet Data:", XLSX.utils.sheet_to_json(sheet, { header: 1 }));

      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log("Parsed Data:", data);

      let currentRow = 7; // Starting from row 7 (0-based index)
      const productsToAdd = [];

      // Prepare products data from XLSX file
      while (data[currentRow]) {
        const [serialNo, productName, content, price, qty, total] = data[currentRow];

        console.log("Processing Row:", currentRow, data[currentRow]);

        // Ensure the content is not undefined or null
        if (productName && price >= 0 && qty >= 0) {
          const product = {
            productName,
            content: content || 'No content provided', // Default value if content is missing
            price: parseFloat(price),
            qty: parseInt(qty),
            total: parseFloat(total),
          };

          productsToAdd.push(product);
        }

        currentRow++;
      }

      // Step 1: Delete all existing products in Firestore
      const querySnapshot = await getDocs(collection(db, "products"));
      const deletePromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, "products", docSnapshot.id))
      );

      try {
        // Wait for all deletions to complete
        await Promise.all(deletePromises);

        console.log("All existing products have been deleted.");
        
        // Step 2: Add new products
        for (const product of productsToAdd) {
          try {
            const docRef = await addDoc(collection(db, "products"), product);
            console.log("Document added with ID:", docRef.id);
          } catch (err) {
            setError("Error saving product to Firestore.");
            console.error("Firestore error:", err);
          }
        }

        setError(""); // Clear error
        alert("Products have been successfully added/updated!");
      } catch (err) {
        setError("Error deleting existing products.");
        console.error("Error deleting products:", err);
      }
    };

    reader.onerror = () => {
      setError("Error reading the file.");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="admin-products-container">
      <h2>Upload Product Data</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Process</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AdminProducts;

