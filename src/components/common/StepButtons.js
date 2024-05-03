import React from 'react';

/**
 * @typedef { object } StepButtonsProps
 * @property {() => void} handleGotoNext
 * @property {boolean} isNextDisabled
 * @property {string} nextBtnText
 */

/**
 * @param {StepButtonsProps} props component props
 * @returns {import('react').ReactElement}
 */
const StepButtons = ({ handleGotoNext, isNextDisabled, nextBtnText }) => {
  return (
    <div>
      <div className={'d-flex bottom-actions align-center'}>
        <div className="d-flex">
          <button disabled={isNextDisabled} onClick={handleGotoNext} className="primary-btn">
            {nextBtnText || 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepButtons;
