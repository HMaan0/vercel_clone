const HamburgerButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      <button onClick={onClick} className="cursor-pointer">
        {children}
      </button>
    </>
  );
};

export default HamburgerButton;
