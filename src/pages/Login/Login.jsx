import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, getUser } from '../../Redux/Slices/authSlice';
import { MdMovie } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        setError('');
        alert('Login successful');
        dispatch(getUser());
      })
      .catch((err) => {
        setError(err || 'Invalid email or password');
      });

  };

  return (
    <div className="flex bg-color1 h-screen w-[100%]">
      <div className='flex flex-col w-[100%] items-center'>
        <div className='flex justify-evenly w-[100%] text-color0 pt-16'>
          <MdMovie size={30} />
        </div>
        <form onSubmit={handleLogin}>
          <div className='flex-col w-[100%] bg-color3 p-12 pt-10 mt-16 rounded-xl'>
            {error && <p className="flex flex-wrap text-xs text-color4">{error}</p>}
            <h1 className='flex text-color4 text-4xl w-[100%]'>Login</h1>
            <div className='flex-col w-[100%] pt-4'>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
                className='bg-color3 text-color4  focus:outline-none focus:border-none p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" /> 
            <div className='flex-col w-[100%] pt-5'>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className='bg-color3 text-color4  focus:outline-none focus:border-none p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" />  
            <button type="submit" disabled={loading} className='flex rounded-lg w-[100%] justify-center bg-color0  text-color4 mt-3 px-20 py-3 text-xs'>
              {loading ? 'Logging in...' : 'Login to your account'}
            </button>
            <div className='flex justify-center'>
              <p className='text-color4 mt-5 text-xs justify-center'>Do not have an account? <Link className="text-color0 text-base" to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
