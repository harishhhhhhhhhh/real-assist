import React, { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { List, Trigger, Content, Root } from "@radix-ui/react-tabs";
import { cva, cx } from "class-variance-authority";
import { X } from "lucide-react";

const Tabs = Root;

const tabStyles = cva(
  "group data-[state=inactive]:text-gray data-[state=active]:text-blue-default flex items-center gap-[10px] justify-center w-fit py-[13px] px-[20px] active:bg-light-blue",
  {
    variants: {
      variation: {
        main: "border-b border-b-light-gray data-[state=active]:border-b-blue-default",
        primary:
          "border border-light-gray data-[state=active]:bg-light-blue data-[state=active]:border-light-blue active:!border-blue-default active:!border-opacity-10",
      },
    },
  }
);

const textStyles = cva("flex text-base group-hover:text-blue-default", {
  variants: {
    variation: {
      main: "text-base",
      primary: "text-h2 font-medium",
    },
  },
});

const TabsList = forwardRef<
  ElementRef<typeof List>,
  ComponentPropsWithoutRef<typeof List>
>(({ className, ...props }, ref) => (
  <List
    className={cx("inline-flex", className)}
    ref={ref}
    {...props}
  />
));

TabsList.displayName = List.displayName;

type TabsTriggerProps = ComponentPropsWithoutRef<
  typeof Trigger
> & {
  canDrag?: boolean;
  handleClose?: () => void;
  variation?: "main" | "primary";
};

const TabsTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  TabsTriggerProps
>(
  (
    { canDrag, className, variation = "main", handleClose, children, ...props },
    ref
  ) => (
    <Trigger
      className={cx(
        tabStyles({
          variation,
        }),
        className
      )}
      ref={ref}
      {...props}
    >
      {!!canDrag && (
        <X
          className="cursor-pointer"
          fill="bold"
          name="DotsSixVertical"
          size={24}
        />
      )}

      <span
        className={textStyles({
          variation,
        })}
      >
        {children}
      </span>

      {!!handleClose && (
        <X
          name="X"
          size={16}
          className="text-gray cursor-pointer"
          onClick={handleClose}
        />
      )}
    </Trigger>
  )
);

TabsTrigger.displayName = Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
  <Content
    ref={ref}
    className={cx(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props} />
));

TabsContent.displayName = Content.displayName;

export {
  TabsContent,
  TabsList,
  Tabs,
  TabsTrigger,
};