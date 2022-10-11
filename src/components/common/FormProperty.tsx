//copied from https://wanago.io/2022/05/09/dynamic-recursive-forms-formik-typescript-react/
import React, { FunctionComponent } from 'react';
import { Grid, IconButton } from '@mui/material';
import TextFieldWrapper from './TextField';
import useFormProperty from './useFormProperty';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface Props {
	prefix?: string;
}

const FormProperty: FunctionComponent<Props> = ({ prefix = '' }) => {
	const { properties, addNewProperty, removeProperty } =
		useFormProperty(prefix); //Since we need a full path to access a particular property, we have to keep track of how deep we are in our form. Because of that, our FormProperty has the prefix property.

	return (
		<>
			<Grid container className='FormProperty'>
				<Grid item>
					<TextFieldWrapper name={`${prefix}label`} />
				</Grid>
				<Grid item>
					<IconButton onClick={addNewProperty}>
						<AddCircleIcon></AddCircleIcon>
					</IconButton>
				</Grid>
			</Grid>
			{properties?.map((property, index) => (
				<Grid item key={index}>
					{property.id !== 'root' && (
						<IconButton onClick={removeProperty(index)}>
							<RemoveCircleIcon></RemoveCircleIcon>
						</IconButton>
					)}
					<FormProperty
						key={property.id}
						prefix={`${prefix}properties[${index}].`}
					/>
				</Grid>
			))}
		</>
	);
};

export default FormProperty;
