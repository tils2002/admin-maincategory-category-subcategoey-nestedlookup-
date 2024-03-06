import React, { useState, useEffect } from 'react';
import { Input, Form, Button } from 'antd';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Editmain = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [maincategory, setMainCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const fetchData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4545/maindataget/${id}`);
      console.log("Fetched data:", response.data);

      if (response.data.status && response.data.data) {
        const { maincategory, description } = response.data.data;
        console.log('Main Category:', maincategory);
        console.log('Description:', description);

        setMainCategory(maincategory);
        setDescription(description);
        form.setFieldsValue({
          maincategory,
          description
        });
      } else {
        console.error('No data found in the response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'maincategory') {
      setMainCategory(value.toLowerCase());
      console.log('Main Category:', value.toLowerCase());
    } else if (name === 'description') {
      setDescription(value.toLowerCase());
    }
  };
  
  const onFinish = () => {
    const updatedData = { maincategory, description };
    axios.patch(`http://localhost:4545/maindataupdate/${id}`, updatedData)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.messages);
          navigate('/Maincategory');
        }
      })
      .catch((error) => {
        console.error('Error updating maincategory:', error);
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
          toast.error('Failed to update maincategory');
        }
      });
  };

  const handleCancel = () => {
    navigate('/Maincategory');
  };

  return (
    <div className="content-wrapper">
      <ToastContainer />
      {/* Navigation Links */}
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
        <br />
        <br />
        <div className="form-container">
          <h1>Edit Main Category</h1>
          <Form form={form} onFinish={onFinish}>
            {/* Form Inputs */}
            <Form.Item
              name="maincategory"
              rules={[
                {
                  required: true,
                  message: 'Enter Main Category',
                },
                {
                  whitespace: true,
                  message: 'Enter Main Category!',
                },
              ]}
              hasFeedback
            >
              <Input
                name="maincategory"
                placeholder="Enter Main Category"
                value={maincategory}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Enter Description',
                },
                {
                  whitespace: true,
                  message: 'Enter Description!',
                },
              ]}
              hasFeedback
            >
              <Input
                name="description"
                placeholder="Enter Description"
                value={description}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Submit and Cancel Buttons */}
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
        </div>
      </div>
    </div>
  );
};

export default Editmain;
