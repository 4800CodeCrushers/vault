// Necessary file because this rating library is 4 years old
// and hasn't been updated for newer versions of React
import React from "react";
import Rating from "react-rating";

const NewRatting = ({ ...props }) => <Rating {...props} />;
export default NewRatting;