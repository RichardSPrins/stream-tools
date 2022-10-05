import { z } from "zod";
import { createProtectedRouter } from "./context";

export const authRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("getAuthUser", {
    async resolve({ ctx }) {
      try {
        const user = await ctx.prisma.user.findFirstOrThrow({
          where: {
            id: ctx.session.user.id,
          },
        });
        return user;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .query("getAuthUserConfig", {
    async resolve({ ctx }) {
      try {
        const config = await ctx.prisma.userConfig.findFirstOrThrow({
          where: { userId: ctx.session.user.id },
        });
        return config;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("updateAuthUserAccount", {
    input: z.object({
      displayName: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const profile = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { displayName: input.displayName },
        });
        return profile;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("saveAuthUserDonationLink", {
    input: z.object({
      donationLink: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const config = await ctx.prisma.userConfig.update({
          where: { userId: ctx.session.user.id },
          data: {
            donationLink: input.donationLink,
          },
        });
        return config;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .query("getAllDonations", {
    async resolve({ ctx }) {
      try {
        const donations = await ctx.prisma.creatorDonation.findMany({
          where: { userId: ctx.session.user.id },
        });
        return donations;
      } catch (error) {
        console.log(error);
      }
    },
  });
