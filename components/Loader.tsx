import Image from "next/image";

export const Loader = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <Image src="/loader.gif" alt="loading" width={100} height={100} />
      <p className="text-4xl">טוען...</p>
    </div>
  );
};
