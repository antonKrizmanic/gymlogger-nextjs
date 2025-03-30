"use client";

import * as z from "zod";
import { useTransition, useState } from "react";
import { useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { LoginSchema } from "@/src/schemas/index";
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
import { login } from "@/src/actions/login";

export const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useTransition();
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError(undefined);
        setSuccess(undefined);
        setIsSubmitting(() => {
            login(values)
            .then((data:any) => {                
                setError(data.error);
                setSuccess(data.success);
            })
        });           
    }

   return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial={true}
            >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                     <div className="space-y-4">
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
                    </div>  
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button disabled={isSubmitting} type="submit" className="w-full hover:cursor-pointer">
                    Login
                </Button>
                </form>
            </Form>
        </CardWrapper>
   )
} 