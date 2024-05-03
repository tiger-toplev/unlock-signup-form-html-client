import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../../context/UserContext';

import StepButtons from '../../common/StepButtons';

/** services */
import { getDirectors, selectCompany, postAbandon } from '../../../service/api';

const CreditCheckFailed = ({ handleGotoPrev, handleGotoNext }) => {
  const history = useHistory();
  const { token, error, updateContext, companyData, renderPixel } = useContext(UserContext);
  const [checked, setChecked] = useState(true);

  // useEffect(() => {
  //   if (decodedToken?.dealId) {
  //     updateContext({ formPath: 'default', activeIndexPage: 0 });
  //   }
  // }, [decodedToken]);

  const decodedToken = token ? jwtDecode(token) : null;

  const handleContinue = async () => {
    updateContext({ loading: true, error: '' });
    try {
      const res = await getDirectors();

      if (res && res.data) {
        updateContext({ token: res.data.Token, directors: res.data.Directors ? res.data.Directors : [] });
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

  const handleSubmit = async (e) => {
    // setChecked(e.target.checked);
    const res = await selectCompany({
      ACN: companyData.ACN,
      VedaBusinessNameID: companyData.VedaBusinessNameID,
      FullJson: JSON.stringify(companyData),
    });

    if (res && res.data) {
      updateContext({ token: res.data.Token, content: res.data.Content });
    }
    postAbandon({ Options: checked ? ['Yes'] : ['No'] }).then();
    updateContext({ isReferred: checked });
    return history.push('/thankyou');
  };

  const renderPixelcodes = () => {
    return (
      <>
        <script
          language="JavaScript1.1"
          async
          src="//pixel.mathtag.com/event/js?mt_id=1611851&mt_adid=257068&mt_exem=&mt_excl=&v1=&v2=&v3=&s1=&s2=&s3="
        ></script>
        {/* <script language='JavaScript1.1' async src='//pixel.mathtag.com/event/js?mt_id=1611849&mt_adid=257068&mt_exem=&mt_excl=&v1=&v2=&v3=&s1=&s2=&s3='></script> */}
      </>
    );
  };

  if (companyData.FailMessage && companyData.FailMessage != 'Ind Search') {
    return (
      <div className="custom-steps check-failed">
        <h3 className="subtitle">We cannot identify your business. Please check you have:</h3>
        <ul className="home-list">
          <li>
            <span>A valid ACN or ABN</span>
          </li>
          <li>
            <span>Been in business and registered for GST for at least 12 months</span>
          </li>
        </ul>

        <div className="subtitle">Would you like us to refer you to one of our lending partners?</div>
        <div className="form-field formCustomCheckBox">
          <div className="checkboxes" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
            <input
              id={'agree'}
              checked={!checked}
              name={'doNotAgree'}
              type={'checkbox'}
              onChange={(e) => setChecked(!e.target.checked)}
            />
            <label className="font-bold">No</label>

            <input
              id={'disagree'}
              checked={checked}
              name={'agree'}
              type={'checkbox'}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="font-bold">Yes</span>
          </div>
        </div>
        <div>
          <div className={'d-flex bottom-actions align-center'}>
            <div className="d-flex">
              <button onClick={handleSubmit} className="primary-btn">
                Submit
              </button>
            </div>
          </div>
        </div>
        {renderPixel && renderPixelcodes()}
      </div>
    );
  }

  return (
    <div className="custom-steps check-failed">
      <div>
        <div>
          We cannot provide you an UnLock Mastercard<sup>&reg;</sup> at this time.
        </div>
        <div className="my-4">Good news, one of our lending partners could help you.</div>
        <div className="form-field formCustomCheckBox">
          <input
            id={'agree'}
            checked={checked}
            name={'agree'}
            type={'checkbox'}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span className="font-bold">Please check if you would like a lending partner to contact you.</span>
        </div>
        <div>
          <div className={'d-flex bottom-actions align-center'}>
            <div className="d-flex">
              <button onClick={handleSubmit} className="primary-btn">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {renderPixel && renderPixelcodes()}
      {error && <p className="error-text">{error}</p>}
      {decodedToken?.dealId ? <StepButtons handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} /> : ''}
    </div>
  );
};

export default CreditCheckFailed;
