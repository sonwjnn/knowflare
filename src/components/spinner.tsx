import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { Loader } from "lucide-react";

const spinnerVariants = cva("text-white animate-spin", {
  variants: {
    size: {
      default: "size-4",
      sm: "size-2",
      lg: "size-6",
      icon: "size-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const Spinner = ({ className, size }: SpinnerProps) => {
  return <Loader className={cn(spinnerVariants({ size }), className)} />;
};
