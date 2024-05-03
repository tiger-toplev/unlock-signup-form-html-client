import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import StepButtons from '../common/StepButtons';

/** services */
import { postConfirmation } from '../../service/api';

const BankStatements = ({ handleGotoPrev, handleGotoNext }) => {
  const history = useHistory();
  const { content, error, updateContext } = useContext(UserContext);

  const handleContinue = async () => {
    updateContext({ loading: true, error: '' });
    try {
      const res = await postConfirmation();
      if (res && res.data) {
        updateContext({ token: res.data.Token, content: res.data.Content });
      }
      handleGotoNext();
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
        history.push('/error');
      }
    }

    updateContext({ loading: false });
  };

  return (
    <div className="custom-steps">
      <div className="title-section">
        <h3 className="text" dangerouslySetInnerHTML={{ __html: content }}></h3>
      </div>
      {error && <p className="error-section">{error}</p>}
      <StepButtons handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} />
    </div>
  );
};

export default BankStatements;
