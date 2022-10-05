// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { authRouter } from "./authUser";
import { stripeRouter } from "./stripe";
import { creatorsRouter } from "./creators";
import { productRouter } from "./product";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("product.", productRouter)
  .merge("creators.", creatorsRouter)
  .merge("example.", exampleRouter)
  .merge("auth.", authRouter)
  .merge("stripe.", stripeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
