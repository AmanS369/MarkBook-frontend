import React, { useEffect, useState } from "react";
import { auth } from "../../../Firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const WithAuth = (WrappedComponent) => {
  return (props) => {
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setAuthReady(true);
      });

      return () => unsubscribe();
    }, []);

    if (!authReady) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
