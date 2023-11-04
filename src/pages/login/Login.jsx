import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { post } from "../../api";
import "./index.scss";

export default function Login() {
    const navigate = useNavigate();
    const [ error, setError] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const baseUrl = process.env.REACT_APP_API_URL;
    const errors = [
        { minLength: 'Preencha com pelo menos 3 caracteres!'},
        { authError: 'Senha ou Email estão incorretos!' }
    ];

    async function login(e) {
        e.preventDefault();

        if (
            !email || 
            !password || 
            email.length < 3 || 
            password.length < 3
        ) {
            setError(showError('minLength'));
            return;
        }

        try {
            setLoading(true);
            const response = await post(baseUrl + "/auth/session", { email: email, password: password  });
            if (response.info?.type === 'Error') throw new Error();
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.user?._id);
            localStorage.setItem('email', email);
            setLoading(false);
            navigate('/');
        } catch (error) {
            toast.error(showError('authError'));
            localStorage.clear();
            setLoading(false);
            console.error(error);
            setError(showError('authError'));
        }
    }

    function showError (error) {
        let showError = '';
        errors.forEach(element => {
            if (error in element) {
                showError = element[error];
            }
        });
        return showError;
    }

    return (
        <>
            <div  className={'login2 flex min-h-screen items-center justify-end mr-20 w-full relative'} >
                <form id="login" onSubmit={(event) => login(event)}>
                    <div className='flex mb-5'>
                        <h1 className='m-0 mr-2'>Fluxo </h1>
                        <h1 className='m-0'>Positivo</h1>
                    </div>
                    <input required className=" mb-5" type="email" name="email" id="email" placeholder="E-mail" value={ email } onChange={ (event) => setEmail(event.target.value) }/>
                    <input required className="mb-5" type="password" name="password" id="password" placeholder="Senha" value={ password } onChange={ (event) => setPassword(event.target.value) }/>
                    <button id="login-button" className="flex items-center justify-center btn w-full" type="submit">
                        <span className={ `material-icons-outlined mr-2 ${ loading ? 'animate-spin' : '' }` }>
                            { loading ? 'autorenew' : 'login' }
                        </span>
                        Entrar
                    </button>
                    { error && <small className="error text-red-600 text-center" >{ error }</small> }
                    <div className='flex items-center mt-4'>
                        <hr className='bg-slate-800 w-full' />
                        <span className='mr-3 ml-3 text-gray-700'>OU</span>
                        <hr className='bg-slate-800  w-full' />
                    </div>
                    <span className='text-blue-600 underline cursor-pointer' onClick={() => navigate('/register')}>
                        Crie sua conta gratuita
                    </span>
                </form>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="colored"
            />
        </>
    );
}
