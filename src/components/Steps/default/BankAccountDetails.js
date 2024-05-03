import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';

import StepButtons from '../../common/StepButtons';

/** services */
import { unlockCard } from '../../../service/api';

const BankAccountDetails = ({ handleGotoPrev, handleGotoNext, validateEmail, renderLabel }) => {
  const history = useHistory();
  const { content, formData, hasAdditionalStep, error, updateContext } = useContext(UserContext);
  const [data, setData] = useState({
    name: '',
    email: hasAdditionalStep ? formData.emailAddress : '',
    bsb: '',
    account_number: '',
    agree: false,
  });
  const [dataError, setDataError] = useState({});

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
      const res = await unlockCard({ ...data });

      if (res && res.data) {
        updateContext({ token: res.data.Token, directors: res.data.Directors, content: res.data.Content });
      }
      handleGotoNext();
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error, directors: [] });
        history.push('/error');
      }
    }
    updateContext({ loading: false });
  };

  // Checks form field input validation
  const validateInput = (value, name) => {
    if (name === 'bsb') {
      const re = /^[0-9\b]+$/;
      if (value === '' || re.test(value)) {
        if(value.length != 6) {
          setDataError((dataError) => ({
            ...dataError,
            bsb: 'BSB must be exactly 6 digits',
          }));
          return false;
        }
        setDataError((dataError) => ({
          ...dataError,
          bsb: '',
        }));
        return true;
      }
      setDataError((dataError) => ({
        ...dataError,
        bsb: 'BSB is invalid',
      }));
      return false;
    }
    if (name === 'account_number') {
      const re = /^[0-9\b]+$/;
      if (value === '' || re.test(value)) {
        if(value.length < 6 || value.length > 10) {
          setDataError((dataError) => ({
            ...dataError,
            account_number: 'Account number should have 6-10 digits',
          }));
          return false;
        }
        setDataError((dataError) => ({
          ...dataError,
          account_number: '',
        }));
        return true;
      }
      setDataError((dataError) => ({
        ...dataError,
        account_number: 'Only numbers are allowed',
      }));
      return false;
    }
    if (name === 'agree' && value == false) {
      setDataError((dataError) => ({
        ...dataError,
        agree: 'You need to agree to the DDRSA and DDR',
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
    if (name === 'email') {
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
    if (e.target.name != 'email') {
      validateInput(e.target.value, e.target.name);
    }
    if (e.target.name === 'agree') {
      setData({ ...data, [e.target.name]: e.target.checked });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <div className={'col-2-list all-payments-unlock-block'}>
        {/* <h3 className="text">
          All payments for your UnLock Account must be made by Direct Debit. UnLock uses the services of{' '}
          <a href="https://www.zepto.com.au/" target="_blank" rel="noreferrer">
            Zepto
          </a>{' '}
          to process these payments. Please follow the prompts here to set up your bank account to process Direct Debits
          and Direct Credits from{' '}
          <a href="https://www.zepto.com.au/" target="_blank" rel="noreferrer">
            Zepto
          </a>
          .
        </h3> */}
        <div className={`form-group ${dataError['name'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Bank Account Name' })}
            <input
              id={'name'}
              value={data['name']}
              name={'name'}
              autoComplete="off"
              onChange={(e) => handleChange(e)}
              className={dataError['name'] ? 'error' : ''}
            />
          </div>
          {dataError['name'] && <p className="error-text">{dataError['name']}</p>}
        </div>
        <div className={`form-group ${dataError['email'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Email' })}
            <input
              id={'email'}
              value={data['email']}
              name={'email'}
              autoComplete="off"
              onBlur={() => validateInput(data['email'], 'email')}
              onChange={(e) => handleChange(e)}
              className={dataError['email'] ? 'error' : ''}
            />
          </div>
          {dataError['email'] && <p className="error-text">{dataError['email']}</p>}
        </div>
        <div className={`form-group ${dataError['bsb'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'BSB' })}
            <input
              id={'bsb'}
              type={'text'}
              maxLength={6}
              value={data['bsb']}
              name={'bsb'}
              autoComplete="off"
              onBlur={() => validateInput(data['bsb'], 'bsb')}
              onChange={(e) => handleChange(e)}
              className={dataError['bsb'] ? 'error' : ''}
            />
          </div>
          {dataError['bsb'] && <p className="error-text">{dataError['bsb']}</p>}
        </div>
        <div className={`form-group account-number-group ${dataError['account_number'] ? 'error' : ''}`}>
          <div className="form-field">
            {renderLabel({ label: 'Account No.' })}
            <input
              id={'account_number'}
              value={data['account_number']}
              maxLength={10}
              name={'account_number'}
              autoComplete="off"
              onBlur={() => validateInput(data['account_number'], 'account_number')}
              onChange={(e) => handleChange(e)}
              className={dataError['account_number'] ? 'error' : ''}
            />
          </div>
          {dataError['account_number'] && <p className="error-text">{dataError['account_number']}</p>}
        </div>
        <div className={`form-group confirm-checkbox-group`}>
          <div className="form-field">
            <div className="form-field formCustomCheckBox mb0">
              <input
                id={'agree'}
                defaultValue={data['agree']}
                name={'agree'}
                type={'checkbox'}
                onChange={(e) => handleChange(e)}
                className={dataError['agree'] ? 'error' : ''}
              />
              <div className="form-field-desc" dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          </div>
          {dataError['agree'] && <p className="error-text">{dataError['agree']}</p>}
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="custom-steps">
        <StepButtons handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} />
      </div>
    </>
  );
};

export default BankAccountDetails;
