import Image from "next/image";

const Logo = ({ height, width }: { height: number; width: number }) => {
  return (
    <Image
      src={"logo.svg"}
      alt="vercel_clone"
      height={height}
      width={width}
      priority={true}
    />
  );
};

export default Logo;
