import React, {useState} from 'react'
import { Input, Form ,Button} from 'antd';
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      email: '',
      password: ''
  });
  const closePopup = () => {
    setIsLogin(false);
  };
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
          ...formData,
          [name]: value,
      });
  };
console.log(formData);
  const onFinish = (values) => {
      setLoading(true);
      axios.post("http://localhost:4545/login",   formData
      ).then((response) => {
          if (response.status   == 200) {
            setIsLogin(true);         
          }
      })
          .catch(function (error) {
              console.log(error);
              alert('invalid details');
          })
      setLoading(false);
  }
  return (
    <div>
      <div className="">
        <div className="form_wrapper">
          {isLogin && (
        <div className="popup">
          <span className="close" onClick={closePopup}>&times;</span>
          <p>Login successful!</p>
          <p>Welcome, {formData.email}!</p>
        </div>
      )}
          <div className="form_container">
            <div className="title_container">
              <h2>Login</h2>
            </div>
            <div className="row clearfix">
              <div className="">
              <Form method="POST" onFinish={onFinish} >

                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                type:'email',
                                                message: 'The input is not valid mail.',
                                              },
                                            {
                                            required: true, message: 'Please input email!'
                                        },
                                        {
                                            whitespace:true,
                                            
                                        }
                                        ]} hasFeedback>
                                        <Input name="email" placeholder="Input a email" onChange={handleChange} />
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
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Login
                                        </Button>

                                    </Form.Item>
                    
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
