import React, { Fragment, useState } from 'react';
import {Link} from "react-router-dom";

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		console.log('Password match');
		console.log(formData);

	};

	const { email, password } = formData;
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

export default Login;
