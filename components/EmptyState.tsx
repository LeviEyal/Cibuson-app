"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  image?: string;
  title: string;
  description?: string;
  className?: string;
}

export const EmptyState = ({
  image,
  title,
  description,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      {image && <Image src={image} alt={title} width={130} height={130} />}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p
          className="text-center text-md text-gray-500"
          style={{ maxWidth: "80%" }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
