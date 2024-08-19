import Image from "next/image";

export const Loader = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-2">
      <Image src="/loader.gif" alt="loading" width={100} height={100} />
      <p className="text-4xl">טוען...</p>
    </div>
  );
};
