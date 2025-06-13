import React, { useState, useEffect } from 'react';
// Initialize Firebase app
import { initializeApp } from 'firebase/app';
// Authentication service
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// Firestore services
import { getFirestore, addDoc, collection } from 'firebase/firestore';

// Navbar component definition (as it was provided embedded previously)
// If you are using a separate Navbar component in your local project,
// you would import it normally: import Navbar from '../components/Navbar';
const EmbeddedNavbar = ({ authInstance, currentUser }) => {
    const [showDetails, setShowDetails] = useState(false);

    const handleLogout = async () => {
        if (!authInstance) {
            console.error("Firebase auth instance not available for logout.");
            return;
        }
        try {
            await signOut(authInstance);
            window.location.href = '/'; // Redirect to LandingPage (root)
        } catch (error) {
            console.error("Logout Error:", error.message);
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

                    {currentUser ? (
                        <>
                            <li className="relative">
                                <span
                                    onClick={toggleDetails}
                                    className="text-white hover:text-blue-200 cursor-pointer flex items-center transition-colors duration-300 px-3 py-2 rounded-lg bg-blue-800 bg-opacity-50 hover:bg-opacity-70"
                                >
                                    {currentUser.displayName || currentUser.email || 'User'}
                                </span>
                                {showDetails && (
                                    <div className="absolute right-0 mt-2 w-64 bg-blue-800 bg-opacity-90 rounded-lg shadow-xl p-4 text-sm z-10 border border-blue-600">
                                        <p className="text-blue-200 mb-1"><strong>Email:</strong> {currentUser.email}</p>
                                        <p className="text-blue-200"><strong>UID:</strong> {currentUser.uid}</p>
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


// Firebase configuration (defined outside to avoid re-initialization if Blog.js is a standalone file)
const firebaseConfig = {
    apiKey: "AIzaSyBDanczGpeAZdzr5liCThgjSCpOrVnpAfk",
    authDomain: "chat-e9374.firebaseapp.com",
    projectId: "chat-e9374",
    storageBucket: "chat-e9374.firebasestorage.app",
    messagingSenderId: "562614811559",
    appId: "1:562614811559:web:ddc712fbf0e851946111482",
    measurementId: "G-N02HYN7D6J"
};

const Blog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // const [isPrivate, setIsPrivate] = useState(false); // Removed: No longer needed for checkbox
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showViewBlogsLink, setShowViewBlogsLink] = useState(false);

    const [authInstance, setAuthInstance] = useState(null);
    const [dbInstance, setDbInstance] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);

    useEffect(() => {
        let authUnsubscribe;
        try {
            const app = initializeApp(firebaseConfig);
            const authService = getAuth(app);
            const firestoreService = getFirestore(app);

            setAuthInstance(authService);
            setDbInstance(firestoreService);
            setIsFirebaseReady(true);

            authUnsubscribe = onAuthStateChanged(authService, (user) => {
                setCurrentUser(user);
            });

        } catch (error) {
            console.error("Firebase Blog Page Initialization Error:", error);
            setMessage('Error initializing Firebase services.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        }

        return () => {
            if (authUnsubscribe) {
                authUnsubscribe();
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Posting blog...');
        setMessageType('');
        setShowViewBlogsLink(false);

        if (!isFirebaseReady || !dbInstance || !authInstance) {
            setMessage('Firebase services not ready. Please wait.');
            setMessageType('error');
            return;
        }

        if (!currentUser) {
            setMessage('You must be logged in to create a blog.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
            return;
        }

        try {
            await addDoc(collection(dbInstance, 'blogs'), {
                title,
                content,
                user: currentUser.email,
                createdAt: new Date(),
                isPublic: false, // ✅ All blogs now save as private by default
            });
            setMessage('Blog posted successfully!');
            setMessageType('success');
            setTitle('');
            setContent('');
            // setIsPrivate(false); // Removed: No longer needed
            setShowViewBlogsLink(true);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error adding blog:', err.message);
            setMessage('Error adding blog: ' + err.message);
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <>
            {/* Embedded Navbar is used here */}
            <EmbeddedNavbar authInstance={authInstance} currentUser={currentUser} />
            <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-800 font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-900 dark:text-white">Create a New Blog</h2>

                {/* Message display area */}
                {message && (
                    <div
                        className={`py-3 px-5 mb-6 rounded-lg text-center font-medium ${
                            messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        } dark:bg-opacity-20 transition-opacity duration-300`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-transform hover:scale-[1.01] duration-300 border border-gray-200 dark:border-gray-700">
                    <input
                        type="text"
                        placeholder="Blog Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-4 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-colors duration-200"
                    />
                    <textarea
                        placeholder="Write your blog here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="10"
                        required
                        className="w-full p-4 mb-6 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-y transition-colors duration-200"
                    ></textarea>

                    {/* ✅ Removed: Privacy toggle checkbox */}
                    {/* <label className="flex items-center space-x-3 mb-6 cursor-pointer text-lg text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 transition-colors duration-200"
                        />
                        <span>Make this blog private</span>
                    </label> */}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 text-xl"
                    >
                        Post Blog
                    </button>
                </form>

                {/* "View All Blogs" link is shown here */}
                {showViewBlogsLink && messageType === 'success' && (
                    <a
                        href="/blogs"
                        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 text-xl"
                    >
                        View All Blogs
                    </a>
                )}
            </div>
        </>
    );
};

export default Blog;
