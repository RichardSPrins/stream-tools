import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession, Session } from "next-auth";
import * as React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import AppLayout from "../../layouts/AppLayout";
import MenuDropdown from "../../components/Shared/MenuDropdown";
import { Button, Progress, CopyButton, Tooltip } from "@mantine/core";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { IoMdCheckmarkCircle } from "react-icons/io";

export default function AppHomePage() {
  const { data: config, status: configStatus } = trpc.useQuery([
    "auth.getAuthUserConfig",
  ]);
  const { data: currentUser, status: userStatus } = trpc.useQuery([
    "auth.getAuthUser",
  ]);

  const [accountProgress, setAccountProgress] = React.useState(0);

  React.useEffect(() => {
    let total: number = 0;
    if (config?.donationLink) {
      total += 25;
    }
    if (currentUser?.displayName) {
      total += 25;
    }
    setAccountProgress(total);
  }, [currentUser, config]);

  const completeBorderColor = (complete: boolean) =>
    complete ? "border-green-500" : "border-gray-500";
  return (
    <AppLayout>
      <p className="text-4xl font-bold">Home</p>
      <div className="mt-8 flex flex-wrap">
        <div className="w-full lg:w-1/3 lg:pr-4">
          <div className="p-6 shadow-lg bg-[#1A1A1B] rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-semibold">Account Progress</p>
              <span className="text-green-600 font-semibold text-2xl">
                {`${accountProgress}%`}
              </span>
            </div>
            <Progress value={accountProgress} color="green" />
            {configStatus === "success" && userStatus === "success" && (
              <div className="flex flex-wrap mt-4">
                <div className="w-1/2 pr-1 pb-1">
                  <Link href={"/app/account"}>
                    <div
                      className={`cursor-pointer relative border ${completeBorderColor(
                        currentUser?.displayName !== null
                      )} rounded-lg p-3 hover:scale-105 transition-all duration-100`}
                    >
                      <span>Add Your Display Name</span>
                      {currentUser?.displayName && (
                        <IoMdCheckmarkCircle className="text-green-500 ml-auto absolute right-2 bottom-2" />
                      )}
                    </div>
                  </Link>
                </div>
                <div className="w-1/2 pl-1 pb-1">
                  <Link href={"/app/account"}>
                    <div
                      className={`cursor-pointer relative border ${completeBorderColor(
                        config?.donationLink !== null
                      )} rounded-lg p-3 hover:scale-105 transition-all duration-100`}
                    >
                      <span>Create Donation Link</span>
                      {config?.donationLink && (
                        <IoMdCheckmarkCircle className="text-green-500 ml-auto absolute right-2 bottom-2" />
                      )}
                    </div>
                  </Link>
                </div>
                <div className="w-1/2 pt-1 pr-1">
                  <Link href={"/app/account"}>
                    <div
                      className={`cursor-pointer relative border ${completeBorderColor(
                        config?.hasCompletedStripeConfig as boolean
                      )} rounded-lg p-3 hover:scale-105 transition-all duration-100`}
                    >
                      <p>Connect Stripe Account</p>
                    </div>
                  </Link>
                </div>
                <div className="w-1/2 pt-1 pl-1">
                  <Link href={"/app/account"}>
                    <div
                      className={`cursor-pointer relative border ${completeBorderColor(
                        false
                      )} rounded-lg p-3 hover:scale-105 transition-all duration-100`}
                    >
                      Complete Verification
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-2/3 lg:pl-4 flex flex-wrap">
          <div className="mt-8 md:mt-0 p-6 shadow-lg bg-[#1A1A1B] rounded-lg w-full 2xl:w-1/2">
            <p className="text-2xl font-semibold">Donation Link</p>
            <p className="text-sm">
              Share this link with your audience wherever you'd like to collect
              tips or donations!
            </p>
            {configStatus === "success" && !config?.donationLink && (
              <Button fullWidth variant="outline" color={"brand.4"}>
                Create a Donation Link
              </Button>
            )}
            {config?.donationLink && (
              <div className="flex gap-2 mt-4 flex-wrap">
                <p className="py-1 px-3 text-md text-white rounded-md bg-[#333F44] truncate">
                  {config.donationLink}
                </p>
                <CopyButton value={config?.donationLink}>
                  {({ copied, copy }) => (
                    <Button
                      color={"brand.4"}
                      variant={copied ? "filled" : "outline"}
                      onClick={copy}
                      sx={{ color: copied ? "black" : "brand.4" }}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </CopyButton>
              </div>
            )}
          </div>
          <div className="mt-8 p-6 shadow-lg bg-[#1A1A1B] rounded-lg w-full 2xl:w-1/2">
            <p className="text-3xl font-semibold">Current Balance:</p>
            <p className="mt-8 text-2xl md:text-5xl text-end">$100.00</p>
            <div className="mt-6">
              <Link href="/app/wallet" passHref>
                <Button
                  fullWidth
                  variant="filled"
                  color="brand.4"
                  sx={{ color: "black" }}
                >
                  Go To Wallet
                </Button>
              </Link>
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
