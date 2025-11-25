import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import GoogleIcon from '@/assets/svgs/googleicon.svg?react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z
    .object({
        email: z.string().email({
            message: 'Please enter a valid email address.',
        }),
        phoneNumber: z
            .string()
            .min(10, {
                message: 'Phone number must be at least 10 digits.',
            })
            .max(15, {
                message: 'Phone number must be at most 15 digits.',
            })
            .regex(/^[0-9+]+$/, {
                message: 'Phone number can only contain numbers and +',
            }),
        password: z.string().min(6, {
            message: 'Password must be at least 6 characters.',
        }),
        confirmPassword: z.string().min(6, {
            message: 'Password must be at least 6 characters.',
        }),
        termAndCondition: z.boolean().refine(value => value, {
            message: 'You must agree to the terms and conditions.',
        }),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export default function SignUpForm({ setActiveTab }: { setActiveTab?: (value: string) => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            termAndCondition: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);

        localStorage.setItem('persist:userInfo', JSON.stringify(values));

        toast.success(
            `Account created successfully!\n\nUsername: Email: ${values.email}\nPhone: ${values.phoneNumber}`
        );

        form.reset();
    }

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
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
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="tel"
                                        placeholder="Phone Number"
                                        {...field}
                                        className="bg-muted"
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
                                            type={showPassword ? 'text' : 'password'}
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
                                                {showPassword ? 'Hide password' : 'Show password'}
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
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            {...field}
                                            className="bg-muted pr-10"
                                        />
                                        <Button
                                            type="button"
                                            className="!absolute top-0 right-0 text-muted-foreground"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {showConfirmPassword
                                                    ? 'Hide password'
                                                    : 'Show password'}
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
                        name="termAndCondition"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm">
                                    I agree to the terms and conditions
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                </form>
            </Form>

            <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex flex-col items-center gap-2">
                    <p>Sign up with</p>
                    <GoogleIcon className="size-10" />
                </div>

                {setActiveTab && (
                    <p className="text-muted-foreground text-sm">
                        Already have an account?{' '}
                        <span
                            className="text-primary cursor-pointer"
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </span>
                    </p>
                )}
            </div>
        </section>
    );
}
