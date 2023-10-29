import React, { useEffect, useState } from "react";
import { get, update } from '../../api';
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import Spinner from "../../components/Spinner/Spinner";
import "./index.scss";

function Profile() {
	const [searchQuery, setSearchQuery] = useState('');
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
			const { user } = await get(baseUrl + '/users/find/638fb99cbcef8af3abed238d');
            delete user.password;
			setLoading(false);
			if (!user) return;
			setFormData(user);
		}
		getUser();
	}, [baseUrl]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { updatedUser } = await update(baseUrl + '/users/update/638fb99cbcef8af3abed238d', formData);
        setFormData(updatedUser);
        setLoading(false);
        setHasChanges(false);
    };

  	return (
    <LayoutPage
		title="Meu perfil"
		subtitle="Gerencie o seu perfil aqui"
		icon="female"
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
                        <input defaultValue={formData.name} required name="name" type="text" placeholder="Seu nome" onChange={handleInputChange}/>
                    </label>
                    <label className="flex flex-col mt-4">
                        E-mail:
                        <input defaultValue={formData.email} required name="email" type="email" placeholder="email@teste.com" onChange={handleInputChange}/>
                    </label>
                    <label className="flex flex-col mt-4">
                        Telefone:
                        <input defaultValue={formData.phone} required name="phone" type="text" placeholder="(XX) XXXXX-XXXX" onChange={handleInputChange}/>
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

            {loading && (
                <div className="w-full flex items-center justify-center mt-4">
                <Spinner />
                </div>
            )}

        </div>
	}></LayoutPage>);
}

export default Profile;
