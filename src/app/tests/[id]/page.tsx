'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, ArrowRight, Save, Flag, Check, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for a test
const mockTestData = {
  id: 1,
  title: "Basic Algebra",
  duration: 45, // in minutes
  questions: [
    {
      id: 1,
      text: "If 3x + 7 = 22, what is the value of x?",
      options: [
        { id: 'a', text: '3' },
        { id: 'b', text: '5' },
        { id: 'c', text: '7' },
        { id: 'd', text: '9' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 2,
      text: "Simplify the expression: 2(x + 3) - 4x",
      options: [
        { id: 'a', text: '2x + 6' },
        { id: 'b', text: '-2x + 6' },
        { id: 'c', text: '6 - 2x' },
        { id: 'd', text: '6 + 2x' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 3,
      text: "Solve for y: 2y - 5 = 11",
      options: [
        { id: 'a', text: '3' },
        { id: 'b', text: '8' },
        { id: 'c', text: '-3' },
        { id: 'd', text: '16' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 4,
      text: "What is the slope of the line passing through the points (2, 3) and (6, 7)?",
      options: [
        { id: 'a', text: '0.5' },
        { id: 'b', text: '1' },
        { id: 'c', text: '1.5' },
        { id: 'd', text: '2' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 5,
      text: "What is the solution to the equation 4x² - 9 = 0?",
      options: [
        { id: 'a', text: 'x = ±1.5' },
        { id: 'b', text: 'x = ±3/2' },
        { id: 'c', text: 'x = ±3' },
        { id: 'd', text: 'x = ±2.25' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 6,
      text: "If f(x) = 2x² - 3x + 1, what is the value of f(2)?",
      options: [
        { id: 'a', text: '3' },
        { id: 'b', text: '5' },
        { id: 'c', text: '7' },
        { id: 'd', text: '9' },
      ],
      correctAnswer: 'a',
    },
    {
      id: 7,
      text: "Expand (x + 2)(x - 3)",
      options: [
        { id: 'a', text: 'x² - 3x + 2x - 6' },
        { id: 'b', text: 'x² - x - 6' },
        { id: 'c', text: 'x² - 5x + 6' },
        { id: 'd', text: 'x² + 5x - 6' },
      ],
      correctAnswer: 'b',
    },
    {
      id: 8,
      text: "Factor completely: x² - 16",
      options: [
        { id: 'a', text: '(x - 4)(x + 4)' },
        { id: 'b', text: '(x - 8)(x + 2)' },
        { id: 'c', text: '(x - 16)(x + 1)' },
        { id: 'd', text: '(x - 4)²' },
      ],
      correctAnswer: 'a',
    },
    {
      id: 9,
      text: "If y varies directly with x, and y = 12 when x = 4, find y when x = 7.",
      options: [
        { id: 'a', text: '16' },
        { id: 'b', text: '18' },
        { id: 'c', text: '21' },
        { id: 'd', text: '24' },
      ],
      correctAnswer: 'c',
    },
    {
      id: 10,
      text: "What is the inverse of f(x) = 3x + 2?",
      options: [
        { id: 'a', text: 'f⁻¹(x) = (x - 2)/3' },
        { id: 'b', text: 'f⁻¹(x) = 3x - 2' },
        { id: 'c', text: 'f⁻¹(x) = (x + 2)/3' },
        { id: 'd', text: 'f⁻¹(x) = x/3 - 2' },
      ],
      correctAnswer: 'a',
    },
  ],
};

interface UserAnswer {
  questionId: number;
  answer: string | null;
  marked: boolean;
}

interface TimerDisplayProps {
  timeLeft: number;
  progress: number;
}

const TimerDisplay = ({ timeLeft, progress }: TimerDisplayProps) => {
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Format time as MM:SS
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="relative mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1.5 text-yellow-500" />
          <span className="font-medium">Time Remaining</span>
        </div>
        <span className="text-lg font-medium">{formattedTime}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default function TestDetail() {
  const router = useRouter();
  // const params = useParams();
  // const testId = params.id as string;
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(mockTestData.duration * 60); // Convert minutes to seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Initialize user answers
  useEffect(() => {
    const initialAnswers = mockTestData.questions.map(q => ({
      questionId: q.id,
      answer: null,
      marked: false,
    }));
    setUserAnswers(initialAnswers);
  }, []);

  // Submit test - memoized with useCallback
  const handleSubmitTest = useCallback(() => {
    // Calculate score
    let correctAnswers = 0;
    userAnswers.forEach((userAnswer, index) => {
      if (userAnswer.answer === mockTestData.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / mockTestData.questions.length) * 100);
    setScore(finalScore);
    setTestSubmitted(true);
    
    toast("Test submitted successfully", {
      description: `Your score: ${finalScore}%`,
    });
  }, [userAnswers, toast]);
  
  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !testSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      // Clean up the timer
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !testSubmitted) {
      // Auto-submit when time is up
      handleSubmitTest();
    }
  }, [timeLeft, testSubmitted, handleSubmitTest]);
  
  // Current question
  const currentQuestion = mockTestData.questions[currentQuestionIndex];
  
  // Calculate timer progress
  const timerProgress = (timeLeft / (mockTestData.duration * 60)) * 100;
  
  // Handle answer selection
  const handleSelectAnswer = (answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      answer,
    };
    setUserAnswers(updatedAnswers);
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < mockTestData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Toggle mark for review
  const toggleMarkForReview = () => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      marked: !updatedAnswers[currentQuestionIndex].marked,
    };
    setUserAnswers(updatedAnswers);
    
    toast(updatedAnswers[currentQuestionIndex].marked 
        ? "Question marked for review"
        : "Mark removed", { 
      description: updatedAnswers[currentQuestionIndex].marked 
        ? "You can review this question later"
        : "This question is no longer marked for review",
    });
  };
  
  // Navigate to a specific question
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  // Get button style based on question status
  const getQuestionButtonStyle = (index: number) => {
    const answer = userAnswers[index];
    if (!answer) return "bg-muted text-muted-foreground";
    
    if (testSubmitted) {
      const isCorrect = answer.answer === mockTestData.questions[index].correctAnswer;
      if (isCorrect) return "bg-green-500 text-white";
      if (answer.answer) return "bg-red-500 text-white";
      return "bg-muted text-muted-foreground";
    }
    
    if (answer.marked) return "bg-yellow-500 text-white";
    if (answer.answer) return "bg-blue-500 text-white";
    return "bg-muted text-muted-foreground";
  };
  
  // Determine if the test can be submitted
  const canSubmit = userAnswers.some(answer => answer.answer !== null);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{mockTestData.title}</h1>
        {!testSubmitted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/tests')}
          >
            Exit Test
          </Button>
        )}
      </div>
      
      {!testSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Question area - 3/4 width on desktop */}
          <Card className="lg:col-span-3 flex flex-col">
            <CardContent className="flex flex-col h-full pt-6">
              <TimerDisplay timeLeft={timeLeft} progress={timerProgress} />
              
              <div className="mb-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span>Question {currentQuestionIndex + 1} of {mockTestData.questions.length}</span>
                </div>
                <div className="text-xl font-medium mb-8">
                  {currentQuestion.text}
                </div>
                
                <RadioGroup
                  value={userAnswers[currentQuestionIndex]?.answer || ""}
                  onValueChange={handleSelectAnswer}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3 border rounded-lg p-4 transition-colors hover:bg-muted/50"
                    >
                      <RadioGroupItem 
                        value={option.id} 
                        id={`option-${option.id}`} 
                        className="text-yellow-500 border-yellow-500"
                      />
                      <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={toggleMarkForReview}
                    className="flex items-center"
                  >
                    <Flag className={`h-4 w-4 mr-2 ${userAnswers[currentQuestionIndex]?.marked ? 'text-yellow-500' : ''}`} />
                    {userAnswers[currentQuestionIndex]?.marked ? 'Unmark' : 'Mark'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {/* Save functionality */}}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
                
                {currentQuestionIndex < mockTestData.questions.length - 1 ? (
                  <Button onClick={goToNextQuestion}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={!canSubmit}
                  >
                    Finish
                    <Check className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Question navigation - 1/4 width on desktop */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {mockTestData.questions.map((_, index) => (
                    <button
                      key={index}
                      className={`h-10 w-10 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                        index === currentQuestionIndex 
                          ? 'ring-2 ring-yellow-500' 
                          : ''
                      } ${getQuestionButtonStyle(index)}`}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2 mt-6">
                  <div className="flex items-center text-sm">
                    <span className="h-4 w-4 rounded-full bg-blue-500 mr-2"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="h-4 w-4 rounded-full bg-muted mr-2"></span>
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></span>
                    <span>Marked for review</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Summary</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Total Questions</span>
                      <span>{mockTestData.questions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Answered</span>
                      <span>{userAnswers.filter(a => a.answer !== null).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Unanswered</span>
                      <span>{userAnswers.filter(a => a.answer === null).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marked for Review</span>
                      <span>{userAnswers.filter(a => a.marked).length}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={!canSubmit}
                  >
                    Submit Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Test Results */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Score summary */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-muted mb-4">
                  <span className="text-4xl font-bold">{score}%</span>
                </div>
                <h2 className="text-2xl font-bold">Test Completed</h2>
                <p className="text-muted-foreground mt-2 mb-6">
                  You&apos;ve completed the {mockTestData.title} test
                </p>
                <div className="space-y-1 text-sm text-left mb-8">
                  <div className="flex justify-between py-1">
                    <span>Total Questions</span>
                    <span className="font-medium">{mockTestData.questions.length}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Correct Answers</span>
                    <span className="font-medium">{Math.round((score / 100) * mockTestData.questions.length)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Incorrect Answers</span>
                    <span className="font-medium">
                      {mockTestData.questions.length - Math.round((score / 100) * mockTestData.questions.length)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Time Taken</span>
                    <span className="font-medium">
                      {Math.floor((mockTestData.duration * 60 - timeLeft) / 60)}m {(mockTestData.duration * 60 - timeLeft) % 60}s
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => router.push('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push('/tests')}
                  >
                    Browse More Tests
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Questions review */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4">Review Your Answers</h3>
              <div className="space-y-6">
                {mockTestData.questions.map((question, index) => {
                  const userAnswer = userAnswers[index]?.answer;
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">Question {index + 1}</span>
                          {userAnswer && (
                            <span className="ml-2">
                              {isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </span>
                          )}
                          {!userAnswer && (
                            <span className="ml-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                            </span>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          isCorrect ? 'text-green-500' : userAnswer ? 'text-red-500' : 'text-yellow-500'
                        }`}>
                          {isCorrect ? '+1 point' : userAnswer ? '0 points' : 'Not answered'}
                        </span>
                      </div>
                      <p className="mb-4">{question.text}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <div 
                            key={option.id}
                            className={`p-3 rounded-md text-sm ${
                              option.id === question.correctAnswer
                                ? 'bg-green-500/10 border border-green-500/20'
                                : option.id === userAnswer
                                  ? 'bg-red-500/10 border border-red-500/20'
                                  : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="mr-2">
                                {option.id === question.correctAnswer ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : option.id === userAnswer ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <span className="h-4 w-4 block"></span>
                                )}
                              </div>
                              <span>{option.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {userAnswer && userAnswer !== question.correctAnswer && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium text-muted-foreground">
                            Correct answer: Option {question.correctAnswer.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Confirm submission dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this test? You won&apos;t be able to change your answers after submission.
              <div className="mt-4 border rounded-md p-3 bg-muted/30">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total Questions</span>
                    <span className="font-medium">{mockTestData.questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Answered</span>
                    <span className="font-medium">{userAnswers.filter(a => a.answer !== null).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Unanswered</span>
                    <span className="font-medium">{userAnswers.filter(a => a.answer === null).length}</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={handleSubmitTest}
            >
              Submit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}