import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import InputMask from 'react-input-mask';

import { UserContext } from '../../../context/UserContext';
import StepButtons from '../../common/StepButtons';

/** services */
import { postCompletion } from '../../../service/api';
import { mobileNumberPattern } from '../../../constants/fields';

const UnlockMasterCard = ({ handleGotoPrev, handleGotoNext, validateMaskInput, validateEmail }) => {
  const history = useHistory();
  const { width, hasAdditionalStep, formData, directors, updateContext } = useContext(UserContext);
  const [pageError, setPageError] = useState('');
  const [ids, setIds] = useState(directors.map((d, i) => i));
  const [data, setData] = useState(
    directors && directors.length
      ? new Array(directors.length).fill({
          mobile: hasAdditionalStep ? formData.mobileNumber : '',
          email: hasAdditionalStep ? formData.emailAddress : '',
        })
      : []
  );
  const [payment_terms, setPaymentTerms] = useState('');
  // const [extraOption, setExtraOption] = useState(false);
  // const paymentTermsOptions = ['30 days', '60 days'];

  const [dataError, setDataError] = useState(
    new Array(directors.length).fill({
      mobile: '',
      email: '',
    })
  );

  const handleContinue = async () => {
    updateContext({ error: '' });

    setDataError(
      new Array(directors.length).fill({
        mobile: '',
        email: '',
      })
    );

    const directorsData = data
      .map((d, i) => {
        return { ...d, director_index: i };
      })
      .filter((d, i) => {
        return ids.includes(i);
      });

    if (ids.length) {
      let isInValid = true;
      directorsData.map((director) => {
        const valid1 = validateInput(director['mobile'], 'mobile', director.director_index);
        const valid2 = validateInput(director['email'], 'email', director.director_index);
        if (!valid1 || !valid2) isInValid = false;
      });

      if (!isInValid) {
        setPageError('You need to select directors and fill in the values');
        return;
      }

      // if (!payment_terms) {
      //   setPageError('You need to select one payment terms.');
      //   return;
      // }
    }

    updateContext({ loading: true });
    try {
      console.log(directorsData);
      const params = /* !extraOption
        ? */ {
        directors: directorsData.map((director) => {
          return {
            ...director,
            mobile: director.mobile.replaceAll('-', ''),
          };
        }),
        payment_terms,
      };
      // : {};
      // const res = await bankStatement(params);
      const res = await postCompletion(params);
      if (res && res.data) {
        updateContext({ token: res.data.Token, content: res.data.Content });
      }
      updateContext({ loading: false });
      history.push('/success');
      handleGotoNext();
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
        history.push('/error');
      }
    }

    updateContext({ loading: false });
  };

  // Checks form field input validation
  const validateInput = (value, name, index) => {
    if (!value || value == '') {
      setDataError((dataError) =>
        dataError.map((de, i) => {
          return i == index
            ? {
                ...de,
                [name]: 'This is a required field',
              }
            : de;
        })
      );

      return false;
    }
    if (name === 'mobile') {
      const maskInputValid = validateMaskInput(value, mobileNumberPattern);
      if (!maskInputValid) {
        setDataError((dataError) =>
          dataError.map((de, i) => {
            return i == index
              ? {
                  ...de,
                  [name]: 'Format is incorrect',
                }
              : de;
          })
        );
        return false;
      }
      setDataError((dataError) =>
        dataError.map((de, i) => {
          return i == index
            ? {
                ...de,
                [name]: '',
              }
            : de;
        })
      );
      setPageError('');
      return true;
    }
    if (name === 'email') {
      const emailValid = validateEmail(value);
      if (!emailValid) {
        setDataError((dataError) =>
          dataError.map((de, i) => {
            return i == index
              ? {
                  ...de,
                  [name]: 'Invalid email address',
                }
              : de;
          })
        );
        return false;
      }
      setDataError((dataError) =>
        dataError.map((de, i) => {
          return i == index
            ? {
                ...de,
                [name]: '',
              }
            : de;
        })
      );
      setPageError('');
      return true;
    }
    setDataError((dataError) =>
      dataError.map((de, i) => {
        return i == index
          ? {
              ...de,
              [name]: '',
            }
          : de;
      })
    );
    setPageError('');
    return true;
  };

  // Handler for form field change
  const handleChange = (e, index) => {
    setData(
      data.map((d, i) => {
        return i == index
          ? {
              ...d,
              [e.target.name]: e.target.value,
            }
          : d;
      })
    );
  };

  const handleChangeOption = (e) => {
    setPaymentTerms(e.target.value);
  };
  /*
  const handleChangeExtraOption = (e) => {
    if (e.target.checked) {
      setPaymentTerms('');
      setIds([]);
    }
    setExtraOption(e.target.checked);
  };
*/
  const handleSelectDirectors = (e) => {
    setPageError('');
    if (!ids.includes(Number(e.target.value))) {
      // setExtraOption(false);
      setIds([...ids, Number(e.target.value)]);
    } else {
      setIds(ids.filter((id) => id !== Number(e.target.value)));
      if (ids.length > 0) {
        setPageError('');
      }

      setDataError(
        dataError.map((d, i) => {
          return i == e.target.value
            ? {
                mobile: '',
                email: '',
              }
            : d;
        })
      );
      setData(
        data.map((d, i) => {
          return i == e.target.value
            ? {
                mobile: '',
                email: '',
              }
            : d;
        })
      );
    }
  };

  return (
    <div className="custom-steps select-director">
      <div className="search-results">
        {directors.map((row, index) => {
          return (
            <div key={index} className="company-info unlock-card">
              {width >= 768 && (
                <>
                  <div>
                    <input
                      id={index}
                      name={'selectedDirector'}
                      type="checkbox"
                      value={index}
                      disabled={hasAdditionalStep}
                      checked={ids.includes(index)}
                      onChange={handleSelectDirectors}
                    />
                  </div>
                  <div className="row-name-browser-view" style={{ padding: '10px 0' }}>
                    <span className="name">{row.Name}</span>
                    <div className="desktop-inputs">
                      <div>
                        <InputMask
                          name={'mobile'}
                          mask={'+99-999-999-999'}
                          disabled={!ids.includes(index) || hasAdditionalStep}
                          value={data[index]['mobile'] ? data[index]['mobile'] : '+61'}
                          onChange={(e) => handleChange(e, index)}
                          onBlur={(e) => validateInput(data[index]['mobile'], 'mobile', index)}
                          placeholder={'Mobile No'}
                          className="phone-input"
                        />
                        {dataError[index]['mobile'] && <p className="error-text">{dataError[index]['mobile']}</p>}
                      </div>
                      <div>
                        <input
                          value={data[index]['email']}
                          name={'email'}
                          autoComplete="off"
                          disabled={!ids.includes(index) || hasAdditionalStep}
                          onChange={(e) => handleChange(e, index)}
                          onBlur={(e) => validateInput(data[index]['email'], 'email', index)}
                          className="email-input"
                          placeholder="Email"
                        />
                        {dataError[index]['email'] && <p className="error-text">{dataError[index]['email']}</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {width < 768 && (
                <>
                  <div className="director-name-block">
                    <input
                      id={index}
                      name={'selectedDirector'}
                      type="checkbox"
                      className="director-checkbox"
                      value={index}
                      disabled={hasAdditionalStep}
                      checked={ids.includes(index)}
                      onChange={handleSelectDirectors}
                    />
                    <div className="name">
                      {row.Name}
                      <>
                        <InputMask
                          name={'mobile'}
                          mask={'+99-999-999-999'}
                          disabled={!ids.includes(index) || hasAdditionalStep}
                          value={data[index]['mobile'] ? data[index]['mobile'] : '+61'}
                          onChange={(e) => handleChange(e, index)}
                          onBlur={(e) => validateInput(data[index]['mobile'], 'mobile', index)}
                          placeholder={'Mobile No'}
                          className="phone-input"
                        />
                        {dataError[index]['mobile'] && <p className="error-text">{dataError[index]['mobile']}</p>}
                      </>
                      <>
                        <input
                          value={data[index]['email']}
                          name={'email'}
                          autoComplete="off"
                          disabled={!ids.includes(index) || hasAdditionalStep}
                          onChange={(e) => handleChange(e, index)}
                          onBlur={(e) => validateInput(data[index]['email'], 'email', index)}
                          className="email-input"
                          placeholder="Email"
                        />
                        {dataError[index]['email'] && <p className="error-text">{dataError[index]['email']}</p>}
                      </>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {/*<h3 className="text" dangerouslySetInnerHTML={{ __html: content }}></h3>*/}
        {/*

        {paymentTermsOptions.map((option, index) => {
          return (
            <div key={'option' + index} className="company-info">
              <span className="name">{option}</span>
              <input
                id={'option' + index}
                name={'payment_terms'}
                disabled={ids.length === 0}
                type="radio"
                value={option}
                checked={option === payment_terms}
                onChange={handleChangeOption}
              />
            </div>
          );
        })}

*/}
        {/*  */}
        {/*<div className="company-info">*/}
        {/*  <span className="name">I don't want to receive an UnLock Mastercard at this stage</span>*/}
        {/*  <input*/}
        {/*    id={'extra-option'}*/}
        {/*    name={'extraOption'}*/}
        {/*    type="checkbox"*/}
        {/*    checked={extraOption}*/}
        {/*    onChange={handleChangeExtraOption}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*  */}
        <div className="unlock-card-info">
          <span>You can also add more card holders through the UnLock Portal.</span>
        </div>
      </div>
      {pageError && <p className="error-section">{pageError}</p>}
      <StepButtons
        handleGotoPrev={handleGotoPrev}
        handleGotoNext={handleContinue}
        // isNextDisabled={!extraOption && ids.length === 0}
        isNextDisabled={ids.length === 0}
      />
    </div>
  );
};

export default UnlockMasterCard;
