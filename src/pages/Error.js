import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { UserContext } from '../context/UserContext';

/** services */
import { initToken } from '../service/api';

function Error() {
  const history = useHistory();
  const { updateContext, error } = useContext(UserContext);

  const startProcess = async () => {
    try {
      updateContext({ loading: true, error: '' });
      const res = await initToken();
      updateContext({ loading: false });
      if (res && res.data) {
        updateContext({ token: res.data.Token });
        history.push('/signup');
      }
    } catch (e) {
      console.log(e);
      updateContext({ loading: false });
    }
  };

  return (
    <Layout title="Error">
      <div className="form-layout">
        <p className="text-center text-base">{error}</p>
        <div>
          <div className="d-flex bottom-actions align-center">
            <div className="d-flex">
              <button className="primary-btn home-btn" onClick={startProcess}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Error;
