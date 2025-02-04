import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MdMovie } from 'react-icons/md';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://movieapp-tu5n.onrender.com/user/signup', {
        email: formData.email,
        password: formData.password,
      });
      alert(response.data.message); 
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-color1 h-screen w-[100%]">
      <div className='flex flex-col w-[100%] items-center'>
        <div className='flex justify-evenly w-[100%] text-color0 pt-16'>
          <MdMovie size={30} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className='flex-col w-[100%] bg-color3 p-12 pt-10 mt-16 rounded-xl'>
            {error && <p className="flex flex-wrap text-xs text-color4">{error}</p>}
            <h1 className='flex text-color4 text-4xl w-[100%]'>Sign up</h1>
            <div className='flex-col w-[100%] pt-4'>
              <input
                type="email"
                id="email"
                name="email"
                placeholder='Email address'
                value={formData.email}
                onChange={handleChange}
                required
                className='bg-color3 text-color4  focus:outline-none focus:border-none p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" />  
            <div className='flex-col w-[100%] pt-5'>
              <input
                type="password"
                id="password"
                name="password"
                placeholder='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='bg-color3 text-color4  focus:outline-none focus:border-none p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" />  
            <div className='flex-col w-[100%] pt-5'>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder='confirm password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='bg-color3 text-color4  focus:outline-none focus:border-none p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" />
            <button type="submit" disabled={loading} className='flex w-[100%] rounded-lg justify-center bg-color0  text-color4 mt-3 px-20 py-3 text-xs'>
              {loading ? 'signning in...' : 'signup to your account'}
            </button>
            <div className='flex justify-center'>
              <p className='text-color4 mt-5 text-xs justify-center'>Already have an account? <Link className="text-color0 text-base" to="/">Login</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;