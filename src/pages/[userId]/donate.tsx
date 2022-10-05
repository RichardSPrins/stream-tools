import * as React from "react";
import { useRouter } from "next/router";
import {
  Input,
  Text,
  NumberInput,
  Textarea,
  Avatar,
  Button,
} from "@mantine/core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "../../utils/trpc";
import { useForm } from "@mantine/form";
import DonationCheckoutForm from "../../components/App/DonationCheckoutForm";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { DONATION_PLATFORM_FEE } from "../../utils/consts";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

enum STEPS {
  INITIAL = "INITIAL",
  PAYMENT = "PAYMENT",
  CONFIRMATION = "THANKS",
}

export default function DonatePage() {
  const donationInfoForm = useForm({
    initialValues: {
      name: "",
      amount: 1,
      message: "",
    },
  });
  const router = useRouter();

  const [cs, setCs] = React.useState(null);
  const { userId } = router.query;
  const username = userId as string;
  const { data: creator } = trpc.useQuery([
    "creators.getById",
    { displayName: username },
  ]);

  const createPaymentIntent = trpc.useMutation(
    "stripe.createDonationPaymentIntent",
    {
      onSuccess: (data, _variables, _context) => {
        console.log(data);
        setCs(data["client_secret"]);
        setCurrentStep("PAYMENT");
      },
    }
  );
  const [currentStep, setCurrentStep] = React.useState("INITIAL");

  const handleProceedToPayment = async () => {
    console.log(donationInfoForm.values);
    const initialAmount = Number(donationInfoForm.values["amount"]) * 100;
    const platformFee = initialAmount * DONATION_PLATFORM_FEE;
    const finalAmount = initialAmount + platformFee;
    createPaymentIntent.mutate({ amount: finalAmount, platformFee });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-12">
      <div className="max-w-5xl w-full rounded-lg bg-[#1A1A1B] p-8 shadow-lg">
        {currentStep === "INITIAL" && (
          <>
            <form onSubmit={donationInfoForm.onSubmit(handleProceedToPayment)}>
              <h1 className="text-2xl font-semibold mb-4">Donation Form</h1>
              <div className="flex flex-wrap gap-6">
                <div className="w-full md:w-1/3">
                  {" "}
                  <Input.Wrapper
                    id="input-demo"
                    withAsterisk
                    label="Name"
                    description="Please enter a name or nickname"
                  >
                    <Input
                      id="input-demo"
                      placeholder="Your name"
                      {...donationInfoForm.getInputProps("name")}
                    />
                  </Input.Wrapper>
                </div>
                <div className="w-full md:w-1/4">
                  {" "}
                  <Input.Wrapper
                    id="input-demo"
                    withAsterisk
                    label="Donation Amount"
                    description="Minimum $1.00 USD"
                  >
                    <NumberInput
                      {...donationInfoForm.getInputProps("amount")}
                      mt={5}
                      id="input-demo"
                      placeholder="1.00"
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      formatter={(value) =>
                        !Number.isNaN(parseFloat(value as string))
                          ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "$ "
                      }
                    />
                  </Input.Wrapper>
                </div>
                <div className="w-full md:w-1/3">
                  <p className="text-sm font-semibold">Donating To:</p>
                  <div className="flex gap-4 items-center mt-4">
                    <Avatar radius="xl" size={45} src={creator?.image} />
                    <p className="font-semibold">{creator?.displayName}</p>
                  </div>
                </div>
              </div>
              <div className="w-full mt-4">
                <Textarea
                  label="Leave a message"
                  placeholder="Let them know why you love supporting their endeavors..."
                  {...donationInfoForm.getInputProps("message")}
                />
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit" color={"brand.4"} sx={{ color: "black" }}>
                  Proceed to payment
                </Button>
              </div>
            </form>
          </>
        )}
        {currentStep === "PAYMENT" && (
          <>
            {cs && (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: cs, appearance: { theme: "night" } }}
              >
                <DonationCheckoutForm
                  clientSecret={cs}
                  setCurrentStep={setCurrentStep}
                  steps={STEPS}
                />
              </Elements>
            )}
          </>
        )}
        {currentStep === "THANKS" && (
          <div className="flex flex-col items-center text-center gap-4">
            <IoMdCheckmarkCircle className="text-green-400 text-4xl" />
            <h2 className="font-semibold text-2xl">
              Thank you for your donation!
            </h2>
            <p>
              Your contribution to{" "}
              <span className="font-semibold">{username}</span> is greatly
              appreciated!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
