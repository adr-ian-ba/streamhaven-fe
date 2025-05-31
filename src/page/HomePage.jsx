import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Footer from "../component/Footer";
import SearchBar from "../component/SearchBar";
import { useLocation } from "react-router-dom";
import Navigation from "../component/Navigation";

const supporterGroups = {
    Platinum: [
        {
            name: "racuningirls",
            image: "https://drive.google.com/thumbnail?id=1Ng7cMFoyc-a9w9z8XGMH18uZC1GHKXH7&sz=w1000",
            link: "https://www.tiktok.com/@racuningirls",
        },

    ],
    Gold: [

    ],
    Silver: [

    ],
    Bronze: [

    ],
};

const tierColors = {
    Platinum : "border-purple-400 text-purple-400",
    Gold: "border-yellow-400 text-yellow-300",
    Silver: "border-gray-300 text-blue-300",
    Bronze: "border-amber-500 text-amber-600",
};

const HomePage = () => {
    const shareUrl = window.location.origin;

    const handleShare = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
    };

    const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

    return (
        <div className="background-color">
            <Navigation showSearch={false}/>
            <div className="text-white min-h-screen pt-[5rem] px-6">
                <div className="max-w-6xl mx-auto">
                    <div id="about" className="text-center mb-16 pt-[4rem]">
                    <img className="max-w-[20rem] w-fit mx-auto mb-[1rem]" src="/image/SH Long White.png" alt="" />
                    <p className="text-lg text-gray-300">
                        Explore. Save. Watch. Your personalized movie & TV space — where freedom meets fandom.
                    </p>

                    <div className="w-fit mx-auto mt-10">
                        <SearchBar />
                    </div>

                    <p className="mt-10 text-sm text-gray-400 max-w-[40rem] mx-auto">
                        <strong className="text-red-700">Disclaimer:</strong> Any advertisements shown during playback are from third-party video providers.
                        StreamHaven does not control or benefit from these ads. We're working to move toward a fully ad-free experience.
                    </p>
                </div>


                    <section id="values" className="grid md:grid-cols-3 gap-8 mb-20">
                        {["Freedom", "Privacy", "Community"].map((title, i) => (
                            <div key={i} className="bg-[#1c1c1c] p-6 rounded-xl shadow-lg">
                                <h2 className="text-xl font-bold mb-2">{title}</h2>
                                <p className="text-gray-300">
                                    {title === "Freedom" &&
                                        "Save anything, anytime — even as a guest."}
                                    {title === "Privacy" &&
                                        "Local-first. Cloud only when you say so."}
                                    {title === "Community" &&
                                        "Supporters drive us forward. Minimal ads. Minimal nonsense."}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section id="supporters" className="pb-20">
                        <h2 className="text-3xl font-bold text-center mb-10">Our Supporters</h2>

                        {Object.entries(supporterGroups).map(([tier, group]) => (
                            <div key={tier} className="mb-16">
                                <h3
                                    className={`text-2xl font-bold text-center mb-6 ${tierColors[tier]}`}
                                >
                                    <span className={tierColors[tier]}>{tier}</span> Tier
                                </h3>

                                {group.length === 0 ? (
                                    <div className="text-center text-gray-400 italic">
                                        Be the first to be featured in the{" "}
                                        <span className={tierColors[tier]}> {tier} </span> tier!
                                        <h1><a href="https://saweria.co/StreamHavenOfficial" target='_blank'>Donate</a></h1>

                                    </div>
                                ) : (
                                    <div className="flex flex-wrap justify-center gap-6">
                                        {group.map((supporter, i) => (
                                            <a
                                                key={i}
                                                href={supporter.link || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`bg-[#2b2b2b] rounded-lg p-4 text-center border line-clamp-1 ${
                                                    tierColors[tier] || "border-gray-600"
                                                } hover:scale-105 transition-transform w-[140px]`}
                                            >
                                                {supporter.image ? (
                                                    <img
                                                        src={supporter.image}
                                                        alt={supporter.name}
                                                        className="w-16 h-16 rounded-full mx-auto border-2 border-white object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-gray-600 text-white mx-auto flex items-center justify-center text-xl font-bold">
                                                        {supporter.name[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <p className="mt-3 text-sm text-gray-200">
                                                    @{supporter.name}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
