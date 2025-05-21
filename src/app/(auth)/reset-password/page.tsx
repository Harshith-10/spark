'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Lock } from 'lucide-react';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClientComponentClient();

  // When the page loads, check if we have a proper auth token
  useEffect(() => {
    // First, check URL search params for token (from the email link)
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    // If we don't have the necessary params, we may need to show an error message
    if (!token || type !== 'recovery') {
      // Fallback - also check hash parameters (might be coming from auth session)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (!accessToken) {
        toast.error("Invalid or expired reset link. Please request a new password reset.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsResetting(true);
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      // Show success message
      setIsSuccess(true);
      toast.success("Password updated successfully");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 2000);
      
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An error occurred during password reset");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">
          {isSuccess 
            ? "Your password has been reset successfully. Redirecting to login..." 
            : "Enter your new password below"}
        </p>
      </div>

      {!isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isResetting}
              required
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isResetting}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600"
            disabled={isResetting}
          >
            {isResetting ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      )}
    </motion.div>
  );
}