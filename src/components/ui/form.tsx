"use client";

import * as React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

const Form = FormProvider;

const FormField = Controller;

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));

FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={className} {...props} />
));

FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <div ref={ref} {...props} />);

FormControl.displayName = "FormControl";

function FormMessage() {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <p className="text-sm text-red-500">
      {Object.values(errors)[0]?.message as string}
    </p>
  );
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
