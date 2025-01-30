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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Zod Form Example
      </h1>
  
      <div className="mb-4 text-sm text-gray-500 text-center">
        Form is <span className={`font-semibold ${isDirty ? "text-red-500" : "text-green-500"}`}>{isDirty ? "dirty" : "pristine"}</span>
      </div>
  
      <div className="space-y-4">
        <form.Field name="firstName" validators={{ onChangeAsyncDebounceMs: 500 }}>
          {(field) => (
            <FormField
              id="firstName"
              label="First Name"
              field={field}
              onChange={() => checkDirtyState(form.state.values)}
            />
          )}
        </form.Field>
  
        <form.Field name="lastName" validators={{ onChangeAsyncDebounceMs: 500 }}>
          {(field) => (
            <FormField
              id="lastName"
              label="Last Name"
              field={field}
              type="textarea"
              onChange={() => checkDirtyState(form.state.values)}
            />
          )}
        </form.Field>
      </div>
  
      <form.Subscribe selector={(state) => [state.canSubmit, state.isValidating]}>
        {([canSubmit, isValidating]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isValidating || !isDirty}
            onClick={form.handleSubmit}
            className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:bg-blue-700 disabled:bg-gray-300"
          >
            Submit
          </Button>
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
  onChange?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  field, 
  type = 'text', 
  placeholder = '',
  onChange 
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
        className="w-full"
        value={field.state.value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
      />
      {field.state.meta.errors && (
        <p className="text-destructive text-sm mt-1">{field.state.meta.errors}</p>
      )}
    </div>
  );
};

export default TanStackForm;