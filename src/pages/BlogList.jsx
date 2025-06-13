import React, { useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';

import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'; 

import { getFirestore, collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBDanczGpeAZdzr5liCThgjSCpOrVnpAfk",
    authDomain: "chat-e9374.firebaseapp.com",
    projectId: "chat-e9374",
    storageBucket: "chat-e9374.firebasestorage.app",
    messagingSenderId: "562614811559",
    appId: "1:562614811559:web:ddc712fbf0e851946111482",
    measurementId: "G-N02HYN7D6J"
};


const EmbeddedNavbar = ({ authInstance, currentUser }) => {
    const [showDetails, setShowDetails] = useState(false);

    const handleLogout = async () => {
        if (!authInstance) {
            console.error("Firebase auth instance not available for logout.");
            return;
        }
        try {
            await signOut(authInstance);
            window.location.href = '/login'; 
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
                                    {currentUser.displayName || currentUser.email || 'User'} {}
                                </span>
                                {showDetails && (
                                    <div className="absolute right-0 mt-2 w-64 bg-blue-800 bg-opacity-90 rounded-lg shadow-xl p-4 text-sm z-10 border border-blue-600">
                                        <p className="text-blue-200 mb-1"><strong>Email:</strong> {currentUser.email}</p> {}
                                        <p className="text-blue-200"><strong>UID:</strong> {currentUser.uid}</p> {}
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


const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');


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
            
                if (user || !user) {
                    fetchBlogs(firestoreService, user);
                }
            });

        } catch (error) {
            console.error("Firebase BlogList Initialization Error:", error);
            setMessage('Error initializing Firebase services.');
            setMessageType('error');
        }

        return () => {
            if (authUnsubscribe) {
                authUnsubscribe();
            }
        };
    }, []); 

    
    const fetchBlogs = async (dbService, userAuth) => {
        if (!dbService) {
            console.log("Firestore instance not ready to fetch blogs.");
            return;
        }
        try {

            const q = query(collection(dbService, 'blogs'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const blogData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBlogs(blogData);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setMessage('Failed to load blogs. Please try again.');
            setMessageType('error');
        }
    }
    useEffect(() => {
        if (isFirebaseReady && dbInstance) {
            fetchBlogs(dbInstance, currentUser);
        }
    }, [isFirebaseReady, dbInstance, currentUser]);


    const handleDelete = async (id) => {
        if (!dbInstance) {
            setMessage('Firestore not initialized for deletion.');
            setMessageType('error');
            return;
        }
        try {
            await deleteDoc(doc(dbInstance, 'blogs', id));
            setMessage('Blog deleted successfully!');
            setMessageType('success');
            fetchBlogs(dbInstance, currentUser)
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error deleting blog:", error);
            setMessage('Failed to delete blog.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleShare = (id) => {
       
        const url = `${window.location.origin}/blogs/${id}`;
        const tempInput = document.createElement('textarea');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            setMessage('Blog link copied to clipboard!');
            setMessageType('success');
        } catch (err) {
            console.error('Failed to copy text:', err);
            setMessage('Failed to copy link. Please copy manually: ' + url);
            setMessageType('error');
        }
        document.body.removeChild(tempInput);
        setTimeout(() => setMessage(''), 3000);
    };

    const filteredBlogs = blogs.filter(blog => {
        
        const isOwner = currentUser?.email === blog.user;
        const isVisible = blog.isPublic || isOwner; 

        const matchesSearch =
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase());

        return isVisible && matchesSearch;
    });

    return (
        <>
            {}
            <EmbeddedNavbar authInstance={authInstance} currentUser={currentUser} />
            <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 text-gray-800 font-inter dark:bg-gray-900 dark:text-gray-200">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-900 dark:text-white">All Blogs</h2>

                {}
                {message && (
                    <div
                        className={`py-3 px-5 mb-6 rounded-lg text-center font-medium ${
                            messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        } dark:bg-opacity-20 transition-opacity duration-300`}
                    >
                        {message}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-8 dark:bg-gray-700 dark:text-white placeholder-gray-400 transition-colors duration-200"
                />

                {filteredBlogs.length === 0 && !message && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">No blogs found or Firebase is loading...</p>
                )}

                <div className="w-full max-w-4xl"> {}
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 w-full transform transition-transform hover:scale-[1.01] duration-300 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{blog.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{blog.content}</p>
                            <small className="block text-sm text-gray-500 dark:text-gray-400 mb-1">By: {blog.user}</small>
                            <small className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{new Date(blog.createdAt.seconds * 1000).toLocaleString()}</small>
                            <small className="block text-sm text-gray-500 dark:text-gray-400">
                                {blog.isPublic ? '🌐 Public' : '🔒 Private'}
                            </small>

                            <div className="flex space-x-3 mt-4">
                                {currentUser && currentUser.email === blog.user && (
                                    <>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                                        >
                                            Delete
                                        </button>
                                        {}
                                        <a
                                            href={`/edit-blog/${blog.id}`} 
                                            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                                        >
                                            Edit
                                        </a>
                                    </>
                                )}

                                {blog.isPublic && (
                                    <button onClick={() => handleShare(blog.id)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800">
                                        Share
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BlogList;
