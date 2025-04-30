'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

// Mock data for the score chart
const scoreData = [
  { name: 'Jan', score: 65, average: 72 },
  { name: 'Feb', score: 75, average: 74 },
  { name: 'Mar', score: 85, average: 75 },
  { name: 'Apr', score: 70, average: 73 },
  { name: 'May', score: 90, average: 78 },
  { name: 'Jun', score: 95, average: 79 },
];

// Mock data for upcoming tests
const upcomingTests = [
  { id: 1, title: 'Basic Calculus', due: '2h 30m', category: 'Mathematics' },
  { id: 2, title: 'Grammar Proficiency', due: '1d 4h', category: 'English' },
  { id: 3, title: 'Chemical Reactions', due: '2d', category: 'Chemistry' },
];

// Mock data for leaderboard
const leaderboardData = [
  { id: 1, name: 'Emma Thompson', score: 98, avatar: 'https://i.pravatar.cc/150?img=36' },
  { id: 2, name: 'Daniel Lee', score: 94, avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: 3, name: 'Olivia Martinez', score: 91, avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 4, name: 'You', score: 87, avatar: 'https://i.pravatar.cc/150?img=12', isCurrentUser: true },
  { id: 5, name: 'Michael Johnson', score: 85, avatar: 'https://i.pravatar.cc/150?img=59' },
];

// Mock data for recent activity
const recentActivity = [
  { 
    id: 1, 
    type: 'test_completed', 
    title: 'Advanced Physics', 
    score: 92, 
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

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<string>('6m');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your progress.</p>
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={scoreData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Your Score"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="Class Average"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top performers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {leaderboardData.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-yellow-500 text-white font-bold shrink-0">
                    {index + 1}
                  </div>
                  <Avatar className="h-9 w-9 ml-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Score: {user.score}%
                    </p>
                  </div>
                  {index === 0 && (
                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Your Ranking</h4>
              <div className="flex items-center">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted text-muted-foreground font-bold shrink-0">
                  4
                </div>
                <Avatar className="h-9 w-9 ml-3 ring-2 ring-yellow-500">
                  <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="You" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">You</p>
                  <p className="text-sm text-muted-foreground">
                    Score: 87%
                  </p>
                </div>
              </div>
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
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
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
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
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