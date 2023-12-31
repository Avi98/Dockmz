import React from "react";
import { getFullNameInitials } from "../../utils";
import { VariantProps, cva } from "class-variance-authority";
import { randomColor } from "./utils";

const avatar = cva(
  `flex items-center p-2 justify-center rounded-full ${randomColor()}  [&>span]:capitalize [&>span]:font-semibold`,
  {
    variants: {
      size: {
        md: "h-10 w-10 [&>span]:text-lg",
        sm: "h-8 w-8 [&>span]:text-md",
        xs: "h-6 w-6 [&>span]:text-xs",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
interface IAvatar
  extends Partial<HTMLSpanElement>,
    VariantProps<typeof avatar> {
  fullName: string;
  random?: boolean;
}

export const Avatar = React.forwardRef<HTMLSpanElement, IAvatar>(
  (props, ref) => {
    return (
      <span
        ref={ref}
        className={avatar({
          className: props.random ? randomColor() : props.className,
          size: props.size,
        })}
      >
        <span>{getFullNameInitials(props.fullName)}</span>
      </span>
    );
  }
);

Avatar.displayName = "Avatar";
