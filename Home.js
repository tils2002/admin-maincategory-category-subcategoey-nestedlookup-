import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <>
    <div class="content-wrapper">
    <nav>
      <ul>
        <li><Link to="/Maincategory">
            Main Category
        </Link>
        </li>
        <li>
        <Link to="/Subcategory">
        Category
    </Link>
        </li>
        <li>
        <Link to="/Subdata">
        SubData
    </Link>
        </li>
      </ul>
    </nav>
    <div class="content">
      <div>
      THIS IS HOME PAGE
      </div>
    </div>
  </div>
    </>
  )
}
export default Home
