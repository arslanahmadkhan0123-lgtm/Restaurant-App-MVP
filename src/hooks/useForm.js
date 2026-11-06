import { useState } from "react";

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (field, value) => {
    const updated = { ...values, [field]: value };
    setValues(updated);
    if (validate) {
      const validationErrors = validate(updated);
      setErrors(validationErrors);
      setIsValid(Object.keys(validationErrors).length === 0);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, reset, isValid };
}