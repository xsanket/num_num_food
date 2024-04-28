import React, { useEffect, useState } from 'react';
import { restaurantRegistration } from '../apicalls/restaurantApiCall';
import { Link, useNavigate } from 'react-router-dom';
import { message, Form, Input, Button, Select, Radio, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/loaderSlice';
import { IoHomeSharp } from "react-icons/io5";


const { Option } = Select;

const RestRegistration = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [restData, setRestData] = useState({
    profilePicture: '',
    name: '',
    email: '',
    phoneNumber: '',
    ownerName: '',
    category: '',
    location: '',
    latitude: '',
    longitude: '',
    cuisine: '',
    fassaiCode: '',
    password: '',
  });

  const cuisineOptions = [
    'North Indian',
    'South Indian',
    'Maharashtrian',
    'Chinese',
    'Italian',
    'Mexican',
  ];

  const [category, setCategory] = useState('');
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setRestData({
      ...restData,
      category: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setRestData({
      ...restData,
      [name]: value,
    });
  };

  const handleInputChange = (name, value) => {
    setRestData({
      ...restData,
      [name]: value,
    });
  };


  const isValidLatitude = (rule, value) => {
    const latitude = parseFloat(value);
    if (isNaN(latitude)) {
      return Promise.reject('Please enter a valid number.');
    }

    if (latitude < -90 || latitude > 90) {
      return Promise.reject('Latitude must be between -90 and 90.');
    }

    return Promise.resolve();
  };
  const handleLatitudeChange = (value) => {
    setRestData({
      ...restData,
      latitude: value,
    });
  };





  const isValidLongitude = (rule, value) => {
    const longitude = parseFloat(value);
    if (isNaN(longitude)) {
      return Promise.reject("Please input a valid longitude.'");
    }
    if (longitude < -180 || longitude > 180) {
      return Promise.reject('longitude must be between -180 and 180.');
    }
    return Promise.resolve();
  };
  const handleLongitudeChange = (value) => {
    setRestData({
      ...restData,
      longitude: value,
    });
  };





  const uploadProfilePicture = (e) => {
    console.log(e.target.files[0]);
    setRestData({
      ...restData,
      profilePicture: e.target.files[0]

    });
  }


  const handleSubmit = async () => {
    try {
      console.log("heloooo");
      console.log('Category:', restData.category);
      console.log('Cuisine:', restData.cuisine);
      console.log('Rest Data:', JSON.stringify(restData));
      //console.log('Submitting Form Data:', restData);
      const formData = new FormData();



      formData.append('profilePicture', restData.profilePicture);
      formData.append('name', restData.name);
      formData.append('email', restData.email);
      formData.append('phoneNumber', restData.phoneNumber);
      formData.append('ownerName', restData.ownerName);
      formData.append('category', restData.category);
      formData.append('location', restData.location);
      formData.append('latitude', restData.latitude);
      formData.append('longitude', restData.longitude);
      formData.append('cuisine', restData.cuisine);
      formData.append('fassaiCode', restData.fassaiCode);
      formData.append('password', restData.password);

      console.log('Category:', restData.category);
      console.log('Cuisine:', restData.cuisine);
      console.log('Rest Data:', JSON.stringify(restData));


      dispatch(setLoading(true));
      const response = await restaurantRegistration(formData);
      dispatch(setLoading(false));
      console.log('API Response:', response); // Log the API response

      if (response.success) {
        message.success('Registration successful. Please login.');
        navigate('/restaurant-login');
      } else if (response.message === 'User already exists') {
        message.error('Email already exists. please login');
      } else if (response.message === 'Phone Number Already Exists') {
        message.error('Phone Number Already Exists. please login');
      }
      else if (response.message === 'fassaiCode Already Exists') {
        message.error('fassaiCode Already Exists');
      }


      else {
        message.error(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.log('Error in Registration', error);
      dispatch(setLoading(false));
      message.error('Registration failed. Please try again.');
    }
  };

  useEffect(() => {

  }, []);



  const newLocal = "w-full md:w-1/2 px-2 mb-4 flex justify-center items-center mx-auto ";
  return (
    <div className="bg-black text-white min-h-screen  flex flex-col justify-center items-center relative" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col items-center  ">
          <h1 className="text-4xl font-bold ">Register your restaurant</h1>
          <span className="text-sm font-light text-black mt-2">Partner with us</span>
        </div>

        <div className="flex justify-center mb-5">

        </div>

        <Form form={form} onFinish={handleSubmit} className="bg-black/75 text-white rounded-lg p-8 max-w-4xl mx-auto">


          {/* Category Buttons */}
          <div className="flex justify-center mb-4">
            <Form.Item name="category" rules={[{ required: true, message: 'Please select a category.' }]}>
              <Radio.Group onChange={handleCategoryChange} value={restData.category} optionType="button" buttonStyle="solid">
                <Radio.Button value="veg" style={{ backgroundColor: restData.category === 'veg' ? 'green' : '', color: category === 'veg' ? 'white' : '' }}>
                  Veg
                </Radio.Button>
                <Radio.Button value="non-veg" style={{ backgroundColor: restData.category === 'non-veg' ? 'red' : '', color: category === 'non-veg' ? 'white' : '' }}>
                  Non-Veg
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>


          <div className="flex flex-wrap -mx-2">

            {/* Profile Picture */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="profilePicture" label="Restaurant Profile Picture"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} labelStyle={{ color: 'white' }}
                rules={[{ required: true, message: 'Please upload your hotel profile picture.' }]}>
                <Input type="file" className="border border-gray-400 p-2 w-full" onChange={uploadProfilePicture} />
              </Form.Item>
            </div>

            {/* Cuisine Input */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item
                name="cuisine"
                label="Restaurant Cuisine"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please select a cuisine.' }]}
              >
                <Select
                  className="border border-gray-400 p-2 w-full"
                  style={{ width: '100%', height: '100%' }}
                  onChange={(value) => handleSelectChange('cuisine', value)}
                  defaultValue=""
                >
                  <Option value="">Select Cuisine</Option>
                  {cuisineOptions.map((cuisine) => (
                    <Option key={cuisine} value={cuisine}>
                      {cuisine}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>


            {/* Name  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="name" label="Restaurant Name"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter your Restaurant name.' }]}>
                <Input type="text" className="border border-gray-400 p-2 w-full"
                  onChange={(e) => handleInputChange('name', e.target.value)} />
              </Form.Item>
            </div>

            {/* Email  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="email" label="Restaurant Email"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter your email.' }]}>
                <Input type="email" className="border border-gray-400 p-2 w-full"
                  onChange={(e) => handleInputChange('email', e.target.value)} />
              </Form.Item>
            </div>

            {/* Phone Number  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="phoneNumber" label="Restaurant Phone Number"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter your phone number.' }, { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits.' }]}>
                <Input type="number" className="border border-gray-400 p-2 w-full"
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
              </Form.Item>
            </div>

            {/* Owner Name  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="ownerName" label="Restaurant Owner Name"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter the owner\'s name.' }]}>
                <Input type="text" className="border border-gray-400 p-2 w-full"
                  onChange={(e) => handleInputChange('ownerName', e.target.value)} />
              </Form.Item>
            </div>



            {/* Latitude  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="latitude" label="Restaurant Latitude"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter the latitude.' }, { validator: isValidLatitude }]}>
                <Input type="number" className="border border-gray-400 p-2 w-full"
                  onChange={(e) => handleLatitudeChange(e.target.value)} />
              </Form.Item>
            </div>

            {/* Longitude  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="longitude" label="Restaurant longitude"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter the longitude.' }, { validator: isValidLongitude }]}>
                <Input type="number" className="border border-gray-400 p-2 w-full"
                  onChange={(e) => handleLongitudeChange(e.target.value)} />
              </Form.Item>
            </div>





            {/* Location  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="location" label="Restaurant Address"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter the address.' }]}>
                <Input type="text" className="border border-gray-400 p-2 w-full" onChange={(e) => handleInputChange('location', e.target.value)} />
              </Form.Item>
            </div>




            {/* FSSAI code  */}
            <div className="w-full md:w-1/2 px-2 mb-2">
              <Form.Item name="fassaiCode" label="Restaurant FSSAI Code"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter the FSSAI code.' },
                { len: 14, message: 'FSSAI code must be exactly 14 digits.' }]}>
                <Input type="text" className="border border-gray-400 p-2 w-full" onChange={(e) => handleInputChange('fassaiCode', e.target.value)} />
              </Form.Item>
            </div>

            {/* Password  */}
            <div className={newLocal}>
              <Form.Item name="password" label="Restaurant Password"
                labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ color: 'white' }}
                rules={[{ required: true, message: 'Please enter your password.' },
                { min: 8, message: 'Password must be at least 8 characters.' },
                { max: 20, message: 'Password cannot exceed 20 characters.' },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: 'Password must contain at least one letter, one number, and one special character.' }]}>
                <Input.Password className="border border-gray-400 p-2 w-full" onChange={(e) => handleInputChange('password', e.target.value)} />
              </Form.Item>
            </div>
          </div>


          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center mx-auto "
            >
              Register
            </Button>
            <span className='mt-1 flex text-center justify-center text-white'>
              Already have an account? Login here <Link to="/restaurant-login" className="text-blue-500 ml-1 mb-0">Login</Link>
            </span>
            <span className='mt-1 flex text-center justify-center text-white'>
              <IoHomeSharp className='mt-1 text-blue-500  ' />
              <Link to="/" className="text-blue-500 ml-1 mb-0">Home</Link>
            </span>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RestRegistration;
