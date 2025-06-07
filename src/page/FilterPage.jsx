import { useState, useEffect, useRef } from "react";
import apiHelper from "../helper/ApiHelper";
import MovieGrid from "../component/MovieGrid";
import toast from "react-hot-toast";
import Footer from "../component/Footer";
import Navigation from "../component/Navigation";

const FilterPage = () => {
    const [type, setType] = useState("MV");
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [language, setLanguage] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [voteGte, setVoteGte] = useState("");
    const [voteLte, setVoteLte] = useState("");
    const [runtimeGte, setRuntimeGte] = useState("");
    const [runtimeLte, setRuntimeLte] = useState("");
    const [includeAdult, setIncludeAdult] = useState(false);
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [keywordInput, setKeywordInput] = useState("");
    const [keywordOptions, setKeywordOptions] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywordDropdownOpen, setKeywordDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const debounceRef = useRef(null);

    function getPagination(low = 1, high, current, visiblePage = 3) {
        let pages = [];

        if (!high || high <= 1) return [1];

        if (high <= visiblePage + 4) {
            for (let i = low; i <= high; i++) {
                pages.push(i);
            }
            return pages;
        }

        pages.push(low);

        if (current <= low + visiblePage) {
            for (let i = low + 1; i <= low + visiblePage + 1; i++) {
                pages.push(i);
            }
            pages.push("...");
            pages.push(high);
            return pages;
        }

        if (current >= high - visiblePage) {
            pages.push("...");
            for (let i = high - visiblePage - 1; i <= high; i++) {
                pages.push(i);
            }
            return pages;
        }

        pages.push("...");
        let half = Math.floor(visiblePage / 2);

        for (
            let i = Math.max(low + 1, current - half);
            i <= Math.min(high - 1, current + half);
            i++
        ) {
            pages.push(i);
        }

        pages.push("...");
        pages.push(high);

        return pages;
    }

    useEffect(() => {
        apiHelper
            .get("/media/genres")
            .then((res) => res.condition && setGenres(res.genres))
            .catch(() => toast.error("Failed to load genres"));

        apiHelper
            .get("/media/languages")
            .then((res) => res.condition && setLanguages(res.languages))
            .catch(() => toast.error("Failed to load languages"));
    }, []);

    const toggleGenre = (id) => {
        setSelectedGenres((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (!keywordInput) {
            setKeywordOptions([]);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            apiHelper
                .get(`/media/keywords?query=${encodeURIComponent(keywordInput)}`)
                .then((res) => {
                    if (res.condition) setKeywordOptions(res.keywords || []);
                    else setKeywordOptions([]);
                })
                .catch(() => setKeywordOptions([]));
        }, 500);
    }, [keywordInput]);

    const fetchFiltered = (overridePage = page) => {
        setLoading(true);
        setResults([]);

        apiHelper
            .post("/media/discover", {
                type,
                genres: selectedGenres,
                keywords: selectedKeywords.map((k) => k.id).join(","), // keyword fix
                language,
                releaseYear,
                voteAverageGte: voteGte,
                voteAverageLte: voteLte,
                runtimeGte,
                runtimeLte,
                includeAdult,
                sortBy,
                page: overridePage,
            })
            .then((res) => {
                if (res.condition) {
                    setResults(res.result.results || []);
                    setTotalPages(res.result.total_pages || 1);
                    setPage(res.result.page || 1);
                } else {
                    toast.error(res.message);
                }
            })
            .catch(() => toast.error("Failed to fetch filtered results"))
            .finally(() => setLoading(false)); // Stop loading
    };

    const clearFilters = () => {
    setType("MV");
    setSelectedGenres([]);
    setLanguage("");
    setReleaseYear("");
    setVoteGte("");
    setVoteLte("");
    setRuntimeGte("");
    setRuntimeLte("");
    setIncludeAdult(false);
    setSortBy("popularity.desc");
    setKeywordInput("");
    setKeywordOptions([]);
    setSelectedKeywords([]);
    setResults([]);
    setPage(1);
    setTotalPages(1);
};


    return (
        <div className="background-color">
            <Navigation showSearch={false} />

            <div className="min-h-screen text-white p-6 pt-[8rem] mx-2 2xl:mx-[8rem]">
                <h1 className="text-3xl font-bold mb-6 text-center">Filter Movies & Series</h1>

                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded w-full border border-gray-600"
                        >
                            <option value="MV">Movie</option>
                            <option value="SR">Series</option>
                        </select>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded w-full border border-gray-600"
                        >
                            <option value="">Language</option>
                            {languages.map((lang, i) => (
                                <option key={i} value={lang.iso_639_1}>
                                    {lang.english_name}
                                </option>
                            ))}
                        </select>

                        
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded w-full border border-gray-600"
                        >
                            <option value="popularity.desc">Popularity ↓</option>
                            <option value="popularity.asc">Popularity ↑</option>
                            <option value="vote_average.desc">Rating ↓</option>
                            <option value="vote_average.asc">Rating ↑</option>
                            <option value="release_date.desc">Release ↓</option>
                            <option value="release_date.asc">Release ↑</option>
                        </select>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="releaseYear" className="text-sm text-gray-300">
                                📅 Release Year
                            </label>
                            <input
                                id="releaseYear"
                                type="number"
                                value={releaseYear}
                                onChange={(e) => setReleaseYear(e.target.value)}
                                placeholder="e.g., 2023"
                                className="bg-gray-800 placeholder-gray-400 p-2 rounded w-full border border-gray-600"
                                min="1800"
                                max="2099"
                                step="1"
                            />
                        </div>

                        <div className="mb-4 col-span-full relative">
                            <label className="block mb-1 text-sm">🎯 Keywords</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onFocus={() => setKeywordDropdownOpen(true)}
                                    onBlur={() =>
                                        setTimeout(() => setKeywordDropdownOpen(false), 150)
                                    } // Delay to allow click
                                    placeholder="Search keywords..."
                                    className="bg-gray-800 text-black placeholder-gray-400 p-2 rounded w-full border border-gray-600"
                                />

                                {keywordDropdownOpen && keywordOptions.length > 0 && (
                                    <div className="absolute z-10 bg-white text-black rounded shadow max-h-[200px] overflow-y-auto mt-1 w-full">
                                        {keywordOptions.map((k) => (
                                            <div
                                                key={k.id}
                                                onMouseDown={() => {
                                                    if (
                                                        !selectedKeywords.some(
                                                            (kw) => kw.id === k.id
                                                        )
                                                    ) {
                                                        setSelectedKeywords((prev) => [
                                                            ...prev,
                                                            { id: k.id, name: k.name },
                                                        ]);
                                                    }
                                                    setKeywordInput("");
                                                    setKeywordOptions([]);
                                                }}
                                                className="p-2 hover:bg-gray-200 cursor-pointer text-sm !text-black"
                                            >
                                                {k.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedKeywords.map((kw) => (
                                    <span
                                        key={kw.id}
                                        className="bg-primary-color-and-hover text-white px-2 py-1 rounded flex items-center text-sm gap-2"
                                    >
                                        {kw.name}
                                        <button
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setSelectedKeywords((prev) =>
                                                    prev.filter((k) => k.id !== kw.id)
                                                )
                                            }
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 🎯 Rating Range */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">
                                ⭐ Rating Range (0–10)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={voteGte}
                                    onChange={(e) => setVoteGte(e.target.value)}
                                    placeholder="Min"
                                    className="bg-gray-800 text-black placeholder-gray-400 p-2 rounded w-full border border-gray-600"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={voteLte}
                                    onChange={(e) => setVoteLte(e.target.value)}
                                    placeholder="Max"
                                    className="bg-gray-800 text-black placeholder-gray-400 p-2 rounded w-full border border-gray-600"
                                />
                            </div>
                        </div>

                        {/* 🎬 Runtime Range */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">
                                ⏱ Runtime (Minutes)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={runtimeGte}
                                    onChange={(e) => setRuntimeGte(e.target.value)}
                                    placeholder="Min"
                                    className="bg-gray-800 text-black placeholder-gray-400 p-2 rounded w-full border border-gray-600"
                                />
                                <input
                                    type="number"
                                    value={runtimeLte}
                                    onChange={(e) => setRuntimeLte(e.target.value)}
                                    placeholder="Max"
                                    className="bg-gray-800 text-black placeholder-gray-400 p-2 rounded w-full border border-gray-600"
                                />
                            </div>
                        </div>
                        <br />

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={includeAdult}
                                onChange={() => setIncludeAdult((prev) => !prev)}
                            />
                            <span>Include Adult Content</span>
                        </label>
                    </div>
                </div>

                {/* Genres */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2">🎭 Genres</h2>
                    <div className="flex flex-wrap gap-2">
                        {genres.map((g) => (
                            <button
                                key={g.tmdbId}
                                onClick={() => toggleGenre(g.tmdbId)}
                                className={`px-3 py-1 rounded text-sm ${
                                    selectedGenres.includes(g.tmdbId)
                                        ? "bg-primary-color"
                                        : "bg-gray-600"
                                }`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => fetchFiltered(1)}
                    className="cursor-pointer bg-primary-color-and-hover px-4 py-2 rounded w-full sm:w-auto block mx-auto mb-8"
                >
                    Apply Filters
                </button>

                <button
                        onClick={clearFilters}
                        className="mb-2 cursor-pointer mt-2 text-sm text-red-400 underline hover:text-red-300 mx-auto block"
                        >
                        Clear All Filters
                        </button>


                {loading ? (
                    <h1 className="text-center py-10 text-gray-300 text-xl">🎥 Loading results...</h1>
                ) : (
                    <MovieGrid
                        movies={results}
                        folderName="Filtered Results"
                        renderType="filtered"
                    />
                )}

                {/* Pagination */}
                <div className="flex gap-2 justify-center items-center mt-6 text-[.8rem]">
                    <button
                        onClick={() => page > 1 && fetchFiltered(page - 1)}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-[3px] ${
                            page === 1
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-primary-color text-white cursor-pointer"
                        }`}
                    >
                        Prev
                    </button>

                    {getPagination(1, totalPages, page, 3).map((p, index) => (
                        <button
                            key={index}
                            onClick={() => p !== "..." && fetchFiltered(p)}
                            className={`w-10 h-10 rounded-[3px] ${
                                p === page
                                    ? "bg-primary-color text-white"
                                    : "text-white"
                            }`}
                            disabled={p === "..."}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => page < totalPages && fetchFiltered(page + 1)}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-[3px] ${
                            page === totalPages
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-primary-color text-white cursor-pointer"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FilterPage;
