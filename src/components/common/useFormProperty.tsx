//copied from https://wanago.io/2022/05/09/dynamic-recursive-forms-formik-typescript-react/
import { useFormikContext, getIn } from 'formik';
import DynamicFormProperty from './DynamicFormProperty';
import { v4 as uuid } from 'uuid';

function useFormProperty(prefix: string) {
	const { values, setFieldValue } = useFormikContext();

	const properties: DynamicFormProperty[] = getIn(
		values,
		`${prefix}properties`
	);

	const addNewProperty = () => {
		console.log('useFormProperty', values);
		const newProperty: DynamicFormProperty = {
			label: '',
			id: uuid(),
			properties: [],
		};

		const newProperties = properties
			? [...properties, newProperty]
			: [newProperty];

		setFieldValue(`${prefix}properties`, newProperties);
	};

	const removeProperty = (propertyIndex: number) => () => {
		const newProperties = [...properties];

		newProperties.splice(propertyIndex, 1);

		setFieldValue(`${prefix}properties`, newProperties);
	};

	return {
		properties,
		addNewProperty,
		removeProperty,
	};
}

export default useFormProperty;
