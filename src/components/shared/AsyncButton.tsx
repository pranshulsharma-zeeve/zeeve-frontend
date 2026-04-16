"use client";
import React from "react";
import { Button, Spinner } from "@zeeve-platform/ui";

interface AsyncButtonProps extends Omit<React.ComponentProps<typeof Button>, "isLoading" | "isDisabled"> {
  loading?: boolean;
}

const AsyncButton = ({ loading, children, ...rest }: AsyncButtonProps) => {
  return (
    <Button isDisabled={loading || (rest as any)?.isDisabled} {...(rest as any)}>
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default AsyncButton;
