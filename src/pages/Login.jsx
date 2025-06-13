import React, { useState, useEffect } from 'react';
// Firebase imports - अब हम Firebase ऐप को सीधे यहीं इनिशियलाइज़ करेंगे
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
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
                    console.log('Firebase: User already logged in:', user.uid);
                } else {
                    console.log('Firebase: No user logged in.');
                }
                setIsAuthReady(true); // ऑथेंटिकेशन को तैयार के रूप में चिह्नित करें
            });

        } catch (error) {
            console.error("Firebase: Error during Firebase initialization or authentication listener setup:", error);
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Attempting to log in...');
        setMessageType('');

        // सुनिश्चित करें कि 'authInstance' और ऑथेंटिकेशन सेवा तैयार है
        if (!isAuthReady || !authInstance) {
            setMessage('Authentication service not ready. Please wait.');
            setMessageType('error');
            return;
        }

        try {
            // ईमेल और पासवर्ड का उपयोग करके Firebase में उपयोगकर्ता को साइन इन करने का प्रयास करें
            await signInWithEmailAndPassword(authInstance, email, password);
            setMessage('Login successful! Redirecting to dashboard...');
            setMessageType('success');
            setTimeout(() => {
                // अपने वास्तविक प्रोजेक्ट में react-router-dom के साथ 'navigate('/home');' का उपयोग करें
                window.location.href = '/home'; // कैनवास वातावरण के लिए नेविगेशन का अनुकरण करें
            }, 1500);

        } catch (error) {
            console.error('Login Error:', error.code, error.message);
            let errorMessage = 'Login failed. Please try again.'; // डिफ़ॉल्ट एरर संदेश
            // Firebase एरर कोड के आधार पर एरर संदेशों को कस्टमाइज़ करें
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Your account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many login attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = `An unexpected error occurred: ${error.message}`;
            }
            setMessage(errorMessage);
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000); // 5 सेकंड के बाद एरर संदेश साफ़ करें
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-900 font-inter"
            style={{
                backgroundImage: `url('/images/bg.jpg')`, // अपनी वास्तविक पृष्ठभूमि छवि से बदलें
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <form onSubmit={handleLogin} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-4 sm:mx-auto border border-gray-700 border-opacity-50 text-white">
                <h2 className="text-4xl font-bold mb-8 text-center text-gray-50">Login</h2>

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
                    Login
                </button>

                {/* साइन अप लिंक */}
                <p className="signup mt-6 text-center text-gray-300 text-sm">
                    Don’t have an account?{' '}
                    <span
                        onClick={() => { /* navigate('/signup'); */ window.location.href = '/signup'; }} // कैनवास के लिए नेविगेशन का अनुकरण करें
                        className="signup-button text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors duration-200"
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
