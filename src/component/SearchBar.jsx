import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import apiHelper from '../helper/ApiHelper';
import toast from 'react-hot-toast';

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState([]);
  const [isFocused, setIsFocused] = useState(false); 
  const navigate = useNavigate()
  
  useEffect(() => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") {
      setLoading(false);
      setSuggestion([]);
      return;
    }

    setLoading(true);

    const searchTimeout = setTimeout(() => {
      console.log("executed");

      apiHelper.get(`/media/search/?query=${encodeURIComponent(trimmedInput)}`)
        .then((result) => {
          if (!result.condition) {
            toast.error(result.message || "Failed to fetch suggestions");
            setSuggestion([]);
            return;
          }
          setSuggestion(result.result.results);
        })
        .catch((err) => {
          console.error("Search error:", err);
          toast.error("Search failed");
        })
        .finally(() => setLoading(false));
    }, 1000);

    return () => clearTimeout(searchTimeout);
  }, [input]);

const handleClick = (id, type, ss) => {
  let path = `/watch/${id}/${type}`;

  if (type === "SR") {
    path += ss === undefined ? `/1/1` : `/${ss}/1`;
  } else if (ss !== undefined) {
    path += `/${ss}/1`;
  }

  navigate(path);

  setInput("");
  setSuggestion([]);
  setIsFocused(false);
};


const handleEnter = () => {
  const trimmedInput = input.trim();
  if (!trimmedInput) return;

  navigate(`/search/1/?query=${encodeURIComponent(trimmedInput)}`);

  setInput("");
  setSuggestion([]);
  setIsFocused(false);
};


  return (
    <div className="relative w-full sm:w-[30rem]">
      <div className="h-[2.3rem] sm:w-[30rem] bg-white p-2 flex justify-between items-center gap-2 rounded-[3px]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Search for Movie"
          className="flex-grow w-full placeholder:text-sm text-sm border-none text-black px-2 py-1 focus:outline-none focus:ring-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} 
          onKeyDown={(e) =>{
            if(e.key == "Enter"){
              handleEnter()
            }
          }}
        />
        <svg className="h-[1.5rem] w-[1.5rem]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#242428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
        {/* <NavLink to="/filter" className="foreground-color py-1 px-2 text-[.8rem] text-white rounded-[3px]">Filter</NavLink> */}
      </div>

      {input.length > 0 && isFocused && ( 
        <div className="p-2 text-sm bg-white backdrop-blur-sm mt-2 rounded-[3px] absolute w-full">
          {loading ? (
            <p className='color-black'>Loading...</p>
          ) : (
            <div className="flex items-center pr-2 flex-col max-h-[20rem] overflow-y-scroll custom-scrollbar">
              {suggestion.length > 0 ? (
                suggestion.map((eachSuggestion, index) => (
                  <div onClick={()=>handleClick(eachSuggestion.id, eachSuggestion.media_type)} key={index} className="border-b border-b-gray-400 w-full flex items-center cursor-pointer">
                    <div className="p-2 flex gap-2">
                      <div onClick={()=>handleClick(eachSuggestion.id, eachSuggestion.media_type)} className="aspect-[4/5] w-[2.5rem] overflow-hidden rounded-[3px]">
                        <img  className='object-fill w-full h-full' src={eachSuggestion.poster_path} alt="" />
                      </div>
                      <div className='flex max-w-[18rem] flex-col'>
                        <p className='color-black truncate text-[.8rem]'>{eachSuggestion.title}</p>
                        <div className='flex items-center'>
                          <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-amber-400">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                          </svg>
                          <p className='color-black text-[.8rem]'>{eachSuggestion.vote_average}</p>

                          <p className='color-black text-[.8rem]'>/</p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-black">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                          </svg>
                          <p className='color-black text-[.8rem]'>{eachSuggestion.vote_count}</p>
                        </div>
                        <p className='color-black text-[.8rem]'>aired : {eachSuggestion.release_date}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Not Found</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
