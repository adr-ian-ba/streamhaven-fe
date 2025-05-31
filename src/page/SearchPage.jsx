import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../component/Footer";
import Navigation from "../component/Navigation";
import apiHelper from "../helper/ApiHelper";
import toast from "react-hot-toast";
import MovieGrid from "../component/MovieGrid";
import Loading from "../component/Loading";

const SearchPage = () => {
  const { page } = useParams()
  const [searchParams] =   useSearchParams()
  const query = searchParams.get("query")
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState(null);

  function getPagination(low = 1, high, current, visiblePage = 3) {
    let pages = [];

    if (!high || high <= 1) return [1]

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

    for (let i = Math.max(low + 1, current - half); i <= Math.min(high - 1, current + half); i++) {
        pages.push(i);
    }

    pages.push("...");
    pages.push(high);

    return pages;
}



  useEffect(() => {
    const pageNumber = parseInt(page, 10) || 1;
    if (!query.trim()) return;

    setCurrentPage(pageNumber);

    apiHelper
      .get(`/media/search/${pageNumber}?query=${encodeURIComponent(query.trim())}`)
      .then((response) => {
        console.log(response);
        if (!response.condition) {
          toast.error(response.message);
          setMovies([]);
          return;
        }

        setMovies(response.result.results || []);
        setTotalPages(response.result?.total_pages || 1);
      })
      .catch((err) => {
        console.error("Search fetch error:", err);
        toast.error("Failed to fetch search results.");
        setMovies([]);
      });
  }, [query, page]);

  if (!movies) {
    return <Loading />
  }

  return (
    <div className="background-color min-h-[100vh]">
      <Navigation />

      <div className="pt-25 relative mx-4 2xl:mx-[8rem]">
        <MovieGrid movies={movies}>
          <h1 className="text-[2rem] font-bold mb-2">Results For</h1>
          <h1 className="text-[1.5rem] font-bold mb-2">&quot;{decodeURIComponent(query)}&quot;</h1>
        </MovieGrid>

        <div className="flex gap-2 justify-center items-center mt-6 text-[.8rem]">
            
            <button onClick={() => currentPage > 1 && navigate(`/search/${currentPage - 1}/?query=${encodeURIComponent(query)}`)}disabled={currentPage === 1}className={`px-4 py-2 rounded-[3px] ${currentPage === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-primary-color text-white cursor-pointer"}`}>Prev</button>

            {getPagination(1, totalPages, currentPage, 3).map((page, index) => (
                <button
                key={index}
                onClick={() => page !== "..." && navigate(`/search/${page}/?query=${encodeURIComponent(query)}`)}
                className={`w-10 h-10 rounded-[3px] ${
                    page === currentPage ? "bg-primary-color text-white" : "text-white"
                }`}
                disabled={page === "..."}
                >
                {page}
                </button>
            ))}

            <button onClick={() => currentPage < totalPages && navigate(`/search/${currentPage + 1}/?query=${encodeURIComponent(query)}`)}disabled={currentPage === totalPages} className={`px-4 py-2 rounded-[3px] ${currentPage === totalPages ? "bg-gray-500 cursor-not-allowed" : "bg-primary-color text-white cursor-pointer"}`}>Next</button>
        </div>


    </div>

    <Footer />
    </div>
  );
};

export default SearchPage;
