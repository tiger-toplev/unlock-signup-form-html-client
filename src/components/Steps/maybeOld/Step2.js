import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import StepButtons from '../common/StepButtons';

/** services */
import { submitPrivacy } from '../../service/api';

const Step2 = ({ handleGotoPrev, handleGotoNext, renderLabel }) => {
  const history = useHistory();
  const [data, setData] = useState({
    agree: false,
  });
  const [dataError, setDataError] = useState({});
  const { content, error, updateContext } = useContext(UserContext);

  // Checks form field input validation
  const validateInput = (value, name) => {
    if (value == false) {
      setDataError((dataError) => ({
        ...dataError,
        agree: 'You need to agree to the Privacy Policy',
      }));
      return false;
    }

    if (!value) {
      setDataError((dataError) => ({
        ...dataError,
        [name]: 'This is a required field',
      }));
      return false;
    }
    setDataError((dataError) => ({ ...dataError, [name]: '' }));
    return true;
  };

  // Handler for form field change
  const handleChange = (e) => {
    if (e.target.name === 'agree') {
      setData({ ...data, [e.target.name]: e.target.checked });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleContinue = async () => {
    const fields = Object.keys(data);

    const result = fields.map((field) => {
      return validateInput(data[field], field);
    });

    const isInValid = result.filter((r) => !r).length > 0;

    if (isInValid) {
      return false;
    }

    updateContext({ loading: true, error: '' });

    try {
      const res = await submitPrivacy({
        agree: data.agree,
      });

      if (res && res.data) {
        updateContext({ token: res.data.Token, content: res.data.Content });
      }
      handleGotoNext();
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
        history.push('/error');
      }
    }
    updateContext({ loading: false });
  };

  return (
    <>
      <div className="col-2-list card">
        <div className={`form-group`}>
          <div className="form-field">
            <div className="form-field-desc" dangerouslySetInnerHTML={{ __html: content }}></div>
            <div className="form-field formCustomCheckBox">
              <input
                id={'agree'}
                defaultValue={data['agree']}
                name={'agree'}
                type={'checkbox'}
                onChange={(e) => handleChange(e)}
                className={dataError['agree'] ? 'error' : ''}
              />
              <label>
                I hereby agree and acknowledge that I have read, understood and agree to the terms set out within the
                Privacy Policy.
              </label>
            </div>
          </div>
        </div>
      </div>
      {dataError['agree'] && <p className="error-text">{dataError['agree']}</p>}
      {error && <p className="error-text">{error}</p>}
      <StepButtons handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} />
    </>
  );
};

export default Step2;
