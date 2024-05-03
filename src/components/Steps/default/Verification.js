import React, { useState, useContext } from 'react';
import InputMask from 'react-input-mask';

import { UserContext } from '../../../context/UserContext';

/** services */
import { submitDetails, submitVerification } from '../../../service/api';
import { mobileNumberPattern } from '../../../constants/fields';

const Verification = ({ handleGotoNext, validateMaskInput, renderLabel }) => {
  const { error, mobileNumber, formData, updateContext } = useContext(UserContext);
  const [data, setData] = useState({
    code: '',
    mobileNumber: mobileNumber,
  });

  console.log(formData);
  // const [isMobileDisabled, setIsMobileDisabled] = useState(true);
  const [dataError, setDataError] = useState({});

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
    setDataError((dataError) => ({ ...dataError, [name]: '' }));
    return true;
  };

  // Handler for form field change
  const handleChange = (e) => {
    validateInput(e.target.value, e.target.name);
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    const fields = Object.keys(data);

    const isInValid = fields.some((field) => {
      return !validateInput(data[field], field);
    });

    console.log(fields, data, isInValid);
    if (isInValid) {
      return false;
    }

    updateContext({ loading: true, error: '' });

    try {
      const res = await submitDetails({
        company_name: formData.companyName,
        email: formData.emailAddress,
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile: data.mobileNumber.replaceAll('-', ''),
        agree: formData.agree,
        verification_code: data.code,
      });

      if (res && res.data) {
        updateContext({ token: res.data.Token, content: res.data.Content });
      }
      handleGotoNext();
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
      }
    }
    updateContext({ loading: false });
  };

  const handleResendCode = async () => {
    updateContext({ loading: true, error: '', mobileNumber: data.mobileNumber });

    const res = await submitVerification({
      mobile: data.mobileNumber,
    });
    if (res && res.data) {
      updateContext({ token: res.data.Token });
    }
    updateContext({ loading: false });
  };

  const handleAmendMobileNo = async () => {
    // setIsMobileDisabled(false);
    const fields = ['mobileNumber'];

    const isInValid = fields.some((field) => {
      return !validateInput(data[field], field);
    });

    if (isInValid) {
      return false;
    }

    updateContext({ loading: true, error: '', mobileNumber: data.mobileNumber });

    const res = await submitVerification({
      mobile: data.mobileNumber,
    });
    if (res && res.data) {
      updateContext({ token: res.data.Token });
    }
    // updateContext({ activeIndexPage: 1, error: '' }); //go to { title: 'ID verification code', step: Verification }
    // we stay on the same page/step
    window.scrollTo(0, 0);

    updateContext({ loading: false });
  };

  return (
    <>
      <div className={'col-2-list verification-container'}>
        <div className={`form-group`}>
          <div className="form-field">
            A message with the verification code has been sent to your mobile number. Enter the code to continue.
          </div>
        </div>
        <div className={`form-group ${dataError['lastName'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Enter validation code' })}
            <input
              id={'code'}
              value={data['code']}
              name={'code'}
              autoComplete="off"
              onChange={(e) => handleChange(e)}
              className={dataError['code'] ? 'error' : ''}
            />
          </div>
          {dataError['code'] && <p className="error-text">{dataError['code']}</p>}
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className={'validation-btns form-group d-flex w-100'}>
          <button onClick={handleConfirm} className="primary-btn">
            Confirm
          </button>
          <button onClick={handleResendCode} className="primary-btn dark">
            Resend Code
          </button>
        </div>
        <div className={`form-group ${dataError['mobileNumber'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Mobile' })}
            <InputMask
              id={'mobileNumber'}
              name={'mobileNumber'}
              mask={'+99-999-999-999'}
              autoComplete="off"
              // disabled={isMobileDisabled}
              value={data['mobileNumber'] ? data['mobileNumber'] : '+61'}
              onChange={(e) => handleChange(e)}
              onBlur={() => validateInput(data['mobileNumber'], 'mobileNumber')}
              placeholder={''}
            />
          </div>
          {dataError['mobileNumber'] && <p className="error-text">{dataError['mobileNumber']}</p>}
        </div>
        <div className={'d-flex bottom-actions align-center'}>
          <button onClick={handleAmendMobileNo} className="primary-btn dark w-100">
            Amend Mobile No.
          </button>
        </div>
      </div>
    </>
  );
};

export default Verification;
