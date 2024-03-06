import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Editsubcategory = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [mainCategories, setMainCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(id);
        fetchMainCategories();
    }, [id]);

    const fetchMainCategories = async () => {
        try {
            const response = await axios.get("http://localhost:4545/maindataget");
            setMainCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching main categories:', error);
        }
    };

    const fetchData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:4545/categories/${id}`);
            const { subcategory, description, maincategoryid } = response.data.data;
            form.setFieldsValue({ maincategoryid, subcategory, description });
            setSelectedMainCategory(maincategoryid);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (changedValues, allValues) => {
        console.log('Form values:', allValues);
    };
    
    const handleFormSubmit = async () => {
        try {
            // Get form data
            const formData = form.getFieldsValue(); 
    
            // Add the selected main category to the form data
            formData.maincategoryid = selectedMainCategory;
    
            setLoading(true);
            
            // Send PATCH request with form data
            await axios.patch(`http://localhost:4545/subcategoryupdate/${id}`, formData); 
    
            setLoading(false);
            
            // Show success toast
            toast.success('Subcategory updated successfully!');
            navigate('/Subcategory');
        } catch (error) {
            console.error('Error updating subcategory:', error);
            setLoading(false);
            
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
        navigate('/Subcategory');
      };
    
    return (
        <div className="content-wrapper">
            <ToastContainer /> {/* ToastContainer should be rendered at the root level */}
            <nav>
                <ul>
                    <li><Link to="/Maincategory">Main Category</Link></li>
                    <li><Link to="/Subcategory">Category</Link></li>
                    <li><Link to="/Subdata">SubData</Link></li>
                </ul>
            </nav>
            <div className="content">
                <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    onValuesChange={handleChange}
                    initialValues={{ maincategoryid: selectedMainCategory, subcategory: '', description: '' }}
                >
                    <h2>Main Category Select</h2>
                    <Select
                        placeholder="Select Main Category"
                        style={{ width: 200 }}
                        showSearch
                        optionFilterProp="children"
                        value={selectedMainCategory}
                        onChange={value => setSelectedMainCategory(value)}
                    >
                        {mainCategories.map(category => (
                            <Select.Option key={category._id} value={category._id}>
                                {category.maincategory}
                            </Select.Option>
                        ))}
                    </Select>
                    <br /><br />
                    <Form.Item
                        name="subcategory"
                        rules={[{ required: true, message: 'Enter Sub Category' }]}
                    >
                        <Input placeholder="Enter Category" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        rules={[{ required: true, message: 'Enter Description' }]}
                    >
                        <Input placeholder="Enter Description" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update
                        </Button>
                        <Button type="default" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                Cancel
              </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Editsubcategory;
