import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore functions
import { getApps, initializeApp } from "firebase/app"; // Initialize Firebase
import DatePicker from "react-datepicker"; // Calendar for picking delivery date
import "react-datepicker/dist/react-datepicker.css"; // Importing datepicker CSS

// Firebase config
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

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null); // For storing selected delivery date
  const [status, setStatus] = useState(""); // For storing selected delivery status

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (err) {
        setError("Error fetching orders.");
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Handle delivery date change
  const handleDateChange = (date, orderId) => {
    setDeliveryDate(date);
    if (window.confirm("Do you want to update the delivery date?")) {
      updateOrder(orderId, { deliveryDate: date });
    }
  };

  // Handle delivery status change
  const handleStatusChange = (status, orderId) => {
    setStatus(status);
    if (window.confirm("Do you want to update the delivery status?")) {
      updateOrder(orderId, { deliveryStatus: status });
    }
  };

  // Update the order in Firestore
  const updateOrder = async (orderId, updateData) => {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, updateData);
      console.log("Order updated successfully");
    } catch (err) {
      console.error("Error updating order: ", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Orders List</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Total Amount</th>
            <th>Payment Mode</th>
            <th>Order Date</th>
            <th>Products</th>
            <th>Set Delivery Date</th>
            <th>Set Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userDetails.name}</td>
              <td>{order.userDetails.email}</td>
              <td>${order.grandTotal}</td>
              <td>{order.paymentMode === "cashOnDelivery" ? "Cash on Delivery" : "Online Payment"}</td>
              <td>{new Date(order.timestamp.seconds * 1000).toLocaleString()}</td>
              <td>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index}>
                      <strong>{product.productName}</strong> ({product.content}) - Quantity: {product.qty}, Price: ${product.price}, Total: ${product.total}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                {/* Calendar to set the delivery date */}
                <DatePicker
                  selected={order.deliveryDate ? new Date(order.deliveryDate.seconds * 1000) : null}
                  onChange={(date) => handleDateChange(date, order.id)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Delivery Date"
                />
              </td>
              <td>
                {/* Dropdown to set the delivery status */}
                <select
                  value={order.deliveryStatus || ""}
                  onChange={(e) => handleStatusChange(e.target.value, order.id)}
                >
                  <option value="">Select Status</option>
                  <option value="Yet to deliver">Yet to deliver</option>
                  <option value="Delivery in process">Delivery in process</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delivery incomplete">Delivery incomplete</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
