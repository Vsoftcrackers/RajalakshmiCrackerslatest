import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './Enquiry.css';

const Enquiry = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // State for storing form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enquiryType: 'Crackers Price',
    location: '',
    district: '',
    comments: ''
  });

  // Hook to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          location: `Latitude: ${latitude.toFixed(2)}, Longitude: ${longitude.toFixed(2)}`
        }));
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        location: 'Location not available'
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEnquiryClick = () => {
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the form data using EmailJS
    emailjs.send('raja', 'raja', formData, 'djl5JpoPh-0BB4PgO') // Replace 'YOUR_USER_ID' with your EmailJS user ID
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        alert('Your enquiry has been sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending email:', error.text);
        alert('Failed to send enquiry. Please try again later.');
      });

    // Optionally clear the form after submission
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      enquiryType: 'Crackers Price',
      location: '',
      district: '',
      comments: ''
    });
  };

  return (
    <div className="contact-container">
      <video autoPlay loop muted className="background-video">
        <source src="/assets/contact.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="contact-form-wrapper">
        <img src="assets/spinner.png" style={{ width: "130px", height: "60px" }} alt="Logo" />
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your Full Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your Mail address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your Phone Number"
              />
            </div>
          

         
            <div className="form-group">
              <label htmlFor="enquiryType">Enquiry Type</label>
              <select
                id="enquiryType"
                name="enquiryType"
                value={formData.enquiryType}
                onChange={handleChange}
              >
                <option value="Crackers">Crackers Price Related</option>
                <option value="Online">Online Shopping Related</option>
                <option value="Offline">Offline Shop Related</option>
                <option value="suggestions">Suggestions</option>
                <option value="complaints">Complaints</option>
              </select>
            </div></div>
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                readOnly
                placeholder="Fetching your location..."
              />
            
          </div>

          
            <div className="form-group">
              <label htmlFor="district">District</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter your district"
              />
            </div>
            </div>
            <div className="form-group">
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                rows="4"
                placeholder="Enter your comments or inquiries here..."
                value={formData.comments}
                onChange={handleChange}
              />
            </div>
        
        

          <div className="form-actions">
            <button type="reset" className="cancel-button" onClick={handleEnquiryClick}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Enquiry;
