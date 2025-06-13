import React, { useState, useEffect } from 'react';
// Firebase ऐप को इनिशियलाइज़ करने के लिए
import { initializeApp } from 'firebase/app';
// ऑथेंटिकेशन सेवाएँ
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

// Navbar को अब सीधे यहीं डिफाइन किया जाएगा ताकि 'resolve' एरर न आए।
// import { Link, useNavigate } from 'react-router-dom'; // आपके स्थानीय प्रोजेक्ट के लिए सक्रिय रहेगा
// import Navbar from '../components/Navbar'; // आपके स्थानीय प्रोजेक्ट में Navbar का पथ सुनिश्चित करें
// import './Home.css'; // Tailwind CSS का उपयोग करने के लिए इसे हटाया गया है

// Firebase कॉन्फ़िगरेशन को मुख्य कंपोनेंट के बाहर परिभाषित करें ताकि यह केवल एक बार हो
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

// Navbar कंपोनेंट की परिभाषा, जिसे Home कंपोनेंट के अंदर एम्बेड किया जाएगा।
// यह authInstance और currentUser को props के रूप में प्राप्त करेगा।
const EmbeddedNavbar = ({ authInstance, currentUser }) => {
    const [showDetails, setShowDetails] = useState(false);

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

                    {currentUser ? ( // 'user' की जगह 'currentUser' का उपयोग करें
                        <>
                            <li className="relative">
                                <span
                                    onClick={toggleDetails}
                                    className="text-white hover:text-blue-200 cursor-pointer flex items-center transition-colors duration-300 px-3 py-2 rounded-lg bg-blue-800 bg-opacity-50 hover:bg-opacity-70"
                                >
                                    {currentUser.displayName || currentUser.email || 'User'} {/* 'user' की जगह 'currentUser' का उपयोग करें */}
                                </span>
                                {showDetails && (
                                    <div className="absolute right-0 mt-2 w-64 bg-blue-800 bg-opacity-90 rounded-lg shadow-xl p-4 text-sm z-10 border border-blue-600">
                                        <p className="text-blue-200 mb-1"><strong>Email:</strong> {currentUser.email}</p> {/* 'user' की जगह 'currentUser' का उपयोग करें */}
                                        <p className="text-blue-200"><strong>UID:</strong> {currentUser.uid}</p> {/* 'user' की जगह 'currentUser' का उपयोग करें */}
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


const Home = () => {
    const [user, setUser] = useState(null); // Firebase उपयोगकर्ता को ट्रैक करने के लिए स्टेट
    const [authInstance, setAuthInstance] = useState(null); // Firebase auth इंस्टेंस
    // const navigate = useNavigate(); // आपके स्थानीय प्रोजेक्ट में react-router-dom के लिए

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
            console.error("Firebase Home Page Initialization Error:", error);
            // होम पेज के लिए कोई UI मैसेज नहीं, क्योंकि यह बैकग्राउंड में होता है
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
            // navigate('/login'); // आपके स्थानीय प्रोजेक्ट में react-router-dom के साथ
            window.location.href = '/'; // कैनवास वातावरण के लिए
        } catch (error) {
            console.error("Logout Error:", error.message);
            // logout फेल होने पर उपयोगकर्ता को सूचित करने के लिए यहां एक संदेश जोड़ें
        }
    };

    // यदि उपयोगकर्ता लोड नहीं हुआ है तो लोडिंग या रीडायरेक्ट दिखाएँ
    if (user === null) {
        // यह यहाँ कुछ लोडिंग इंडिकेटर दिखा सकता है
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-inter">
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <>
            {/* Embedded Navbar को यहाँ रेंडर करें, आवश्यक props पास करते हुए */}
            <EmbeddedNavbar authInstance={authInstance} currentUser={user} />

            {/* यहाँ बैकग्राउंड इमेज बदलें */}
            <div
                className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white font-inter"
                style={{
                    backgroundImage: `url('/images/home.jpg')`, // <-- इस URL को अपनी इमेज से बदलें
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed' // बैकग्राउंड को फिक्स्ड रखने के लिए
                }}
            >
                <div className="flex flex-col items-center justify-center flex-grow p-8 text-center">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">
                        Welcome, {user?.displayName || user?.email || 'User'}!
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-12 animate-fade-in-up">
                        Start exploring or create your next great blog post.
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                        <a
                            href="/blog" // Link को <a> से बदला गया
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
                        >
                            Go to Create Blog
                        </a>

                        <a
                            href="/blogs" // Link को <a> से बदला गया
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
                        >
                            View All Blogs
                        </a>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-12 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
