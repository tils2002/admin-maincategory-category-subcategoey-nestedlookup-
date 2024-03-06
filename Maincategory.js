import React, { useState, useEffect } from 'react';
import { Input, Form, Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Maincategory = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = () => {
    axios.get('http://localhost:4545/maindataget/')
      .then(response => {
        console.log(response);
        setData(response.data.data);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const [mainformData, setmainFormData] = useState({
    maincategory: '',
    description: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setmainFormData({
      ...mainformData,
      [name]: value.toLowerCase(),
    });
  };

  const onFinish = values => {
    axios.post('http://localhost:4545/maincategory', mainformData)
      .then(response => {
        if (response.status === 200) {
          toast.success(response.data.messages);
          form.resetFields();
          fetchData();
        }
      })
      .catch(error => {
        console.error('Error adding maincategory:', error);
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
          toast.error('Failed to add maincategory');
        }
      });
  };

  const handleDelete = (categoryId) => {
    axios.delete(`http://localhost:4545/maincategory/${categoryId}`)
      .then(response => {
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchData(); // Refresh data after deletion
        }
      })
      .catch(error => {
        console.error('Error deleting main category:', error);
        toast.error('Failed to delete main category');
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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
        <br />
        <br />
        <div className="form-container">
          <Form method="POST" form={form} onFinish={onFinish}>
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
              <Input name="maincategory" placeholder="Enter Main Category" onChange={handleChange} />
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
              <Input name="description" placeholder="Enter Description" onChange={handleChange} />
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
        <table border="2px solid white">
          <thead>
            <tr>
              <th>Index</th>
              <th>Main Category</th>
              <th>Description</th>
              <th>Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {currentItems.map((item, indexOnPage) => (
            <tr key={item._id}>
              <td>{indexOfFirstItem + indexOnPage + 1}</td>
              <td>{item.maincategory}</td>
              <td>{item.description}</td>
              <td>
                <Button
                  type="danger"
                  style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </td>
              <td>
                <Link to={`/edit/${item._id}`}>
                  <Button type="primary">
                    Edit
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <div className="pagination">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <ul>
            {data.length > itemsPerPage &&
              Array(Math.ceil(data.length / itemsPerPage))
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </li>
                ))}
          </ul>
          <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Maincategory;
