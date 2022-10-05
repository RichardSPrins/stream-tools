import { createRouter } from "./context";
import { z } from "zod";

export const productRouter = createRouter()
  .query("getAllRoadmapTasks", {
    async resolve({ ctx }) {
      return await ctx.prisma.productRoadmapTask.findMany({
        include: {
          upvotes: true,
        },
        orderBy: {
          upvotes: {
            _count: "desc",
          },
        },
      });
    },
  })
  .mutation("addProductUpvote", {
    input: z.object({
      userId: z.string(),
      productId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.productRoadmapTaskUpvote.create({
        data: { userId: input.userId, productRoadmapTaskId: input.productId },
      });
    },
  });
