import { FC } from "react";
import Loader from "../../components/Loader";
import "./LoaderPage.scss";

const LoaderPage:FC = () => {
    return (
    <div className="loader-page">
      <Loader />
    </div>
  );
};

export default LoaderPage;