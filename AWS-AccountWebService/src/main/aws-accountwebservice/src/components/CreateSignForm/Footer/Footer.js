import React from "react";

const Footer = ({
  title="No Title",
  goNextStep=alert('No onClick')
}) => (
  <div className='footer'>
    <button className="signup" onClick={goNextStep}>{title}</button>
  </div>
);

export default Footer;