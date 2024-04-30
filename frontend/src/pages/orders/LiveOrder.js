import React, { useState, useEffect } from 'react';
import { Table, message, Button, Modal } from 'antd';
import { deleteOrder, getOrder } from '../../apicalls/orderApiCall';
import moment from 'moment';
import io from 'socket.io-client';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { orderTransaction } from '../../apicalls/transactionApiCall';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/loaderSlice';

function LiveOrder({ onOrderDelete, onOrderAccept, email }) {
  const [liveOrderCount, setLiveOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [isConfirmCancelModalVisible, setIsConfirmCancelModalVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch()

  const columns = [
    {
      title: "Order Id",
      dataIndex: "orderId",
    },
    {
      title: "Dish Name",
      dataIndex: "dishName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (text) => "₹ " + text
    },
    {
      title: "Order Time",
      dataIndex: "createdAt",
      render: (text) => {
        const formattedDate = moment(text).format("hh:mm");
        return formattedDate;
      }
    },
    {
      title: "Order Status",
      render: (text, record) => (
        <div className='space-x-1'>
          <Button type="primary" onClick={() => handleAcceptOrder(record.orderId)}>
            Accept
          </Button>
          <Button danger onClick={() => handleCancelOrder(record.orderId, record)} confirm={{
            title: 'Are you sure want to cancel order?',
            onOk: () => setIsConfirmCancelModalVisible(true),
          }}>
            Cancel
          </Button>
        </div>
      ),
    },
  ];




  const getOrders = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await getOrder(email);
      dispatch(setLoading(false));
      if (response.success) {
        const reversedOrders = response.data.reverse();
        setOrders(reversedOrders);
        setLiveOrderCount(response.data.length);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const handleAcceptOrder = (orderId) => {
    const order = orders.find((order) => order.orderId === orderId);
    setSelectedOrder(order);
    setIsModalVisible(true);
    calculateDeliveryCharges(order.totalPrice);
    setLiveOrderCount((prevCount) => prevCount - 1);
  };

  const handleCancelButton = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setDeliveryCharges(0);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setDeliveryCharges(0);

  };

  const calculateDeliveryCharges = (totalPrice) => {
    const charges = (totalPrice * 0.1).toFixed(2);
    setDeliveryCharges(charges);
  };


  // delete the order
  const handleCancelOrder = async (orderId, order) => {
    setCancelOrder(order);
    setIsConfirmCancelModalVisible(true);
  };

  const handleConfirmCancelOrder = async () => {
    setIsConfirmCancelModalVisible(false);
    try {
      dispatch(setLoading(true));
      await deleteOrder(cancelOrder.orderId);
      dispatch(setLoading(false));
      setOrders(orders.filter((order) => order.orderId !== cancelOrder.orderId));
      onOrderDelete();
      message.success('Order canceled successfully');
      setLiveOrderCount((prevCount) => prevCount - 1);

      getOrders(email);

    } catch (error) {
      dispatch(setLoading(false));
      if (error.response && error.response.status === 404) {
        message.error('Order not found');
      } else {
        message.error('Failed to cancel order');
      }
    }
  };

  const handleCancelConfirmCancelOrder = () => {
    setIsConfirmCancelModalVisible(false);
    setCancelOrder(null);
  };


  useEffect(() => {
    //const newSocket = io('http://localhost:5000');
    const newSocket = io('wss://lumpy-bead-lip.glitch.com.me/');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server');
      getOrders(email);
    });

    newSocket.on('new-order', (newOrder) => {
      // showNotification(newOrder);
      setOrders([...orders, newOrder]);
      getOrders(email);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
    getOrders(email);
    return () => {
      newSocket.disconnect();
    };
  }, [email]);

  const showNotification = (newOrder) => {
    const { dishName, totalPrice, quantity } = newOrder;
    NotificationManager.info(
      `Quantity: ${quantity} - ${dishName} - Total Price: ₹${totalPrice}  `,
      'New Order Received',
      5000
    );
    getOrders(email);
    setOrders([newOrder, ...orders]);
    setLiveOrderCount((prevCount) => prevCount + 1);
  }


  // accepting orders
  const handlePay = async (order, email, newOrder) => {
    try {
      const deliveryCharges = (order.totalPrice * 0.1).toFixed(2);
      console.log("res ======>>>>>", email)
      const response = await orderTransaction({
        transactionId: order.orderId,
        name: order.dishName,
        amount: deliveryCharges,
        phone: "1234567890",
        email,
      });

      console.log("res ======>>>>>", response)

      if (response.data.instrumentResponse && response.data.instrumentResponse.redirectInfo) {
        onOrderAccept();
        setLiveOrderCount((prevCount) => prevCount - 1);
        window.open(response.data.instrumentResponse.redirectInfo.url, '_blank');
        await deleteOrder(order.orderId);

        setOrders(orders.filter((ord) => ord.orderId !== order.orderId));
        getOrders(email);

        setIsModalVisible(false);
        setSelectedOrder(null);
      } else {
        message.error("Error processing the payment");
      }
    } catch (error) {
      message.error("Error processing the payment");
    }
  };






  return (
    <div>
      <NotificationContainer />
      <Table columns={columns} dataSource={orders} />

      <Modal
        title="Payment and Confirmation"
        open={isModalVisible}
        onCancel={handleCancelButton}
        onOk={() => handlePay(selectedOrder, email)}
        okText={`Pay ₹ ${deliveryCharges}`}
        cancelText="Cancel"
        centered
      >
        {selectedOrder && (
          <>
            <p className='text-sm'>Shipping Address: {selectedOrder.shippingAddress}</p>
            <p>Total Price: ₹{selectedOrder.totalPrice}</p>
            <p>GST and Delivery Charges (10% of Total Price): ₹{deliveryCharges}</p>
          </>
        )}
      </Modal>

      <Modal
        title="Are you sure want to cancel order?"
        open={isConfirmCancelModalVisible}
        onOk={handleConfirmCancelOrder}
        okText={"Yes"}
        onCancel={handleCancelConfirmCancelOrder}
        className="cancel-order-modal"
        centered
      >
        {cancelOrder && (
          <>
            <p className='text-sm'>
              Order Id: {cancelOrder.orderId}
            </p>
            <p>
              Total Price: ₹{cancelOrder.totalPrice}
            </p>
          </>
        )}
      </Modal>

    </div>
  );
}

export default LiveOrder;
