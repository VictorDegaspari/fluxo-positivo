import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get, post, remove, update } from '../../api';
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import "./index.scss";


function Products() {
	const [searchQuery, setSearchQuery] = useState('');
	const [data, setData] = useState([]);
	const [brands, setBrands] = useState([]);
	const [donors, setDonors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingEdit, setLoadingEdit] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const baseUrl = process.env.REACT_APP_API_URL;
	const route = useNavigate();

	useEffect(() => {
		setLoading(true);
		async function getProducts() {
			const { products } = await get(baseUrl + '/products/get/');
			setLoading(false);
			if (!products) return;
			setData(products);
		}
		async function getBrands() {
			const { brands } = await get(baseUrl + '/brands/get/');
			setLoading(false);
			if (!brands) return;
			setBrands(brands);
		}
		async function getDonors() {
			const { donors } = await get(baseUrl + '/donors/get/');
			setLoading(false);
			if (!donors) return;
			setDonors(donors);
		}
		getDonors();
		getProducts();
		getBrands();
	}, [baseUrl]);

	function openModal(modalContent) {
		setModalContent(modalContent)
		setModalOpened(true);
	}

	async function deleteProduct(productId) {
		setData(data.filter(product => product._id !== productId));
		setModalOpened(false);
		try {
			await remove(baseUrl + '/products/remove/' + encodeURI(productId));
			toast.success("Produto deletado com sucesso!");
		} catch (error) {
			toast.error("Erro ao deletar produto");
            console.error(error);
		}
	}

	async function editProduct(e, product) {
        e.preventDefault();
		const editedData = new FormData(e.target);
		const jsonData = {};
	
		editedData.forEach((value, key) => {
			jsonData[key] = key === 'flap' ? (value === 'on' ? true : false) : value;	
		});
		const hasFlap = Object.keys(jsonData).includes('flap');
		if (!hasFlap) {
			jsonData.flap = false;
		}
        try {
            const response = await update(baseUrl + '/products/update/' + encodeURI(product._id), jsonData);
            if (response.info?.type === 'Error') throw new Error();
			const index = data.findIndex(item => item._id === response.updatedProduct._id);
			const updatedItems = data;
			updatedItems[index] = response.updatedProduct;
			toast.success("Produto atualizado com sucesso!");
			setData(updatedItems);
            setLoadingEdit(false);
			setModalOpened(false);
        } catch (error) {
			toast.error("Erro ao atualizar produto");
            console.error(error);
            setLoadingEdit(false);
			setModalOpened(false);
        }
	}

    const handleSubmit = async (event) => {
        event.preventDefault();

		const editedData = new FormData(event.target);
		const jsonData = {};
	
		editedData.forEach((value, key) => {
			jsonData[key] = key === 'flap' ? (value === 'on' ? true : false) : value;	
		});
		const hasFlap = Object.keys(jsonData).includes('flap');
		if (!hasFlap) {
			jsonData.flap = false;
		}
		jsonData.brand = jsonData.brand === '' ? null : jsonData.brand;
		setLoading(true);
		try {
            const response = await post(baseUrl + '/products/post/', jsonData);
            if (response.info?.type === 'Error') throw new Error();
			const oldData = data;
			oldData.push(response.product);
			setData(oldData);
            setLoading(false);
			setModalOpened(false);
			toast.success("Produto adicionado com sucesso!");
        } catch (error) {
			toast.error("Erro ao adicionar produto");
            console.error(error);
            setLoading(false);
        }
    };

	const productForm = (product) => {
		return (
			<form onSubmit={(e) => { setLoadingEdit(true); editProduct(e, product)}}>
				<h1>Editar produto</h1>
				<label className="flex flex-col mt-4">
					Título:
					<input name="name" defaultValue={ product.name } type="text" placeholder="Título do absorvente"/>
				</label>
				<label className="flex flex-col mt-4">
					Descrição:
					<input name="description" type="text" defaultValue={ product.description } placeholder="Descrição do absorvente"/>
				</label>
				<label className="flex flex-col mt-4">
					Tamanho:
					<select name="size" placeholder="Título do absorvente" defaultValue={product.size}>
						<option value="" hidden>Selecione</option>
						<option value="P">P</option>
						<option value="M">M</option>
						<option value="G">G</option>
						<option value="XG">XG</option>
						<option value="XXG">XGG</option>
					</select>
				</label>
				<label className="flex flex-col mt-4">
					Tipo:
					<select name="type" defaultValue={product.type}>
						<option value="" hidden>Selecione</option>
						<option value="internal">Interno</option>
						<option value="evening">Noturno</option>
						<option value="external">Externo</option>
					</select>
				</label>
				<label className="flex flex-col mt-4">
					Marca:
					<select name="brand" defaultValue={product.brand}>
						{brands.map(item => (
							<option key={item._id} value={item._id}>
								{item.name}
							</option>
						))}
					</select>
				</label>
				<label className="flex mt-4 items-center justify-between" >
					Possui aba:
					<input
						name="flap"
						style={{ width: 'auto' }}
						type="checkbox"
						defaultChecked={product.flap}
					/>
				</label>
				<div className="flex items-center justify-end mt-4">
					<button type="button" className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
					<button type="submit" className="mr-2 btn">
						<span className={ `material-icons-outlined mr-2 ${ loadingEdit ? 'animate-spin' : '' }` }>
							{ loadingEdit ? 'autorenew' : '' }
						</span>
						Editar
					</button>
				</div>
			</form>
		);
	}

  	return (
	<>
    <LayoutPage
		title="Absorventes disponíveis"
		subtitle="Gerencie os seus absorventes aqui"
		icon="inventory_2"
		backButton={true}
		bodyStyle="overflow: initial !important "
		background="linear-gradient(to right, #22c55e, #1a9e4b)"
		header={
			<div className="table-header w-full flex items-center justify-between mobile-flex-column">
				<div className="relative">
					<input
						className="block w-full py-2 px-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						type="text"
						placeholder="Buscar absorvente"
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
						<h1>Criar produto</h1>
						<label className="flex flex-col mt-4">
							Título:
							<input required name="name" type="text" placeholder="Nome do absorvente"/>
						</label>
						<label className="flex flex-col mt-4">
							Descrição:
							<input required name="description" type="text" placeholder="Descrição do absorvente"/>
						</label>
						<label className="flex flex-col mt-4">
							Tamanho:
							<select required name="size" defaultValue={""}>
								<option value="" hidden>Selecione</option>
								<option value="P">P</option>
								<option value="M">M</option>
								<option value="G">G</option>
								<option value="XG">XG</option>
								<option value="XXG">XGG</option>
							</select>
						</label>
						<label className="flex flex-col mt-4">
							Tipo:
							<select required name="type" defaultValue={""}>
								<option value="" hidden>Selecione</option>
								<option value="internal">Interno</option>
								<option value="evening">Noturno</option>
								<option value="external">Externo</option>
							</select>
						</label>
						<label className="flex flex-col mt-4">
							Doador/Parceiro:
							<div className="flex items-center">
								{ (donors && donors.length > 0) && <select name="donor" className="mr-2" defaultValue={""}>
									<option value="" hidden>Selecione</option>
									{donors.map(item => (
										<option key={item._id} value={item._id}>
											{(item.type === 'partner' ? 'Parceiro - ' : 'Doador - ') + item.name}
										</option>
									))}
								</select> }
								<button type="button" onClick={() => route('/donor')} className="flex items-center btn">
									<span className="material-icons-outlined">add</span>
								</button>
							</div>
						</label>
						<label className="flex flex-col mt-4">
							Marca:
							<div className="flex items-center">
								{ (brands && brands.length > 0) && <select name="brand" className="mr-2" defaultValue={null}>
									<option value="" hidden>Selecione</option>
									{brands.map(item => (
										<option key={item._id} value={item._id}>
											{item.name}
										</option>
									))}
								</select> }
								<button type="button" onClick={() => route('/brand')} className="flex items-center btn">
									<span className="material-icons-outlined">add</span>
								</button>
							</div>
						</label>
						<label className="flex mt-4 items-center justify-between" >
							Possui aba:
							<input
								name="flap"
								style={{ width: 'auto' }}
								type="checkbox"
							/>
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
					Criar produto
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
                        Nome
                    </th>
                    <th className="px-6 py-3" scope="col">
                        Tamanho
                    </th>
                    <th className="px-6 py-3" scope="col">
						Tipo
					</th>
                    <th className="px-6 py-3" scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 && data.map((product, index) => (
                        <tr
                            key={index}
                            onClick={() => {}}
                            className={`border-b cursor-pointer hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            <th className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap" scope="row" onClick={() => openModal(productForm(product))}>
								<span className="font-normal text-gray-900 whitespace-nowrap">{ product.name }</span>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900" onClick={() => openModal(productForm(product))}>
								{ product.size }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900" onClick={() => openModal(productForm(product))}>
								{ product.type === 'evening' ? 'Noturno' : (product.type === 'internal' ? 'Interno' : 'Diário')  }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap" onClick={() => openModal(productForm(product))}>
                                <span className="font-normal text-gray-900 cursor-pointer hover:underline whitespace-nowrap">
                                    Ver Produto
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-end w-full">
                                    <span className="material-icons-outlined mr-2 text-gray-600" onClick={() => openModal(productForm(product))}>
                                        edit
                                    </span>
                                    <span className="material-icons-outlined mr-2 text-red-500" onClick={() => openModal(
										<div>
											<span>Deseja realmente excluir esse produto?</span>
											<br />
											<b>* Seu produto também será removido do estoque</b>
											<div className="flex items-center justify-end mt-4">
												<button className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
												<button className="mr-2 btn" onClick={() => deleteProduct(product._id)}>Confirmar</button>
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

export default Products;
