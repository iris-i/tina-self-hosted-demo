import { NextApiHandler } from "next";
import { isUserAuthorized } from "@tinacms/auth";
import { databaseRequest } from "../../lib/databaseConnection";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

const nextApiHandler: NextApiHandler = async (req, res) => {
  // Use your own authentication logic here
  // const isAuthorized = headers.authorization === "Bearer some-token"
  const session = await getServerSession(req, res, authOptions)
  const userHasValidSession = Boolean(session)
  console.log("Session in gql", session)

  // // Example if using TinaCloud for auth
  // const tinaCloudUser = await isUserAuthorized({
  //   clientID: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  //   token: req.headers.authorization,
  // });

  const isAuthorized =
    process.env.TINA_PUBLIC_IS_LOCAL === 'true'
    || userHasValidSession === true
    || false

  if (isAuthorized) {
    const { query, variables } = req.body;
    const result = await databaseRequest({ query, variables });
    return res.json(result);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default nextApiHandler;
