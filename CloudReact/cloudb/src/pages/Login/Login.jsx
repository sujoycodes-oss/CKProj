import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer/footer';
import { setAuthData } from '../../redux/actions/authActions';
import { login } from '../../services/authService';
import svgLogo from '../../assets/newCklogo.png';
import '../../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth);

    useEffect(() => {
        if (user && user.role) {
            const redirectPath =
                user.role === 'ADMIN' ? '/admin' :
                    user.role === 'READ_ONLY' ? '/readonly' :
                        user.role === 'CUSTOMER' ? '/customer' :
                            '/';

            navigate(redirectPath, { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        try {
            const response = await login(formData);

            dispatch(setAuthData({
                token: response.token,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
                role: response.role,
                cloudAccountIds: response.cloudAccountIds || null
            }));

            if (response.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            }
            if (response.role === 'READ_ONLY') {
                navigate('/readonly', { replace: true });
            }
            if (response.role === 'CUSTOMER') {
                navigate('/customer/cost-explorer', { replace: true });
            }
            

        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <div className='login-container'>
                <div className='login-card'>
                    <img src={svgLogo} alt='Cloud Balance logo' className='logo-img' />
                    {error && <div className='alert alert-danger'>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="email">Email</label>
                            <input
                                type='text'
                                name='email'
                                placeholder='Business Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password">Password</label>
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'LOGIN'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
