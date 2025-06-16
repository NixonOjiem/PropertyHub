'use client'
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './auth.css';

function Page() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(false);

    // useEffect to handle signup when signupSuccess is true
    useEffect(() => {
        if (signupSuccess) {
            const signup = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ROUTE}/auth/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: userName, email, phone, password }),

                    });

                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    console.log('Signup successful:', data);
                    alert('Sign-up successful!');
                } catch (error) {
                    console.error('Error during signup:', error);
                }
            };

            signup();
            setSignupSuccess(false); // Reset state after signup
        }
    }, [signupSuccess]); // Runs when signupSuccess changes

    useEffect(() => {
  if (signInSuccess) {
    (async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ROUTE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // 👇 CHANGE THIS LINE
          body: JSON.stringify({ email, password }), // Assuming 'email' variable holds the username/email value
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Login successful:', data);
        alert('Login successful!');
      } catch (error) {
        console.error('Error during login:', error);
      }
    })();
    setSignInSuccess(false);
  }
    }, [signInSuccess, email, password]); // Add email and password to dependency array if they are state variables



    // Signup handler that triggers useEffect
    const handleSignup: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setSignupSuccess(true); // Trigger useEffect
        console.log('Sign-up clicked!');
    };

    const handleLogin: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            alert('Please enter both email and password!');
            return;
        }
        setSignInSuccess(true); // Trigger useEffect
        // Here you can add the logic to handle login with JWT  
        console.log('Login clicked!');
    }

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ROUTE}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            if (!response.ok) throw new Error('Google authentication failed');
            const data = await response.json();
            alert(`Google authentication successful! Welcome ${data.user.name}`);
        } catch (error) {
            console.error('Google authentication error:', error);
            alert('Failed to authenticate with Google');
        }
    };

    const handleGoogleError = () => {
        console.error('Google authentication failed');
        alert('Google authentication failed. Please try again.');
    };
       

  return (
    
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
    <div className='container'>
	    <div className="main">  	
		    <input type="checkbox" id="forms" aria-hidden="true" />

			<div className="signup">
				<form>
					<label htmlFor="forms" aria-hidden="true">Sign up</label>
					<input type="text" name="txt" placeholder="User name" onChange={(e) => setUserName(e.target.value)} required />
					<input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="number" name="number" placeholder="phone number" onChange={(e) => setPhone(e.target.value)} required />
					<input type="password" name="pswd" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
					<input type="password" name="pswd" placeholder="Repeat Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
					<button onClick={handleSignup}>Sign up</button>
					<p className='logintext'>or</p>
					<GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        text="signup_with"
                        shape="rectangular"/>
				</form>
			</div>

			<div className="login">
				<form>
					<label htmlFor="forms" aria-hidden="true">Login</label>
					<input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
					<input type="password" name="pswd" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
					<button onClick={handleLogin}>Login</button>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signin_with"
                        shape="rectangular"/>
				</form>
			</div>
	    </div>
    </div>
    </GoogleOAuthProvider>
  )
}

export default Page