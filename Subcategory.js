import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

const Subcategory = () => {
    const formRef = useRef(null);
    const [search, setSearch] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchMainCategories();
        fetchData();
    }, []);
    
    const handleSubcategoryChange = (value) => {
        setSubcategory(value.toLowerCase());
    };
    
    const handleDescriptionChange = (value) => {
        setDescription(value.toLowerCase());
    };
    

    const fetchMainCategories = async () => {
        try {
            const response = await axios.get("http://localhost:4545/maindataget");
            setMainCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching main categories:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:4545/categories");
            setSubCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleMainCategoryChange = (id) => {
        setSelectedMainCategoryId(id);
    };

    const handleSubmit = async () => {
        try {
            const dataToSend = {
                maincategoryid: selectedMainCategoryId,
                subcategory: subcategory,
                description: description
            };
            const response = await axios.post("http://localhost:4545/subcategory", dataToSend);
            if (response.status === 200) {
                setSelectedMainCategoryId('');
                setSubcategory('');
                setDescription('');
                formRef.current.resetFields();
                fetchData();
                toast.success(response.data.messages);
            }
        } catch (error) {
            console.error('Error adding subcategory:', error);
            let errorMessages = '';
            if (error.response && error.response.status === 400) {
                if (Array.isArray(error.response.data.message)) {
                    errorMessages = error.response.data.message.join('\n');
                } else if (typeof error.response.data.message === 'string') {
                    errorMessages = error.response.data.message;
                } else {
                    errorMessages = 'An error occurred during validation.';
                }
                toast.error(errorMessages);
            } else {
                toast.error('Failed to add subcategory');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:4545/subcategory/${id}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            toast.error('Failed to delete subcategory');
        }
    };

    return (
        <div className="content-wrapper">
            <ToastContainer />
            <nav>
                <ul>
                    <li><Link to="/Maincategory">Main Category</Link></li>
                    <li><Link to="/Subcategory">Category</Link></li>
                    <li><Link to="/Subdata">SubData</Link></li>
                </ul>
            </nav>
            <div className="content">
                <br />
                <Form.Item>
                    <Input placeholder="Enter Search" onChange={(e) => setSearch(e.target.value)} style={{ width: '200px' }} />
                </Form.Item>
                <br /><br />
                <div>
                    <Form ref={formRef} onFinish={handleSubmit}>
                        <h2>Maincategory Select</h2>
                        <Select
                            placeholder="Select Main Category"
                            value={selectedMainCategoryId}
                            onChange={handleMainCategoryChange}
                            showSearch
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children}
                        >
                            {mainCategories.map(category => (
                                <Option key={category._id} value={category.id}>{category.maincategory}</Option>
                            ))}
                        </Select>
                        <br /><br />
                        <Form.Item
                            name="subcategory"
                            rules={[
                                {
                                    required: true,
                                    message: 'Enter Sub Category'
                                }
                            ]}
                        >
                            <Input name="subcategory" placeholder="Enter Category" onChange={(e) => handleSubcategoryChange(e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Enter description'
                                }
                            ]}
                        >
                            <Input name="description" placeholder="Enter Description" onChange={(e) => handleDescriptionChange(e.target.value)} />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 12,
                                span: 12,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <table border="2px solid white" index>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Main Category</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Action</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subCategories
                            .filter(category => {
                                return search === '' || category.Subcategories.subcategory.includes(search) || category.maincategory.includes(search);
                            })
                            .map((category, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{category.maincategory}</td>
                                    <td>{category.Subcategories.subcategory}</td>
                                    <td>{category.Subcategories.description}</td>
                                    <td>
                                    <Button
    type="danger"
    style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
    onClick={() => handleDelete(category.Subcategories._id)} // Corrected ID here
>
    Delete
</Button>
                                    </td>
                                    <td>
                                        <Link to={`/subcategoeyedit/${category.Subcategories._id}`}>
                                            <Button type="primary">Edit</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Subcategory;
