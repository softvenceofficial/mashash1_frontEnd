import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import useOtpVerify from "./hooks/use-otp-verify";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import useOtpTimer from "./hooks/use-otp-timer";
import { useState } from "react";

export default function OtpVerificationForm() {
  const [loading, setLoading] = useState(false);
  const { form, onSubmit, goBack } = useOtpVerify({ setLoading });
  const { timeLeft, canResend, handleResend } = useOtpTimer(120);

  return (
    <div className="w-full max-w-md mx-auto py-10 min-h-[calc(100vh-300px)] flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-[40px] font-bold mb-3 text-black">
          OTP Verification
        </h2>
        <p className="text-base font-normal text-auth-foreground">
          Enter the verification code we just sent to your email address
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 pt-10"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground mt-8 dark:text-black">
                  OTP code
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={4} {...field}>
                    <InputOTPGroup className="justify-center gap-5 w-full">
                      <InputOTPSlot
                        index={0}
                        className="border-auth-border border h-10 text-center w-1/4 rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:bg-transparent text-black"
                      />
                      <InputOTPSlot
                        index={1}
                        className="border-auth-border border h-10 text-center w-1/4 rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:bg-transparent text-black"
                      />
                      <InputOTPSlot
                        index={2}
                        className="border-auth-border border h-10 text-center w-1/4 rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:bg-transparent text-black"
                      />
                      <InputOTPSlot
                        index={3}
                        className="border-auth-border border h-10 text-center w-1/4 rounded-xl! outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:!shadow-nonefocus-visible:!outline-none focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none! dark:bg-transparent text-black caret-black"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-center mt-10">
            {!canResend ? (
              <p className="text-auth-foreground mb-2">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>
            ) : (
              <p className="text-auth-foreground">Time expired</p>
            )}

            <p className="text-auth-foreground">
              Didn’t receive code?{" "}
              <span
                onClick={canResend ? handleResend : undefined}
                className={`text-base font-medium ${
                  canResend ? "cursor-pointer text-auth-text" : "text-gray-400"
                }`}
              >
                Re-send
              </span>
            </p>
          </div>
          {/* Send OTP */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black h-12 hover:bg-black text-base font-medium rounded-full cursor-pointer mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Confirming..." : "Confirm Code"}
          </Button>

          {/* Back */}
          <Button
            type="button"
            onClick={goBack}
            variant="outline"
            className="w-full h-12 rounded-full text-base font-medium border border-black bg-transparent! hover:bg-transparent cursor-pointer text-black!"
          >
            Back
          </Button>
        </form>
      </Form>
    </div>
  );
}
