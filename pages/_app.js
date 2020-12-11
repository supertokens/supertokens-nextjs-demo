import '../styles/globals.css';
import React from "react";
import 'regenerator-runtime/runtime';
import SuperTokens  from 'supertokens-auth-react';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import Session  from 'supertokens-auth-react/recipe/session';

const websitePort = process.env.APP_PORT || 3000;
const websiteUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${websitePort}`; 

if (typeof window !== 'undefined') {
  SuperTokens.init({
    appInfo: {
      appName: "SuperTokens Demo App",
      apiDomain: websiteUrl,
      websiteDomain: websiteUrl,
      apiBasePath: "api/auth"
    },
    recipeList: [
      EmailPassword.init(),
      Session.init({
        sessionScope: 'localhost'
      })
    ]
  });
}


function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
