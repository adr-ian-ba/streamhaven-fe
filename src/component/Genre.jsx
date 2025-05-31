

// eslint-disable-next-line react/prop-types
const Genre = ({ genre }) => {

  return (
    <div className="text-[.7rem] py-1 px-2 rounded-[6px] border color-white cursor-pointer text-nowrap">
      {genre}
    </div>
  );
};

export default Genre;
