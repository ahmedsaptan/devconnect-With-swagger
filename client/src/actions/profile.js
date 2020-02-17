import axios from 'axios';
import {CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE} from './types';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispatch => {
	try {
		const res = await axios.get('/api/profile/me');

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (e) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: e.response.statusText, status: e.response.status }
		});
	}
};

export const createProfile = (
	formData,
	history,
	edit = false
) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const res = await axios.post('/api/profile', formData, config);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
		dispatch(setAlert(edit ? 'Profile Update' : 'Profile created'), 'success');

		if (!edit) {
			history.push('/dashboard');
		}
	} catch (e) {
		const errors = e.response.data.erros;
		if (errors) {
			errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: e.response.statusText, status: e.response.status }
		});
	}
};

export const addExperience = (formData, history) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};

		const res = await axios.put('/api/profile/experience', formData, config);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});

		dispatch(setAlert('Add Experience', 'success'));

		history.push('/dashboard');
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status
			}
		});
	}
};

export const addEducation = (formData, history) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};

		const res = await axios.put('/api/profile/education', formData, config);
		console.log(res);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});

		dispatch(setAlert('Add Education', 'success'));

		history.push('/dashboard');
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status
			}
		});
	}
};


export const deleteExperience = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});

		dispatch(setAlert('Experience Removed!', 'success'))
	} catch (e) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: e.response.statusText,
				status: e.response.status
			}
		});
	}
};


export const deleteEducation = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});

		dispatch(setAlert('Education Removed!', 'success'))
	} catch (e) {
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: e.response.statusText,
				status: e.response.status
			}
		});
	}
};


export const deleteAccount= () => async dispatch => {
	if(window.confirm('Are you sure ? can\'t be undone')) {
		try {
			const res = await axios.delete(`/api/profile`);

			dispatch({ type: CLEAR_PROFILE });
			dispatch({ type: DELETE_ACCOUNT });

			dispatch(setAlert('Profile Removed!', 'success'))
		} catch (e) {
			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: e.response.statusText,
					status: e.response.status
				}
			});
		}
	}

};