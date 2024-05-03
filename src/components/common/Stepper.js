import React from 'react';
import { Circle } from 'rc-progress';
import { BrowserView } from 'react-device-detect';

const Stepper = ({ sections, activeIndex, completed, handleChangeStepIndex }) => {
  return (
    <BrowserView>
      <div className="mobile-stepper stepper-container">
        <div className="step-index">
          <Circle
            className="mobile-circle"
            percent={((activeIndex + 1) / sections.length) * 100}
            trailWidth="3"
            strokeWidth="3"
            strokeColor="#2f570d"
          />
          <span>
            {activeIndex + 1} of {sections.length}
          </span>
        </div>
      </div>
    </BrowserView>
  );
};

export default Stepper;
