// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {superTokensVerifySession} from "supertokens-node/nextjs";
import {runCORSMiddleware, getCors} from "../../supertokens";


export default async (req, res) => {
    if (req.method !== "GET") {
        return res.end();
    }

    await runCORSMiddleware(req, res, getCors());
    await superTokensVerifySession(req, res);

    return res.json({
        'note': "Fetch any data from your application for authenticated user after using superTokensVerifySession middleware",
        'userId': req.session.userId,
        'sessionHandle': req.session.sessionHandle,
        'userDataInJWT': req.session.userDataInJWT
    });
}
