import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Subdata = () => {
    const formRef = useRef(null);
    const { Option } = Select;
    const [search, setSearch] = useState('');
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    const [subdata, setSubdata] = useState('');
    const [description, setDescription] = useState('');
    const [showdata, setshowdata] = useState([]);
    useEffect(() => {
        datashow();
    }, []);
    const datashow = () => {
        axios.get("http://localhost:4545/subdataget")
            .then(response => {
                if ((response.data)) {
                    console.log(response.data);
                    setshowdata(response.data);
                } else {
                    console.error('Data received is not an array:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        axios.get("http://localhost:4545/maindataget")
            .then(response => {
                setMainCategories(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching main categories:', error);
            });
    };
    useEffect(() => {
        fetchSubData();
    }, [selectedMainCategoryId]);
    const fetchSubData = () => {
        if (selectedMainCategoryId) {
            axios.get(`http://localhost:4545/subcatdataget?mainCategoryId=${selectedMainCategoryId}`)
                .then(response => {
                    setSubCategories(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching subcategories:', error);
                });
        }
    };
    const handleMainCategoryChange = (value) => {
        setSelectedMainCategoryId(value);
        setSelectedSubCategoryId('');
    };
    const handleSubCategoryChange = (value) => {
        setSelectedSubCategoryId(value);
    };
    const handleSubmit = () => {
        const dataToSend = {
            maincategoryid: selectedMainCategoryId,
            subcategoryid: selectedSubCategoryId,
            subdata: subdata.toLowerCase(),
            description: description.toLowerCase()
        };
        console.log(dataToSend);
        axios.post("http://localhost:4545/subdata", dataToSend)
            .then(response => {
                if (response.status === 200) {
                    toast.success(response.data.messages); 
                    setSelectedMainCategoryId('');
                    setSelectedSubCategoryId('');
                    setSubdata('');
                    setDescription('');
                    formRef.current.resetFields();
                    fetchallData();
                }
            })
            .catch(error => {
                console.error('Error adding subdata:', error);
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
                    toast.error('Failed to add subdata');
                }
            });
    };
    const fetchallData = () => {
        axios.get("http://localhost:4545/subdataget")
            .then(response => {
                console.log("Categories data:", response.data);
                setshowdata(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:4545/subdata/${id}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchallData();
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
                    <Form ref={formRef} onFinish={handleSubmit}>
                        <>
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
                                <Option value='blank'>Select</Option>
                                {mainCategories.map(category => (
                                    <Option key={category._id} value={category.id}>{category.maincategory}</Option>
                                ))}
                            </Select>
                            {subCategories.length > 0 && (
                                <>
                                    <h2>Category Select</h2>
                                    <Select
                                        placeholder="Select Category"
                                        value={selectedSubCategoryId}
                                        onChange={handleSubCategoryChange}
                                        showSearch
                                        style={{ width: 200 }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.children}
                                    >
                                        {subCategories.filter((category) => {
                                            return search === '' || category.subcategory.toLowerCase().includes(search.toLowerCase());
                                        }).map((category) => (
                                            <Option key={category._id} value={category.id}>{category.subcategory}</Option>
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
                            <Input name="subdata" placeholder="Enter SubData" onChange={(e) => setSubdata(e.target.value)} />
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
                            <Input name="description" placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)} />
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
                    <br />
                    <table border="2px solid white">
                    <thead>
                    <tr>
                    <th>Index</th>
                        <th>Main Category</th>
                        <th>Subcategory</th>
                        <th>Subdata</th>
                        <th>Description</th>
                        <td>Action</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>

    {showdata.slice().reverse().map((category,index)=>(
        <React.Fragment key={index}>
        <tr>
        <td>{index+1}</td>
        <td>{category.maincategory}</td>
        <td>{category.SubcategoryName.subcategory}</td>
        <td>{category.SubcategoryName.Subdata.subdata}</td>
        <td>{category.SubcategoryName.Subdata.description}</td>
        <td>
        <Button
            type="danger"
            style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
            onClick={() => handleDelete(category.SubcategoryName.Subdata._id)}
        >
            Delete
        </Button>
    </td>
        <td>
                                        <Link to={`/subdataedit/${category.SubcategoryName.Subdata._id}`}>
                                            <Button type="primary">Edit</Button>
                                        </Link>
                                    </td>
    </tr>
        </React.Fragment>
    ))}
</tbody>

                        
                    </table>

                </div>
            </div>
        </div>
    );
}
export default Subdata;
