import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageContainer = ({
  children,
  className,
  ...otherProps
}: PageContainerProps) => {
  return (
    <div
      className={cn(
        "flex-1 w-full px-2 mt-4 mb-20 flex flex-col justify-start items-center gap-2",
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};
