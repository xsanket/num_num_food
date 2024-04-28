import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { getCompletedOrders } from '../../apicalls/completedOrdersApiCall';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';

function CompletedOrders({ email }) {
  const [completedOrders, setCompletedOrders] = useState([]);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Dish Name",
      dataIndex: "name",
    },

    {
      title: "Transaction Id",
      dataIndex: "merchantTransactionId",
    },
    {
      title: "Merchant Id",
      dataIndex: "merchantId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => "₹ " + text
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Order Time",
      dataIndex: "createdAt",
      render: (text) => {
        const formattedDate = moment(text).format("hh:mm");
        return formattedDate;
      }
    },
  ];

  const getCompletedOrdersData = async (email) => {
    try {
      dispatch(setLoading(true))
      const response = await getCompletedOrders(email);
      dispatch(setLoading(false))
      if (response.success) {
        const reversedOrders = response.data.reverse();
        setCompletedOrders(reversedOrders);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoading(false))
      message.error(error.message);
    }
  };

  useEffect(() => {
    getCompletedOrdersData(email);
  }, [email]);

  return (
    <div>
      <Table columns={columns} dataSource={completedOrders} />
    </div>
  );
}

export default CompletedOrders;
