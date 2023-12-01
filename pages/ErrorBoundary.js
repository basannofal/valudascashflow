import React, { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleErrors = (error, errorInfo) => {
      setHasError(true);
      // Log the error to your service or console.log it
      logErrorToMyService(error, errorInfo);
    };

    // Attach the error handler
    window.addEventListener("error", handleErrors);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("error", handleErrors);
    };
  }, []); // Empty dependency array ensures the effect runs once

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return children;
};

export default ErrorBoundary;
