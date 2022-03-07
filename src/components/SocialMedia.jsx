import React from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const SocialMedia = () => (
  <div className="app__social">
    <div>
      <a href="https://github.com/borhan-dev">
        <BsGithub />
      </a>
    </div>
    <div>
      <a href="https://www.facebook.com/borhan.webdev/">
        <FaFacebookF />
      </a>
    </div>
    <div>
      <a href="https://www.linkedin.com/in/borhan-dev/">
        <BsLinkedin />
      </a>
    </div>
  </div>
);

export default SocialMedia;
