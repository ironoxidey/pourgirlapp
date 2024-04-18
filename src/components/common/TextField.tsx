import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import {
  setRightToMakeChanges,
  setLastToMakeChanges,
} from "../../reducers/appSlice";
import { useAppSelector, useAppDispatch } from "../../reducers/hooks";

const TextFieldWrapper = ({
  id,
  name,
  error,
  helperText,
  label,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  inputProps,
  InputProps,
  multiline,
  value,
  defaultValue,
  step,
  autoComplete,
  sx,
  ...otherProps
}: {
  id?: string;
  name: string;
  error?: any;
  helperText?: string;
  label?: string;
  type?: string;
  onChange?: any;
  placeholder?: string;
  inputProps?: any;
  InputProps?: any;
  multiline?: boolean;
  value?: any;
  defaultValue?: any;
  step?: number;
  onFocus?: any;
  onBlur?: any;
  autoComplete?: string;
  sx?: any;
}) => {
  const [field, meta] = useField(name);
  const { values, setFieldValue } = useFormikContext();

  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );
  const appLastToMakeChanges: string = useAppSelector(
    (state: any) => state.app.lastToMakeChanges
  );

  useEffect(() => {
    // console.log("textfieldWarppaer name", name);
    if (appRightToMakeChanges !== "FORM") {
      if (typeof value === "number" && name === "servings") {
        setFieldValue(name, Math.round(value));
      } else {
        setFieldValue(name, value);
      }
    }
  }, [field.value, value]);

  const configTextField = {
    ...field,
    ...otherProps,
    id,
    fullWidth: true,
    variant: "standard" as "standard",
    error,
    helperText,
    label,
    placeholder,
    inputProps,
    InputProps,
    multiline,
    value: field.value, // Use field.value for controlled component
    // value,
    defaultValue,
    autoComplete,
    sx,
    step,
    // onChange,
    // onFocus,
    // onBlur,
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }
  // return <TextField {...configTextField} value={field.value} />;
  return <TextField {...configTextField} />;
};

export default TextFieldWrapper;
