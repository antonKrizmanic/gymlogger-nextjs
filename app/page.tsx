"use client";

import { DeviceMockup } from "@/src/components/common/device-mockup";
import { GridPattern } from "@/src/components/common/grid-pattern";
import { Marquee } from "@/src/components/common/marquee";
import { Spotlight } from "@/src/components/common/spotlight";
import { StatCounter } from "@/src/components/common/stat-counter";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ArrowRight, BarChart3, Dumbbell, Loader2, Target, Users } from "lucide-react";
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
                <GridPattern className="text-primary-900/20" />
                <Spotlight className="" />
                <div className="container mx-auto px-4 py-16 lg:py-28">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Logo/Brand */}
                        <div className="mb-8 lg:mb-0 order-2 lg:order-1 text-center lg:text-left">
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
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-8">
                            <Button
                                size="lg"
                                variant="accent"
                                className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:translate-y-[-1px]"
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
                                className="px-8 py-4 text-lg font-semibold transition-all duration-200 border-white text-white hover:bg-white/10 hover:translate-y-[-1px]"
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

                        {/* Stats */}
                        <div className="mt-10 grid grid-cols-3 gap-6 text-center lg:text-left">
                            <div>
                                <p className="text-3xl font-bold text-white"><StatCounter value={25000} suffix="+" /></p>
                                <p className="text-primary-100 text-sm">Workouts Logged</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white"><StatCounter value={120} suffix="k" /></p>
                                <p className="text-primary-100 text-sm">Sets Tracked</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white"><StatCounter value={5} suffix="m" /></p>
                                <p className="text-primary-100 text-sm">Reps Recorded</p>
                            </div>
                        </div>
                    </div>

                    {/* App Preview */}
                    <div className="order-1 lg:order-2">
                        <DeviceMockup>
                            <div className="rounded-lg border border-border p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-3 w-20 bg-primary-200 rounded" />
                                    <div className="h-3 w-8 bg-gold-400 rounded" />
                                </div>
                                <div className="space-y-3">
                                    <div className="h-10 rounded-md bg-primary-100" />
                                    <div className="h-16 rounded-md bg-primary-50" />
                                    <div className="h-16 rounded-md bg-primary-50" />
                                    <div className="h-16 rounded-md bg-primary-50" />
                                </div>
                            </div>
                        </DeviceMockup>
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
                            <Card key={index} className="group border border-primary-200/60 dark:border-primary-700/60 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 dark:bg-primary-800/90 backdrop-blur relative overflow-hidden">
                                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-gold-500/10 to-transparent" />
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

            {/* Marquee Section */}
            <section className="py-8 bg-primary-50 dark:bg-primary-900/20 border-y border-primary-100 dark:border-primary-800">
                <Marquee className="text-primary-700 dark:text-primary-200" speedMs={30000}>
                    <span className="font-semibold">Track smarter</span>
                    <span className="font-semibold">Lift heavier</span>
                    <span className="font-semibold">Recover better</span>
                    <span className="font-semibold">Progress faster</span>
                </Marquee>
            </section>

            {/* How it works */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-display font-bold text-primary-900 dark:text-primary-100">How it works</h2>
                        <p className="text-primary-700 dark:text-primary-300 mt-2">Three simple steps to start logging and improving.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {["Create workout", "Log sets", "Review progress"].map((step, i) => (
                            <Card key={i} className="bg-white/95 dark:bg-primary-800/90 backdrop-blur border border-primary-100 dark:border-primary-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <span className="inline-flex size-9 items-center justify-center rounded-full bg-gold-500 text-white font-bold">{i + 1}</span>
                                        {step}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-primary-600 dark:text-primary-300">{i === 0 ? "Start a new workout and add exercises." : i === 1 ? "Record sets with weight and reps quickly." : "See charts and personal bests over time."}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-800 relative overflow-hidden">
                <GridPattern className="text-primary-900/30" />
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