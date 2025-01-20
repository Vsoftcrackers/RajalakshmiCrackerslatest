import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app"; // Initialize Firebase
import { useNavigate } from "react-router-dom";

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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          qty: 0, // Initialize qty for each product
        }));
        setProducts(productsData);
      } catch (err) {
        setError("Error fetching products.");
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleQuantityChange = (productId, change) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => {
        if (product.id === productId) {
          const updatedQty = product.qty + change;
          return { ...product, qty: updatedQty >= 0 ? updatedQty : 0 }; // Ensure qty is not negative
        }
        return product;
      });
      return updatedProducts;
    });
  };

  const handleAddToCheckout = (product) => {
    setSelectedProducts(prevSelectedProducts => {
      if (!prevSelectedProducts.find(p => p.id === product.id)) {
        return [...prevSelectedProducts, product];
      }
      return prevSelectedProducts;
    });
  };

  const calculateGrandTotal = () => {
    return selectedProducts.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { selectedProducts } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Content</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.productName}</td>
              <td>{product.content}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <button onClick={() => handleQuantityChange(product.id, -1)} disabled={product.qty <= 0}>-</button>
                {product.qty}
                <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
              </td>
              <td>${(product.qty * product.price).toFixed(2)}</td>
              <td>
                <button onClick={() => handleAddToCheckout(product)}>Add to Checkout</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3>Grand Total: ${calculateGrandTotal()}</h3>
        <button onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default ProductList;
