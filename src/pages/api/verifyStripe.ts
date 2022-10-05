import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { code } = req.body;
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const result = await stripe.oauth
      .token({
        grant_type: "authorization_code",
        code: code,
      })
      .catch((err: any) => {
        throw new Error("Stripe oauth fail", err.message);
      });
    const account = await stripe.accounts
      ?.retrieve(result?.stripe_user_id)
      ?.catch((err: any) => {
        throw new Error("Error fetching stripe account", err.message);
      });

    // Here we get the important details of the account.
    const accountAnalysis = {
      hasConnectedAccount: !!account?.id, // Check if account ID received is actually connected or exists.
      accountId: account?.id,
      hasCompletedProcess: account?.details_submitted,
      isValid: account?.charges_enabled && account?.payouts_enabled,
      displayName:
        account?.settings?.dashboard?.display_name ||
        account?.display_name ||
        null,
      country: account?.country,
      currency: account?.default_currency,
    };

    // boolean - Once the account is connected, should we let it unlink?
    const shouldAllowUnlink =
      accountAnalysis?.hasConnectedAccount &&
      (!accountAnalysis?.isValid ||
        !accountAnalysis?.hasCompletedProcess ||
        !accountAnalysis?.displayName);

    return res
      .status(200)
      .json({ oauth: result, account, accountAnalysis, shouldAllowUnlink });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export default handler;
