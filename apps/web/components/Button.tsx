export const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button className="p-2 bg-gray-600" onClick={onClick}>
      {children}
    </button>
  );
};
