import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function useOtpResendTimer() {
    const [timer, setTimer] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Function to start the OTP timer
    const handleSendOTP = () => {
        const expiryTime = Date.now() + 2 * 60 * 1000; // 2 minutes from now
        localStorage.setItem("otp_expiry", expiryTime.toString());
        setTimer(120); // 2 minutes in seconds
    };

    const startTimer = (expiryTime : number) => {
        // clear any existing interval before starting a new one
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            const remaining = Math.floor((expiryTime - Date.now()) / 1000);
            if (remaining <= 0) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setTimer(0);
                localStorage.removeItem("otp_expiry");
            } else {
                setTimer(remaining);
            }
        }, 1000);
    };

    useEffect(() => {
        const expiry = localStorage.getItem("otp_expiry");
        if (expiry) {
            const remaining = Math.floor((+expiry - Date.now()) / 1000);
            if (remaining > 0) {
                setTimer(remaining);
                startTimer(+expiry);
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Function to handle resending OTP
    const handleResend = async () => {
        toast.loading("Invio codice di verifica...");

        try {
            const result = await sendForgotPasswordEmail(email);
            if (result.error) {
                console.error("Error resending OTP:", result.error);
                toast.dismiss();
                toast.error(result.error);
                return;
            }
            toast.dismiss();
            toast.success('Codice di verifica inviato con successo!');
            // Reset and start the timer again
            if (timer > 0) return; // prevent resending while timer active
            const newExpiry = Date.now() + 2 * 60 * 1000;
            localStorage.setItem("otp_expiry", newExpiry.toString());
            setTimer(120);
            startTimer(newExpiry); // <-- start countdown immediately
        } catch (error) {
            console.error("Error during OTP resend:", error);
            toast.dismiss();
            toast.error('Si è verificato un errore durante l\'invio del codice di verifica.');
        }
    };

    return { timer, handleResend, handleSendOTP };
}