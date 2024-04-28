import React, { useState, useEffect } from 'react';
import { Button, Empty, Layout, Modal } from 'antd';
import MenuForm from './MenuForm.js';
import { getMenu, deleteMenu } from '../../apicalls/menuApiCall.js';
import MenuItems from '../../components/MenuItems.js';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice.js';


const fetchAndSetMenus = async (email, setMenus) => {
  try {
    
    const response = await getMenu(email);
    console.log("response in fetchandsetMenus", response)
    const fetchedMenus = response.data.sort((a, b) => b._id.localeCompare(a._id));
    setMenus(fetchedMenus);
  } catch (error) {
    console.error('Error fetching menus:', error.message);
  }
};


function Home({ email }) {
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAndSetMenus(email, setMenus);
    console.log("response in useEffect")
  }, [email]);

  const reloadData = () => {
    fetchAndSetMenus(email, setMenus);
    console.log("response in reloadData")
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenu(id);
      setMenus(menus.filter((menu) => menu._id !== id));
      console.log('Menu deleted successfully');
    } catch (error) {
      console.error('Error deleting menu:', error.message);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-center flex-grow">
          <h2 className="text-2xl font-semibold">My Menu</h2>
        </div>
        <div className="mr-16">
          <Button type="primary" onClick={() => setOpen(true)}>
            Add Menu
          </Button>
        </div>
      </div>
      {open && <MenuForm open={open} setOpen={setOpen} reloadData={reloadData} email={email} />}
      {/* {open && <MenuForm open={open} setOpen={setOpen} reloadData={reloadData} />} */}
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {menus.length > 0 ? (
          <ul className=" gap-8 cursor-pointer sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {menus.map((menu) => (
              <MenuItems key={menu._id} id={menu._id} menu={menu} onDelete={handleDelete} />
            ))}
          </ul>
        ) : (
          <div style={{ position: 'absolute', top: '50%', left: '55%', transform: 'translate(-50%, -50%)' }}>
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;