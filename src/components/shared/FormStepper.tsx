"use client";
import React from "react";

export interface Step {
  id: string;
  label: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStepId: string;
  onStepClick?: (id: string) => void;
}

const FormStepper = ({ steps, currentStepId, onStepClick }: FormStepperProps) => {
  return (
    <ol className="flex flex-wrap items-center gap-3">
      {steps.map((s, i) => {
        const active = s.id === currentStepId;
        const classes = [
          "flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors",
          active ? "border-white/30 bg-white/10" : "border-white/10 hover:bg-white/5",
        ].join(" ");
        const content = (
          <span className={classes}>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/10 text-xs">
              {i + 1}
            </span>
            <span>{s.label}</span>
          </span>
        );
        return (
          <li key={s.id} className="list-none">
            {onStepClick ? (
              <button onClick={() => onStepClick(s.id)} aria-current={active ? "step" : undefined}>
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default FormStepper;
