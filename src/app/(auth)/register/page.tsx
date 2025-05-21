'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

// Create a wrapper component that will use the useSearchParams hook
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'student',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, accountType: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (!formData.agreeTerms) {
      toast.error("You must agree to the terms of service and privacy policy");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            account_type: formData.accountType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          toast.error("An account with this email already exists");
          return;
        }
        
        toast.success("Registration successful! Please check your email to verify your account.");
        
        // After successful registration, either redirect or stay on the page depending on if email confirmation is required
        if (data.session) {
          router.push(redirect);
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo user info helper
  const fillDemoInfo = () => {
    setFormData({
      fullName: 'New Demo User',
      email: 'new-demo@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      accountType: 'student',
      agreeTerms: true
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">
          Enter your information to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Account Type</Label>
          <div className="flex max-w-[160] items-center justify-between cursor-pointer">
            <span
              className={`flex-grow text-sm border px-4 py-2 rounded-s-md bg-muted transition duration-300 ${formData.accountType === 'student' && 'border-yellow-500 bg-yellow-500/20 text-yellow-300'}`}
              onClick={() => handleRadioChange('student')}
            >Student</span>
            <span
              className={`flex-grow text-sm border px-4 py-2 rounded-e-md bg-muted transition duration-300 ${formData.accountType === 'teacher' && 'border-yellow-500 bg-yellow-500/20 text-yellow-300'}`}
              onClick={() => handleRadioChange('teacher')}
            >Teacher</span>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeTerms}
            onCheckedChange={handleCheckboxChange}
            className="mt-1"
          />
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link
              href="#"
              className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
            >
              terms of service
            </Link>
            {" "}and{" "}
            <Link
              href="#"
              className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
            >
              privacy policy
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <Button
        onClick={fillDemoInfo}
        variant="ghost"
        className="w-full mt-4 text-sm text-muted-foreground hover:text-primary"
      >
        Fill with demo information
      </Button>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <Link
          href="/login"
          className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
        >
          Sign in
        </Link>
      </div>

      <div className="mt-6 p-3 border rounded-md text-sm text-muted-foreground bg-muted/50">
        <p className="font-medium mb-1">Note</p>
        <p>This is a simplified registration page. All registration attempts redirect to the dashboard.</p>
      </div>
    </motion.div>
  );
}

// A fallback component to show while the content is loading
function RegisterFormFallback() {
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mx-auto"></div>
        <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-16 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ))}
        <div className="h-10 bg-muted rounded mt-6"></div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<RegisterFormFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
