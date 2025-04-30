import LoadingSpinner from "./LoadingSpinner";

export const Button = ({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) => {
  console.log(disabled);
  return (
    <button
      className={`${disabled ? " cursor-not-allowed " : "cursor-pointer"}  bg-zinc-800 text-zinc-300 rounded px-3 py-1 font-medium border border-zinc-700 flex justify-center items-center `}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <LoadingSpinner></LoadingSpinner> : children}
    </button>
  );
};
