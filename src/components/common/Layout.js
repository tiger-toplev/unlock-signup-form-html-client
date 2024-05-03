import React, { useContext } from 'react';
// import ReactLoading from 'react-loading';
import { UserContext } from '../../context/UserContext';
import PageHeader from './PageHeader';
import mobileLoadingSpinner from '../../assets/images/loading_icon_mobile.gif';
import desktopLoadingSpinner from '../../assets/images/loading_icon_desktop.gif';
import { BrowserView, MobileView } from 'react-device-detect';

const Layout = ({ children, title }) => {
  const { loading, customLoadingText } = useContext(UserContext);

  return (
    <div className="page-layout">
      {loading && (
        <div className="custom-spinner">
          <MobileView>
            <img src={mobileLoadingSpinner} alt="loading..." />
          </MobileView>
          <BrowserView>
            <img src={desktopLoadingSpinner} alt="loading..." />
          </BrowserView>
          {customLoadingText && <p className="custom-loading-text">{customLoadingText}</p>}
        </div>
      )}
      <PageHeader title={title} />
      <div className="layout-content">{children}</div>
    </div>
  );
};

export default Layout;
