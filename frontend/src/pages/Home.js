import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
        const navigate = useNavigate();
      
        const handleSubmit = (event) => {
          navigate('/restaurant-registration')
        }
        const handleLogin = (event) => {
          navigate('/restaurant-login')
        }

  return (
    <div>
      <div style={{
        // backgroundImage: `url(${process.env.PUBLIC_URL}/front.jpg)`,
        backgroundImage: 'url(/bgi.jpg)',
        backgroundSize: 'cover',
        width: '100%',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'relative',
      }}>
        <div className="flex items-center justify-between gap-2" style={{ width: '100%' }}>
          <h1 className='text-4xl font-bold text-center' style={{ color: '#fff', margin: '0 200px', fontStyle: 'italic' }}>Num-Num</h1>

          <nav>
            <ul  style={{ display: 'flex', listStyleType: 'none', margin: '50px 200px 0px 0px', padding: 0 }}>
              <li className='rounded-md' style={{ margin: '0 10px', border: '1px solid #fff', padding: '5px 10px' }}>
                <a href="#advertise" style={{ textDecoration: 'none', color: 'white' }}>Advertise</a>
              </li>
              <li className='rounded-md' style={{ margin: '0 10px', border: '1px solid #fff', padding: '5px 10px' }}>
                <Link to="/restaurant-login" style={{ textDecoration: 'none', color: 'white' }}>Login</Link>
              </li>
              <li className='rounded-md bg-blue-500' style={{ margin: '0 10px', border: '1px solid #fff', padding: '5px 10px',  }}>
                <Link to="/restaurant-registration" style={{ textDecoration: 'none', color: 'white' }}>Create Account</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div style={{ margin: '25px 200px 30px', textAlign: 'left', padding: '0' }}>
          <p className='text-2xl' style={{ color: '#fff' }}>Partner with Num-Num <br></br>
            at 0% commission for the 1st month!</p> <br/>
           <p className='text-white'> And get ads worth INR 1500. Valid for new restaurant partners in select cities.</p>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
              <a className='rounded-md bg-blue-500  hover:bg-blue-600 text-center cursor-pointer justify-center content-center size-12' onClick={handleSubmit} style={{ width: '45%',  textDecoration: 'none', color: 'white' }}>Register Your Restaurant</a>
              <a className=' bg-white rounded-md text-center justify-center ease-in-out hover:bg-gray-400 cursor-pointer content-center size-12' onClick={handleLogin} style={{ padding: '10px', width: '45%', textAlign: 'center', textDecoration: 'none', color: 'black' }}>Login your Restaurant</a>
            </div>
            <p className='mt-4' style={{ color: '#fff' }}>Need help? Contact +91 97-16-16-16-16</p>
          </div>
        </div>


        <div className="container mx-auto px-7">
       <div className=" rounded-lg p-8 max-w-4xl mx-auto">
    
            <div className="bg-white text-black rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">
                Get started with online ordering
              </h3>
              <p className="text-sm mb-4">
                Please keep the documents ready for a smooth signup
              </p>
              <ul className="list-disc list-inside">
                <li>FSSAI license copy (apply now)</li>
                <li>PAN card copy</li>
                <li>Regular GSTIN (apply now)</li>
                <li>Bank account details</li>
                <li>Your restaurant menu</li>
                <li>Dish images for top 5 items</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

