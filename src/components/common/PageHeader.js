import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/unlock-logo.png';

const PageHeader = ({ title }) => {
  return (
    <div className="page_header">
      <div className="page_header-logo">
        <Link to="/">
          <img src={logo} alt="UnLock logo" />
        </Link>
      </div>
      <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
    </div>
  );
};

export default PageHeader;
