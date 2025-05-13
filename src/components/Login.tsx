
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '../types';
import { setCurrentUser } from '../services/localStorage';
import { useToast } from '@/hooks/use-toast';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and email",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    // Create mock user
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: '', // In a real app, we'd collect this too
      rating: 5.0,
      mode: 'rider', // Default mode
    };
    
    // Save to localStorage
    setCurrentUser(user);
    
    // Simulate delay
    setTimeout(() => {
      onLogin(user);
      toast({
        title: "Logged In",
        description: `Welcome, ${name}!`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">R</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">ride with us</h1>
        
        <p className="text-center text-muted-foreground mb-6">
          Connect with nearby riders or find passengers going your way
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
