import React from "react";
import Navigation from "../component/Navigation";
import Footer from "../component/Footer";

const TermPage = () => {
    return (
        <div className="background-color">
            <Navigation showSearch={false} />
            <div className="min-h-screen text-white px-6 py-12  mx-4 2xl:mx-[8rem] pt-[8rem]">
                <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

                <p className="mb-4">
                    By accessing or using StreamHaven, you agree to be bound by these Terms of
                    Service and our Privacy Policy. If you do not agree with any part, you must not
                    use the platform.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">1. Eligibility</h2>
                <p className="mb-4">
                    You must be at least 13 years old, or have parental/guardian permission to use
                    this service. You are responsible for maintaining the confidentiality of your
                    account and for all activities under it.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">2. Use of Service</h2>
                <p className="mb-4">
                    You agree not to misuse the platform for unlawful or harmful purposes. You may
                    not attempt to disrupt our systems or access restricted areas of the platform.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">3. Content Ownership</h2>
                <p className="mb-4">
                    All media content (movies, series, posters) belongs to its rightful owners
                    (e.g., TMDB). StreamHaven provides access to this data but does not own or host
                    copyrighted materials.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">4. User Content</h2>
                <p className="mb-4">
                    You may create folders, history, and upload avatars. You retain ownership of
                    your content, but grant us permission to store and display it within the
                    service.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">5. Termination</h2>
                <p className="mb-4">
                    We reserve the right to suspend or delete accounts that violate our policies,
                    including spam, abuse, or unauthorized use of the platform.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">6. Modifications</h2>
                <p className="mb-4">
                    We may update these terms at any time. Continued use after updates means you
                    accept the new terms. We encourage you to check this page regularly.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">7. Disclaimers</h2>
                <p className="mb-4">
                    This service is provided "as-is" without warranties of any kind. We do not
                    guarantee uninterrupted access or complete accuracy of data.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">8. Limitation of Liability</h2>
                <p className="mb-4">
                    StreamHaven is not liable for any indirect, incidental, or consequential damages
                    arising from the use or inability to use the service.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">9. Governing Law</h2>
                <p className="mb-4">
                    These terms are governed by the laws of your local jurisdiction, unless
                    otherwise required by applicable regulations.
                </p>

                <p className="text-sm text-gray-400 mt-10">Last updated: May 30, 2025</p>
            </div>

            <Footer />
        </div>
    );
};

export default TermPage;
