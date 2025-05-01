'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, BookOpen, ChevronRight, CheckIcon, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Test {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    questions: number;
    duration: number;
    hasProgress: boolean;
    progress?: number;
    questionsAnswered?: number;
}

// Mock data for tests
const availableTests: Test[] = [
    {
        id: 1,
        title: "Basic Algebra",
        category: "Mathematics",
        difficulty: "Beginner",
        questions: 20,
        duration: 45,
        hasProgress: false,
    },
    {
        id: 2,
        title: "English Grammar",
        category: "English",
        difficulty: "Intermediate",
        questions: 30,
        duration: 60,
        hasProgress: false,
    },
    {
        id: 3,
        title: "World History",
        category: "Social Studies",
        difficulty: "Advanced",
        questions: 25,
        duration: 50,
        hasProgress: false,
    },
    {
        id: 4,
        title: "Chemistry Fundamentals",
        category: "Science",
        difficulty: "Intermediate",
        questions: 15,
        duration: 30,
        hasProgress: false,
    },
    {
        id: 5,
        title: "Computer Programming",
        category: "Computer Science",
        difficulty: "Advanced",
        questions: 35,
        duration: 70,
        hasProgress: false,
    },
    {
        id: 6,
        title: "Basic Physics",
        category: "Science",
        difficulty: "Beginner",
        questions: 20,
        duration: 40,
        hasProgress: false,
    },
];

const inProgressTests: Test[] = [
    {
        id: 7,
        title: "Advanced Calculus",
        category: "Mathematics",
        difficulty: "Advanced",
        questions: 25,
        duration: 60,
        hasProgress: true,
        progress: 40,
        questionsAnswered: 10,
    },
    {
        id: 8,
        title: "Literary Analysis",
        category: "English",
        difficulty: "Intermediate",
        questions: 30,
        duration: 55,
        hasProgress: true,
        progress: 70,
        questionsAnswered: 21,
    },
];

// Define available filter options
const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const categoryOptions = ["Mathematics", "English", "Science", "Social Studies", "Computer Science"];

// Combine and sort mock data
const allTests = [...inProgressTests, ...availableTests];

export default function Tests() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTests, setFilteredTests] = useState(allTests);
    const [activeTab, setActiveTab] = useState("all");

    // New state for filters
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Apply all filters (search, tab, difficulty, category)
    const applyFilters = (
        tests: Test[],
        term: string,
        tab: string,
        difficulty: string | null,
        category: string | null
    ) => {
        return tests.filter(test => {
            // Filter by search term
            const matchesSearch = !term ||
                test.title.toLowerCase().includes(term.toLowerCase()) ||
                test.category.toLowerCase().includes(term.toLowerCase());

            // Filter by tab (progress status)
            const matchesTab = tab === "all" ||
                (tab === "inProgress" && test.hasProgress) ||
                (tab === "available" && !test.hasProgress);

            // Filter by difficulty
            const matchesDifficulty = !difficulty || test.difficulty === difficulty;

            // Filter by category
            const matchesCategory = !category || test.category === category;

            return matchesSearch && matchesTab && matchesDifficulty && matchesCategory;
        });
    };

    // Filter tests based on search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        setFilteredTests(applyFilters(
            allTests,
            term,
            activeTab,
            selectedDifficulty,
            selectedCategory
        ));
    };

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value);

        setFilteredTests(applyFilters(
            allTests,
            searchTerm,
            value,
            selectedDifficulty,
            selectedCategory
        ));
    };

    // Handle difficulty filter selection
    const handleDifficultySelect = (difficulty: string) => {
        const newValue = selectedDifficulty === difficulty ? null : difficulty;
        setSelectedDifficulty(newValue);

        setFilteredTests(applyFilters(
            allTests,
            searchTerm,
            activeTab,
            newValue,
            selectedCategory
        ));
    };

    // Handle category filter selection
    const handleCategorySelect = (category: string) => {
        const newValue = selectedCategory === category ? null : category;
        setSelectedCategory(newValue);

        setFilteredTests(applyFilters(
            allTests,
            searchTerm,
            activeTab,
            selectedDifficulty,
            newValue
        ));
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedDifficulty(null);
        setSelectedCategory(null);
        setSearchTerm("");

        setFilteredTests(applyFilters(
            allTests,
            "",
            activeTab,
            null,
            null
        ));
    };

    // Check if any filters are applied
    const hasActiveFilters = selectedDifficulty !== null || selectedCategory !== null || searchTerm !== "";

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    // Badge color based on difficulty
    const difficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Beginner":
                return "bg-green-500 hover:bg-green-600";
            case "Intermediate":
                return "bg-blue-500 hover:bg-blue-600";
            case "Advanced":
                return "bg-purple-500 hover:bg-purple-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
                    <p className="text-muted-foreground">Browse and take tests from various subjects</p>
                </div>
                <div className="w-full md:w-auto flex items-center space-x-2">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search tests..."
                            className="w-full md:w-[250px] pl-8"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className={`h-4 w-4 ${hasActiveFilters ? "text-yellow-500" : ""}`} />
                                <span className="hidden md:inline">Filter</span>
                                {hasActiveFilters && (
                                    <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5 rounded-full flex items-center justify-center">
                                        {(selectedDifficulty ? 1 : 0) + (selectedCategory ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <div className="flex items-center justify-between px-2 py-1.5">
                                <DropdownMenuLabel className="m-0 p-0">Filter by</DropdownMenuLabel>
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={clearFilters}>
                                        Clear all
                                    </Button>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Difficulty</DropdownMenuLabel>
                            {difficultyOptions.map(difficulty => (
                                <DropdownMenuItem
                                    key={difficulty}
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => handleDifficultySelect(difficulty)}
                                >
                                    {difficulty}
                                    {selectedDifficulty === difficulty && (
                                        <CheckIcon className="h-4 w-4 text-yellow-500" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Category</DropdownMenuLabel>
                            {categoryOptions.map(category => (
                                <DropdownMenuItem
                                    key={category}
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                    {selectedCategory === category && (
                                        <CheckIcon className="h-4 w-4 text-yellow-500" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {selectedDifficulty && (
                        <Badge variant="secondary" className="px-2 py-1 h-7 flex items-center gap-1">
                            Difficulty: {selectedDifficulty}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => handleDifficultySelect(selectedDifficulty)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {selectedCategory && (
                        <Badge variant="secondary" className="px-2 py-1 h-7 flex items-center gap-1">
                            Category: {selectedCategory}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => handleCategorySelect(selectedCategory)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {searchTerm && (
                        <Badge variant="secondary" className="px-2 py-1 h-7 flex items-center gap-1">
                            Search: {searchTerm}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilteredTests(applyFilters(allTests, "", activeTab, selectedDifficulty, selectedCategory));
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )}

            <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="mb-8">
                    <TabsTrigger value="all">All Tests</TabsTrigger>
                    <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                    <TabsTrigger value="available">Available</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    <motion.div
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        variants={container}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredTests.map((test) => (
                            <motion.div key={test.id} variants={item}>
                                <div onClick={() => router.push(`/tests/${test.id}?fullscreen=true`)} className="block group hover:scale-[1.02] transition-transform">
                                    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
                                        <CardHeader className="relative pb-0">
                                            {test.hasProgress && (
                                                <div className="absolute right-6">
                                                    <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>
                                                </div>
                                            )}
                                            <CardTitle className="text-xl group-hover:text-yellow-500 transition-colors">
                                                {test.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline">{test.category}</Badge>
                                                <Badge className={difficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                                <div className="flex items-center">
                                                    <BookOpen className="mr-1 h-4 w-4" />
                                                    {test.questions} questions
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="mr-1 h-4 w-4" />
                                                    {test.duration} min
                                                </div>
                                            </div>

                                            {test.hasProgress ? (
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>Progress</span>
                                                        <span className="font-medium">{test.questionsAnswered}/{test.questions}</span>
                                                    </div>
                                                    <Progress value={test.progress} className="h-2" />
                                                </div>
                                            ) : (
                                                <div className="mt-4 mb-3 text-sm text-muted-foreground">
                                                    <span className="font-medium">&nbsp;</span>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="border-t pt-4 flex justify-between">
                                            <div className="text-sm text-muted-foreground">
                                                {test.hasProgress ? "Continue" : "Start Test"}
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                                        </CardFooter>
                                    </Card>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {filteredTests.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Search className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No tests found</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Try adjusting your search or filter to find what you&apos;re looking for.
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="inProgress" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activeTab === "inProgress" && filteredTests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No tests in progress</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {hasActiveFilters
                                    ? "Try adjusting your filters to see your in-progress tests."
                                    : "You haven't started any tests yet. Browse the available tests and begin your journey."
                                }
                            </p>
                            {hasActiveFilters ? (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                                    onClick={() => handleTabChange("available")}
                                >
                                    Browse Tests
                                </Button>
                            )}
                        </div>
                    ) : filteredTests.map((test) => (
                        <motion.div key={test.id} variants={item}>
                            <div onClick={() => router.push(`/tests/${test.id}?fullscreen=true`)} className="block group hover:scale-[1.02] transition-transform">
                                <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
                                    <CardHeader className="relative pb-0">
                                        {test.hasProgress && (
                                            <div className="absolute right-6">
                                                <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>
                                            </div>
                                        )}
                                        <CardTitle className="text-xl group-hover:text-yellow-500 transition-colors">
                                            {test.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{test.category}</Badge>
                                            <Badge className={difficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                            <div className="flex items-center">
                                                <BookOpen className="mr-1 h-4 w-4" />
                                                {test.questions} questions
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4" />
                                                {test.duration} min
                                            </div>
                                        </div>

                                        {test.hasProgress ? (
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Progress</span>
                                                    <span className="font-medium">{test.questionsAnswered}/{test.questions}</span>
                                                </div>
                                                <Progress value={test.progress} className="h-2" />
                                            </div>
                                        ) : (
                                            <div className="mt-4 mb-3 text-sm text-muted-foreground">
                                                <span className="font-medium">&nbsp;</span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="border-t pt-4 flex justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            {test.hasProgress ? "Continue" : "Start Test"}
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                                    </CardFooter>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </TabsContent>

                <TabsContent value="available" className="mt-0">
                    {activeTab === "available" && filteredTests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Search className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No available tests found</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {hasActiveFilters
                                    ? "Try adjusting your filters to see available tests."
                                    : "Try adjusting your search or filter to find what you're looking for."}
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : filteredTests.map((test) => (
                        <motion.div key={test.id} variants={item}>
                            <div onClick={() => router.push(`/tests/${test.id}?fullscreen=true`)} className="block group hover:scale-[1.02] transition-transform">
                                <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
                                    <CardHeader className="relative pb-0">
                                        {test.hasProgress && (
                                            <div className="absolute right-6">
                                                <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>
                                            </div>
                                        )}
                                        <CardTitle className="text-xl group-hover:text-yellow-500 transition-colors">
                                            {test.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{test.category}</Badge>
                                            <Badge className={difficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                            <div className="flex items-center">
                                                <BookOpen className="mr-1 h-4 w-4" />
                                                {test.questions} questions
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4" />
                                                {test.duration} min
                                            </div>
                                        </div>

                                        {test.hasProgress ? (
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Progress</span>
                                                    <span className="font-medium">{test.questionsAnswered}/{test.questions}</span>
                                                </div>
                                                <Progress value={test.progress} className="h-2" />
                                            </div>
                                        ) : (
                                            <div className="mt-4 mb-3 text-sm text-muted-foreground">
                                                <span className="font-medium">&nbsp;</span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="border-t pt-4 flex justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            {test.hasProgress ? "Continue" : "Start Test"}
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                                    </CardFooter>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}