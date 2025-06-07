import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../component/Navigation";
import { useContext, useEffect, useState } from "react";
import apiHelper from "../helper/ApiHelper";
import toast from "react-hot-toast";
import Genre from "../component/Genre";
import MovieGrid from "../component/MovieGrid";
import Loading from "../component/Loading";
import { saveToLocalHistory } from "../helper/SaveHelper";
import { UserContext } from "../helper/UserContext";
import Footer from "../component/Footer";

const WatchPage = () => {
    const { isLoggedIn } = useContext(UserContext);
    const { id, type, ss, ep } = useParams();
    const [movieInfo, setMovieInfo] = useState(null);
    const [isIframeLoading, setIsIframeLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!id || !type) return;

        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                let endpoint = "";

                if (type === "MV") {
                    endpoint = `/media/get-detail/${id}/MV`;
                } else if (type === "SR") {
                    endpoint = `/media/get-detail/${id}/SR/${ss || 1}`;
                } else {
                    toast.error("Invalid media type.");
                    return;
                }

                const response = await apiHelper.get(endpoint);

                if (!response.condition) {
                    toast.error(response.message);
                    return;
                }

                setMovieInfo(response.result);
                console.log(response.result);
            } catch (error) {
                console.error("Error fetching movie data:", error);
                toast.error("Failed to fetch movie details");
            }
        };

        fetchData();
    }, [id, type, ss]);

    const changeSeason = async (season) => {
        try {
            const response = await apiHelper.get(`/media/get-detail/${id}/SR/${season}`);

            if (!response.condition) {
                toast.error(response.message);
                return;
            }

            const firstEpisode = response.result.episodes?.[0]?.episode_number || 1;

            navigate(`/watch/${id}/${type}/${season}/${firstEpisode}`);
        } catch (error) {
            console.error("Error fetching season data:", error);
            toast.error("Failed to fetch season details");
        }
    };

    const changeEpisode = (episode) => {
        navigate(`/watch/${id}/${type}/${ss}/${episode}`);
    };

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (!movieInfo) return;

        const localHistoryItem = {
            id: id,
            title: movieInfo.title,
            poster_path: movieInfo.poster_path,
            media_type: type,
        };

        saveToLocalHistory(localHistoryItem); // Always save locally

        if (isLoggedIn) {
            const cloudPayload = {
                movie: {
                    ...localHistoryItem,
                    watchedAt: new Date(),
                },
            };

            apiHelper.postAuthorization(
                "/user/addhistory",
                cloudPayload,
                localStorage.getItem("streamhaven-token")
            );
        }
    }, [movieInfo]);

    useEffect(() => {
    toast(
        (t) => (
            <div className="text-sm text-white">
                <strong className="text-yellow-500">Notice :</strong> Media Player is a third-party service.
                <br />
                <p className="border-t-1 border-gray-400 pt-2 mt-2">StreamHaven is not affiliated with any ads shown.</p> 
                <span className="font-semibold text-red-400">We recommend using an ad blocker.</span>
            </div>
        ),
        {
            duration: 4000,
            style: {
                background: "#1a1a1a",
                padding: "12px",
            }
        }
    );
}, []);


    const embedUrlMovie = `https://vidsrc.net/embed/movie?tmdb=${id}`;
    const embedUrlSerie = `https://vidsrc.net/embed/tv?tmdb=${id}&season=${ss}&episode=${ep}`;

    // const embedUrlMovie = `https://vidbinge.dev/embed/movie/${id}`
    // const embedUrlSerie = `https://vidbinge.dev/embed/tv/${id}/${ss}/${ep}`

    //const embedUrlMovie = `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`
    //const embedUrlSerie = `https://vidsrc.cc/v2/embed/tv/${id}/${ss}/${ep}?autoPlay=false`

    if (!movieInfo) {
        return <Loading />;
    }
    return (
        <div className="background-color relative overflow-hidden">
            <Navigation />
            <div className="absolute top-0 left-0 w-screen min-h-[40rem]">
                <div className="h-full w-full bg-black opacity-60 absolute inset-0"></div>
                <div className="w-full h-[10rem] absolute bottom-0 top-gradient"></div>

                <img
                    className="object-cover w-full min-h-[50rem] lg:h-auto"
                    src={movieInfo.backdrop_path}
                    alt=""
                />
            </div>
            <div className="relative mx-auto px-4 max-w-[60rem] min-h-[100dvh]">
                <div className="mt-20"></div>
                <div
                    onClick={goBack}
                    className="flex items-center gap-2 mb-[1rem] p-1 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                    </svg>

                    <h1>BACK</h1>
                </div>

                <div className="video-container mt-4 mx-auto mb-8 relative">
                    {isIframeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                            <div className="text-white animate-pulse text-xl font-bold">
                                🎥 Loading player...
                            </div>
                        </div>
                    )}

                    <iframe
                        className="w-full h-full relative z-0"
                        src={type === "MV" ? embedUrlMovie : embedUrlSerie}
                        title={movieInfo.title}
                        width="100%"
                        height="500"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        onLoad={() => setIsIframeLoading(false)}
                    ></iframe>
                </div>

                {/* {movieInfo.seasons && 
                movieInfo.seasons.map((eachSeason, index) => {
                    return (
                        <div className='flex justify-between' key={index}>
                            <p>{eachSeason.name}</p>
                        </div>
                    )
                })
            } */}

                <div className="flex gap-2 text-sm">
                    <img
                        className="hidden sm:block max-w-[12rem] rounded-[3px]"
                        src={movieInfo.poster_path}
                        alt=""
                    />
                    <div>
                        <h1 className="text-2xl">
                            {movieInfo.original_name || movieInfo.title}{" "}
                            {ss ? `SS${ss}:EP${ep}` : ""}
                        </h1>
                        <p className="max-w-[40rem] mb-2">{movieInfo.overview}</p>
                        <div className="flex gap-2 items-center mb-2">
                            {/* Your SVG icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6 fill-amber-400"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p>{movieInfo.vote_average}</p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                    clipRule="evenodd"
                                />
                            </svg>

                            <p className="">{movieInfo.vote_count}</p>
                        </div>
                        <p className="mb-2">
                            {movieInfo.release_date} • {movieInfo.runtime}m
                        </p>
                        <div className="flex gap-2 mb-2">
                            {movieInfo.genres?.map((eachGenre, index) => (
                                <Genre genre={eachGenre.name} key={index} />
                            ))}
                        </div>
                    </div>
                </div>

                {movieInfo.seasons && (
                    <div className="flex flex-wrap gap-4 mt-2">
                        {movieInfo.seasons
                            .filter((eachSeason) => eachSeason.season_number != 0)
                            .map((eachSeason, index) => (
                                <div
                                    key={index}
                                    onClick={() => changeSeason(eachSeason.season_number)}
                                    className={`${
                                        ss == eachSeason.season_number
                                            ? "border-primary border"
                                            : "border-gray-400 border"
                                    } cursor-pointer overflow-hidden relative rounded-[5px] text-sm w-[8rem] h-[5rem] border-gray-400 grid place-items-center p-1`}
                                >
                                    <div className="h-full w-full bg-black opacity-70 absolute inset-0 z-20"></div>
                                    <img
                                        src={eachSeason.poster_path}
                                        className="z-10 w-full h-full absolute top-0 left-0 object-cover"
                                        alt=""
                                    />

                                    <h1
                                        className={`${
                                            ss == eachSeason.season_number ? "color-primary" : ""
                                        } z-30`}
                                    >
                                        ss{eachSeason.season_number} : {eachSeason.name} :{" "}
                                        {eachSeason.episode_count}ep
                                    </h1>
                                </div>
                            ))}
                    </div>
                )}

                {movieInfo.episodes && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4 gap-2">
                        {movieInfo.episodes.map((eachEpisode, index) => (
                            <div
                                key={index}
                                onClick={() => changeEpisode(eachEpisode.episode_number)}
                                className={`${
                                    eachEpisode.episode_number == ep ? "color-primary" : ""
                                } border p-2 cursor-pointer`}
                            >
                                <p
                                    className={`${
                                        eachEpisode.episode_number == ep ? "color-primary" : ""
                                    } truncate`}
                                >
                                    EP{eachEpisode.episode_number} {eachEpisode.name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {movieInfo.recommendations && (
                    <>
                        <h1 className="text-[2rem] font-bold mb-[.5rem]">Recommendation</h1>
                        <MovieGrid movies={movieInfo.recommendations} className="mt-[4rem]" />
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default WatchPage;
