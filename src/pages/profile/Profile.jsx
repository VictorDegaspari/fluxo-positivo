import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { get, update } from '../../api';
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import "./index.scss";

function Profile() {
	const [userId, setUserId] = useState(localStorage.getItem('userId'));
	const [loading, setLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [formData, setFormData] = useState({});
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleInputChange = (event) => {
        if (!hasChanges) {
            setHasChanges(true);
        }
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

	useEffect(() => {
		setLoading(true);
		async function getUser() {
            try {
                const { user } = await get(baseUrl + '/users/find/' + userId);
                if (!user) throw new Error();
                delete user.password;
                setLoading(false);
                if (!user) return;
                setFormData(user);
            } catch (error) {
                setLoading(false);
                console.error(error);
                toast.error('Erro ao encontrar o usuário, certifique-se de estar logado!');
            }
		}
		getUser();
	}, [baseUrl, userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData?.phone?.length < 3 || formData?.phone?.email < 3 || formData?.name?.length < 3) {
            toast.error('Preencha os campos com ao menos 3 caracteres!');
            return;
        }
        setLoading(true);
        try {
            const { updatedUser } = await update(baseUrl + '/users/update/' + userId, formData);
            if (!updatedUser) throw new Error();
            setFormData(updatedUser);
            setLoading(false);
            setHasChanges(false);
            toast.success('Usuário atualizado com sucesso!');
        } catch (error) {
            console.error(error);
            setHasChanges(false);
            setLoading(false);
            toast.error('E-mail já cadastrado no sistema!');
        }
    };

  	return (
    <>
    <LayoutPage
		title="Meu perfil"
		subtitle="Gerencie o seu perfil aqui"
		icon="settings"
		backButton={true}
		bodyStyle="overflow: initial !important "
		background="linear-gradient(to right, #3b82f6, #74c9f7)"
		header={
			<div className="table-header w-full flex items-center justify-end">
			</div>
      	}
      	body={
        <div className="w-full">
            <div>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <label className="flex flex-col mt-4">
                        Nome:
                        <input defaultValue={formData.name} disabled={loading} required name="name" type="text" placeholder="Seu nome" onChange={handleInputChange}/>
                    </label>
                    <label className="flex flex-col mt-4">
                        E-mail:
                        <input defaultValue={formData.email} disabled={loading} required name="email" type="email" placeholder="email@teste.com" onChange={handleInputChange}/>
                    </label>
                    <label className="flex flex-col mt-4">
                        Telefone:
                        <input defaultValue={formData.phone} disabled={loading} required name="phone" type="text" placeholder="(XX) XXXXX-XXXX" onChange={handleInputChange}/>
                    </label>
                    <div className="flex items-center justify-end mt-4">
                        <button type="button" className="mr-2 btn error" onClick={() => {}}>Cancelar</button>
                        <button disabled={!hasChanges || loading} className="btn mr-2 flex items-center" type="submit">
                            <span className={ `material-icons-outlined mr-2  ${ loading ? 'animate-spin' : '' }` }>
                                { loading ? 'autorenew' : 'check' }
                            </span>
                            Salvar alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
	}></LayoutPage>
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
    </>);
}

export default Profile;
