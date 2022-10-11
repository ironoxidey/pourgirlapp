import React from 'react';
import { AppBar, Typography, Grid, IconButton } from '@mui/material';
import { account } from '../appwrite/appwriteConfig';
import { useNavigate } from 'react-router-dom';
import AddEditCocktails from './AddEditCocktails';

const NavBar = () => {
	const navigate = useNavigate();
	const logout = async () => {
		try {
			await account.deleteSession('current');
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<AppBar
				className='navbar'
				position='sticky'
				sx={{
					borderBottom: '1px solid var(--primary-color)',
					backgroundImage: 'none',
					backgroundColor: 'var(--purple)',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'row',
				}}
			>
				<Grid item>
					<AddEditCocktails />
				</Grid>

				<Grid item>
					<Typography
						sx={{ fontSize: '.8rem', cursor: 'pointer', color: '#fff' }}
						onClick={() => logout()}
					>
						Logout
					</Typography>
				</Grid>
			</AppBar>
		</>
	);
};

export default NavBar;
