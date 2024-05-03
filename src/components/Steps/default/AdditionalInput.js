import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import StepButtons from '../../common/StepButtons';
import { UserContext } from '../../../context/UserContext';

/** services */
import { submitAdditionalInfo } from '../../../service/api';
import { mobileNumberPattern } from '../../../constants/fields';

const stateOptions = [
  { label: 'Select State', value: '' },
  { label: 'Australian Capital Territory', value: 'ACT' },
  { label: 'New South Wales', value: 'NSW' },
  { label: 'Northern Territory', value: 'NT' },
  { label: 'Queensland', value: 'QLD' },
  { label: 'South Australia', value: 'SA' },
  { label: 'Tasmania', value: 'TAS' },
  { label: 'Victoria', value: 'VIC' },
  { label: 'Western Australia', value: 'WA' },
];

const genderOptions = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Unknown', value: 'U' },
];

const AdditionalInput = ({ handleGotoPrev, validateEmail, validateMaskInput, renderLabel }) => {
  const { error, companyData, formData, updateContext } = useContext(UserContext);
  const history = useHistory();
  const [data, setData] = useState({
    FamilyName: formData.firstName,
    GivenName: formData.lastName,
    StreetNumber: '',
    StreetName: '',
    Suburb: '',
    State: '',
    Postcode: '',
    DriversLicence: '',
    GenderCode: 'U',
    DateOfBirth: '',
  });
  const [dataError, setDataError] = useState({});

  const fields = [
    { name: 'FamilyName', label: 'First Name', type: 'text', required: true },
    { name: 'GivenName', label: 'Surname', type: 'text', required: true },
    { name: 'StreetNumber', label: 'Street No', type: 'text', required: true },
    { name: 'StreetName', label: 'Street', type: 'text', required: true },
    { name: 'Suburb', label: 'Suburb', type: 'text', required: true },
    { name: 'State', label: 'State', type: 'select', required: true, options: stateOptions },
    { name: 'Postcode', label: 'Postcode', type: 'text', required: true },
    { name: 'DriversLicence', label: 'Drivers Licence', type: 'text' },
    { name: 'GenderCode', label: 'Gender', type: 'select', options: genderOptions },
    { name: 'DateOfBirth', label: 'Date of Birth', type: 'date' },
  ];

  // Checks form field input validation
  const validateInput = (value, name) => {
    const field = fields.find((f) => f.name == name);
    if (field.required && !value) {
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
      validateInput(e.target.value, e.target.name);
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

    updateContext({ loading: true, error: '' });

    try {
      const res = await submitAdditionalInfo({
        ...data,
      });
      if (res) {
        console.log('AdditionalInput: companyData', companyData);

        updateContext({
          token: res.data.Token,
          content: res.data.Content,
          directors: [{ ...formData, ...data }],
          formPath: 'default',
          activeIndexPage: 3,
          loading: false,
        });
      } else {
        updateContext({ loading: false });
      }
    } catch (error) {
      console.log(error);
      if (error.response.data && error.response.data.error) {
        updateContext({ loading: false, error: error.response.data.error });
        history.push('/empty-error');
      }
    }
  };

  return (
    <>
      <div className={'col-2-list first-step-container'}>
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <div key={field.name} className={`form-group ${dataError[field.name] ? 'error' : ''}`}>
                <div className="form-field">
                  {renderLabel(field, false)}
                  <select
                    id={field.name}
                    value={data[field.name]}
                    name={field.name}
                    autoComplete="off"
                    onChange={(e) => handleChange(e)}
                    className={dataError[field.name] ? 'error' : ''}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {dataError[field.name] && <p className="error-text">{dataError[field.name]}</p>}
              </div>
            );
          }

          if (field.type === 'date') {
            return (
              <div key={field.name} className={`form-group ${dataError[field.name] ? 'error' : ''}`}>
                <div className="form-field">
                  {renderLabel(field, false)}
                  <input
                    id={field.name}
                    value={data[field.name]}
                    name={field.name}
                    type="date"
                    autoComplete="off"
                    onChange={(e) => handleChange(e)}
                    placeholder="YYYY-MM-DD"
                    className={dataError[field.name] ? 'error' : ''}
                  />
                </div>
                {dataError[field.name] && <p className="error-text">{dataError[field.name]}</p>}
              </div>
            );
          }

          return (
            <div key={field.name} className={`form-group ${dataError[field.name] ? 'error' : ''}`}>
              <div className="form-field">
                {renderLabel(field, false)}
                <input
                  id={field.name}
                  value={data[field.name]}
                  name={field.name}
                  autoComplete="off"
                  onChange={(e) => handleChange(e)}
                  className={dataError[field.name] ? 'error' : ''}
                />
              </div>
              {dataError[field.name] && <p className="error-text">{dataError[field.name]}</p>}
            </div>
          );
        })}
        {error && <p className="error-text">{error}</p>}
        <StepButtons handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} />
      </div>
    </>
  );
};

export default AdditionalInput;
