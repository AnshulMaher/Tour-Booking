/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `http://localhost:5000/api/v1/users/updatePassword`
        : `http://localhost:5000/api/v1/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.toUpperCase()} updated successfully! Reload to see changes`
      );
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
