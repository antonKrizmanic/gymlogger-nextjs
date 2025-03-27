"use client";

import * as z from "zod";
import { useTransition, useState } from "react";
import { useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/src/schemas/index";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/src/components/ui/form";

import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/src/actions/register";


export const RegisterForm = () => {
    const [isSubmitting, setIsSubmitting] = useTransition();
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError(undefined);
        setSuccess(undefined);
        setIsSubmitting(() => {
            register(values)
            .then((data) => {                
                setError(data.error);
                setSuccess(data.success);
            })
        });           
    }

   return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial={false}
            >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                     <div className="space-y-4">
                     <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) =>(
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                <Input
                                    type="text"
                                    disabled={isSubmitting}
                                    {...field}
                                    placeholder="Full name"
                                />                                
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField 
                        control={form.control}
                        name="email"
                        render={({field}) =>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input
                                    type="email"
                                    disabled={isSubmitting}
                                    {...field}
                                    placeholder="Email"
                                />                                
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) =>(
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input
                                    type="password"
                                    disabled={isSubmitting}
                                    {...field}
                                    placeholder="Password"
                                />                                
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField 
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) =>(
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                <Input
                                    type="password"
                                    disabled={isSubmitting}
                                    {...field}
                                    placeholder="Confirm Password"
                                />                                
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>  
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button disabled={isSubmitting} type="submit" className="w-full hover:cursor-pointer">
                    Register
                </Button>
                </form>
            </Form>
        </CardWrapper>
   )
} 