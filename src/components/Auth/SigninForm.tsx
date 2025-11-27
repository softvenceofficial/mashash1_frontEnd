import { Button } from "@/components/ui/button";
import google from "@/assets/svgs/google.svg";
import Icon from "@/components/common/Icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useLogin from "./hooks/use-login";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";

const SigninForm = () => {
  const { form, onSubmit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <div className="text-center">
        <h2 className="text-[40px] font-bold mb-4 text-black">Log in</h2>
        <p className="text-base font-normal text-auth-foreground">
          Enter your email and password to log in
        </p>
        <Button
          variant="outline"
          className="w-full mt-6 bg-transparent! border-black rounded-full h-12 hover:text-foreground"
        >
          <Icon src={google} className="size-5" />
          <span className="font-medium text-black">Log in with Google</span>
        </Button>
      </div>
      <div className="flex w-full items-center my-5 md:my-10">
        <div className="bg-auth-border h-px w-1/2 ml-10"></div>
        <p className="mx-4 text-auth-foreground">or</p>
        <div className="bg-auth-border h-px w-1/2 mr-10"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base gap-0 text-black">
                  Email<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="your@email.com"
                    className="rounded-[10px] h-12 placeholder:text-auth-foreground placeholder:text-base placeholder:font-normal text-base! font-normal border-[#E5E7EB] focus:ring-0! focus:ring-offset-0! focus:border-border! dark:bg-transparent text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="font-medium text-base gap-0 text-black">
                  Password<span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      {...field}
                      className="rounded-[10px] h-12 placeholder:text-auth-foreground placeholder:text-base placeholder:font-normal text-base! font-normal border-auth-border focus:ring-0! focus:ring-offset-0! focus:border-border! dark:bg-transparent text-black"
                    />
                    <button
                      type="button"
                      className="absolute! top-[50%] right-3 text-muted-foreground transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="size-5" />
                      ) : (
                        <EyeOff className="size-5"/>
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-auth-border [&>svg]:h-10 [&>svg]:w-7 dark:bg-transparent"
                    />
                  </FormControl>
                  <FormLabel className="text-sm md:text-base md:font-medium text-black cursor-pointer">
                    Keep me logged in
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link to="/auth/forgot-password" className="text-sm md:text-base font-medium cursor-pointer text-auth-text">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-black h-12 hover:bg-black text-base font-medium rounded-full mt-7"
          >
            Log In
          </Button>
        </form>
      </Form>
      <div className="mt-7 text-center">
        <p className="text-base font-medium text-black">
          Not registered yet?{" "}
          <Link
            to="/auth/signup"
            className="text-auth-text cursor-pointer font-medium text-base"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
