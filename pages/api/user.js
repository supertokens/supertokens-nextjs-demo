// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {useSuperTokensFromNextJs} from "supertokens-node/nextjs";
import {verifySession} from "supertokens-node/recipe/session";
import {runCORSMiddleware, getCors} from "../../supertokens";


export default async (req, res) => {
    if (req.method !== "GET") {
        return res.end();
    }

    await runCORSMiddleware(req, res, getCors());

    await useSuperTokensFromNextJs(async (next) => {
        verifySession()(req, res, next);
    }, req, res);

    return res.json({
        'note': "Fetch any data from your application for authenticated user after using verifySession middleware",
        'userId': req.session.userId,
        'sessionHandle': req.session.sessionHandle,
        'userDataInJWT': req.session.userDataInJWT
    });
}
