import React, { useEffect, useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Tabs, Modal, Layout, Menu, Image, theme, message } from 'antd';
import { getRestaurant } from '../apicalls/restaurantApiCall.js';
import { useNavigate } from 'react-router-dom';
import LiveOrder from './orders/LiveOrder.js';
import Home from './orders/Home.js';
import { TbLogout2 } from "react-icons/tb";
import { LogoutOutlined } from '@ant-design/icons';
import { getOrder } from '../apicalls/orderApiCall.js';
import CompletedOrders from './orders/CompletedOrders.js';
import { FaLocationDot } from "react-icons/fa6";
import io from 'socket.io-client';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/loaderSlice.js';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import TestOrderForm from '../components/TestOrderForm.js';



const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

const IMAGE_URL = 'http://localhost:5000/uploads/';


const RestProfile = () => {
  const [imagePath, setImagePath] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [liveOrderCount, setLiveOrderCount] = useState(0);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);



  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      try {
        dispatch(setLoading(true))
        const restaurantData = await getRestaurant();
        dispatch(setLoading(false));
        console.log('Restaurant Data:', restaurantData);
        if (restaurantData && restaurantData.data) {
          setImagePath(`${IMAGE_URL}${restaurantData.data.profilePicture}`);
          setRestaurant(restaurantData.data);
          const response = await getOrder(restaurantData.data.email);
          //console.log("wow-----------",`?email=${restaurantData.data.email}`)
          setLiveOrderCount(response.data.length);
          //console.log("set live order count is =================", response.data.length)  
          // handleOrderCountChange(6);


        } else {
          console.error('Invalid restaurant data:', restaurantData);
        }
      } catch (error) {
        dispatch(setLoading(false));
        console.error('Error fetching restaurant profile:', error);
      }
    };
    fetchRestaurantProfile();
  }, []);


  const handleViewOrders = (status) => {
    navigate(`/orders/${status}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const TbLogout2 = ({ className, onClick }) => (
    <div className={`flex  cursor-pointer ${className}`} onClick={onClick}>
      <LogoutOutlined />
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleOrderDelete = () => {
    setLiveOrderCount(liveOrderCount - 1);

  };


  const [orders, setOrders] = useState([]);








  const [socket, setSocket] = useState(null);
  const showNotification = (newOrder) => {
    const { dishName, totalPrice, quantity } = newOrder;
    NotificationManager.info(
      `Quantity: ${quantity} - ${dishName} - Total Price: ₹${totalPrice}`,
      'New Order Received',
      5000
    );

    setOrders([newOrder, ...orders]);
    handleOrderCountChange(1);
    // setLiveOrderCount((prevCount) => prevCount + 1);
  };

  const handleOrderAccept = () => {
    setLiveOrderCount((prevCount) => prevCount - 1);

  };

  useEffect(() => {
    const newSocket = io('wss://lumpy-bead-lip.glitch.com.me/');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server');
    });

    newSocket.on('new-order', (newOrder) => {
      showNotification(newOrder);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    const fetchLiveOrderCount = async () => {
      try {
        const response = await getOrder(`?email=${restaurant?.email}`);
        setLiveOrderCount(response.data.length);
      } catch (error) {
        console.error('Error fetching live order count:', error);
      }
    };

    fetchLiveOrderCount();
  }, [restaurant?.email]);

  const handleOrderCountChange = (change) => {
    setLiveOrderCount((prevCount) => prevCount + change);
  };



  return (

    <Layout>
      <NotificationContainer />
      <Header className="text-white" style={{ display: 'flex', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 className='text-white text-4xl italic mx-auto mb-2 cursor-pointer' onClick={() => navigate('/restaurant-dashboard')}>Num-Num</h1>
        </div>


        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            className="max-w6xl"
            activeKey={activeTab}
            style={{ width: '100%', color: 'white' }}
            onChange={handleTabChange}
            tabBarStyle={{ margin: 'auto', color: 'white' }}
            tabBarGutter={50}
          >
            <TabPane tab={<span style={{ color: 'white' }}>Home</span>} key="1" />
            <TabPane tab={<span style={{ color: 'white' }}>{`Live Orders (${liveOrderCount})`}</span>} key="2" />
            <TabPane tab={<span style={{ color: 'white' }}>Completed Orders</span>} key="3" />
          </Tabs>
        </div>

        <div>

          <TbLogout2 className='mt-6' onClick={handleLogout} style={{ fontSize: '40px' }} />
        </div>
      </Header>

      <Layout>

        <Sider width={250} style={{ background: colorBgContainer }} className="bg-gray-200  h-[100vh] min-h-[120vh] flex flex-col justify-between">
          <div className="flex flex-col items-center">
            {restaurant && (
              <>
                <div className="mt-6 mb-4">
                  <Image width={170} height={170} src={imagePath} className="rounded-full border-4 border-green" />
                </div>
                <div className="mt-4">
                  <span className="font-bold text-xl">{restaurant.name.toUpperCase()}</span>

                </div>
                <div className="mt-2">
                  <div className='flex'>
                    <FaLocationDot className='mr-2 mt-1 text-red-600' />
                    <span>{restaurant.location.toUpperCase()}</span>
                  </div>
                </div>
              </>
            )}




            <div className=' border-4 border-green w-full h-[300px] lg:h-[300px] z-10 overflow-auto mt-8 mb-4'>
              {restaurant && (
                <MapContainer

                  center={restaurant?.latitude ? [restaurant.latitude, restaurant.longitude] : [0, 0]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[restaurant.latitude, restaurant.longitude]}>
                    <Popup  >
                      {[restaurant.name]} <br /> {[restaurant.location]}
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>

            <div className='ml-2'>
              <Button className='' onClick={() => setOpen(true)}>
                Test Order
              </Button>
            </div>


            {open && <TestOrderForm open={open} setOpen={setOpen} email={restaurant?.email} />}




            <div style={{ background: colorBgContainer }}
              className=" absolute bottom-0  w-full bg-white mb-8  justify-between  flex flex-col items-center"
            >
              <div className="text-sm text-center">
                <span>Connect with us:</span>
                {restaurant && <div>Email: {restaurant.email}</div>}
              </div>
              <div className="flex items-center mt-2">
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="mr-4">
                  <FaLinkedin className="text-blue-600 text-xl" />
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-blue-800 text-xl" />
                </a>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                &copy; {new Date().getFullYear()} Num-Num. All rights reserved.
              </div>
            </div>
          </div>
        </Sider>





        <Content style={{ padding: '24px', minHeight: 280 }}>
          {activeTab === '1' && <Home email={restaurant?.email} />}
          {activeTab === '2' && (
            <LiveOrder
              email={restaurant?.email}
              onOrderDelete={handleOrderDelete}
              onOrderAccept={handleOrderAccept}
              showNotification={showNotification}
              liveOrderCount={liveOrderCount}
            />
          )}
          {/* {activeTab === '2' && <LiveOrder onOrderDelete={handleOrderDelete} />} */}
          {activeTab === '3' && <CompletedOrders
            email={restaurant?.email}


          />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default RestProfile;