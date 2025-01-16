import React from 'react'

function Profile({ handleLogout }) {

  return (
    <div className='flex justify-center text-2xl font-bold pt-40'>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Profile