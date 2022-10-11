//copied from https://wanago.io/2022/05/09/dynamic-recursive-forms-formik-typescript-react/

interface DynamicFormProperty {
	id: string;
	label: string;
	properties: DynamicFormProperty[];
}

export default DynamicFormProperty;
