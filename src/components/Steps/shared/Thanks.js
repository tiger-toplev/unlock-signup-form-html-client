import React, { useContext } from 'react';
import Layout from '../../common/Layout';
import { BrowserView, MobileView } from 'react-device-detect';

import mobileHero from '../../../assets/images/congrats_mobile.png';
import desktopHero from '../../../assets/images/congrats_desktop.png';
import { UserContext } from '../../../context/UserContext';

export default function ThanksScreen() {
  const { isReferred } = useContext(UserContext);
  return (
    <Layout title={isReferred ? 'You are referred' : 'Thanks'}>
      <div className="form-layout">
        <MobileView className="hero-image">
          <img src={mobileHero} alt="Hero image" />
        </MobileView>
        <BrowserView className="hero-image">
          <img src={desktopHero} alt="Hero image" />
        </BrowserView>
        <p className="font-bold max-w-[75%] text-center text-base">
          {isReferred ? 'We will refer you to our partners' : 'Your preferences have been submitted'}
          <br />
          <br />
          Thank you for your UnLock Application
        </p>
      </div>
      <div>
        <div className="d-flex bottom-actions align-center">
          <div className="d-flex">
            <button className="primary-btn home-btn" onClick={handleClick}>
              Done
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
const handleClick = () => {
  window.open('/', '_self');
  window.close();
};
