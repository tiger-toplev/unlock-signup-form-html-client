import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import StepButtons from '../common/StepButtons';

// import id from '../../assets/id.svg';
// import camera from '../../assets/camera.svg';

/** services */
import { postBankAccount } from '../../service/api';

const IdentificationCheck = ({ handleGotoPrev, handleGotoNext }) => {
  const history = useHistory();
  const { content, error, updateContext } = useContext(UserContext);

  // handle file change event
  // const handleFileChange = async (e) => {
  //   e.preventDefault();

  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   //const res = await fileUpload(formData);
  // };

  const handleContinue = async () => {
    updateContext({ loading: true, error: '' });
    try {
      const res = await postBankAccount();
      if (res && res.data) {
        updateContext({ token: res.data.Token, content: res.data.Content });
      }
    } catch (error) {
      if (error.response.data && error.response.data.error) {
        updateContext({ error: error.response.data.error });
        history.push('/error');
      }
    }
    updateContext({ loading: false });
    handleGotoNext();
  };

  return (
    <div className="custom-steps">
      <div className="title-section" dangerouslySetInnerHTML={{ __html: content }}></div>
      {/* <div className="title-section bankAccountDetails">
        <div className="files">
          <div className="file-box">
            <label htmlFor={`input-id`}>
              <img src={id} />
            </label>
            <input id={`input-id`} type="file" name={'id'} onChange={(e) => handleFileChange(e)} />
          </div>
          <div className="file-box">
            <label htmlFor={`input-camera`}>
              <img src={camera} />
            </label>
            <input id={`input-camera`} type="file" name={'id'} onChange={(e) => handleFileChange(e)} />
          </div>
        </div>
        <button className="primary-btn" onClick={handleContinue}>
          Provide ID document (Licence) and Photo
        </button>
      </div> */}
      {error && <p className="error-text">{error}</p>}
      <StepButtons handleGotoPrev={handleGotoPrev} handleGotoNext={handleContinue} />
    </div>
  );
};

export default IdentificationCheck;
