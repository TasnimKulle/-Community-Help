import React from 'react'

export const SignIn = () => {
    console.log("SignIn component rendered");
    const handleSignIn = () => {
        // Placeholder for sign-in logic
        console.log("Sign-in button clicked");


    }
  return (
    <div>
      <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
       onClick={handleSignIn}>Sign In</button>

    </div>
  )
}
