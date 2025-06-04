'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import * as RechartsPrimitive from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useUser } from '@/contexts/user-context';
import UserProfile from '@/components/user-profile';

// Types
interface LeaderboardUser {
  id: number;
  name: string;
  score: number;
  avatar: string;
  isCurrentUser?: boolean;
}

// Mock data for the score chart
const scoreData = [
  { name: 'Jan', score: 78, average: 68 },
  { name: 'Feb', score: 75, average: 65 },
  { name: 'Mar', score: 85, average: 69 },
  { name: 'Apr', score: 96, average: 73 },
  { name: 'May', score: 90, average: 64 },
  { name: 'Jun', score: 98, average: 65 },
];

// Mock data for upcoming tests
const upcomingTests = [
  { id: 1, title: 'Basic Calculus', due: '2h 30m', category: 'Mathematics' },
  { id: 2, title: 'Grammar Proficiency', due: '1d 4h', category: 'English' },
  { id: 3, title: 'Chemical Reactions', due: '2d', category: 'Chemistry' },
];

// Mock data for leaderboard
const leaderboardData : LeaderboardUser[] = [
  { id: 1, name: 'Yechii', score: 98, avatar: '/images/yechika.jpg' },
  { id: 3, name: 'Yakshika', score: 95, avatar: '/images/yakshika.png' },
  { id: 2, name: 'Harshith', score: 91, avatar: '/images/harshith.jpg' },
];

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    type: 'test_completed',
    title: 'Advanced Physics',
    score: 98,
    maxScore: 100,
    date: '2d ago'
  },
  {
    id: 2,
    type: 'badge_earned',
    badgeName: 'Top 10%',
    test: 'World History',
    date: '3d ago'
  },
  {
    id: 3,
    type: 'streak',
    days: 7,
    date: '1w ago'
  },
];

// Chart config for different data series
const chartConfig = {
  score: {
    label: "Your Score",
    theme: {
      light: "#ffb100",
      dark: "#ffb100",
    },
  },
  average: {
    label: "Class Average",
    theme: {
      light: "#2563eb",
      dark: "#3b82f6",
    },
  },
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<string>('6m');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { user } = useUser();
  // Generate leaderboard data with actual user information
  const getLeaderboardData = (): LeaderboardUser[] => {
    const baseData = leaderboardData;

    // Add current user to leaderboard
    if (user) {
      baseData.push({
        id: 4,
        name: user.name || 'You',
        score: 90,
        avatar: user.image || '/images/avatar.jpg',
        isCurrentUser: true
      });
    }

    return baseData;
  };

  useEffect(() => {
    // Reset animations when timeRange changes
    const timer = setTimeout(() => {
      // This would trigger a re-render if we needed to reset animations
      // when changing time ranges
    }, 100);

    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your progress.</p>
        </div>
        <div className="flex items-center space-x-4">
          <UserProfile variant="compact" showEmail={false} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">
              Keep going!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tutor Sessions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9" />
              <path d="M9 21h6" />
              <path d="M12 18v3" />
              <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1H3Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Score Performance</CardTitle>
              <div className="flex space-x-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-yellow-500/10 transition-colors",
                    timeRange === '1m' && "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                  )}
                  onClick={() => setTimeRange('1m')}
                >
                  1M
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-yellow-500/10 transition-colors",
                    timeRange === '3m' && "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                  )}
                  onClick={() => setTimeRange('3m')}
                >
                  3M
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-yellow-500/10 transition-colors",
                    timeRange === '6m' && "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                  )}
                  onClick={() => setTimeRange('6m')}
                >
                  6M
                </Badge>
              </div>
            </div>
            <CardDescription>
              Compare your scores with the class average over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig} className="!aspect-auto h-full">
                <RechartsPrimitive.LineChart
                  data={scoreData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 6 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: "#888", strokeDasharray: "4 4", opacity: 0.3 }}
                  />
                  <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" height={36} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="score"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    stroke={isDarkMode ? chartConfig.score.theme.dark : chartConfig.score.theme.light}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="average"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    stroke={isDarkMode ? chartConfig.average.theme.dark : chartConfig.average.theme.light}
                  />
                </RechartsPrimitive.LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top performers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getLeaderboardData().slice(0, 3).map((userData, index) => (
                <div key={userData.id} className={`flex items-center p-2 rounded-lg ${userData.isCurrentUser ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : ''}`}>
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold shrink-0 text-sm ${
                    index < 3 ? 'bg-yellow-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <Avatar className="h-8 w-8 ml-3">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-xs">
                      {userData.name ? userData.name.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{userData.name}</p>
                      {userData.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Score: {userData.score}%
                    </p>
                  </div>
                  <div className="ml-auto font-bold text-sm">
                    {userData.score}%
                  </div>
                  {index < 3 && (
                    <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                        <circle cx="12" cy="8" r="6"></circle>
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Tests</CardTitle>
            <CardDescription>Tests scheduled in the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{test.title}</h4>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs">
                        {test.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-500">{test.due} left</p>
                    <button className="text-xs text-muted-foreground hover:text-foreground mt-1">
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-center text-muted-foreground hover:text-foreground py-2 border-t">
              View all tests
            </button>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Your recent test activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center p-3 border rounded-lg">
                    {activity.type === 'test_completed' && (
                      <>
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-5 w-5 text-yellow-500"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Completed Test</h4>
                            <p className="text-sm text-muted-foreground">{activity.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{activity.score}/{activity.maxScore}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </>
                    )}

                    {activity.type === 'badge_earned' && (
                      <>
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-5 w-5 text-yellow-500"
                            >
                              <circle cx="12" cy="8" r="6" />
                              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Badge Earned</h4>
                            <p className="text-sm text-muted-foreground">{activity.badgeName} in {activity.test}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </>
                    )}

                    {activity.type === 'streak' && (
                      <>
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="h-5 w-5 text-yellow-500"
                            >
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1-1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Achievement Unlocked</h4>
                            <p className="text-sm text-muted-foreground">{activity.days} day streak!</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="tests" className="space-y-4">
                {recentActivity
                  .filter(a => a.type === 'test_completed')
                  .map((activity) => (
                    <div key={activity.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-5 w-5 text-yellow-500"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Completed Test</h4>
                          <p className="text-sm text-muted-foreground">{activity.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{activity.score}/{activity.maxScore}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                {recentActivity
                  .filter(a => a.type === 'badge_earned' || a.type === 'streak')
                  .map((activity) => (
                    <div key={activity.id} className="flex justify-between items-center p-3 border rounded-lg">
                      {activity.type === 'badge_earned' && (
                        <>
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-5 w-5 text-yellow-500"
                              >
                                <circle cx="12" cy="8" r="6" />
                                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Badge Earned</h4>
                              <p className="text-sm text-muted-foreground">{activity.badgeName} in {activity.test}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </>
                      )}

                      {activity.type === 'streak' && (
                        <>
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-5 w-5 text-yellow-500"
                              >
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1-1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Achievement Unlocked</h4>
                              <p className="text-sm text-muted-foreground">{activity.days} day streak!</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}