import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get, post, remove, update } from '../../api';
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import "./index.scss";

function Brand() {
	const [searchQuery, setSearchQuery] = useState('');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const baseUrl = process.env.REACT_APP_API_URL;
	
	useEffect(() => {
		setLoading(true);
		async function getBrands() {
			setLoading(true);
			const { brands } = await get(baseUrl + '/brands/get/');
			setLoading(false);
			if (!brands) return;
			setData(brands);
		}
		getBrands();
	}, [baseUrl]);

	function openModal(modalContent) {
		setModalContent(modalContent)
		setModalOpened(true);
	}

	async function deleteBrand(brandId) {
		setData(data.filter(brand => brand._id !== brandId));
		setModalOpened(false);
		try {
			await remove(baseUrl + '/brands/remove/' + encodeURI(brandId));
			toast.success("Marca removida com sucesso!");
		} catch (error) {
			toast.error("Erro ao deletar Marca");
            console.error(error);
		}
	}

	async function editBrand(e, brand) {
        e.preventDefault();
		const editedData = new FormData(e.target);
		const jsonData = {};
	
		editedData.forEach((value, key) => {
			jsonData[key] = value;	
		});

        try {
            const response = await update(baseUrl + '/brands/update/' + encodeURI(brand._id), jsonData);
            if (response.info?.type === 'Error') throw new Error();
			const index = data.findIndex(item => item._id === response.updatedBrand._id);
			const updatedItems = data;
			updatedItems[index] = response.updatedBrand;
			toast.success("Marca atualizada com sucesso!");
			setData(updatedItems);
            setLoading(false);
			setModalOpened(false);
        } catch (error) {
			toast.error("Erro ao atualizar produto");
            console.error(error);
            setLoading(false);
			setModalOpened(false);
        }
	}

    const handleSubmit = async (event) => {
        event.preventDefault();
		const editedData = new FormData(event.target);
		const jsonData = {};
	
		editedData.forEach((value, key) => {
			jsonData[key] = value;	
		});

		setLoading(true);
		try {
			const response = await post(baseUrl + '/brands/post/', jsonData);
            setLoading(false);
            if (response.info?.type === 'Error') throw new Error();
			const { brand } = response;
			const oldData = data;
			oldData.push(brand);
			setData(oldData);
			toast.success("Marca adicionada com sucesso!");
			setModalOpened(false);
        } catch (error) {
			toast.error("Erro ao adicionar marca");
            console.error(error);
            setLoading(false);
        }
    };

  	return (
	<>
    <LayoutPage
		title="Marcas de absorvente"
		subtitle="Gerencie suas marcas aqui"
		icon="manage_accounts"
		backButton={true}
		bodyStyle="overflow: initial !important "
		background="linear-gradient(to right, #eab308, #fcdb58)"
		header={
			<div className="table-header w-full flex items-center justify-between mobile-flex-column">
				<div className="relative">
					<input
						className="block w-full py-2 px-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						type="text"
						placeholder="Buscar parceiro"
						onChange={() => {}}
					/>
					<div className="absolute top-3 right-0 flex items-center pr-3 pointer-events-none">
						<span className="material-icons-outlined">
							search
						</span>
					</div>
				</div>
				<button className="btn mr-2 flex items-center" onClick={() => openModal(
					<form onSubmit={(event) => handleSubmit(event)}>
						<h1>Criar marca</h1>
						<label className="flex flex-col mt-4">
							Nome:
							<input required name="name" type="text" placeholder="Nome da marca"/>
						</label>
						<label className="flex flex-col mt-4">
							Descrição:
							<textarea required name="description" type="text" placeholder="Descrição da Marca"/>
						</label>
						<div className="flex items-center justify-end mt-4">
							<button type="button" className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
							<button type="submit" className="mr-2 btn">Salvar</button>
						</div>
					</form>
				)}>
					<span className="material-icons-outlined mr-2">
						add
					</span>
					Criar marca
				</button>
			</div>
      	}
      	body={
        <div className="w-full">
            <div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
						<th className="px-6 py-3" scope="col">
							Nome da marca
						</th>
						<th className="px-6 py-3" scope="col">
							Data de criação
						</th>
						<th className="px-6 py-3" scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 && data.map((brand, index) => (
                        <tr
                            key={index}
                            className={`border-b cursor-pointer hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            <th className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap" scope="row">
								<span className="font-normal text-gray-900 whitespace-nowrap">{ brand.name }</span>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
								{  new Intl.DateTimeFormat('pt-BR', {}).format(new Date(brand.created)) }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-normal text-gray-900 cursor-pointer hover:underline whitespace-nowrap">
                                    Ver marca
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-end w-full">
                                    <span className="material-icons-outlined mr-2 text-gray-600" onClick={() => openModal(
										<form onSubmit={(e) => editBrand(e, brand)}>
											<h1>Editar parceiro</h1>
											<label className="flex flex-col mt-4">
												Nome:
												<input name="name" defaultValue={ brand.name } type="text" placeholder="Título do absorvente"/>
											</label>
											<label className="flex flex-col mt-4">
												Descrição:
												<textarea className="input-primary" name="description" type="text" defaultValue={ brand.description } placeholder="Título do absorvente"/>
											</label>
											<div className="flex items-center justify-end mt-4">
												<button type="button" className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
												<button type="submit" className="mr-2 btn">Editar</button>
											</div>
										</form>
									)}>
                                        edit
                                    </span>
                                    <span className="material-icons-outlined mr-2 text-red-500" onClick={() => openModal(
										<div>
											<span>Deseja realmente excluir esse produto?</span>
											<div className="flex items-center justify-end mt-4">
												<button className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
												<button className="mr-2 btn" onClick={() => deleteBrand(brand._id)}>Confirmar</button>
											</div>
										</div>
									)}>
                                        delete
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {loading && (
                <div className="w-full flex items-center justify-center mt-4">
                <Spinner />
                </div>
            )}

            {(!data || !data.length) && !loading && (
                <div className="w-full flex items-center justify-center p-6">
                <span className="mr-2 material-icons-outlined">wifi_tethering_off</span>
                    Nenhum resultado para sua busca...
                </div>
            )}

			{ modalOpened && <Modal opened={(e) => setModalOpened(e)} body={ modalContent }/>}
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

export default Brand;
