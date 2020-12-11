// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
            connectionURI: "https://try.supertokens.io", // Replace with your SuperTokens core instance. See https://supertokens.io/docs/emailpassword/quick-setup/supertokens-core/overview
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
