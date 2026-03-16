import React from 'react'
import { NavLink } from 'react-router'

import {
  navbarClass,
  navContainer,
  navLogo,
  navLinks,
  navLink
} from '../../styles/common.js'

function Header() {
  return (
    <header className={navbarClass}>
      <div className={navContainer}>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className={navLogo}>
            LearnHub
          </span>
        </div>

        {/* Navigation */}
        <nav className={navLinks}>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${navLink} font-semibold text-black` : navLink
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? `${navLink} font-semibold text-black` : navLink
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? `${navLink} font-semibold text-black` : navLink
            }
          >
            Register
          </NavLink>

        </nav>

      </div>
    </header>
  )
}

export default Header