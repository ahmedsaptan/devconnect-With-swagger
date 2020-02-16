import React, { Fragment, useState } from 'react';
import {Link, Redirect} from "react-router-dom";
import {connect } from "react-redux";
import PropTypes from "prop-types";
import {login} from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		console.log(formData);
		login(email, password);
	};

	if(isAuthenticated) {
		return <Redirect to="/dashboard"/>
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Log In</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> login in Your Account
			</p>
			<form className='form' onSubmit={e => onSubmit(e)}>
				<div className='form-group'>
					<input
						type='email'
						onChange={e => onChange(e)}
						placeholder='Email Address'
						name='email'
						required
						value={email}
					/>

				</div>
				<div className='form-group'>
					<input
						type='password'
						onChange={e => onChange(e)}
						placeholder='Password'
						name='password'
						value={password}
						required
						minLength='6'
					/>
				</div>

				<input type='submit' className='btn btn-primary' value='Login' />
			</form>
			<p className='my-1'>
				You don't have an account? <Link to='/register'>Register</Link>
			</p>
		</Fragment>
	);
};


Login.prototype = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.isAuthenticated
	}
};
export default connect(mapStateToProps,{login})(Login);
