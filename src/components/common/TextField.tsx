import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

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
}) => {
	const [field, meta] = useField(name);

	const configTextField = {
		...field,
		...otherProps,
		id,
		fullWidth: true,
		variant: 'standard' as 'standard',
		error,
		helperText,
		label,
		placeholder,
		inputProps,
		InputProps,
		multiline,
		value,
		defaultValue,
		autoComplete,
		step,
	};

	if (meta && meta.touched && meta.error) {
		configTextField.error = true;
		configTextField.helperText = meta.error;
	}
	return <TextField {...configTextField} />;
};

export default TextFieldWrapper;
