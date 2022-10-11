//mostly identical to WineSelect.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import PropTypes from 'prop-types';
import { account, databases } from '../appwrite/appwriteConfig';
import { Formik, Form } from 'formik';
import {
	Grid,
	Typography,
	Box,
	TextField,
	Autocomplete,
	createFilterOptions,
} from '@mui/material';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import TextFieldWrapper from './common/TextField';

import { addBeer, updateBeer } from '../reducers/groceriesSlice';
import { setRightToMakeChanges } from '../reducers/appSlice';

import { useAppSelector, useAppDispatch } from '../reducers/hooks';

import { useDebouncedCallback } from 'use-debounce';
import { Beer } from '../types/Beer';

type FormState = {
	beer?: Beer;
	servings?: number;
	fieldID: string;
};
const INITIAL_FORM_STATE: FormState = {
	beer: {},
	servings: 1,
	fieldID: '',
};

const filter = createFilterOptions<Beer>();

type propsTypes = {
	fieldID: string;
	removeBeer: any;
	cIndex: number;
	ref: any;
	name?: string;
	servings?: number;
};

const ounces = 2; //of alcohol per serving
const mLperOunce = 29.5735; //according to Google

const BeerSelect = (props: propsTypes) => {
	// const stateApp = useAppSelector((state: any) => state.app.beersUpdate);

	const dispatch = useAppDispatch();
	const [beers, setBeers] = useState<any[]>([]);
	const [ouncesPerPart, setOuncesPerPart] = useState(1.5);

	const [servingsFocus, setServingsFocus] = useState(false);

	const stateApp = useAppSelector((state: any) => state.app.beersUpdate);
	const appRightToMakeChanges: string = useAppSelector(
		(state: any) => state.app.rightToMakeChanges
	);

	const handleOnChange = useDebouncedCallback((beer: any, servings: any) => {
		if (appRightToMakeChanges === 'FORM') {
			console.log('handleOnChange FORM', beer);
			dispatch(
				updateBeer({
					...beer,
					servings,
					index: props.cIndex - 1,
					fieldID: props.fieldID,
				})
			);
		}
	}, 150);

	return (
		<Formik
			initialValues={{
				...INITIAL_FORM_STATE,
				beer: { name: props.name },
				servings: props.servings,
			}}
			onSubmit={(values) => {
				// onSubmit(values);
			}}
		>
			{({ setFieldValue, values: { beer, servings } }) => (
				<Form style={{ width: '100%' }}>
					<>
						<>
							<Grid
								className='beer'
								container
								sx={{
									position: 'relative',
									maxWidth: '500px',
									margin: '8px auto',
								}}
							>
								<Box
									className='deleteBtn'
									sx={{
										position: 'absolute',
										top: '-13px',
										right: '-13px',
										zIndex: '10',
									}}
								>
									{/* red X button in the top-right corner */}
									<HighlightOffTwoToneIcon
										sx={{
											color: 'red',
											backgroundColor: '#fff',
											borderRadius: '30px',
											fontSize: '30px',
											cursor: 'pointer',
										}}
										onClick={() => {
											props.removeBeer(props.fieldID);
											// props.ref.current.removeChild(
											// 	props.ref.current.children[props.cIndex - 1]
											// );
											//props.ref.current[props.cIndex - 1].innerHTML = '';
										}}
									></HighlightOffTwoToneIcon>
								</Box>
								<Grid
									container
									sx={{
										justifyContent: 'center',
										border: '2px solid var(--green)',
										borderRadius: '10px',
										overflow: 'hidden',
									}}
								>
									<Grid
										item
										className='beer'
										sx={{ margin: '8px auto', width: '150px' }}
									>
										<TextFieldWrapper
											id='name'
											label={`Beer #${props.cIndex}`}
											name='beer.name'
											defaultValue={props.name}
											onChange={(e: any, value: any) => {
												handleOnChange(value, servings);
												//console.log('autocomplete onChange', value);

												setFieldValue(
													'beer',
													value !== null
														? value
														: props.name
														? props.name
														: INITIAL_FORM_STATE.beer &&
														  INITIAL_FORM_STATE.beer.name
												);

												//console.log('values.beer', beer);
											}}
											onFocus={() => {
												dispatch(setRightToMakeChanges('FORM'));
												setServingsFocus(true);
											}}
											onBlur={() => setServingsFocus(false)}
										></TextFieldWrapper>
									</Grid>
									<Grid
										item
										className='servings'
										sx={{ margin: '8px auto', width: '150px' }}
									>
										<TextFieldWrapper
											name='servings'
											defaultValue={props.servings}
											label='How many servings?'
											type='number'
											onChange={handleOnChange(beer, servings)}
											onFocus={() => {
												dispatch(setRightToMakeChanges('FORM'));
												setServingsFocus(true);
											}}
											onBlur={() => setServingsFocus(false)}
										></TextFieldWrapper>
									</Grid>
								</Grid>
								{/* END .beer# */}
							</Grid>
						</>
					</>
				</Form>
			)}
		</Formik>
	);
};

BeerSelect.propTypes = {
	cIndex: PropTypes.number.isRequired,
	ref: PropTypes.any,
	removeBeer: PropTypes.func.isRequired,
	name: PropTypes.string,
	servings: PropTypes.number,
};

export default BeerSelect;
