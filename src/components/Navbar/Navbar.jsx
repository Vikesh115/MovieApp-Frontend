import React from 'react'
import { MdMovie, MdLocalMovies, MdBookmark } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";

import { NavLink } from 'react-router-dom'

function Navbar({ handleLogout }) {
    return (
        <div>
            {/* Desktop */}
            <div className='lg:flex sm:hidden fixed md:hidden h-[100%] justify-between items-center flex-col bg-color3 w-[6%] py-4 z-10'>
                <div className='flex-col gap-3'>
                    <NavLink to="/"><MdMovie color='#FC4747' size={36} /></NavLink>
                    <div className='flex-col justify-center mt-10 text-color2'>
                        <NavLink to="/" ><RxDashboard size={28} /></NavLink>
                        <NavLink to="/movie" className='flex mt-3'><MdLocalMovies size={28} /></NavLink>
                        <NavLink to="/tv" className='flex mt-3'><PiTelevisionFill size={28} /></NavLink>
                        <NavLink to="/bookmark" className='flex mt-3'><MdBookmark size={28} /></NavLink>
                    </div>
                </div>
                <button onClick={handleLogout}>
                    <IoMdLogOut size={30} className="text-color0" />
                </button>
                {/* <NavLink to="/profile" style={isActive => ({
                    color: isActive ? "#FFFFFF" : "#5A698F"
                })}><CgProfile size={30} /></NavLink> */}
            </div>
            {/* Tab */}
            <div className='md:flex sm:hidden lg:hidden fixed h-[10%] w-[100%] justify-between items-center bg-color3 px-4 z-20'>
                <div className='flex'>
                    <NavLink to="/"><MdMovie size={48} color='#FC4747' /></NavLink>
                </div>
                <div className='flex gap-3 text-color2'>
                    <NavLink to="/">
                        <RxDashboard size={44} />
                    </NavLink>
                    <NavLink to="/movie">
                        <MdLocalMovies size={44} />
                    </NavLink>
                    <NavLink to="/tv">
                        <PiTelevisionFill size={44} />
                    </NavLink>
                    <NavLink to="/bookmark">
                        <MdBookmark size={44} />
                    </NavLink>
                </div>
                <div className='flex text-color4'>
                    <NavLink to="/profile"><CgProfile size={44} /></NavLink>
                </div>
            </div>
            {/* Mobile */}
            <div className='sm:flex md:hidden lg:hidden fixed h-[6%] w-[100%] justify-between items-center bg-color3 px-2 z-30'>
                <div className='flex text-color0'>
                    <NavLink to="/"><MdMovie size={28} /></NavLink>
                </div>
                <div className='flex gap-2 text-color2'>
                    <NavLink to="/"><RxDashboard size={24} /></NavLink>
                    <NavLink to="/movie"><MdLocalMovies size={24} /></NavLink>
                    <NavLink to="/tv"><PiTelevisionFill size={24} /></NavLink>
                    <NavLink to="/bookmark"><MdBookmark size={24} /></NavLink>
                </div>
                <div className='flex text-color4'>
                    <NavLink to="/profile"><CgProfile size={26} /></NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar