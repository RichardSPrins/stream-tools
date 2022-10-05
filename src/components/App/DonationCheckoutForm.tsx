import { Button } from "@mantine/core";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import * as React from "react";
import { toast } from "react-toastify";

const DonationCheckoutForm = ({
  setCurrentStep,
  steps,
  clientSecret,
}: {
  setCurrentStep: (step: string) => void;
  steps: any;
  clientSecret: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleConfirmPayment = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window?.location?.origin}`,
      },
    });
    if (!error) {
      toast.success("Donation Payment Successful.", { theme: "colored" });
      setCurrentStep("THANKS");
    } else if (
      error &&
      (error?.type === "card_error" || error?.type === "validation_error")
    ) {
      toast.error(error?.message, { theme: "colored" });
    } else {
      toast.error("An unexpected error occurred.", { theme: "colored" });
    }
    setIsLoading(false);
    return;
  };

  return (
    <form onSubmit={handleConfirmPayment}>
      <h1 className="text-2xl font-semibold mb-4">Payment Information</h1>
      <PaymentElement />
      <div className="flex justify-end mt-6 gap-4">
        <Button
          color={"brand.4"}
          variant="outline"
          onClick={() => setCurrentStep(steps.INITIAL)}
        >
          Go Back
        </Button>
        <Button
          color={"brand.4"}
          sx={{ color: "black" }}
          disabled={isLoading || !stripe || !elements}
          loading={isLoading}
          type="submit"
        >
          Confirm Payment
        </Button>
      </div>
    </form>
  );
};

export default DonationCheckoutForm;
