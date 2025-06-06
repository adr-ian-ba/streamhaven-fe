import React from "react";
import Footer from "../component/Footer";
import Navigation from "../component/Navigation";

const PrivacyPage = () => {
    return (
        <div className="background-color">
            <Navigation showSearch={false} />

            <div className="min-h-screen text-white px-6 py-12  mx-4 2xl:mx-[8rem] pt-[8rem]">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

                <p className="mb-4">
                    Your privacy is important to us. This policy outlines what data we collect and
                    how we use it.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">1. Data Collection</h2>
                <p className="mb-4">
                    We collect personal information such as your email, username, and usage data to
                    provide a better experience. Information we collect are as follows
                </p>
                <ul>
                    <li>- Personal info : email, username, profile picture</li>
                    <li>- Usage data: pages visited, buttons clicked</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-2">2. Third-party Services</h2>
                <p className="mb-4">
                    We may use third-party services like Google Analytics. These services may
                    collect information as per their own privacy policies.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">3. Data Security</h2>
                <p className="mb-4">
                    We implement security measures to protect your data, but cannot guarantee
                    absolute security, All sensitive data are encrypted, your password is save, even from us.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">4. How We Use Your Information</h2>
                <p className="mb-4">
                    Your Data will not in any way be used or sold to another party, all data will be
                    used to improve and enhance application, and will no be used outside of that.
                </p>
                <ul>
                    <li>- Account creation and authentication</li>
                    <li>- Improving site performance and user experience</li>
                    <li>- Sending emails (e.g., password resets, newsletters)</li>
                </ul>

                <p className="text-sm text-gray-400 mt-10">Last updated: May 30, 2025</p>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPage;
