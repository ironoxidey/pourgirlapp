import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Dialog, DialogContent } from '@mui/material';
import LocalBarTwoToneIcon from '@mui/icons-material/LocalBarTwoTone';
import CocktailEditForm from './CocktailEditForm';

const AddEditCocktails = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const dialogHandleClose = () => {
		setDialogOpen(false);
	};
	return (
		<>
			<Dialog
				className='addEditCocktail'
				open={dialogOpen}
				onClose={dialogHandleClose}
				// aria-labelledby="alert-dialog-title"
				// aria-describedby="alert-dialog-description"
				scroll='body'
				fullWidth
				maxWidth='md'
			>
				<DialogContent>
					<CocktailEditForm dialogHandleClose={() => setDialogOpen(false)} />
				</DialogContent>
			</Dialog>
			<IconButton onClick={() => setDialogOpen(true)}>
				<LocalBarTwoToneIcon
					sx={{
						fontSize: '1.2rem',
						cursor: 'pointer',
						color: '#fff',
						verticalAlign: 'middle',
					}}
				/>
			</IconButton>
		</>
	);
};

AddEditCocktails.propTypes = {};

export default AddEditCocktails;
