import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';

import StepButtons from '../../common/StepButtons';

/** services */
import { postCompletion } from '../../../service/api';

const ApplicationDetails = ({ handleGotoPrev, handleGotoNext }) => {
  const history = useHistory();
  const { content, error, updateContext } = useContext(UserContext);

  const handleContinue = async () => {
    updateContext({ loading: true, error: '' });
    try {
      const res = await postCompletion();
      if (res && res.data) {
        updateContext({
          token: res.data.Token,
          content: res.data.Content,
        });
      }
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
        history.push('/error');
      }
    }

    updateContext({ loading: false });
    history.push('/success');
  };

  return (
    <div className="custom-steps">
      <div className="title-section">
        <h3 className="text" dangerouslySetInnerHTML={{ __html: content }}></h3>
      </div>
      {error && <p className="error-text">{error}</p>}
      <StepButtons handleGotoNext={handleContinue} nextBtnText={'Confirm'} />
    </div>
  );
};

export default ApplicationDetails;
