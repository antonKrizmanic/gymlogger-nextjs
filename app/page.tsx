"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
    BarChart3,
    CheckCircle,
    Dumbbell,
    Loader2,
    TrendingUp,
    Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IndexPage() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState<string | null>(null);

    const handleNavigation = (path: string) => {
        setIsNavigating(path);
        router.push(path);
    };

    const features = [
        {
            icon: <Dumbbell className="h-8 w-8 text-primary" />,
            title: "Workout Tracking",
            description: "Log your exercises, sets, reps, and weights with ease. Track every detail of your fitness journey."
        },
        {
            icon: <TrendingUp className="h-8 w-8 text-primary" />,
            title: "Progress Analytics",
            description: "Visualize your strength gains and performance improvements with detailed charts and statistics."
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-primary" />,
            title: "Performance Metrics",
            description: "Analyze your training volume, frequency, and intensity to optimize your workout routines."
        },
    ];

    const benefits = [
        "Track unlimited workouts and exercises",
        "Visual progress charts and analytics",
        "Mobile-responsive design for gym use",
        "Secure data backup and synchronization",
        "Customizable workout templates",
        "Exercise history and personal records"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                            Transform Your
                            <span className="text-primary block sm:inline sm:ml-3">
                                Fitness Journey
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Take control of your fitness with intelligent workout tracking, progress analytics,
                            and personalized insights. Join thousands of users achieving their fitness goals.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            size="lg"
                            className="px-8 py-6 text-lg font-semibold"
                            disabled={isNavigating !== null}
                            onClick={() => handleNavigation("/auth/register")}
                        >
                            {isNavigating === "/auth/register" ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <Users className="mr-2 h-5 w-5" />
                                    Start Your Journey
                                </>
                            )}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-6 text-lg font-semibold"
                            disabled={isNavigating !== null}
                            onClick={() => handleNavigation("/auth/login")}
                        >
                            {isNavigating === "/auth/login" ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Everything You Need to Succeed
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed to help you track, analyze, and optimize your fitness journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-muted/50 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                                Why Choose GymNotebook?
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Built by fitness enthusiasts for fitness enthusiasts. Our platform combines
                                simplicity with powerful analytics to give you the insights you need to reach your goals.
                            </p>
                            <div className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center space-y-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Ready to Start Your Transformation?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join our community of dedicated fitness enthusiasts and take the first step
                        towards achieving your goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="px-8 py-6 text-lg font-semibold"
                            disabled={isNavigating !== null}
                            onClick={() => handleNavigation("/auth/register")}
                        >
                            {isNavigating === "/auth/register" ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Get Started Free"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}