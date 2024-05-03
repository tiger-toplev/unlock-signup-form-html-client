import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { UserContext } from '../context/UserContext';

/** services */
import { extraOptions } from '../service/api';

function ExtraOptions() {
  const history = useHistory();
  const { updateContext } = useContext(UserContext);
  const [options, setOptions] = useState('');

  useEffect(() => {
    updateContext({ loading: false });
  }, []);

  const handleSubmit = async () => {
    try {
      updateContext({ loading: true, error: '' });
      const res = await extraOptions({ options });
      if (res && res.data) {
        updateContext({ token: res.data.Token, content: res.data.Content });
      }
      history.push('/thankyou');
    } catch (e) {
      console.log(e);
    }
    updateContext({ loading: false });
  };

  const handleChange = (e) => {
    if (!options.includes(e.target.value)) {
      setOptions([...options, e.target.value]);
    } else {
      setOptions(options.filter((option) => option !== e.target.value));
    }
  };

  return (
    <Layout>
      <div className="form-layout">
        <h1 className="title">Additional Options</h1>
        <div className="custom-steps">
          <div className="search-results">
            <div className="company-info">
              <span className="name">Get someone from unlock to contact you to discuss</span>
              <input name="manual" type="checkbox" value="manual" onChange={handleChange} />
            </div>
            <div className="company-info">
              <span className="name">Give permission to refer application to our referral partner(s)</span>
              <input name="manual" type="checkbox" value="referral" onChange={handleChange} />
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex bottom-actions align-center">
            <div className="d-flex">
              <button className="primary-btn home-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ExtraOptions;
