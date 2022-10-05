import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "");

export const stripeRouter = createProtectedRouter()
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("getBalance", {
    input: z.object({ userId: z.string().optional() }),
    resolve({ ctx }) {
      // TODO: replace with Stripe Connected Account balance query result
      // Set your secret key. Remember to switch to your live secret key in production.
      // See your keys here: https://dashboard.stripe.com/apikeys

      // const balance = await stripe.balance.retrieve({
      //   stripeAccount: '{{CONNECTED_STRIPE_ACCOUNT_ID}}'
      // });
      return 100;
    },
  })
  .mutation("handlePayout", {
    input: z.object({}),
    async resolve({ ctx, input }) {
      try {
      } catch (error) {}
    },
  })
  .mutation("createDonationPaymentIntent", {
    input: z.object({ amount: z.number(), platformFee: z.number() }),
    async resolve({ ctx, input }) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        const donationAmount = input.amount - input.platformFee;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: donationAmount,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
        });
        return paymentIntent;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("handleDonationPayment", {
    input: z.object({ amount: z.number(), paymentIntent: z.string() }),
    async resolve({ ctx, input }) {
      try {
      } catch (error) {}
    },
  });
