import React, { useState, useEffect, useRef } from 'react';
// Link is imported but react-router-dom is not available in this environment.
// For demonstration purposes, I will keep Link, but in a real app,
// ensure react-router-dom is properly installed and configured.
// import { Link } from 'react-router-dom';

const Start = () => {
    // State to manage the current background image of the page
    const [currentBgImage, setCurrentBgImage] = useState('https://placehold.co/1920x1080/0A2647/FFFFFF?text=Welcome+to+Blogify');

    // Refs for observing sections
    const headerRef = useRef(null);
    const featuresRef = useRef(null);

    // Data for feature cards, including default and hover images
    // **YOUR IMAGES ARE ADDED HERE: bg1.jpg, bg2.jpg, bg3.jpg**
    // Please make sure these images are located in your public/images/ folder.
    const featureCardsData = [
        {
            id: 'feature1',
            title: 'Know your audience',
            description: 'Find out which posts are a hit with Blogger’s built-in analytics. You’ll see where your audience is coming from and what they’re interested in. You can even connect your blog directly to Google Analytics for a more detailed look.',
            defaultImage: '/images/bg1.jpg', // <-- आपकी bg1.jpg यहाँ इस्तेमाल की गई है
            hoverImage:'/images/bg1_hover.jpg', // आप चाहें तो इसके लिए भी अलग इमेज दे सकते हैं
        },
        {
            id: 'feature2',
            title: 'Choose the perfect design',
            description: 'Create a beautiful blog that fits your style. Choose from a selection of easy-to-use templates – all with flexible layouts and hundreds of background images – or design something new',
            defaultImage: '/images/bg2.jpg', // <-- आपकी bg2.jpg यहाँ इस्तेमाल की गई है
            hoverImage: '/images/bg2_hover.jpg', // <-- यहाँ अपनी hover इमेज का path दें, // आप चाहें तो इसके लिए भी अलग इमेज दे सकते हैं
        },
        {
            id: 'feature3',
            title: 'Share Easily',
            description: 'Social share your blogs with one click.',
            defaultImage: '/images/bg3.jpg', // <-- आपकी bg3.jpg यहाँ इस्तेमाल की गई है
            hoverImage: '/images/bg3_hover.jpg', // आप चाहें तो इसके लिए भी अलग इमेज दे सकते हैं
        },
    ];

    // useEffect for Intersection Observer to change background image on scroll
    useEffect(() => {
        // Array of background images for different sections
        // Moved inside useEffect to resolve 'react-hooks/exhaustive-deps' warning
        // as this array is static and only used within this effect.
        const sectionBackgrounds = [
            { id: 'header', src: 'https://placehold.co/1920x1080/0A2647/FFFFFF?text=Welcome+to+Blogify' },
            { id: 'features', src: 'https://placehold.co/1920x1080/1A1A2E/FFFFFF?text=Discover+Our+Features' },
            // Add more sections and their corresponding image paths if needed
        ];

        // Options for the Intersection Observer
        const options = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.5, // Trigger when 50% of the section is visible
        };

        // Callback function for the Intersection Observer
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const matchedImage = sectionBackgrounds.find(bg => bg.id === sectionId);
                    if (matchedImage) {
                        setCurrentBgImage(matchedImage.src);
                    }
                }
            });
        };

        // Create a new Intersection Observer instance
        const observer = new IntersectionObserver(observerCallback, options);

        // Capture current ref values for use in cleanup function
        // This resolves the 'ref value will likely have changed' warning.
        const currentHeaderRef = headerRef.current;
        const currentFeaturesRef = featuresRef.current;

        // Observe the header and features sections if they exist
        if (currentHeaderRef) observer.observe(currentHeaderRef);
        if (currentFeaturesRef) observer.observe(currentFeaturesRef);

        // Cleanup function: disconnect the observer when the component unmounts
        return () => {
            if (currentHeaderRef) observer.unobserve(currentHeaderRef);
            if (currentFeaturesRef) observer.unobserve(currentFeaturesRef);
        };
    }, []); // Empty dependency array because sectionBackgrounds is now inside the effect

    // FeatureCard component (nested for simplicity, can be moved to its own file)
    const FeatureCard = ({ title, description, defaultImage, hoverImage }) => {
        const [currentCardImage, setCurrentCardImage] = useState(defaultImage);

        // Handle mouse enter event to show hover image
        const handleMouseEnter = () => {
            setCurrentCardImage(hoverImage);
        };

        // Handle mouse leave event to show default image
        const handleMouseLeave = () => {
            setCurrentCardImage(defaultImage);
        };

        return (
            <div
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform transition-transform hover:scale-105 duration-300 min-h-[350px]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave} // FIXED: Corrected typo from handleLeaveMouse to handleMouseLeave
            >
                {/* Image for the feature card */}
                <img
                    src={currentCardImage}
                    alt={title}
                    className="w-full h-40 object-cover rounded-md mb-4 shadow-sm"
                />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        );
    };

    return (
        // Main landing page container with dynamic background image
        <div
            className="font-inter min-h-screen flex flex-col transition-all duration-1000 ease-in-out"
            style={{
                backgroundImage: `url(${currentBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Header section */}
            <header
                id="header" // ID for Intersection Observer
                ref={headerRef} // Ref for Intersection Observer
                className="flex flex-col justify-center items-center h-screen text-center text-white p-8 bg-black bg-opacity-50"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate__fadeInDown">Welcome to 📝 Blogify</h1>
                <p className="text-2xl md:text-4xl mb-10 font-light animate__fadeInUp">Write. Share. Inspire.</p>
                {/* Using a regular anchor tag since Link is not available */}
                <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                    Get Started
                </a>
            </header>

            {/* Features section */}
            <section
                id="features" // ID for Intersection Observer
                ref={featuresRef} // Ref for Intersection Observer
                className="py-20 px-8 bg-gray-100 bg-opacity-95 flex flex-col items-center justify-center flex-grow"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-16 text-center">Why Blogify?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {/* Map through feature card data to render FeatureCard components */}
                    {featureCardsData.map((feature) => (
                        <FeatureCard
                            key={feature.id}
                            title={feature.title}
                            description={feature.description}
                            defaultImage={feature.defaultImage}
                            hoverImage={feature.hoverImage}
                        />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto border-b border-gray-700 pb-8 mb-8">
                    <div className="flex flex-col items-start">
                        <h4 className="text-2xl font-semibold mb-4 text-blue-400">Help</h4>
                        <ul>
                            <li className="mb-2"><a href="#help-center" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Help Center</a></li>
                            <li className="mb-2"><a href="#help-forum" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Help Forum</a></li>
                            <li className="mb-2"><a href="#video-tutorials" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Video Tutorials</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-start">
                        <h4 className="text-2xl font-semibold mb-4 text-blue-400">Developers</h4>
                        <ul>
                            <li className="mb-2"><a href="#blogger-api" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Blogger API</a></li>
                            <li className="mb-2"><a href="#developer-forum" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Developer Forum</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-start">
                        <h4 className="text-2xl font-semibold mb-4 text-blue-400">Connect</h4>
                        <ul>
                            <li className="mb-2"><a href="#twitter" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Twitter</a></li>
                            <li className="mb-2"><a href="#facebook" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Facebook</a></li>
                            <li className="mb-2"><a href="#linkedin" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="text-center text-gray-500 text-sm max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <p className="mb-4 md:mb-0">© {new Date().getFullYear()} Blogify. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                        <span className="text-gray-600">|</span>
                        <a href="#privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                        <span className="text-gray-600">|</span>
                        <a href="#cookies" className="hover:text-white transition-colors duration-300">Content Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Start;
