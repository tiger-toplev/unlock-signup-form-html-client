import React from 'react';

const StepperBar = ({ activeNumber, steps }) => {
  return (
    <div className="stepper_bar">
      <p>Account Application</p>
      <div className="stepper_bar-wrapper">
        {steps.map((step, index) => {
          return (
            <div className={index > activeNumber ? 'stepper_bar-item-active' : 'stepper_bar-item'} key={index}></div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperBar;
