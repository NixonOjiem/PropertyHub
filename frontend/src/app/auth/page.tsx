'use client'
import React from 'react'
import './auth.css'


function page() {

    const handleSignup: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault(); // Prevent default form behavior
    
    // console.log("Sign-up clicked!");
};

const handleLogin: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault(); // Prevent default form behavior
    console.log("Sign-in clicked!");
};

  return (
    <div className='container'>
	    <div className="main">  	
		    <input type="checkbox" id="chk" aria-hidden="true" />

			<div className="signup">
				<form>
					<label htmlFor="chk" aria-hidden="true">Sign up</label>
					<input type="text" name="txt" placeholder="User name" required />
					<input type="email" name="email" placeholder="Email" required />
                    <input type="number" name="broj" placeholder="BrojTelefona" required />
					<input type="password" name="pswd" placeholder="Password" required />
					<button onClick={handleSignup}>Sign up</button>
				</form>
			</div>

			<div className="login">
				<form>
					<label htmlFor="chk" aria-hidden="true">Login</label>
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