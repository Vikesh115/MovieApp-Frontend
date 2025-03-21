import React from 'react'
import { MdMovie, MdLocalMovies, MdBookmark } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { IoPersonCircleSharp } from "react-icons/io5";

import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <div>
            <div className='lg:flex sm:hidden fixed md:hidden h-[100%] justify-between items-center flex-col bg-color3 w-[6%] py-4 z-10'>
                <div className='flex-col gap-3'>
                    <NavLink to="/"><MdMovie color='#FC4747' size={36} /></NavLink>
                    <div className='flex-col justify-center mt-10'>
                        <NavLink to="/" 
                        style={({ isActive }) => ({
                            color: isActive ? "White" : 'gray'
                        })}
                        ><RxDashboard size={28} /></NavLink>
                        <NavLink to="/movie" className='flex mt-3'
                        style={({ isActive }) => ({
                            color: isActive ? "White" : 'gray'
                        })}
                        ><MdLocalMovies size={28} /></NavLink>
                        <NavLink to="/tv" className='flex mt-3'
                        style={({ isActive }) => ({
                            color: isActive ? "White" : 'gray'
                        })}
                        ><PiTelevisionFill size={28} /></NavLink>
                        <NavLink to="/bookmark" className='flex mt-3'
                        style={({ isActive }) => ({
                            color: isActive ? "White" : 'gray'
                        })}
                        ><MdBookmark size={28} /></NavLink>
                    </div>
                </div>
                <NavLink to="/profile">
                    <IoPersonCircleSharp size={30} className="text-color0" />
                </NavLink>
            </div>
            <div className='md:flex sm:hidden lg:hidden fixed h-[10%] w-[100%] justify-between items-center bg-color3 px-4 z-20'>
                <div className='flex'>
                    <NavLink to="/"><MdMovie size={48} color='#FC4747' /></NavLink>
                </div>
                <div className='flex gap-3'>
                    <NavLink to="/"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    >
                        <RxDashboard size={44} />
                    </NavLink>
                    <NavLink to="/movie"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    >
                        <MdLocalMovies size={44} />
                    </NavLink>
                    <NavLink to="/tv"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    >
                        <PiTelevisionFill size={44} />
                    </NavLink>
                    <NavLink to="/bookmark"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    >
                        <MdBookmark size={44} />
                    </NavLink>
                </div>
                <NavLink to="/profile">
                    <IoPersonCircleSharp size={30} className="text-color0" />
                </NavLink>
            </div>
            <div className='sm:flex md:hidden lg:hidden fixed h-[6%] w-[100%] justify-between items-center bg-color3 px-2 z-30'>
                <div className='flex text-color0'>
                    <NavLink to="/"><MdMovie size={28} /></NavLink>
                </div>
                <div className='flex gap-2 text-color2'>
                    <NavLink to="/"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    ><RxDashboard size={24} /></NavLink>
                    <NavLink to="/movie"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    ><MdLocalMovies size={24} /></NavLink>
                    <NavLink to="/tv"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    ><PiTelevisionFill size={24} /></NavLink>
                    <NavLink to="/bookmark"
                    style={({ isActive }) => ({
                        color: isActive ? "White" : 'gray'
                    })}
                    ><MdBookmark size={24} /></NavLink>
                </div>
                <NavLink to="/profile">
                    <IoPersonCircleSharp size={30} className="text-color0" />
                </NavLink>
            </div>
        </div>
    )
}

export default Navbar