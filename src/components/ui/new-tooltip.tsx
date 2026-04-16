/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, HTMLMotionProps, Variants, motion } from "framer-motion";
import React, { Children, cloneElement, forwardRef, useState, Ref } from "react";
import { Modifier, usePopper } from "react-popper";
import ReactFocusLock from "react-focus-lock";
import { Placement, PositioningStrategy } from "@popperjs/core";
import { Portal, tx, useMergeRefs, useToggle } from "@zeeve-platform/ui";

const motionVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

interface NewTooltipProps extends HTMLMotionProps<"div"> {
  text: string;
  textClassName?: string;
  placement?: Placement;
  strategy?: PositioningStrategy;
  modifiers?: Array<Partial<Modifier<string, any>>>;
  size?: "small" | "medium" | "large";
}

const NewTooltip = forwardRef<HTMLDivElement, NewTooltipProps>((props, ref) => {
  const {
    children,
    className,
    text,
    textClassName,
    placement = "bottom",
    strategy,
    modifiers,
    size = "medium",
    ...rest
  } = props;

  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy,
    modifiers: [
      ...(modifiers || []),
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top", "bottom"],
        },
      },
    ],
  });

  const { isOpen, handleOpen, handleClose } = useToggle();

  return (
    <>
      {cloneElement(
        Children.only(children) as React.ReactElement & {
          ref?: Ref<any>;
        },
        {
          ref: useMergeRefs(ref, setReferenceElement),
          onMouseEnter: handleOpen,
          onMouseLeave: handleClose,
        },
      )}

      <AnimatePresence>
        {isOpen ? (
          <Portal>
            <ReactFocusLock>
              <motion.div
                variants={motionVariants}
                initial="initial"
                animate="animate"
                exit="initial"
                style={styles.popper}
                {...attributes.popper}
                ref={setPopperElement}
                className="relative"
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
              >
                {/* Tooltip box */}
                <div
                  className={tx(
                    "relative rounded-md bg-white px-3 py-1.5 text-center text-wrap text-[12px] text-gray-700",
                    size === "small" ? "w-20" : "w-40",
                    placement.startsWith("top")
                      ? "shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
                      : "shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
                    // ...
                  )}
                >
                  <p className={tx("leading-tight text-center", textClassName)}>{text}</p>
                </div>

                {/* Arrow (now disappears with fade) */}
                {placement.startsWith("top") ? (
                  <div className="absolute left-1/2 top-full z-0 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white " />
                ) : (
                  <div className="absolute bottom-full left-1/2 z-0 size-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-white" />
                )}
              </motion.div>
            </ReactFocusLock>
          </Portal>
        ) : null}
      </AnimatePresence>
    </>
  );
});

NewTooltip.displayName = "NewTooltip";

export type { NewTooltipProps };
export { NewTooltip };
