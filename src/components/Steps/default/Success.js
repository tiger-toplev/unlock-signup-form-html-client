import React, { useContext } from 'react';
import jwtDecode from 'jwt-decode';
import Layout from '../../common/Layout';
import { BrowserView, MobileView } from 'react-device-detect';
import { UserContext } from '../../../context/UserContext';
import StepButtons from '../../common/StepButtons';

import mobileHero from '../../../assets/images/your_all_set_mobile.png';
import desktopHero from '../../../assets/images/your_all_set_desktop.png';
import checkMark from '../../../assets/images/check.png';

export default function SuccessScreen() {
  const { token } = useContext(UserContext);

  const decodedToken = token ? jwtDecode(token) : null;

  console.log(decodedToken);
  //claims["kyc_url"]
  return (
    <Layout title="UnLock Mastercard<sup>&reg;</sup><br/>next steps">
      <div className="form-layout">
        <>
          {/*<p className="max-w-[75%] text-center text-base -mt-7">Next steps</p>*/}
          <MobileView className="hero-image">
            <img src={mobileHero} alt="Hero image" />
          </MobileView>
          <BrowserView className="hero-image">
            <img src={desktopHero} alt="Hero image" />
          </BrowserView>
          <h3 className="max-w-[75%] subtitle text-center text-base m-0">To get your card, you'll need to:</h3>
          <ol className="max-w-[90%] p-0 m-0 mb-1 success-list">
            <li className="text-primary-color">
              <span className="ml-2">Sign your UnLock Credit Terms</span>
            </li>
            <li className="text-primary-color">
              <span className="ml-2 ">
                Link your bank account
              </span>
            </li>
            <li className="text-primary-color">
              <span className="ml-2">
                Complete your <a target="_blank" rel="noreferrer" href={decodedToken?.kyc_url}>ID check</a>
              </span>
            </li>
          </ol>
          <p className="max-w-[80%] text-center">
            Keep an eye out for UnLock SMSes and emails.
          </p>
          <StepButtons handleGotoNext={() => {window.location.href = 'https://unlockb2b.com/confirmation/'}} />
          <div className="mt-4 mx-auto text-base success-info" onClick={handleClick}>
            {/*<b>You may now close this browser window</b>*/}
          </div>
          <p>
            <br />
          </p>
        </>
      </div>
    </Layout>
  );
}

const handleClick = () => {
  // window.open('/', '_self');
  window.close();
};
