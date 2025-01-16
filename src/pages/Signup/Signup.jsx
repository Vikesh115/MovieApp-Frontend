import React, { useState } from 'react';
import axios from 'axios'; // for making HTTP requests
import { useNavigate } from 'react-router-dom'; // for navigation after successful signup
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/user/signup', {
        email: formData.email,
        password: formData.password,
      });
      // Handle successful signup
      alert(response.data.message); // Display the success message
      navigate('/'); // Redirect to the login page after successful signup
    } catch (err) {
      // Handle errors from backend
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
              {/* <label htmlFor="email">Email</label> */}
              <input
                type="email"
                id="email"
                name="email"
                placeholder='Email address'
                value={formData.email}
                onChange={handleChange}
                required
                className='bg-color3 text-color4 p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" />  {/* Add horizontal line */}
            <div className='flex-col w-[100%] pt-5'>
              {/* <label htmlFor="password">Password</label> */}
              <input
                type="password"
                id="password"
                name="password"
                placeholder='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='bg-color3 text-color4 p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" />  {/* Add horizontal line */}
            <div className='flex-col w-[100%] pt-5'>
              {/* <label htmlFor="confirmPassword">Confirm Password</label> */}
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder='confirm password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='bg-color3 text-color4 p-2 w-[100%]'
              />
            </div>
            <hr className="my-4 border-t-2 border-color4" />  {/* Add horizontal line */}
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

{/* <form onSubmit={handleSubmit} className="signup-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form> */}