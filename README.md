# Serverless authentication in 10 minutes with SuperTokens and NextJS

Learn how to build and deploy a NextJS application protected by SuperTokens in 10 minutes.

## Create the project and install dependencies 👌

```bash
yarn create next-app
```

![yarn create next-app](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/yarn-create-next-app.png?raw=true)

```
cd supertokens-nextjs-demo
yarn add supertokens-auth-react regenerator-runtime supertokens-node cors
```

## Add SuperTokens to the client side 🎭

If you navigate to `/pages/_app.js`, you should find the entry point for your NextJS application.

```js
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```

Replace this file with the following:

```js
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
      appName: "YOUR APP NAME", // Example: "SuperTokens Demo App"
      apiDomain: websiteUrl,
      websiteDomain: websiteUrl,
      apiBasePath: "api/auth"
    },
    recipeList: [
      EmailPassword.init(),
      Session.init()
    ]
  });
}


function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
```


Create an `auth` folder under `pages` and create a [[...path]].js file to render all SuperTokens components.

![Client side Tree](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/tree-client-side.png?raw=true)

#### **`pages/auth/[[...path]].js`**
```js
import Head from 'next/head';
import React, { useEffect } from 'react';
import 'regenerator-runtime/runtime';
import styles from '../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import SuperTokens  from 'supertokens-auth-react';

const SuperTokensComponentNoSSR = dynamic(() => import('supertokens-auth-react').then(mod => {
  return () => mod.getRoutingComponent() || null;
}), {
  ssr: false
});

export default function Auth() {
    useEffect(() => {
      if (SuperTokens.canHandleRoute() === false) {
        window.location.href = "/";
      }
    }, []);

    return (
        <div className={styles.container}>
          <Head>
            <title>Create Next App</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
              <SuperTokensComponentNoSSR />
          </main>

        </div>
    );
}
```


Make `index.js` file an authenticated only file:


#### **`pages/index.js`**
```js
import React, {useEffect, useState} from "react";
import Head from 'next/head';
import 'regenerator-runtime/runtime';
import styles from '../styles/Home.module.css'
import {doesSessionExist} from 'supertokens-auth-react/recipe/session';
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

export default function Home() {
    const [hasSession, setHasSession] = useState(false);

    async function logoutClicked() {
      await signOut();
      window.location.href = "/auth";
    }

    useEffect(() => {
        if (doesSessionExist() === false) {
            window.location.href = "/auth"; 
        } else {
          setHasSession(true);
        }
    }, [hasSession, setHasSession]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                  Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                {hasSession && 
                      <>
                          <p className={styles.description}>
                            You are authenticated with SuperTokens!
                          </p>

                          <div
                            style={{
                                display: "flex",
                                height: "70px",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                paddingLeft: "75px",
                                paddingRight: "75px"
                          }}>
                              <div
                                  onClick={logoutClicked}
                                  style={{
                                      display: "flex",
                                      width: "116px",
                                      height: "42px",
                                      backgroundColor: "#000000",
                                      borderRadius: "10px",
                                      cursor: "pointer",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#ffffff",
                                      fontWeight: "bold"
                                  }}>
                                  SIGN OUT
                              </div>
                          </div>
                          <p>
                            <a href="https://github.com/nkxxkn/supertokens-nextjs-demo" rel="noreferer" target="_blank">View the code on GitHub</a>
                          </p>
                      </>
                }
              
                <div className={styles.grid}>

                    <a href="https://supertokens.io/docs/emailpassword/introduction" className={styles.card}>
                        <h3>SuperTokens &rarr;</h3>
                        <p>Find in-depth information about SuperTokens.io features and API.</p>
                    </a>

                    <a className={styles.card}>
                        <h3>SSR with SuperTokens</h3>
                        <p>These sections are rendered server side, before verifying if there was a SuperTokens Session.</p>
                    </a>

                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h3>Documentation &rarr;</h3>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h3>Learn &rarr;</h3>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/master/examples"
                        className={styles.card}
                    >
                        <h3>Examples &rarr;</h3>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h3>Deploy &rarr;</h3>
                        <p>
                          Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                  href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Powered by{' '}
                  <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
                </a>
            </footer>
        </div>
    );
}
```

## Add SuperTokens to the server side 🎭

Similarly, create an `auth` folder under `pages/api` and create a [[...path]].js file

![Server side Tree](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/tree-server-side.png?raw=true)

#### **`pages/api/[[...path]].js`**
```js
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Cors from 'cors';

const apiPort = process.env.APP_PORT || 3000;
const apiDomain = process.env.APP_URL || `http://localhost:${apiPort}`;
const websitePort = process.env.APP_PORT || 3000;
const websiteDomain = process.env.APP_URL || `http://localhost:${websitePort}`
const apiBasePath = "/api/auth/";

try {
    SuperTokens.init({
        supertokens: {
            connectionURI: "https://try.supertokens.io",
        },
        appInfo: {
            appName: "SuperTokens Demo App",
            apiDomain,
            apiBasePath,
            websiteDomain
        },
        recipeList: [
            EmailPassword.init(),
            Session.init()
        ]
    });
} catch (e) {}

const cors = Cors({
    origin: websiteDomain,
    allowedHeaders: ["content-type", ...SuperTokens.getAllCORSHeaders()],
    credentials: true
});


function runCORSMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, async (result) => {
            if (result instanceof Error) {
              return reject(result)
            }

            return resolve(result)
        });
    })
}

function runSuperTokensMiddleware(req, res) {
    const reqProxy = new Proxy(req, {
        get(target, name) {
            if (name === `originalUrl`) {
                return target.url
            }

            return target[name]
        }
    });

    const resProxy = new Proxy(res, {
        get(target, name) {
            if (name === `header`) {
                return target.setHeader
            }

            return target[name]
        }
    });

    return new Promise((resolve, reject) => {
        SuperTokens.middleware()(reqProxy, resProxy, async (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            if (result !== undefined) {
                SuperTokens.errorHandler()(result, req, res, (errorHandlerResult) => {
                    if (result instanceof Error) {
                        return reject(result)
                    }

                    resolve(errorHandlerResult);
                });
            };

            return resolve(result);
        });
    })
}

export default async (req, res) => {
    await runCORSMiddleware(req, res, cors)
    await runSuperTokensMiddleware(req, res);
}
```

Run you application in development:

```
yarn dev
```

## Deploy with Vercel 🎉🥳

Follow the [Deploying Your Next.js Project with Vercel guide](https://vercel.com/guides/deploying-nextjs-with-vercel#step-2:-deploying-your-next.js-project-with-vercel) to deploy on Vercel.

![Deploy with Vercel](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/deploy-with-vercel.png?raw=true)

Once you have created your github repository and configured Vercel, you need to add the `PUBLIC_NEXT_APP_URL` and `APP_URL` to the environment variables.

In your project setttings, go to "Environment Variables":

![Project Settings](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/project-settings.png?raw=true)

Then create the following:

![Environment Variables](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/environment-variables.png?raw=true)

Make sure to redeploy your application for the environment variables to be taken into account.

That's it!

You now have a working NextJS application protected with SuperTokens authentication running in production:

![Demo Sign Up](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/demo-sign-up.png?raw=true)

And after you have Sign up / Sign in: 

![Demo Authenticated](https://raw.githubusercontent.com/NkxxkN/supertokens-nextjs-demo/main/assets/demo-authenticated.png?raw=true)


## Use your own SuperTokens Instance 🐳

To go one step further, you should deploy your own instance of SuperTokens. Please visit the [Managed Service](https://supertokens.io/docs/emailpassword/quick-setup/supertokens-core/saas-setup) documentation for a quick setup.
If you would like to deploy SuperTokens yourself, please visit the [Core Overview](https://supertokens.io/docs/emailpassword/quick-setup/supertokens-core/overview) documentation.