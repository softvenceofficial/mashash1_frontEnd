import { useForgotPasswordMutation } from "@/redux/endpoints/authApi";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

export default function useOtpTimer(totalSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchParams] = useSearchParams();
  const encodedEmail = searchParams.get("email");
  const email = encodedEmail ? atob(encodedEmail) : null;
  const [forgotPassword] = useForgotPasswordMutation();

  // --- Initialize timer immediately (NO FLICKER) ---
  useEffect(() => {
    let expireAt = localStorage.getItem("otp_expire_at");

    if (!expireAt) {
      const newExpire = Date.now() + totalSeconds * 1000;
      localStorage.setItem("otp_expire_at", newExpire.toString());
      expireAt = newExpire.toString();
    }

    const initialLeft = Math.floor((Number(expireAt) - Date.now()) / 1000);

    if (initialLeft <= 0) {
      setTimeLeft(0);
      setCanResend(true);
      return;
    }

    setTimeLeft(initialLeft);

    // --- Start interval ---
    timerRef.current = setInterval(() => {
      const left = Math.floor((Number(expireAt!) - Date.now()) / 1000);

      if (left <= 0) {
        setTimeLeft(0);
        setCanResend(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setTimeLeft(left);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSeconds]);

  // --- Handle resend ---
  const handleResend = async () => {
    toast.loading("Resending OTP...");
    if (!canResend) return;
    const formData = new FormData();
    formData.append("email", email || "");

    try {
      const res = await forgotPassword(formData).unwrap();
      console.log("Resend OTP Response:", res);
      if (res.code === 200) {
        toast.dismiss();
        toast.success("OTP resent to your email!");
        const newExpire = Date.now() + totalSeconds * 1000;
        localStorage.setItem("otp_expire_at", newExpire.toString());
        setCanResend(false);
        setTimeLeft(totalSeconds);
        // Restart interval
        if (timerRef.current) clearInterval(timerRef.current);
        // Start NEW countdown interval immediately
        timerRef.current = setInterval(() => {
          const left = Math.floor((newExpire - Date.now()) / 1000);

          if (left <= 0) {
            setTimeLeft(0);
            setCanResend(true);
            if (timerRef.current) clearInterval(timerRef.current);
          } else {
            setTimeLeft(left);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.dismiss();
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return { timeLeft, canResend, handleResend };
}
