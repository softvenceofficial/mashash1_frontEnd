import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useForgetPassword from "./hooks/use-forget-password";

export default function ForgotPasswordForm() {
  const { form, onSubmit, goBack } = useForgetPassword();

  return (
    <div className="w-full max-w-md mx-auto py-10">
      <div className="text-center">
        <h2 className="text-[40px] font-bold mb-3">Forget Password</h2>
        <p className="text-base font-normal text-auth-foreground">
          Please enter your email address to reset your password
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-7 mt-12"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base gap-0">
                  Email address<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="rounded-[10px] h-12 placeholder:text-auth-foreground 
                    placeholder:text-base placeholder:font-normal text-base font-normal 
                    border-[#E5E7EB] focus:ring-0 focus:ring-offset-0 focus:border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Send OTP */}
          <Button
            type="submit"
            className="w-full bg-black h-12 hover:bg-black text-base font-medium rounded-full cursor-pointer mt-12"
          >
            Send OTP
          </Button>

          {/* Back */}
          <Button
            type="button"
            onClick={goBack}
            variant="outline"
            className="w-full h-12 rounded-full text-base font-medium border border-black bg-transparent hover:bg-transparent cursor-pointer"
          >
            Back
          </Button>
        </form>
      </Form>
    </div>
  );
}
