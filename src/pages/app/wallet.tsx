import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import AppLayout from "../../layouts/AppLayout";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";
import { Button } from "@mantine/core";

export default function AppWalletPage() {
  const { data: currentUser, status } = trpc.useQuery(["auth.getAuthUser"]);
  const { data: balance, status: balanceStatus } = trpc.useQuery([
    "stripe.getBalance",
    { userId: currentUser?.id },
  ]);
  const handlePayout = trpc.useMutation(["stripe.handlePayout"]);
  return (
    <AppLayout>
      <p className="text-4xl font-bold">Your Wallet</p>
      <div className="mt-8 flex flex-wrap">
        <div className="w-full lg:w-1/2 lg:pr-4">
          <div className="p-6 bg-[#1A1A1B] shadow-lg rounded-lg">
            <p className="text-3xl font-semibold">Current Balance:</p>
            <p className="mt-8 text-3xl md:text-5xl text-end">
              {balanceStatus === "success" ? `$${balance}.00` : "$--.--"}
            </p>
            <div className="mt-4">
              <Button
                fullWidth
                variant="filled"
                color="teal.3"
                sx={{ color: "black" }}
                loading={handlePayout.isLoading}
              >
                Withdraw Funds
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:pl-4">
          <div className=" bg-[#1A1A1B] mt-8 lg:mt-0 p-6 shadow-lg rounded-lg">
            <p className="text-3xl font-semibold">Recent Withdrawals:</p>
            <div className="mt-4">
              {Array(5)
                .fill(null)
                .map((_el) => (
                  <div className="border-b border-gray-200 mb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Amount:</p>
                      <p>$55.00</p>
                    </div>
                    <p>Date: {"08/01/2022, 09:25:00 PM"}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: { destination: "/sign-in" },
    };
  }

  return {
    props: {},
  };
}
