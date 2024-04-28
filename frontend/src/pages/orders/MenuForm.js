import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { saveMenu } from '../../apicalls/menuApiCall';

const { Item } = Form;

function MenuForm({ open, setOpen, reloadData, email }) {
    const props = {
        name: 'file',
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        headers: {
            authorization: 'authorization-text',
        },


        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const [menuData, setMenuData] = useState({
        'image': '',
        'dishName': '',
        'description': '',
        'price': '',
        'email': email || '',

    })



    const uploadImage = (event) => {

        setMenuData({
            ...menuData,
            image: event.target.files[0]
        });
    };



    const [form] = Form.useForm();

    useEffect(() => {
        setMenuData((prevData) => ({
            ...prevData,
            email: email || '',
        }));
    }, [email]);




    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('image', menuData.image);
            formData.append('dishName', values.dishName);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('email', menuData.email);


            const response = await saveMenu(formData);
            console.log(response);

            if (response.message === 'Menu saved successfully') {
                message.success('Menu added successfully');
                setOpen(false);
                reloadData();

            } else {
                message.error('Failed to add menu');
            }
        } catch (error) {
            message.error('Error adding menu: ' + error.message);
        }
    };

    const onCancel = () => {
        setOpen(false);
    };


    return (
        <Modal
            title="Add Menu"
            open={open}
            onCancel={onCancel}
            centered
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="black-text-form"
            >
                <Item
                    name="image"
                    label=""
                    
                >

                    <div className="">
                        <Form.Item name="image" label="Dish image"
                            labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} labelStyle={{ color: 'white' }}
                            rules={[{ required: true, message: 'Please upload your dish image.' }]}>
                            <Input type="file" className="border border-gray-400 p-2 w-full" onChange={(e) => setMenuData({ ...menuData, image: e.target.files[0] })} />

                        </Form.Item>
                    </div>



                </Item>


                <Item
                    name="dishName"
                    label="Dish Name"
                    rules={[{ required: true, message: 'Please enter the dish name!' }]}
                >
                    <Input />
                </Item>
                <Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter the description!' }]}
                >
                    <Input.TextArea />
                </Item>
                <Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter the price!' }]}
                >
                    <Input />
                </Item>

                <Item
                    name="email"
                    label="Restaurant Email"
                   
                >
                    <Input defaultValue={menuData.email} readOnly />
                </Item>



                <Item>
                    <Button type="primary" htmlType="submit">Add Menu</Button>
                </Item>
            </Form>
        </Modal>
    );
}

export default MenuForm;
