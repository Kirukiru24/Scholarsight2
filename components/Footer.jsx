import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-700 text-gray-100 py-4 text-center">
            &copy; {new Date().getFullYear()} Scholarsight. All rights reserved.
        </footer>
    );
};

export default Footer;