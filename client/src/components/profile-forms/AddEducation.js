import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
	const [formData, setFormData] = useState({
		school: '',
		degree: '',
		fieldofstudy: '',
		from: '',
		to: '',
		current: false,
		description: ''
	});

	const [toDataDisabled, toggleDisabled] = useState(false);

	const {
		school,
		degree,
		fieldofstudy,
		from,
		to,
		current,
		description
	} = formData;
	const onChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const onSubmit = e => {
		console.log('Submit..');
		e.preventDefault();
		addEducation(formData, history);
	};

	return (
		<Fragment>
			<h1 className='large text-primary'>Add Your Education</h1>
			<p className='lead'>
				<i className='fas fa-graduation-cap'></i> Add any school, bootcamp, etc
				that you have attended
			</p>
			<small>* = required field</small>
			<form className='form' onSubmit={e => onSubmit(e)}>
				<div className='form-group'>
					<input
						type='text'
						value={school}
						onChange={e => onChange(e)}
						placeholder='* School or Bootcamp'
						name='school'
						required
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						value={degree}
						onChange={e => onChange(e)}
						placeholder='* Degree or Certificate'
						name='degree'
						required
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						value={fieldofstudy}
						onChange={e => onChange(e)}
						placeholder='Field Of Study'
						name='fieldofstudy'
					/>
				</div>
				<div className='form-group'>
					<h4>From Date</h4>
					<input
						type='date'
						value={from}
						onChange={e => onChange(e)}
						name='from'
					/>
				</div>
				<div className='form-group'>
					<p>
						<input
							type='checkbox'
							checked={current}
							onChange={e => {
								setFormData({ ...formData, current: !current });
								toggleDisabled(!toDataDisabled);
							}}
							name='current'
							value=''
						/>{' '}
						Current School or Bootcamp
					</p>
				</div>
				<div className='form-group'>
					<h4>To Date</h4>
					<input
						type='date'
						disabled={toDataDisabled ? 'disabled' : ''}
						value={to}
						onChange={e => onChange(e)}
						name='to'
					/>
				</div>
				<div className='form-group'>
					<textarea
						name='description'
						value={description}
						onChange={e => onChange(e)}
						cols='30'
						rows='5'
						placeholder='Program Description'></textarea>
				</div>
				<input type='submit' className='btn btn-primary my-1' />
				<Link className='btn btn-light my-1' to='/dashboard'>
					Go Back
				</Link>
			</form>
		</Fragment>
	);
};

AddEducation.propTypes = {
	addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(withRouter(AddEducation));
