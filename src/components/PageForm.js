import React, { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import jwt_decode from 'jwt-decode';

import StepperBar from './common/StepperBar';

/** constants */
import { steps } from './Steps/steps';
import { useEffect } from 'react';
import Layout from './common/Layout';

function PageForm() {
  const history = useHistory();
  const step = new URLSearchParams(history.location.search).get('step');

  const contextDataRef = useRef();
  const contextData = useContext(UserContext);
  contextDataRef.current = contextData;

  const { error, content, activeIndexPage, updateContext, token, companyData, hasAdditionalStep, formPath } =
    contextDataRef.current;

  const currentSteps = steps[formPath] || steps['default'];
  const currentStep = currentSteps[activeIndexPage];

  useEffect(() => {
    // go to proper route based on step route parameter
    updateContext({ activeIndexPage: step ? parseInt(step) : 0 });
  }, []);

  // go to Previous step handler
  const handleGotoPrev = () => {
    if (activeIndexPage > 0) {
      updateContext({ activeIndexPage: activeIndexPage - 1, error: '' });
      window.scrollTo(0, 0);
    }
  };

  // go to Next step handler
  const handleGotoNext = () => {
    if (activeIndexPage < currentSteps.length - 1) {
      updateContext({ activeIndexPage: activeIndexPage + 1, error: '' });
      window.scrollTo(0, 0);
    }
  };

  /**
   * validate email field based on the pattern
   *
   * @param email
   * @param pattern
   */
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * validate mask input field based on the pattern
   *
   * @param value
   * @param pattern
   */
  const validateMaskInput = (value, pattern) => {
    const re = new RegExp(pattern);
    return re.test(value);
  };

  const renderLabel = (field, renderAsterisk = true) => {
    return (
      <>
        <label>
          <span>{field.label}</span>
          {renderAsterisk && field.required && <span>*</span>}
        </label>
      </>
    );
  };

  // Get the current step title based on following conditions
  let title = currentStep?.title;
  if (title === 'Congratulations!') {
    // if(companyData.FailMessage) {
    //   // && !hasAdditionalStep
    //   title = 'You have been approved for a $5000 UnLock Mastercard<sup>&reg;</sup>.';
    // }
    title = content;
  } else if (activeIndexPage === 5 && !jwt_decode(token)?.dealId) {
    title = '';
  }

  // Get the current step component to render
  const Component = currentStep?.step;

  // component props
  const props = {
    handleGotoPrev,
    handleGotoNext,
    validateEmail,
    validateMaskInput,
    renderLabel,
  };

  return (
    <>
      {window.location.origin.includes('localhost') && (
        <div className="d-flex bottom-controls">
          <button onClick={handleGotoPrev} className="secondary-btn">
            Prev
          </button>

          <button onClick={handleGotoNext} className="primary-btn ml-auto">
            Skip
          </button>
        </div>
      )}
      <Layout title={title}>
        <div className="form-layout">
          <div className={`section form-section`}>
            {Component ? (
              <Component {...props} />
            ) : (
              <div className={'col-2-list'}>{error && <p className="error-text">{error}</p>}</div>
            )}
          </div>

          <div className="spacer" />

          {formPath === 'default' && <StepperBar activeNumber={activeIndexPage} steps={currentSteps} />}
        </div>
      </Layout>
    </>
  );
}

export default PageForm;
