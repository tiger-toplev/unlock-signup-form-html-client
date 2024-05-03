import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { UserContext } from '../context/UserContext';

/** services */
import { initToken } from '../service/api';
import { BrowserView, MobileView } from 'react-device-detect';

import mobileHero from '../assets/images/landing_mobile.png';
import desktopHero from '../assets/images/landing_desktop.png';

function Home() {
  const history = useHistory();
  const { updateContext } = useContext(UserContext);

  useEffect(() => {
    const search = history.location.search;
    const params = new URLSearchParams(search);
    updateContext({ renderPixel: params.has('src') && params.get('src') == 'mccorkell' });
  }, []);

  const startProcess = async () => {
    try {
      // console.log(window.location.search)
      // console.log(history.location.pathname)
      const search = window.location.search;
      const params = new URLSearchParams(search);
      updateContext({ loading: true, error: '' });
      // console.log(params.get('src'))
      const res = await initToken({
        lead_referrer: params.has('src') ? params.get('src') : undefined,
      });
      updateContext({ loading: false });
      if (res && res.data) {
        updateContext({ token: res.data.Token });
        history.push('/signup');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout title="Account Application">
      <div className="form-layout">
        <MobileView className="hero-image">
          <img src={mobileHero} alt="Hero image" />
        </MobileView>
        <BrowserView className="hero-image">
          <img src={desktopHero} alt="Hero image" />
        </BrowserView>
        <h3 className="subtitle">To start buying with UnLock within 24 hours you'll need:</h3>
        <ul className="home-list">
          <li>
            <span>an active ACN or ABN</span>
          </li>
          <li>
            <span>to have been trading for at least 12 months</span>
          </li>
          <li>
            <span>no judgment defaults</span>
          </li>
        </ul>
        <div>
          <div className="d-flex bottom-actions align-center">
            <div className="d-flex">
              <button className="primary-btn" onClick={startProcess}>
                Start your Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
