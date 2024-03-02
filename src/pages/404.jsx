import React from "react";

import notFoundPageStyles from "../assets/css/404.module.css";
import IncorrectAnimation from "../components/IncorrectAnimation";

const NotFoundPage = () => {
  return (
    <section className={notFoundPageStyles.notFoundPageContainer}>
      <div>
        <IncorrectAnimation />
        <p>Not Found</p>
      </div>
    </section>
  );
};

export default NotFoundPage;
