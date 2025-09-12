"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ArrowRight, BarChart3, CheckCircle, Dumbbell, Loader2, Target, Users } from "lucide-react";
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
            icon: Dumbbell,
            title: "Track Workouts",
            description: "Log your exercises, sets, reps, and weights with ease. Never lose track of your progress again."
        },
        {
            icon: BarChart3,
            title: "Monitor Progress",
            description: "Visualize your fitness journey with detailed charts and analytics. See your improvements over time."
        },
        {
            icon: Target,
            title: "Set Goals",
            description: "Define your fitness objectives and track your achievements. Stay motivated with clear targets."
        },
        {
            icon: Users,
            title: "Community",
            description: "Connect with fellow fitness enthusiasts. Share workouts, tips, and celebrate achievements together."
        }
    ];

    const benefits = [
        "Easy workout logging",
        "Progress visualization",
        "Goal tracking",
        "Mobile-friendly design",
        "Data export options",
        "Privacy-focused"
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 text-primary-foreground">
                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Logo/Brand */}
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-500 rounded-2xl mb-6 shadow-lg">
                                <Dumbbell className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                                Gym Logger
                            </h1>
                            <p className="text-xl lg:text-2xl text-primary-100 font-medium">
                                Track your workouts, monitor your progress, and achieve your fitness goals.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Button
                                size="lg"
                                variant="accent"
                                className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-4 text-lg font-semibold transition-all duration-200 border-white text-white hover:bg-white/10"
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

                        {/* Benefits List */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-primary-100">
                                    <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                                    <span className="text-sm font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-primary-900 dark:text-primary-100 mb-4">
                            Everything you need to succeed
                        </h2>
                        <p className="text-xl text-primary-700 dark:text-primary-300 max-w-2xl mx-auto">
                            Powerful features designed to help you track, analyze, and improve your fitness journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-primary-800">
                                <CardHeader className="text-center pb-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 rounded-xl mb-4">
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-primary-900 dark:text-primary-100">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-primary-600 dark:text-primary-300 text-center leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-display font-bold text-white mb-6">
                            Ready to transform your fitness journey?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Join thousands of fitness enthusiasts who are already tracking their progress with Gym Logger.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="accent"
                                className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={isNavigating !== null}
                                onClick={() => handleNavigation("/auth/register")}
                            >
                                {isNavigating === "/auth/register" ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Start Your Journey"
                                )}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-200"
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
            </section>
        </div>
    );
}