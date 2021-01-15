// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {superTokensMiddleware} from "supertokens-node/nextjs";
import {runCORSMiddleware, getCors} from "../../../supertokens";

export default async (req, res) => {
    await runCORSMiddleware(req, res, getCors());
    await superTokensMiddleware(req, res);
}
