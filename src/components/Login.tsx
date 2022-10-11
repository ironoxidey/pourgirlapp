import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { account } from '../appwrite/appwriteConfig';
import { Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Typography, Button } from '@mui/material';
import TextFieldWrapper from './common/TextField';
import pourGirlLogo from '../img/pour-girl-logo.png';

const INITIAL_FORM_STATE = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const FORM_VALIDATION = Yup.object().shape({
	email: Yup.string()
		.email('Invalid Email')
		.required('Please enter your email address'),
	// phone: Yup.number()
	// 	.integer()
	// 	.typeError('Please enter a valid phone number')
	// 	.required('Required'),
	password: Yup.string().required('Please enter your password'),
});

const Login = () => {
	const navigate = useNavigate();

	const [consoleError, setConsoleError] = useState<any>();

	//Appwrite Login
	const onSubmit = (fields: any) => {
		const promise = account.createEmailSession(fields.email, fields.password);

		promise.then(
			function (response) {
				navigate('/dashboard');
			},
			function (error) {
				console.log('Login error:', error); // Failure
				setConsoleError(error);
			}
		);
	};
	return (
		<>
			<Grid
				container
				className='login'
				justifyContent='center'
				alignItems='flex-start'
				sx={{ minHeight: '100vh', padding: '60px 20px' }}
			>
				<Formik
					initialValues={{
						...INITIAL_FORM_STATE,
					}}
					validationSchema={FORM_VALIDATION}
					onSubmit={(values) => {
						onSubmit(values);
					}}
				>
					<Form>
						<Grid item xs={12}>
							<img
								src={pourGirlLogo}
								alt=''
								className='pourGirlLogo'
								style={{ maxWidth: '200px', marginBottom: '20px' }}
							/>
						</Grid>
						<Grid container>
							<Grid item xs={12}>
								<Typography component='h3'>Login</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextFieldWrapper
									id='email'
									name='email'
									label='Email Address'
									type='email'
									autoComplete='email'
								/>
							</Grid>
							<Grid item xs={12}>
								<TextFieldWrapper
									id='password'
									name='password'
									label='Password'
									type='password'
									autoComplete='password'
								/>
							</Grid>
							<Grid item xs={12} sx={{ margin: '8px auto' }}>
								<Button
									type='submit'
									sx={{
										fontFamily: 'Bree',
										fontWeight: '600',
										textTransform: 'capitalize',
										color: 'var(--purple)',
										border: '2px solid var(--purple)',
										backgroundColor: 'transparent',
										width: '250px',
										'&:hover': {
											backgroundColor: 'var(--purple)',
											color: '#fff',
										},
									}}
								>
									Submit
								</Button>
							</Grid>
							{consoleError && (
								<Grid container justifyContent='center'>
									<pre style={{ color: 'red' }}>{consoleError.message}</pre>
								</Grid>
							)}
						</Grid>
					</Form>
				</Formik>
			</Grid>
		</>
	);
};

Login.propTypes = {};

export default Login;
