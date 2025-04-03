export const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="border cursor-pointer hover:bg-gray-900 border-gray-400 rounded-2xl text-center py-1.5 px-3 flex justify-center items-center  bg-gray-800"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
