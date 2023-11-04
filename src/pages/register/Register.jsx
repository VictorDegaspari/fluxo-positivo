import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { post } from "../../api";
import "./index.scss";

export default function Register() {
    const navigate = useNavigate();
    const [ error, setError] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ email, setEmail] = useState('');
    const [ name, setName] = useState('');
    const [ phone, setPhone] = useState('');
    const [ password, setPassword] = useState('');
    const [ passwordConfirm, setPasswordConfirm] = useState('');
    const baseUrl = process.env.REACT_APP_API_URL;
    const errors = [
        { minLength: 'Preencha os campos com pelo menos 3 caracteres!' },
        { invalidPassword: 'As senhas devem ser iguais!' },
        { authError: 'E-mail já cadastrado no sistema' },
    ];

    async function login(e) {
        e.preventDefault();

        if (
            !email || 
            !password || 
            !name || 
            !phone || 
            phone.length < 3 || 
            email.length < 3 || 
            name.length < 3 || 
            password.length < 3
        ) {
            setError(showError('minLength'));
            toast.error(showError('minLength'));
            return;
        }

        if (password !== passwordConfirm) {
            setError(showError('invalidPassword'));
            toast.error(showError('invalidPassword'));
            return;
        }

        try {
            setLoading(true);
            const response = await post(baseUrl + "/auth/new", { email: email, password: password, phone: phone, name: name  });
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
                <form id="login" className='w-full' onSubmit={(event) => login(event)}>
                    <div className='flex mb-5'>
                        <h1 className='m-0 mr-2'>Fluxo </h1>
                        <h1 className='m-0'>Positivo</h1>
                    </div>
                    <label className="flex flex-col">
					    Nome:
                        <input required className=" mb-5" type="text" name="name" id="name" placeholder="Nome completo" value={ name } onChange={ (event) => setName(event.target.value) }/>
                    </label>
                    <label className="flex flex-col">
                        E-mail:
                        <input required className=" mb-5" type="email" name="email" id="email" placeholder="E-mail" value={ email } onChange={ (event) => setEmail(event.target.value) }/>
                    </label>
                    <label className="flex flex-col">
                        Telefone:
                        <input required className=" mb-5" type="text" name="phone" id="phone" placeholder="(XX) XXXXX-XXXX" value={ phone} onChange={ (event) => setPhone(event.target.value) }/>
                    </label>
                    <label className="flex flex-col">
                        Senha:
                        <input required className="mb-5" type="password" name="password" id="password" placeholder="Senha" value={ password } onChange={ (event) => setPassword(event.target.value) }/>
                    </label>
                    <label className="flex flex-col">
                        Confirmar senha:
                        <input required className="mb-5" type="password" name="password_confirm" id="password_confirm" placeholder="Confirmar senha" value={ passwordConfirm } onChange={ (event) => setPasswordConfirm(event.target.value) }/>
                    </label>
                    <button id="login-button" className="flex items-center justify-center btn w-full" type="submit">
                        <span className={ `material-icons-outlined mr-2 ${ loading ? 'animate-spin' : '' }` }>
                            { loading ? 'autorenew' : 'add' }
                        </span>
                        Registrar
                    </button>
                    { error && <small className="error text-red-600 text-center" >{ error }</small> }
                    <div className='flex items-center mt-4'>
                        <hr className='bg-slate-800 w-full' />
                        <span className='mr-3 ml-3 text-gray-700'>OU</span>
                        <hr className='bg-slate-800  w-full' />
                    </div>
                    <span className='text-blue-600 underline cursor-pointer' onClick={() => navigate('/login')}>
                        Já possui conta? Clique aqui
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
