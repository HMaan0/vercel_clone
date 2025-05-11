import Copy from "./Copy";

const CommandSnippet = () => {
  return (
    <div className="w-10/12 xl:5/12 sm:5/12 md:w-6/12 border border-border-theme shadow rounded-2xl bg-white">
      <div className="2xl:px-6 2xl:py-2 px-4 py-1 flex justify-between items-center">
        <p className="font-mono 2xl:text-lg md:text-lg ">{">"}_ Terminal</p>
        <div>
          <Copy textToCopy={"pip install preswald && preswald tutorial"} />
        </div>
      </div>
      <div className="font-mono bg-light-bg 2xl:text-2xl md:text-xl text-lg 2xl:px-6 2xl:py-4 px-4 py-2 border-t border-border-theme rounded-b-2xl">
        <p>~$ pip install preswald</p>
        <p>~$ tutorial preswald</p>
      </div>
    </div>
  );
};

export default CommandSnippet;
