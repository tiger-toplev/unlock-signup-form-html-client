import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

/** services */
import { selectCompany, postAbandon } from '../../service/api';

const CompanyDetails = ({ handleGotoPrev, handleGotoNext }) => {
  const history = useHistory();
  const { companyData, error, updateContext } = useContext(UserContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (companyData.FailMessage) {
      postAbandon({ Options: checked ? ['Yes', 'Rejected'] : ['No', 'Rejected'] }).then();
    }
  }, []);

  const handleConfirm = async () => {
    if (companyData.FailMessage) {
      await postAbandon({ Options: checked ? ['Yes', 'Rejected'] : ['No', 'Rejected'] });
      return history.push('/thankyou');
    }
    updateContext({
      loading: true,
      customLoadingText: 'Your UnLock Account Application is being processed...',
      error: '',
    });
    try {
      const res = await selectCompany({
        ACN: companyData.ACN,
        VedaBusinessNameID: companyData.VedaBusinessNameID,
        FullJson: JSON.stringify(companyData),
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
    updateContext({ loading: false, customLoadingText: '' });
  };

  return (
    <div className="custom-steps">
      <div className="search-results">
        {companyData.FailMessage ? (
          <div>
            {/* <div className="company-info">
              <span className="name" dangerouslySetInnerHTML={{ __html: companyData.FailMessage }}></span>
            </div> */}
            <div className="company-info">
              Unfortunately your application is declined as it does not meet our credit policy.
              <br />
              - You must have a valid ACN or ABN
              <br />- You must have been in business and have been registered for GST for at least 12 months
            </div>
            <div className="form-field formCustomCheckBox">
              <span>
                We can refer your application to one of our lending partners and they may be able to assist you. Please
                check here if you would like to be referred &nbsp;
              </span>
              <input
                id={'agree'}
                defaultValue={checked}
                name={'agree'}
                type={'checkbox'}
                onChange={(e) => setChecked(e.target.checked)}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="company-info">
              <span className="name">
                <strong>Name</strong> : {companyData.Name}
              </span>
            </div>
            <div className="company-info">
              <span className="name">
                <strong> ABN</strong> : {companyData.ABN}
              </span>
            </div>
            <div className="company-info">
              <span className="name">
                <strong> ACN</strong> : {companyData.ACN}
              </span>
            </div>
            <div className="company-info">
              <span className="name">
                <strong> Status</strong> : {companyData.Status}
              </span>
            </div>
            <div className="company-info">
              <span className="name">
                <strong> Trading Name</strong> : {companyData.TradingNames}
              </span>
            </div>
            <div className="company-info">
              <span className="name">
                <strong> Address</strong> : {companyData.Address}
              </span>
            </div>
          </>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="bottom-section">
        <button onClick={handleGotoPrev} className="primary-btn">
          Search again
        </button>
        <button onClick={handleConfirm} className="primary-btn">
          {companyData.FailMessage ? 'Submit' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;
