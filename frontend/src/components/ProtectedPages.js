import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { getRestaurant } from '../apicalls/restaurantApiCall';
import { useNavigate } from 'react-router-dom';

function ProtectedPages(props) {
    const { children } = props;
    const navigate = useNavigate();
    const [currentRestaurant, setCurrentRestaurant] = useState(null);

    const fetchRestaurant = async () => {
        try {
            const response = await getRestaurant();

            if (response.success) {
                //message.success(response.message);
                setCurrentRestaurant(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchRestaurant();
        } else {
            message.error('You must be logged in to view this page');
            navigate("/restaurant-login");
        }
    }, [navigate]);

    return <div>{children}</div>;
}

export default ProtectedPages;
