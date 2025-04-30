'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Moon, Monitor, SunMedium, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/components/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?img=68",
  });
  
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
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Profile updated", {
      description: "Your profile information has been updated successfully.",
    });
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
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
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
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="outline">
                      Change Avatar
                    </Button>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newTests: checked})}
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
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, testResults: checked})}
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
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, studyReminders: checked})}
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
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
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
                    onCheckedChange={(checked) => setTestSettings({...testSettings, autoSubmit: checked})}
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
                    onCheckedChange={(checked) => setTestSettings({...testSettings, showTimer: checked})}
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
                    onCheckedChange={(checked) => setTestSettings({...testSettings, soundEffects: checked})}
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
                    onValueChange={(value) => setTestSettings({...testSettings, timerPosition: value})}
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