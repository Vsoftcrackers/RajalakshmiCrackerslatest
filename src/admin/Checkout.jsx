import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firestore functions
import { getApps, initializeApp } from "firebase/app"; // Initialize Firebase

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

const Checkout = () => {
  const location = useLocation();
  const { selectedProducts } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    otp: "",
    paymentMode: "cashOnDelivery",
  });
  const [otpVerified, setOtpVerified] = useState(false);

  const calculateGrandTotal = () => {
    return selectedProducts.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOtpVerification = () => {
    // Simulate OTP verification (in a real app, you'd use an actual service)
    if (formData.otp === "123456") {
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handlePaymentModeChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      paymentMode: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.paymentMode === "cashOnDelivery") {
      const isConfirmed = window.confirm("Are you sure you want to choose Cash on Delivery?");
      if (isConfirmed) {
        try {
          // Prepare order data
          const orderData = {
            userDetails: {
              name: formData.name,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              email: formData.email,
            },
            products: selectedProducts.map(product => ({
              productName: product.productName,
              content: product.content,
              price: product.price,
              qty: product.qty,
              total: product.qty * product.price,
            })),
            grandTotal: calculateGrandTotal(),
            paymentMode: formData.paymentMode,
            timestamp: new Date(),
          };

          // Add order data to Firestore
          await addDoc(collection(db, "orders"), orderData);

          // Show success alert
          alert("Order submitted successfully!");
        } catch (err) {
          alert("Error submitting order: " + err.message);
        }
      }
    } else {
      alert("Proceeding with Online Payment.");
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      {/* Display selected products in a table */}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Content</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts && selectedProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.productName}</td>
              <td>{product.content}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.qty}</td>
              <td>${(product.qty * product.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Grand Total */}
      <h3>Grand Total: ${calculateGrandTotal()}</h3>

      {/* User details form */}
      <div className="user-details-form">
        <h3>Enter Your Details</h3>
        <form>
          <div>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Address: </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>City: </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>State: </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Pincode: </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email ID: </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>OTP: </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              disabled={otpVerified}
              required
            />
            <button type="button" onClick={handleOtpVerification} disabled={otpVerified}>
              Verify OTP
            </button>
          </div>
        </form>

        {/* Payment Mode */}
        <div>
          <h4>Payment Mode</h4>
          <label>
            <input
              type="radio"
              name="paymentMode"
              value="cashOnDelivery"
              checked={formData.paymentMode === "cashOnDelivery"}
              onChange={handlePaymentModeChange}
            />
            Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              name="paymentMode"
              value="onlinePayment"
              checked={formData.paymentMode === "onlinePayment"}
              onChange={handlePaymentModeChange}
            />
            Online Payment
          </label>
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleSubmit}>
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
