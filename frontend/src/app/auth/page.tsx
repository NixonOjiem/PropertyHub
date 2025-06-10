'use client'
import React, { useState, useEffect } from 'react';
import './auth.css';

function Page() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

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

    const handleSignupJWT: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        
        console.log('Sign-up JWT clicked!');
    };

    const handleLogin: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();
    }

  return (
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
					<button onClick={handleSignupJWT} className='googlebutton'>Sign up with google</button>
				</form>
			</div>

			<div className="login">
				<form>
					<label htmlFor="forms" aria-hidden="true">Login</label>
					<input type="email" name="email" placeholder="Email" required />
					<input type="password" name="pswd" placeholder="Password" required />
					<button onClick={handleLogin}>Login</button>
				</form>
			</div>
	    </div>
    </div>
  )
}

export default Page