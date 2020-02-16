import axios from "axios";
import {GET_PROFILE, PROFILE_ERROR} from "./types";
import {setAlert} from "./alert";



export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })

  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText , status: e.response.status}
    })
  }
};


export const createProfile = (formData, history, edit= false) => async dispatch =>{
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
    dispatch(setAlert(edit? 'Profile Update' : 'Profile created'), 'success');

    if(!edit) {
      history.push('/dashboard');
    }
  } catch (e) {

    const errors = e.response.data.erros;
    if(errors) {
      errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: e.response.statusText, status: e.response.status}
    });

  } 
};
