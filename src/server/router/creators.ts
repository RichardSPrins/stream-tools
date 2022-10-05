import { createRouter } from "./context";
import { z } from "zod";

export const creatorsRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  })
  .query("getById", {
    input: z.object({ displayName: z.string() }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: { displayName: input.displayName },
      });
      return user;
    },
  });
