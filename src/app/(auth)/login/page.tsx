"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';
import {GoogleSignInButton} from "@/components/google-signin-button";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call - in a real application you would implement actual authentication here
    setTimeout(() => {
      // Simply redirect to dashboard - no actual authentication in this simplified version
      router.push('/dashboard');
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
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
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
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label 
            htmlFor="remember" 
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-yellow-500 hover:bg-yellow-600"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
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
        <span className="text-muted-foreground">Don&apos;t have an account?</span>{" "}
        <Link 
          href="/register" 
          className="font-semibold text-yellow-500 hover:text-yellow-600 transition-colors"
        >
          Sign up
        </Link>
      </div>

      {/* Demo account notice - no longer needed since all logins redirect to dashboard */}
      <div className="mt-6 p-3 border rounded-md text-sm text-muted-foreground bg-muted/50">
        <p className="font-medium mb-1">Note</p>
        <p>All login attempts will redirect to the dashboard in this simplified version.</p>
      </div>
    </motion.div>
  );
}
