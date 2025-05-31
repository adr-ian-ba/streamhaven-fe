import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const Dialog = ({ children, title, useTitle = false, useClose = false, closeFunction, className }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, []);

  const handleClose = () => {
    setVisible(false)
    setTimeout(closeFunction, 50)
  };

  return (
    <div className={`${className} relative`}>
      <div onClick={handleClose} className="fixed inset-0 bg-[#242428]/60 backdrop-blur-[3px] z-[1000]"></div>

      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-gray-400/20 backdrop-blur-2xl rounded-[1rem] w-[90%] p-8 max-w-[35rem] z-[1001]
                      transition-all duration-300 ${visible ? "dialog-container" : "opacity-0 scale-75"}`}>

        <div className={`flex ${useTitle && useClose ? "justify-between" : useTitle ? "justify-start" : "justify-end"} items-center gap-2`}>
          {useTitle && <h1 className="text-[2.5rem]">{title}</h1>}
          {useClose && (
            <svg onClick={handleClose} className="p-1 size-8 cursor-pointer" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path fill="ffffff" d="M15.1 3.1l-2.2-2.2-4.9 5-4.9-5-2.2 2.2 5 4.9-5 4.9 2.2 2.2 4.9-5 4.9 5 2.2-2.2-5-4.9z"></path>
              </g>
            </svg>
          )}
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
