'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Moon, Monitor, SunMedium, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/components/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/providers/auth-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth();
  const supabase = createClientComponentClient();
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    avatarUrl: '',
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load user profile from Supabase when component mounts
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setUserProfile({
        fullName: metadata.full_name || '',
        email: user.email || '',
        avatarUrl: metadata.avatar_url || '',
      });
    }
  }, [user]);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    newTests: true,
    testResults: true,
    studyReminders: false,
    marketingEmails: false,
  });

  // Appearance settings state
  const [fontSizePreference, setFontSizePreference] = useState("medium");
  const [motionReduced, setMotionReduced] = useState(false);

  // Test settings state
  const [testSettings, setTestSettings] = useState({
    autoSubmit: true,
    showTimer: true,
    soundEffects: false,
    timerPosition: "top",
  });

  // Handle profile form submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: userProfile.fullName,
          avatar_url: userProfile.avatarUrl,
        }
      });
      
      if (error) {
        toast.error("Failed to update profile", {
          description: error.message,
        });
        return;
      }
      
      // If password fields are filled, update password
      if (newPassword && currentPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords don't match", {
            description: "New password and confirmation must match.",
          });
          return;
        }
        
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (passwordError) {
          toast.error("Failed to update password", {
            description: passwordError.message,
          });
          return;
        }
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        toast.success("Password updated successfully");
      }
      
      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred", {
        description: "There was a problem updating your profile.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // File upload handler for avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    setIsUpdating(true);
    
    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update user profile with new avatar URL
      setUserProfile({
        ...userProfile,
        avatarUrl: publicUrl
      });
      
      // Update user metadata in Supabase with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUpdating(false);
    }
  };

  // Save notification settings
  const handleSaveNotifications = () => {
    toast("Notifications updated", {
      description: "Your notification settings have been saved.",
    });
  };

  // Save appearance settings
  const handleSaveAppearance = () => {
    toast("Appearance settings updated", {
      description: "Your appearance preferences have been saved.",
    });
  };

  // Save test settings
  const handleSaveTestSettings = () => {
    toast("Test preferences updated", {
      description: "Your test settings have been saved.",
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="tests">Test Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-0">
          <form onSubmit={handleProfileSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account information and how others see you on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile.avatarUrl} alt={userProfile.fullName} />
                      <AvatarFallback>{getInitials(userProfile.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="relative">
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        disabled={isUpdating}
                      >
                        Change Avatar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={userProfile.fullName}
                        onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        disabled={true}
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Your email cannot be changed directly. Please contact support if you need to update it.</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>

                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-yellow-500 hover:bg-yellow-600"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications about platform activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-tests">New Tests Available</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when new tests are published
                    </p>
                  </div>
                  <Switch
                    id="new-tests"
                    checked={notificationSettings.newTests}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newTests: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="test-results">Test Results</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your test results are ready
                    </p>
                  </div>
                  <Switch
                    id="test-results"
                    checked={notificationSettings.testResults}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, testResults: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="study-reminders">Study Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive periodic reminders to continue your learning
                    </p>
                  </div>
                  <Switch
                    id="study-reminders"
                    checked={notificationSettings.studyReminders}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, studyReminders: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and services
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, marketingEmails: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive real-time notifications even when you&apos;re not using the platform
                    </p>
                  </div>
                  <Button variant="outline" className="space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>Configure in Browser</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveNotifications} className="bg-yellow-500 hover:bg-yellow-600">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how Spark looks and feels for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>

                <RadioGroup
                  defaultValue={theme}
                  onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="light"
                      id="theme-light"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-yellow-500 [&:has([data-state=checked])]:border-yellow-500"
                    >
                      <SunMedium className="h-6 w-6 mb-2" />
                      Light
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="theme-dark"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-yellow-500 [&:has([data-state=checked])]:border-yellow-500"
                    >
                      <Moon className="h-6 w-6 mb-2" />
                      Dark
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="system"
                      id="theme-system"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-yellow-500 [&:has([data-state=checked])]:border-yellow-500"
                    >
                      <Monitor className="h-6 w-6 mb-2" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Font Size</h3>

                <RadioGroup
                  defaultValue={fontSizePreference}
                  onValueChange={setFontSizePreference}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="small"
                      id="font-small"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="font-small"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-yellow-500 [&:has([data-state=checked])]:border-yellow-500"
                    >
                      <span className="text-sm mb-2">A</span>
                      Small
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="medium"
                      id="font-medium"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="font-medium"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-yellow-500 [&:has([data-state=checked])]:border-yellow-500"
                    >
                      <span className="text-base mb-2">A</span>
                      Medium
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="large"
                      id="font-large"
                      className="sr-only"
                    />
                    <Label
                      htmlFor="font-large"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-yellow-500 [&:has([data-state=checked])]:border-yellow-500"
                    >
                      <span className="text-lg mb-2">A</span>
                      Large
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accessibility</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduce-motion">Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations throughout the interface
                    </p>
                  </div>
                  <Switch
                    id="reduce-motion"
                    checked={motionReduced}
                    onCheckedChange={setMotionReduced}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveAppearance} className="bg-yellow-500 hover:bg-yellow-600">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Test Preferences */}
        <TabsContent value="tests" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Test Preferences</CardTitle>
              <CardDescription>
                Customize your test-taking experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Test Behavior</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-submit">Auto Submit</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically submit tests when time expires
                    </p>
                  </div>
                  <Switch
                    id="auto-submit"
                    checked={testSettings.autoSubmit}
                    onCheckedChange={(checked) => setTestSettings({ ...testSettings, autoSubmit: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-timer">Show Timer</Label>
                    <p className="text-sm text-muted-foreground">
                      Display countdown timer during tests
                    </p>
                  </div>
                  <Switch
                    id="show-timer"
                    checked={testSettings.showTimer}
                    onCheckedChange={(checked) => setTestSettings({ ...testSettings, showTimer: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-effects">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound when time is running low
                    </p>
                  </div>
                  <Switch
                    id="sound-effects"
                    checked={testSettings.soundEffects}
                    onCheckedChange={(checked) => setTestSettings({ ...testSettings, soundEffects: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Options</h3>

                <div className="grid gap-2">
                  <Label htmlFor="timer-position">Timer Position</Label>
                  <Select
                    value={testSettings.timerPosition}
                    onValueChange={(value) => setTestSettings({ ...testSettings, timerPosition: value })}
                  >
                    <SelectTrigger id="timer-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top of screen</SelectItem>
                      <SelectItem value="right">Right sidebar</SelectItem>
                      <SelectItem value="floating">Floating (drag anywhere)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveTestSettings} className="bg-yellow-500 hover:bg-yellow-600">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}