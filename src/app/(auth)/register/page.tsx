'use client'; // Needed for useState, framer-motion, and client-side logic

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Changed from next/router
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { Separator } from "@radix-ui/react-separator";
import { GoogleSignInButton } from "@/components/google-signin-button";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'student',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) { // Added password length check
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // Demo registration - in a real app, you'd create account via API
      // localStorage.setItem('spark-auth', 'true'); // Auth state should be managed server-side or via context/state management
      router.push('/dashboard'); // Redirect after successful registration
    }, 500);
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

      {error && (
        <Alert variant="destructive" className="mt-5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
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
            required
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
            required
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
            required
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

        <div className="flex items-start space-x-2"> {/* Changed items-center to items-start for better alignment */}
          <Checkbox
            id="terms"
            checked={formData.agreeTerms}
            onCheckedChange={handleCheckboxChange}
            required
            className="mt-1" // Added margin top for alignment
          />
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70" // Adjusted leading
          >
            I agree to the{" "}
            <Link
              href="#" // Link to actual terms page
              className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
            >
              terms of service
            </Link>
            {" "}and{" "}
            <Link
              href="#" // Link to actual privacy policy page
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

      {/* Google Auth */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center items-center text-xs uppercase py-6">
          <hr className='flex-1'></hr>
          <span className="bg-background px-2 text-muted-foreground">OR</span>
          <hr className='flex-1'></hr>
        </div>
      </div>

      <GoogleSignInButton />

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <Link
          href="/login"
          className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
