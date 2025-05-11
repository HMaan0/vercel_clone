const Button = ({
  children,
  className,
  textSize,
  width,
}: {
  children: React.ReactNode;
  className?: string;
  textSize?: string;
  width?: string;
}) => {
  return (
    <button
      className={`${width ? width : "lg:w-fit w-full"}  flex  justify-center items-center px-7 py-3 rounded-2xl border border-gray-600/50 ${textSize ? textSize : "text-xl"} font-medium shadow transition-colors duration-300 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
