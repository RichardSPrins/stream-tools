import * as React from "react";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import AppLayout from "../../layouts/AppLayout";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";
import MenuDropdown from "../../components/Shared/MenuDropdown";
import { Button } from "@mantine/core";

type EarningsFilter = "Today" | "This Week" | "This Month" | "All Time";

export default function AppDonationsPage() {
  const { data: currentUser, status } = trpc.useQuery(["auth.getAuthUser"]);
  const { data: donations } = trpc.useQuery(["auth.getAllDonations"]);
  const [earningsFilter, setEarningsFilter] =
    React.useState<EarningsFilter>("Today");

  React.useEffect(() => {
    console.log(earningsFilter);
  }, [earningsFilter]);
  return (
    <AppLayout>
      <p className="text-4xl font-bold">Your Donations</p>
      <div className="mt-8 flex flex-col-reverse lg:flex-row flex-wrap">
        <div className="w-full lg:w-1/2 lg:pr-4">
          <div className="mt-8 lg:mt-0 p-6 bg-[#1A1A1B] shadow-lg rounded-lg">
            <p className="text-2xl font-semibold">Recent Donations</p>
            <div className="mt-4">
              {donations?.map((donation) => (
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <p>
                      <span className="font-semibold">From:</span>{" "}
                      {donation.donator}
                    </p>
                    <p>{`$${donation.amount / 100}.00`}</p>
                  </div>
                  <p className="font-semibold">Message:</p>
                  <p>{donation.message || "--None--"}</p>
                </div>
              ))}
              <div className="mt-6">
                <Button fullWidth variant="filled" color="brand.4">
                  See More
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:pr-4">
          <div className="p-6 bg-[#1A1A1B] shadow-lg rounded-lg">
            <div className="flex items-start justify-between">
              <p className="text-2xl font-semibold">Earnings:</p>
              <MenuDropdown
                buttons={[
                  {
                    text: "Today",
                    onClick: () => setEarningsFilter("Today"),
                  },
                  {
                    text: "This Week",
                    onClick: () => setEarningsFilter("This Week"),
                  },
                  {
                    text: "This Month",
                    onClick: () => setEarningsFilter("This Month"),
                  },
                  {
                    text: "All Time",
                    onClick: () => setEarningsFilter("All Time"),
                  },
                ]}
              />
            </div>
            <div className="flex items-end justify-between">
              <p>{`${earningsFilter}:`}</p>
              <p className="mt-8 text-3xl font-semibold">
                {`$${
                  donations
                    ? donations
                        ?.map((donation) => donation.amount)
                        .reduce((a, b) => a + b, 0) / 100
                    : "--"
                }.00`}
              </p>
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
