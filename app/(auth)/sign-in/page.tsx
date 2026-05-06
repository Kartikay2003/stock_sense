'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if (result.success) {
                router.push('/');
            }
            else {
                toast.error('Sign in failed', {
                    description: result.error || 'Invalid credentials'
                });
            }
        }
        catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to sign in'
            });
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    autoComplete="off"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid Email address!'
                        }
                    }}
                />

                <div className="relative">
                    <InputField
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        register={register}
                        error={errors.password}
                        validation={{ required: 'Password is required' }}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-10 text-gray-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
            </form>
        </>
    );
};
export default SignIn;