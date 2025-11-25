import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import GoogleIcon from "@/assets/svgs/googleicon.svg?react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean(),
});

export default function LoginForm({
  setActiveTab,
}: {
  setActiveTab: (value: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success(
      `Logged in successfully!\n\nEmail: ${values.email}\nRemember me: ${
        values.rememberMe ? "Yes" : "No"
      }`
    );
    form.reset();
  }

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-muted"
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
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="bg-muted pr-10"
                    />
                    <Button
                      type="button"
                      className="!absolute top-0 right-0 text-muted-foreground"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm">Remember me</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center gap-4 py-4">
        <div className="flex flex-col items-center gap-2">
          <p>Login with</p>
          <GoogleIcon className="size-10" />
        </div>

        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => setActiveTab("signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </section>
  );
}
