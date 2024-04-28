import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { testOrder } from '../apicalls/orderApiCall';

const { Item } = Form;

function TestOrderForm({ open, setOpen, reloadData, email }) {

    const [formData, setFormData] = useState({
        orderId: '',
        dishName: '',
        quantity: '',
        shippingAddress: '',
        totalPrice: '',
        email: email || '',
    });

    const [form] = Form.useForm();

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            email: email || '',
        }));
    }, [email]);

    const onFinish = async (values) => {
        try {
            const response = await testOrder({ ...values, email: formData.email });
            console.log(response);

            if (response.message === 'Order placed successfully') {
                //message.success('Order placed successfully');
                setOpen(false);

            } else {
                message.error('Failed placed test order');
            }
        } catch (error) {
            message.error('Error adding test order: ' + error.message);
        }
    };

    const onCancel = () => {
        setOpen(false);
    };

    return (
        <Modal
            title="Add Test Order"
            open={open}
            onCancel={onCancel}
            centered
            footer={null}
            className="test-order-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="black-text-form"
            >
                <Item
                    name="orderId"
                    label="Order ID"
                    rules={[{ required: true, message: 'Please enter the order ID!' }]}
                >
                    <Input placeholder='OI23Gh67' />
                </Item>
                <Item
                    name="dishName"
                    label="Dish Name"
                    rules={[{ required: true, message: 'Please enter the dish name!' }]}
                >
                    <Input placeholder='PIZZA' />
                </Item>
                <Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please enter the quantity!' }]}
                >
                    <Input placeholder='2' type="number" min={1} />
                </Item>
                <Item
                    name="shippingAddress"
                    label="Shipping Address"
                    rules={[{ required: true, message: 'Please enter the shipping address!' }]}
                >
                    <Input placeholder='G-25, Bandra west, Mumbai' />
                </Item>
                <Item
                    name="totalPrice"
                    label="Total Price (₹)"
                    rules={[{ required: true, message: 'Please enter the total price!' }]}
                >
                    <Input placeholder='400' type="number" min={0} step="0.01" />
                </Item>
                <Item
                    name="email"
                    label="Restaurant Email"
                >
                    <Input defaultValue={formData.email} readOnly />
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit">Test Order</Button>
                </Item>
            </Form>
        </Modal>
    );
}

export default TestOrderForm;