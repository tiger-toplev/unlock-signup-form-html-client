import React, { useContext } from 'react';
import Layout from '../components/common/Layout';
import { UserContext } from '../context/UserContext';


function Error() {
  const { error } = useContext(UserContext);

  return (
    <Layout title="">
      <div className="form-layout">
        <p className="text-center text-base">{error}</p>
      </div>
    </Layout>
  );
}

export default Error;
