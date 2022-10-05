import { NextPage } from "next";
import * as React from "react";
import LandingLayout from "../layouts/LandingLayout";
import { Checkbox, Textarea, Button } from "@mantine/core";
import { ROADMAP } from "../utils/content";
import { useSession, signIn } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { FaCaretUp } from "react-icons/fa";
import { ProductRoadmapTask, ProductRoadmapTaskUpvote } from "@prisma/client";

const Roadmap: NextPage = () => {
  const ctx = trpc.useContext();
  const { data: session, status } = useSession();
  const { data: tasks, status: tasksStatus } = trpc.useQuery([
    "product.getAllRoadmapTasks",
  ]);
  console.log(tasks);
  const addNewUpvote = trpc.useMutation("product.addProductUpvote", {
    onMutate: () => {
      ctx.cancelQuery(["product.getAllRoadmapTasks"]);

      let optimisticUpdate = ctx.getQueryData(["product.getAllRoadmapTasks"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["product.getAllRoadmapTasks"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["product.getAllRoadmapTasks"]);
      console.log("upvote added");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleProductUpvote = (
    task: ProductRoadmapTask & { upvotes: ProductRoadmapTaskUpvote[] }
  ) => {
    if (!task.upvotes.some((upvote) => upvote.userId === session?.user?.id)) {
      addNewUpvote.mutate({
        userId: session?.user?.id as string,
        productId: task.id,
      });
    }
  };

  return (
    <LandingLayout>
      <div className="container mx-auto max-w-4xl min-h-screen mt-20 px-8">
        <h1 className="text-center font-semibold text-5xl">Product Roadmap</h1>
        <p className="text-center mt-4 w-full md:w-2/3 mx-auto">
          We aim to provide useful, quality tools for streamers and content
          creators to help them grow their channel, here is a preview of what we
          have in mind, and how far we have come to accomplish these goals.
        </p>
        <div className="mt-12 mb-8 flex flex-col gap-4 max-w-2xl mx-auto">
          {tasks?.map((task) => (
            <div className="p-4 bg-[#1A1A1B] rounded-md flex justify-between items-center">
              <div className="flex items-center gap-8">
                <Checkbox checked={task.completed} />
                <p>{task.title}</p>
              </div>
              <div
                className="flex flex-col items-center px-2 cursor-pointer"
                onClick={() => handleProductUpvote(task)}
              >
                <FaCaretUp />
                <span>{task.upvotes.length}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-12 mt-24 flex flex-col gap-8 max-w-2xl mx-auto">
          <p className="text-lg font-semibold">
            If you have any suggestions or ideas of features you think would be
            useful, leave us a tip below!
          </p>
          {session ? (
            <>
              <Textarea
                placeholder="Type something..."
                label="Leave a suggestion"
                variant="filled"
              />
              <Button color="teal.3" sx={{ color: "black" }}>
                Send Feedback
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() =>
                  signIn(undefined, {
                    callbackUrl: `${window.location.origin}/roadmap`,
                  })
                }
                color="teal.3"
                mx={"auto"}
                sx={{ color: "black", width: "fit-content" }}
              >
                Log in to leave a suggestion
              </Button>
            </>
          )}
        </div>
      </div>
    </LandingLayout>
  );
};

export default Roadmap;
