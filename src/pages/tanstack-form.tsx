import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const userSchema = z.object({
  firstName: z.string().min(5, {
    message: "first name cannot be less than 5 letters",
  }),
  lastName: z.string().min(3, "[Form] Last name must be at least 3 characters"),
});

type User = z.infer<typeof userSchema>;

const TanStackForm: React.FC = () => {
  const [lastSubmittedValues, setLastSubmittedValues] = useState({
    firstName: "",
    lastName: "",
  });
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm({
    defaultValues: lastSubmittedValues,
    onSubmit: async ({ value }) => {
      setLastSubmittedValues(value);
      setIsDirty(false);
      console.log(value);
    },
    validators: {
      onChange: userSchema,
    },
  });

  const checkDirtyState = (values: User) => {
    const currentValues = JSON.stringify(values);
    const lastSubmittedValuesStr = JSON.stringify(lastSubmittedValues);
    setIsDirty(currentValues !== lastSubmittedValuesStr);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200 transition-all duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        TanStack Zod Form with Custom isDirty Example
      </h1>
  
      {/* Form Status */}
      <div className="mb-4 text-sm text-gray-500 text-center">
        Form is{" "}
        <span
          className={`font-semibold transition-colors duration-300 ${
            isDirty ? "text-red-500" : "text-green-500"
          }`}
        >
          {isDirty ? "dirty" : "pristine"}
        </span>
      </div>
  
      <div className="space-y-4">
        {/* First Name Field */}
        <form.Field name="firstName" validators={{ onChangeAsyncDebounceMs: 500 }}>
          {(field) => (
            <div className="relative group">
              <FormField
                id="firstName"
                label="First Name"
                field={field}
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                onChange={() => checkDirtyState(form.state.values)}
              />
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></span>
            </div>
          )}
        </form.Field>
  
        {/* Last Name Field */}
        <form.Field name="lastName" validators={{ onChangeAsyncDebounceMs: 500 }}>
          {(field) => (
            <div className="relative group">
              <FormField
                id="lastName"
                label="Last Name"
                field={field}
                type="text"
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                onChange={() => checkDirtyState(form.state.values)}
              />
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></span>
            </div>
          )}
        </form.Field>
      </div>
  
      {/* Submit Button */}
      <form.Subscribe selector={(state) => [state.canSubmit, state.isValidating]}>
        {([canSubmit, isValidating]) => (
          <button
            type="submit"
            disabled={!canSubmit || isValidating || !isDirty}
            onClick={form.handleSubmit}
            className={`w-full mt-4 py-2 px-4 text-white font-semibold rounded-lg transition-all duration-300 ${
              canSubmit && isDirty
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        )}
      </form.Subscribe>
    </div>
  );
  
  
};

interface FormFieldProps {
  id: string;
  label: string;
  field: any;
  type?: 'text' | 'textarea';
  placeholder?: string;
  className: string;
  onChange?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  field, 
  type = 'text', 
  placeholder = '',
  onChange ,
  className = ''  
}) => {
  const FieldComponent = type === 'textarea' ? Textarea : Input;

  const handleChange = (value: string) => {
    field.handleChange(value);
    onChange?.();
  };

  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium mb-2 block">
        {label}
      </Label>
      <FieldComponent
        id={id}
        value={field.state.value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
      {field.state.meta.errors && (
        <p className="text-destructive text-sm mt-1">{field.state.meta.errors}</p>
      )}
    </div>
  );
};

export default TanStackForm;