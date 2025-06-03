import { useState, useEffect } from "react";
import apiHelper from "../helper/ApiHelper";
import MovieGrid from "../component/MovieGrid";
import toast from "react-hot-toast";

const FilterPage = () => {
  const [type, setType] = useState("MV");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [voteGte, setVoteGte] = useState("");
  const [voteLte, setVoteLte] = useState("");
  const [runtimeGte, setRuntimeGte] = useState("");
  const [runtimeLte, setRuntimeLte] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [results, setResults] = useState([]);

  useEffect(() => {
    apiHelper.get("/media/genres")
      .then(res => {
        if (res.condition) setGenres(res.genres || []);
      })
      .catch(() => toast.error("Failed to load genres"));
  }, []);

  const toggleGenre = (id) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const fetchFiltered = () => {
    apiHelper.post("/media/discover", {
      type,
      genres: selectedGenres,
      keywords,
      language,
      releaseYear,
      voteAverageGte: voteGte,
      voteAverageLte: voteLte,
      runtimeGte,
      runtimeLte,
      includeAdult,
      sortBy
    })
    .then(res => {
      if (res.condition) setResults(res.result.results || []);
      else toast.error(res.message);
    })
    .catch(() => toast.error("Failed to fetch filtered results"));
  };

  return (
    <div className="background-color min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎯 Filter Movies & Series</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <select value={type} onChange={e => setType(e.target.value)} className="text-black p-2 rounded w-full">
          <option value="MV">Movie</option>
          <option value="SR">Series</option>
        </select>

        <input type="text" value={language} onChange={e => setLanguage(e.target.value)} placeholder="Language code (e.g., en)" className="text-black p-2 rounded w-full" />

        <input type="text" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} placeholder="Release year (e.g., 2023)" className="text-black p-2 rounded w-full" />

        <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Keyword IDs (e.g., 210024,123)" className="text-black p-2 rounded w-full" />

        <input type="number" value={voteGte} onChange={e => setVoteGte(e.target.value)} placeholder="Min rating (e.g., 6)" className="text-black p-2 rounded w-full" />

        <input type="number" value={voteLte} onChange={e => setVoteLte(e.target.value)} placeholder="Max rating (e.g., 9)" className="text-black p-2 rounded w-full" />

        <input type="number" value={runtimeGte} onChange={e => setRuntimeGte(e.target.value)} placeholder="Min runtime (minutes)" className="text-black p-2 rounded w-full" />

        <input type="number" value={runtimeLte} onChange={e => setRuntimeLte(e.target.value)} placeholder="Max runtime (minutes)" className="text-black p-2 rounded w-full" />

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-black p-2 rounded w-full">
          <option value="popularity.desc">Popularity ↓</option>
          <option value="popularity.asc">Popularity ↑</option>
          <option value="vote_average.desc">Rating ↓</option>
          <option value="vote_average.asc">Rating ↑</option>
          <option value="release_date.desc">Release ↓</option>
          <option value="release_date.asc">Release ↑</option>
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={includeAdult} onChange={() => setIncludeAdult(prev => !prev)} />
          <span>Include Adult Content</span>
        </label>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold mb-2">🎭 Genres</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map(g => (
            <button
              key={g.tmdbId}
              onClick={() => toggleGenre(g.tmdbId)}
              className={`px-3 py-1 rounded text-sm ${selectedGenres.includes(g.tmdbId) ? "bg-primary-color" : "bg-gray-600"}`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <button onClick={fetchFiltered} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full sm:w-auto block mx-auto mb-8">
        🚀 Apply Filters
      </button>

      <MovieGrid movies={results} folderName="Filtered Results" renderType="filtered" />
    </div>
  );
};

export default FilterPage;
