import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const Editsubdata = () => {
    const { Option } = Select;
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    const [search, setSearch] = useState('');
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const mainResponse = await axios.get("http://localhost:4545/maindataget");
            setMainCategories(mainResponse.data.data);
        } catch (error) {
            console.error('Error fetching main categories:', error);
        }
    };

    const fetchSubData = async (mainCategoryId) => {
        try {
            const subResponse = await axios.get(`http://localhost:4545/subcatdataget?mainCategoryId=${mainCategoryId}`);
            setSubCategories(subResponse.data.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    useEffect(() => {
        if (selectedMainCategoryId) {
            fetchSubData(selectedMainCategoryId);
        }
    }, [selectedMainCategoryId]);

    useEffect(() => {
        if (id) {
            fetchDatas(id);
        }
    }, [id]);

    const fetchDatas = async (id) => {
        try {
            const response = await axios.get(`http://localhost:4545/subdata/${id}`);
            const { subcategoryid, description, subdata, maincategoryid } = response.data.data;

            setSelectedMainCategoryId(maincategoryid);
            setSelectedSubCategoryId(subcategoryid);

            // Populate form fields
            form.setFieldsValue({ maincategoryid, subcategoryid, subdata, description });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleMainCategoryChange = (value) => {
        setSelectedMainCategoryId(value);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const handleFormSubmit = async () => {
        try {
            // Get form data
            const formData = form.getFieldsValue(); 
    
            // Add the selected main category to the form data
            formData.maincategoryid = selectedMainCategoryId;
            formData.subcategoryid = selectedSubCategoryId;

    
            
            
            // Send PATCH request with form data
            await axios.patch(`http://localhost:4545/subdataupdate/${id}`, formData); 
    
        
            
            // Show success toast
            toast.success('Subcategory updated successfully!');
            navigate('/Subdata');
        
        } catch (error) {
            console.error('Error updating subcategory:', error);
            
            
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
                toast.error('Failed to update subcategory');
            }
        }
    };
    const handleCancel = () => {
        navigate('/Subdata');
      };
    return (
        <div className="content-wrapper">
            <ToastContainer />
            <nav>
                <ul>
                    <li>
                        <Link to="/Maincategory">
                            Main Category
                        </Link>
                    </li>
                    <li>
                        <Link to="/Subcategory">
                            Category
                        </Link>
                    </li>
                    <li>
                        <Link to="/Subdata">
                            SubData
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="content">
                <br /><br />
                <div>
                    <Form form={form} onFinish={handleFormSubmit}>
                        <>
                            <h2>Maincategory Select</h2>
                            <Select
                                placeholder="Select Main Category"
                                style={{ width: 200 }}
                                onChange={handleMainCategoryChange}
                                value={selectedMainCategoryId}
                            >
                                {mainCategories.map(category => (
                                    <Option key={category._id} value={category.id}>{category.maincategory}</Option>
                                ))}
                            </Select>

                            {subCategories.length > 0 && (
                                <>
                                    <h2>Category Select</h2>
                                    <Select
                                        placeholder="Select Category"
                                        style={{ width: 200 }}
                                        onChange={(value) => setSelectedSubCategoryId(value)}
                                        value={selectedSubCategoryId}
                                    >
                                        {subCategories.filter((category) => {
                                            return search === '' || category.subcategory.toLowerCase().includes(search.toLowerCase());
                                        }).map((category) => (
                                            <Option key={category._id} value={category._id}>{category.subcategory}</Option>
                                        ))}
                                    </Select>
                                </>
                            )}
                        </>

                        <br /><br />
                        <Form.Item
                            name="subdata"
                            rules={[
                                {
                                    required: true,
                                    message: 'Enter Sub Category'
                                }
                            ]}
                        >
                            <Input name="subdata" placeholder="Enter SubData" />
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
                            <Input name="description" placeholder="Enter Description" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 12,
                                span: 12,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                            <Button type="default" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                Cancel
              </Button>
                        </Form.Item>
                    </Form>
                    <br />
                </div>
            </div>
        </div>
    );
}

export default Editsubdata;
