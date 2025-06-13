import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app'; // Firebase ऐप को इनिशियलाइज़ करने के लिए
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'; // ऑथेंटिकेशन सेवाएँ

// import { Link, useNavigate } from 'react-router-dom'; // आपके स्थानीय प्रोजेक्ट के लिए सक्रिय रहेगा
// import './Navbar.css'; // Tailwind CSS का उपयोग करने के लिए इसे हटाया गया है

const Navbar = () => {
    // Firebase कॉन्फ़िगरेशन - आपकी `src/firebase.js` से ली गई जानकारी
    // कृपया सुनिश्चित करें कि यह जानकारी आपके वास्तविक Firebase प्रोजेक्ट से मेल खाती है।
    const firebaseConfig = {
        apiKey: "AIzaSyBDanczGpeAZdzr5liCThgjSCpOrVnpAfk",
        authDomain: "chat-e9374.firebaseapp.com",
        projectId: "chat-e9374",
        storageBucket: "chat-e9374.firebasestorage.app",
        messagingSenderId: "562614811559",
        appId: "1:562614811559:web:ddc712fbf0e85194611482",
        measurementId: "G-N02HYN7D6J"
    };

    const [user, setUser] = useState(null); // Firebase उपयोगकर्ता को ट्रैक करने के लिए स्टेट
    const [authInstance, setAuthInstance] = useState(null); // Firebase auth इंस्टेंस
    const [showDetails, setShowDetails] = useState(false); // उपयोगकर्ता ड्रॉपडाउन के लिए

    // Firebase को इनिशियलाइज़ करें और ऑथेंटिकेशन लिसनर सेट करें
    useEffect(() => {
        let unsubscribe = () => {}; // डिफॉल्ट अनसब्सक्राइब फ़ंक्शन

        try {
            const app = initializeApp(firebaseConfig);
            const authService = getAuth(app);
            setAuthInstance(authService); // auth इंस्टेंस को सेट करें

            // ऑथेंटिकेशन स्टेट बदलने पर लिसनर सेट करें
            unsubscribe = onAuthStateChanged(authService, (currentUser) => {
                setUser(currentUser); // यूजर स्टेट को अपडेट करें
            });

        } catch (error) {
            console.error("Firebase Navbar Initialization Error:", error);
            // यहाँ कोई UI मैसेज नहीं, क्योंकि नेविगेशन बार हमेशा दिखना चाहिए
        }

        // कंपोनेंट अनमाउंट होने पर ऑथेंटिकेशन लिसनर को क्लीनअप करें
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []); // केवल एक बार कंपोनेंट माउंट होने पर चलता है

    const handleLogout = async () => {
           if (!authInstance) {
               console.error("Firebase auth instance not available for logout.");
               return;
           }
           try {
               await signOut(authInstance);
               window.location.href = '/login'; // Canvas वातावरण के लिए
           } catch (error) {
               console.error("Logout Error:", error.message);
               // logout फेल होने पर उपयोगकर्ता को सूचित करने के लिए यहां एक संदेश जोड़ें
           }
       };

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 shadow-lg sticky top-0 z-50 font-inter">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <h1 className="text-white text-3xl font-extrabold cursor-pointer select-none">
                    📝 Blogify
                </h1>
                <ul className="flex items-center space-x-6 text-lg">
                    <li><a href="/home" className="text-white hover:text-blue-200 transition-colors duration-300">Home</a></li>
                    <li><a href="/blog" className="text-white hover:text-blue-200 transition-colors duration-300">Create Blog</a></li>
                    <li><a href="/blogs" className="text-white hover:text-blue-200 transition-colors duration-300">All Blogs</a></li>

                    {user ? (
                        <>
                            <li className="relative">
                                <span
                                    onClick={toggleDetails}
                                    className="text-white hover:text-blue-200 cursor-pointer flex items-center transition-colors duration-300 px-3 py-2 rounded-lg bg-blue-800 bg-opacity-50 hover:bg-opacity-70"
                                >
                                    {user.displayName || user.email || 'User'}
                                </span>
                                {showDetails && (
                                    <div className="absolute right-0 mt-2 w-64 bg-blue-800 bg-opacity-90 rounded-lg shadow-xl p-4 text-sm z-10 border border-blue-600">
                                        <p className="text-blue-200 mb-1"><strong>Email:</strong> {user.email}</p>
                                        <p className="text-blue-200"><strong>UID:</strong> {user.uid}</p>
                                    </div>
                                )}
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><a href="/login" className="text-white hover:text-blue-200 transition-colors duration-300">Login</a></li>
                            <li><a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">Signup</a></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
