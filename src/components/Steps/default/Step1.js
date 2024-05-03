import React, { useState, useContext } from 'react';
import InputMask from 'react-input-mask';

import StepButtons from '../../common/StepButtons';
import { UserContext } from '../../../context/UserContext';

/** services */
import { submitVerification } from '../../../service/api';
import { mobileNumberPattern } from '../../../constants/fields';

const Step1 = ({ handleGotoPrev, handleGotoNext, validateEmail, validateMaskInput, renderLabel }) => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    emailAddress: '',
    mobileNumber: '',
    agree: false,
  });
  const [dataError, setDataError] = useState({});
  const { error, updateContext } = useContext(UserContext);

  // Checks form field input validation
  const validateInput = (value, name) => {
    if (!value) {
      setDataError((dataError) => ({
        ...dataError,
        [name]: 'This is a required field',
        agree: 'You need to accept and agree to the Privacy and Consent Statement and Terms of Service',
      }));
      return false;
    }
    if (name === 'mobileNumber') {
      const maskInputValid = validateMaskInput(value, mobileNumberPattern);
      if (!maskInputValid) {
        setDataError((dataError) => ({
          ...dataError,
          [name]: 'Format is incorrect',
        }));
        return false;
      }
      setDataError((dataError) => ({ ...dataError, [name]: '' }));
      return true;
    }
    if (name === 'emailAddress') {
      const emailValid = validateEmail(value);
      if (!emailValid) {
        setDataError((dataError) => ({
          ...dataError,
          [name]: 'Invalid email address',
        }));
        return false;
      }
      setDataError((dataError) => ({ ...dataError, [name]: '' }));
      return true;
    }
    setDataError((dataError) => ({ ...dataError, [name]: '' }));
    return true;
  };

  // Handler for form field change
  const handleChange = (e) => {
    if (e.target.name === 'agree') {
      validateInput(e.target.checked, 'agree');
      setData({ ...data, agree: e.target.checked });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleContinue = async () => {
    const fields = Object.keys(data);

    const isInValid = fields.some((field) => {
      return !validateInput(data[field], field);
    });

    if (isInValid) {
      return false;
    }

    updateContext({ loading: true, error: '', formData: data, mobileNumber: data.mobileNumber });

    try {
      const res = await submitVerification({
        mobile: data.mobileNumber,
      });
      if (res && res.data) {
        updateContext({ token: res.data.Token });
      }

      handleGotoNext();
    } catch (e) {
      if (e.response.data && e.response.data.error) {
        updateContext({ error: e.response.data.error });
      }
    }

    updateContext({ loading: false });
  };

  return (
    <>
      <div className={'col-2-list first-step-container'}>
        <div className={`form-group ${dataError['firstName'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'First Name' })}
            <input
              id={'firstName'}
              value={data['firstName']}
              name={'firstName'}
              autoComplete="off"
              onBlur={() => validateInput(data['firstName'], 'firstName')}
              onChange={(e) => handleChange(e)}
              className={dataError['firstName'] ? 'error' : ''}
            />
          </div>
          {dataError['firstName'] && <p className="error-text">{dataError['firstName']}</p>}
        </div>
        <div className={`form-group ${dataError['lastName'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Surname' })}
            <input
              id={'lastName'}
              value={data['lastName']}
              name={'lastName'}
              autoComplete="off"
              onBlur={() => validateInput(data['lastName'], 'lastName')}
              onChange={(e) => handleChange(e)}
              className={dataError['lastName'] ? 'error' : ''}
            />
          </div>
          {dataError['lastName'] && <p className="error-text">{dataError['lastName']}</p>}
        </div>
        <div className={`form-group ${dataError['companyName'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Business Name' })}
            <input
              id={'companyName'}
              value={data['companyName']}
              name={'companyName'}
              autoComplete="off"
              onBlur={() => validateInput(data['companyName'], 'companyName')}
              onChange={(e) => handleChange(e)}
              className={dataError['companyName'] ? 'error' : ''}
            />
          </div>
          {dataError['companyName'] && <p className="error-text">{dataError['companyName']}</p>}
        </div>
        <div className={`form-group ${dataError['emailAddress'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Email' })}
            <input
              id={'emailAddress'}
              value={data['emailAddress']}
              name={'emailAddress'}
              autoComplete="off"
              onBlur={() => validateInput(data['emailAddress'], 'emailAddress')}
              onChange={(e) => handleChange(e)}
              className={dataError['emailAddress'] ? 'error' : ''}
            />
          </div>
          {dataError['emailAddress'] && <p className="error-text">{dataError['emailAddress']}</p>}
        </div>
        <div className={`form-group ${dataError['mobileNumber'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Mobile' })}
            <InputMask
              id={'mobileNumber'}
              name={'mobileNumber'}
              mask={'+99-999-999-999'}
              autoComplete="off"
              value={data['mobileNumber'] ? data['mobileNumber'] : '+61'}
              onChange={(e) => handleChange(e)}
              onBlur={() => validateInput(data['mobileNumber'], 'mobileNumber')}
              placeholder={''}
            />
          </div>
          {dataError['mobileNumber'] && <p className="error-text">{dataError['mobileNumber']}</p>}
        </div>
        <div className="form-field">
          <div className="form-field formCustomCheckBox formCustomCheckBox-large mb0">
            <input
              id={'agree'}
              defaultValue={data['agree']}
              name={'agree'}
              type={'checkbox'}
              onChange={(e) => handleChange(e)}
              className={dataError['agree'] ? 'error' : ''}
            />
            <label>
              I accept and agree to the{' '}
              <a href="https://unlockb2b.com/privacy-policy/" target="_blank" rel="noreferrer">
                Privacy and Consent Statement
              </a>{' '}
              and{' '}
              <a
                href="https://unlockb2b.com/wp-content/uploads/2021/09/UnLock-Terms-of-Service-v.4-21-09-21.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Service
              </a>
              .
            </label>
          </div>
        </div>
        {dataError['agree'] && <p className="error-text">{dataError['agree']}</p>}
        {error && <p dangerouslySetInnerHTML={{ __html: error }} className="error-text"></p>}
        <StepButtons isNextDisabled={!data.agree} handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} />
      </div>
    </>
  );
};

export default Step1;
