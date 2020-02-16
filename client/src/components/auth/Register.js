import React, { Fragment, useState } from 'react';
import {Link, Redirect } from "react-router-dom";
import {connect} from "react-redux";
import {setAlert} from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: ''
	});

	const { name, email, password, password2 } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		if (password !== password2) {
			setAlert("Password don't match", "danger");
		} else {
			console.log('Password match');
			register({name, email, password })
		}
	};

	if(isAuthenticated) {
		return <Redirect to="/dashboard"/>
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Sign Up</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Create Your Account
			</p>
			<form className='form' onSubmit={e => onSubmit(e)}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Name'
						name='name'
						onChange={e => onChange(e)}
						value={name}
					/>
				</div>
				<div className='form-group'>
					<input
						type='email'
						onChange={e => onChange(e)}
						placeholder='Email Address'
						name='email'

						value={email}
					/>
					<small className='form-text'>
						This site uses Gravatar so if you want a profile image, use a
						Gravatar email
					</small>
				</div>
				<div className='form-group'>
					<input
						type='password'
						onChange={e => onChange(e)}
						placeholder='Password'
						name='password'
						value={password}

					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						onChange={e => onChange(e)}
						placeholder='Confirm Password'
						name='password2'

						value={password2}
					/>
				</div>
				<input type='submit' className='btn btn-primary' value='Register' />
			</form>
			<p className='my-1'>
				Already have an account? <Link to='/login'>Sign In</Link>
			</p>
		</Fragment>
	);
};

Register.prototype = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.isAuthenticated
	}
};

export default  connect(mapStateToProps, {
	setAlert,
	register
})(Register);
