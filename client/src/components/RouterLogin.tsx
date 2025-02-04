import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RouterInfo } from "./RouterInfo";
import { authenticateRouter, type RouterCredentials } from "@/lib/mikrotik";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export function RouterLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [routerIp] = useState("103.200.37.183");
  const { toast } = useToast();

  const form = useForm<Omit<RouterCredentials, "ip">>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Omit<RouterCredentials, "ip">) => 
      authenticateRouter({ ...data, ip: routerIp }),
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Connected successfully",
        description: "Authentication with router successful",
      });
    },
    onError: (error) => {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: Omit<RouterCredentials, "ip">) {
    mutation.mutate(data);
  }

  if (isAuthenticated) {
    return <RouterInfo ip={routerIp} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="admin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Connecting..." : "Connect"}
        </Button>
      </form>
    </Form>
  );
}