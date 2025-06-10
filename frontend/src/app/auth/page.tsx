'use client'
import React from 'react'
import './auth.css'
import { useState, useEffect } from 'react';


function page() {
	const [userName, setUserName] = useState('');
	

    const handleSignup: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault(); // Prevent default form behavior
    
    console.log("Sign-up clicked!");
};

const handleLogin: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault(); // Prevent default form behavior
    console.log("Sign-in clicked!");
};

const handleSignupJWT: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault(); // Prevent default form behavior
    console.log("Sign-in clicked!");
};

  return (
    <div className='container'>
	    <div className="main">  	
		    <input type="checkbox" id="forms" aria-hidden="true" />

			<div className="signup">
				<form>
					<label htmlFor="forms" aria-hidden="true">Sign up</label>
					<input type="text" name="txt" placeholder="User name" required />
					<input type="email" name="email" placeholder="Email" required />
                    <input type="number" name="number" placeholder="phone number" required />
					<input type="password" name="pswd" placeholder="Password" required />
					<input type="password" name="pswd" placeholder="Repeat Password" required />
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

export default page