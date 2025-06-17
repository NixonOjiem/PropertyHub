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
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // State to track if the client ID is loaded
    const [isClientLoaded, setIsClientLoaded] = useState(false);

    const SERVER_ROUTE = process.env.NEXT_PUBLIC_SERVER_ROUTE;
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    // This effect runs once on component mount to check for the Client ID.
    useEffect(() => {
        if (GOOGLE_CLIENT_ID) {
            console.log("Google Client ID loaded:", GOOGLE_CLIENT_ID);
            setIsClientLoaded(true);
        } else {
            console.error("Google Client ID not found. Check your .env.local file.");
        }
    }, [GOOGLE_CLIENT_ID]);


    const handleSignup = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch(`${SERVER_ROUTE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userName, email, phone, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const data = await response.json();
            console.log('Signup successful:', data);
            alert('Sign-up successful!');
            // Example: redirect or store token
            // localStorage.setItem('token', data.token);
            // window.location.href = '/dashboard';

        } catch (error) {
            console.error('Error during signup:', error);
            alert(`Signup failed: ${error.message}`);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!loginEmail || !loginPassword) {
            alert('Please enter both email and password!');
            return;
        }

        try {
            const response = await fetch(`${SERVER_ROUTE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }
            
            const data = await response.json();
            console.log('Login successful:', data);
            alert('Login successful!');
             // Example: redirect or store token
            // localStorage.setItem('token', data.token);
            // window.location.href = '/dashboard';

        } catch (error) {
            console.error('Error during login:', error);
            alert(`Login failed: ${error.message}`);
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${SERVER_ROUTE}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || 'Google authentication failed');
            }
            
            const data = await response.json();
            //console.log('Google Auth successful:', data);
            alert(`Google authentication successful! Welcome ${data.user.name}`);
             // Example: redirect or store token
            // localStorage.setItem('token', data.token);
            // window.location.href = '/dashboard';

        } catch (error) {
            console.error('Google authentication error:', error);
            alert(`Failed to authenticate with Google: ${error.message}`);
        }
    };

    const handleGoogleError = () => {
        console.error('Google authentication failed');
        alert('Google authentication failed. Please try again.');
    };
        
    // Render a loading state or nothing until the client ID is verified.
    if (!isClientLoaded) {
        return <div>Loading authentication provider...</div>;
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className='container'>
              <div className="main">      
                  <input type="checkbox" id="forms" aria-hidden="true" />

                  <div className="signup">
                      <form>
                          <label htmlFor="forms" aria-hidden="true">Sign up</label>
                          <input type="text" name="txt" placeholder="User name" onChange={(e) => setUserName(e.target.value)} required />
                          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                          <input type="tel" name="number" placeholder="Phone number" onChange={(e) => setPhone(e.target.value)} required />
                          <input type="password" name="pswd" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                          <input type="password" name="pswd_confirm" placeholder="Repeat Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                          <button onClick={handleSignup}>Sign up</button>
                          <p className='logintext'>or</p>
                          <div className='googlelogibutton'>
                          <GoogleLogin
                              onSuccess={handleGoogleSuccess}
                              onError={handleGoogleError}
                              useOneTap
                              text="signup_with"
                              shape="rectangular"/>
                              </div>
                      </form>
                  </div>

                  <div className="login">
                      <form>
                          <label htmlFor="forms" aria-hidden="true">Login</label>
                          <input type="email" name="email" placeholder="Email" required onChange={(e) => setLoginEmail(e.target.value)} />
                          <input type="password" name="pswd" placeholder="Password" required onChange={(e) => setLoginPassword(e.target.value)} />
                          <button onClick={handleLogin}>Login</button>
                           <p className='logintext'>or</p>
                           <div className='googlelogibutton'>
                          <GoogleLogin
                              onSuccess={handleGoogleSuccess}
                              onError={handleGoogleError}
                              text="signin_with"
                              shape="rectangular"/>
                            </div>
                      </form>
                  </div>
              </div>
            </div>
        </GoogleOAuthProvider>
    )
}

export default Page;