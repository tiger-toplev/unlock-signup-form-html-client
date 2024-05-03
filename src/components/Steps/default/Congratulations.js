import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../../context/UserContext';

import StepButtons from '../../common/StepButtons';

/** services */
import { getDirectors } from '../../../service/api';
import { BrowserView, MobileView } from 'react-device-detect';
import mobileHero from '../../../assets/images/congrats_mobile.png';
import desktopHero from '../../../assets/images/congrats_desktop.png';
import { render } from '@testing-library/react';

const Congratulations = ({ handleGotoPrev, handleGotoNext }) => {
  const history = useHistory();

  const contextDataRef = useRef();
  const contextData = useContext(UserContext);
  contextDataRef.current = contextData;

  const { content, token, companyData, hasAdditionalStep, directors, error, updateContext, renderPixel } =
    contextDataRef.current;

  const decodedToken = token ? jwtDecode(token) : null;

  useEffect(() => {
    // if (hasAdditionalStep) {
    //   return;
    // }
    console.log(companyData, decodedToken);
    if (companyData.FailMessage && !hasAdditionalStep) {
      updateContext({ formPath: 'businessCheckFailed', activeIndexPage: 0 });
    } else if (!decodedToken?.dealId) {
      updateContext({ formPath: 'creditCheckFailed', activeIndexPage: 0 });
    }
  }, [decodedToken]);

  const handleContinue = async () => {
    updateContext({ loading: true, error: '' });
    try {
      const res = await getDirectors();

      if (res && res.data) {
        updateContext({
          token: res.data.Token,
          directors: hasAdditionalStep ? directors : res.data.Directors ? res.data.Directors : [],
        });
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

  const renderPixelcodes = () => {
    return (
      <>
        <script
          language="JavaScript1.1"
          async
          src="//pixel.mathtag.com/event/js?mt_id=1611850&mt_adid=257068&mt_exem=&mt_excl=&v1=&v2=&v3=&s1=&s2=&s3="
        ></script>
        {/* <script language='JavaScript1.1' async src='//pixel.mathtag.com/event/js?mt_id=1611849&mt_adid=257068&mt_exem=&mt_excl=&v1=&v2=&v3=&s1=&s2=&s3='></script> */}
      </>
    );
  };

  return (
    <div className="custom-steps">
      <MobileView className="hero-image">
        <img src={mobileHero} alt="Hero image" />
      </MobileView>
      <BrowserView className="hero-image">
        <img src={desktopHero} alt="Hero image" />
      </BrowserView>
      {/* {decodedToken?.dealId || hasAdditionalStep ? (
        <div
          className={`title-section ${decodedToken?.dealId ? '' : 'small'}`}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      ) : (
        <div></div>
      )} */}
      <div className='title-section small'><h3>To get your UnLock card,<br/> let's set up your UnLock Account.</h3></div>
      {renderPixel && renderPixelcodes()}
      {error && <p className="error-text">{error}</p>}
      {decodedToken?.dealId ? <StepButtons handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} /> : ''}
    </div>
  );
};

export default Congratulations;
