import React, { useState, useEffect } from 'react';
// Firebase imports - अब हम Firebase ऐप को सीधे यहीं इनिशियलाइज़ करेंगे
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth'; // 'auth' इंस्टेंस को सीधे आयात करने की आवश्यकता नहीं है
// import { useNavigate } from 'react-router-dom'; // Commented for Canvas environment

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State for displaying messages
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [authInstance, setAuthInstance] = useState(null); // 'auth' इंस्टेंस को यहीं मैनेज करेंगे
    const [isAuthReady, setIsAuthReady] = useState(false);

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

    // Firebase को इनिशियलाइज़ करें और ऑथेंटिकेशन लिसनर सेट करें
    useEffect(() => {
        let unsubscribe;
        try {
            // Firebase ऐप को इनिशियलाइज़ करें
            const app = initializeApp(firebaseConfig);
            const authService = getAuth(app);
            setAuthInstance(authService); // 'authInstance' स्टेट को सेट करें

            // ऑथेंटिकेशन स्टेट बदलने पर लिसनर सेट करें
            unsubscribe = onAuthStateChanged(authService, (user) => {
                if (user) {
                    console.log('Firebase: उपयोगकर्ता पहले से लॉग इन है:', user.uid);
                } else {
                    console.log('Firebase: कोई उपयोगकर्ता लॉग इन नहीं है।');
                }
                setIsAuthReady(true); // ऑथेंटिकेशन को तैयार के रूप में चिह्नित करें
            });

        } catch (error) {
            console.error("Firebase: Firebase इनिशियलाइज़ेशन या ऑथेंटिकेशन लिसनर सेटअप में एरर:", error);
            setMessage(`Firebase setup issue: ${error.message}`);
            setMessageType('error');
        }

        // कंपोनेंट अनमाउंट होने पर ऑथेंटिकेशन लिसनर को क्लीनअप करें
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []); // यह इफ़ेक्ट केवल एक बार कंपोनेंट माउंट होने पर चलता है

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('Attempting to sign up...');
        setMessageType('');

        // सुनिश्चित करें कि authInstance तैयार है और उपलब्ध है
        if (!isAuthReady || !authInstance) {
            setMessage('Firebase authentication not initialized. Please wait a moment.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
            return;
        }

        try {
            // Create user with email and password using Firebase
            const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);

            // Update user profile with the provided username
            await updateProfile(userCredential.user, { displayName: username });

            setMessage('Signup successful! Redirecting...');
            setMessageType('success');
            // For actual navigation in your local project with react-router-dom:
            // navigate('/'); // Redirect to home or login page after successful signup
            // For demonstration in this Canvas environment:
            setTimeout(() => {
                window.location.href = '/Home'; // Simulate navigation to home page
            }, 1500);

        } catch (error) {
            console.error('Signup Error:', error.code, error.message);
            let errorMessage = 'Signup failed. Please try again.'; // Default error message
            // Customize error messages based on Firebase error codes
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already in use.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = `Signup error: ${error.message}`;
            }
            setMessage(errorMessage);
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000); // Clear error after 5 seconds
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-900 font-inter"
            style={{
                backgroundImage: `url('images/sing')`, // अपनी वास्तविक पृष्ठभूमि छवि से बदलें
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <form onSubmit={handleSignup} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-4 sm:mx-auto border border-gray-700 border-opacity-50 text-white">
                <h2 className="text-4xl font-bold mb-8 text-center text-gray-50">Sign Up</h2>

                {/* संदेश प्रदर्शित करने का क्षेत्र */}
                {message && (
                    <div
                        className={`py-3 px-5 mb-6 rounded-lg text-center font-medium ${
                            messageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        } transition-opacity duration-300`}
                    >
                        {message}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-3 mb-4 rounded-lg bg-gray-800 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                <input
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 mb-4 rounded-lg bg-gray-800 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 mb-6 rounded-lg bg-gray-800 bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Sign Up
                </button>

                <p className="login-text mt-6 text-center text-gray-300 text-sm">
                    Already have an account?{' '}
                    <span
                        onClick={() => { /* navigate('/login'); */ window.location.href = '/login'; }} // कैनवास के लिए नेविगेशन का अनुकरण करें
                        className="login-button text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors duration-200"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Signup;
