import React, { useState } from "react";
import { Input, Form, Checkbox, Button } from 'antd';

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DatePicker, Space } from 'antd';


const Register = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        dob: null,
        phone: '',
        password: '',
        repassword: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dob: date,
        });
    };
    const closePopup = () => {
        setIsRegistered(false);
      };
    const onFinish = (values) => {
        setLoading(true);
        axios.post("http://localhost:4545/", formData
        ).then((response) => {    
            if (response.status == 200) {        
                setIsRegistered(true);                
            }
        })
            .catch(function (error) {
                console.log(error);
                alert('invalid details');
            })
        setLoading(false);
    }
    return (
        <>   
            <div className="">
             <div className="form_wrapper">
             {isRegistered && (
        <div className="popup">
          <span className="close" onClick={closePopup}>&times;</span>
          <p>Registration successful!</p>
          <p>Welcome, {formData.email}!</p>
        </div>
      )}
                    <div className="form_container">
                        <div className="title_container">
                            <h2>Registrations</h2>
                        </div>
               <div className="row clearfix">
                            <div className="">
                                <Form method="POST" onFinish={onFinish} >
                                    <div className="row clearfix">
                                        <div className="col_half">
                                            <div className="input_field">
                                                <Form.Item 
                                                    name="firstname"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please input First Name!'
                                                        },
                                                        {
                                                            whitespace: true,
                                                            message: 'Please input First Name!'
                                                        }
                                                    ]} hasFeedback>
                                                    <Input name="firstname" placeholder="Input a First Name" onChange={handleChange} />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col_half">
                                            <Form.Item
                                                name="lastname"
                                                rules={[{
                                                    required: true,
                                                    message: 'Please input Last Name!'
                                                },
                                                {
                                                    whitespace: true,
                                                    message: 'Please input Last Name!'
                                                }
                                                ]}
                                                hasFeedback
                                            >
                                                <Input name="lastname" placeholder="Input a Last Name" onChange={handleChange} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                type: 'email',
                                                message: 'The input is not valid mail.',
                                            },
                                            {
                                                required: true, message: 'Please input email!'
                                            },
                                            {
                                                whitespace: true,

                                            }
                                        ]} hasFeedback>
                                        <Input name="email" placeholder="Input a email" onChange={handleChange} />
                                    </Form.Item>
                                    <Form.Item

                                        name="dob"
                                        hasFeedback >
                                        <Space  >
                                            <DatePicker name="dob" onChange={handleDateChange} />
                                        </Space>
                                    </Form.Item>
                                    <Form.Item
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input phone number!'
                                            },
                                            {
                                                whitespace: true,
                                                message: 'Please input Phone!'
                                            }]} hasFeedback>
                                        <Input name="phone" placeholder="Input a  Phone Number" onChange={handleChange}
                                            maxLength={10}
                                            minLength={10} />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[{
                                            required: true,
                                            message: 'Please input password!'
                                        },
                                        {
                                            whitespace: true,
                                            message: 'Please input Password!'
                                        }
                                        ]} hasFeedback>
                                        <Input.Password name="password" placeholder="Input a Password" onChange={handleChange} />
                                    </Form.Item>
                                    <Form.Item
                                        name="repassword"
                                        rules={[{
                                            required: true, message: 'Please input re password!'
                                        },
                                        {
                                            whitespace: true,
                                            message: 'Please input  repassword!'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject('The Two Password is Not Match')
                                            }
                                        })

                                        ]} hasFeedback>
                                        <Input.Password name="repassword" placeholder="Input a re Password" onChange={handleChange} />
                                    </Form.Item>
                                    <Form.Item
                                        name="agreement"
                                        valuePropName="checked"
                                        rules={[
                                            {
                                                validator: (_, value) =>
                                                    value
                                                        ? Promise.resolve()
                                                        : Promise.reject(
                                                            'Please Check',
                                                        ),
                                            },
                                            {
                                                required: true,
                                                message: 'Please Check',
                                            },
                                        ]}>
                                        <Checkbox >
                                            {" "}
                                            Agree to our <a href="#">Terms and Conditation</a>
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Register
                                        </Button>

                                    </Form.Item>
                                 
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Register
