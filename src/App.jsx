import { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Login from './pages/Login/Login';
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Bookmark from './pages/Bookmark/Bookmark';
import { Routes, Route, useNavigate } from 'react-router-dom'
import Movies from "./pages/Movies/Movies";
import Tv from "./pages/Tv/Tv";
import MovieDetail from "./pages/viewDetail/MovieDetail";
import TvDetail from "./pages/viewDetail/TvDetail";
import { useSelector, useDispatch } from "react-redux";
import { logout, setToken, setUser } from "./Redux/Slices/authSlice";
import MovieOrTvDetails from "./pages/viewDetail/MovieOrTvDetails";
import Profile from "./pages/Profile/Profile";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const storedEmail = localStorage.getItem('email');
console.log(storedEmail);
//   const getUser = useSelector((state)=> state.auth)

// console.log(getUser.email);

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
          dispatch(setUser(storedUser));  // Set the user in Redux
          dispatch(setToken(storedToken)); // Set the token in Redux
      }
  }, [user, dispatch]);

  const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      dispatch(logout()); // Reset Redux store
      navigate('/');
  };

  return (
    <>
      {token  ? (
        <>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie" element={<Movies />} />
            <Route path="/tv" element={<Tv />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TvDetail />} />
            <Route path="/detail/:id" element={<MovieOrTvDetails />} />
            <Route path="/profile" element={<Profile handleLogout={handleLogout}/>}/>
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
    </>
  )
}
export default App;