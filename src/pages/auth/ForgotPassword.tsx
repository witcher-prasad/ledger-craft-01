import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, DollarSign, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    // Mock forgot password functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    toast({
      title: 'Reset link sent!',
      description: 'Check your email for password reset instructions.',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <DollarSign className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No worries! We'll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <Card className="border-border/50 shadow-elegant-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Reset password</CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "We've sent password reset instructions to your email"
                : "Enter your email address to receive reset instructions"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-success/10 rounded-full">
                  <Mail className="w-8 h-8 text-success" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    We've sent an email to <span className="font-medium">{form.getValues('email')}</span> with 
                    instructions to reset your password.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try different email
                </Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...form.register('email')}
                    className="transition-smooth"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Sending...' : 'Send reset instructions'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/auth/sign-in"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}