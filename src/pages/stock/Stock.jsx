import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get, post, remove, update } from '../../api';
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import "./index.scss";

function Stock() {
	const [stockError, setStockError] = useState("");
	const [searchQuery, setSearchQuery] = useState('');
	const [data, setData] = useState([]);
	const [productsData, setProductsData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const baseUrl = process.env.REACT_APP_API_URL;

	useEffect(() => {
		async function getStocks() {
			setLoading(true);
			const { stocks } = await get(baseUrl + '/stocks/get/');
			setLoading(false);
			if (!stocks) return;
			setData(stocks);
		}
		async function getProducts() {
			setLoading(true);
			const { products } = await get(baseUrl + '/products/get/');
			setLoading(false);
			if (!products) return;
			setProductsData(products);
		}
		getProducts();
		getStocks();

	}, [baseUrl]);

	function openModal(modalContent) {
		setModalContent(modalContent)
		setModalOpened(true);
	}

	async function deleteStock(stockId) {
		setData(data.filter(product => product._id !== stockId));
		setModalOpened(false);
		try {
			await remove(baseUrl + '/stocks/remove/' + encodeURI(stockId));
			toast.success("Estoque removido com sucesso!");
		} catch (error) {
			toast.error("Erro ao deletar Estoque");
            console.error(error);
		}
	}

	async function editStock(e, stock) {
        e.preventDefault();
		const editedData = new FormData(e.target);
		const jsonData = {};
	
		editedData.forEach((value, key) => {
			if (key === 'quantity') {
				jsonData[key] = value;	
			}
		});

        try {
            const response = await update(baseUrl + '/stocks/update/' + encodeURI(stock._id), jsonData);
            if (response.info?.type === 'Error') throw new Error();
			const index = data.findIndex(item => item._id === response.updatedStock._id);
			const updatedItems = data;
			updatedItems[index] = response.updatedStock;
			toast.success("Produto atualizado com sucesso!");
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
		setStockError("");
		const editedData = new FormData(event.target);
		const jsonData = {};
	
		editedData.forEach((value, key) => {
			jsonData[key] = value;	
		});

		setLoading(true);
		try {
			const response = await post(baseUrl + '/stocks/post/', jsonData);
            setLoading(false);
            if (response.info?.type === 'Error') return toast.error("Produto já existe no estoque");
			const { stock } = response;
			const oldData = data;
			oldData.push(stock);
			setData(oldData);
			toast.success("Produto adicionado ao estoque!");
			setModalOpened(false);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

  	return (
	<>
    <LayoutPage
		title="Estoque"
		subtitle="Gerencie o seu estoque aqui"
		icon="inventory"
		backButton={true}
		bodyStyle="overflow: initial !important "
		background="linear-gradient(to right, #a855f7, #a47ffa)"
		header={
			<div className="table-header w-full flex items-center justify-between">
				<div className="relative">
					<input
						className="block w-full py-2 px-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						type="text"
						placeholder="Buscar estoque"
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
						<h1>Adicionar novo produto ao estoque</h1>
						<label className="flex flex-col mt-4">
							Absorventes:
							<select name="product" defaultValue={""}>
								<option value="">Selecione</option>
								{productsData.map(item => (
									<option key={item._id} value={item._id}>
										{
											item.name + ' - Tamanho ' + item.size + ' - Tipo ' + (item.type === 'evening' ? 'Noturno' : (item.type === 'internal' ? 'Interno' : 'Diário')) + (item.flap ? ' com aba' : ' sem aba')}
									</option>
								))}
							</select>
						</label>
						<label className="flex flex-col mt-4">
							Quantidade:
							<input required name="quantity" type="number" placeholder="Quantidade de absorvente"/>
						</label>
						{ stockError && <small>{stockError}</small>
						}
						<div className="flex items-center justify-end mt-4">
							<button type="button" className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
							<button type="submit" className="mr-2 btn">Salvar</button>
						</div>
					</form>
				)}>
					<span className="material-icons-outlined mr-2">
						add
					</span>
					Adicionar produto ao estoque
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
                            Quantidade disponível
                        </th>
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
                    {data.length > 0 && data.map((stock, index) => (
                        <tr
                            key={index}
                            onClick={() => {}}
                            className={`border-b cursor-pointer hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            <td className="px-6 py-4 text-gray-900">
                                <b>{ stock.quantity || 0 }</b> itens
                            </td>
                            <th className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap" scope="row">
								<span className="font-normal text-gray-900 whitespace-nowrap">{ stock.product?.name }</span>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
								{ stock.product?.size }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
								{ stock.product?.type === 'evening' ? 'Noturno' : (stock.product?.type === 'internal' ? 'Interno' : 'Diário')  }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-normal text-gray-900 cursor-pointer hover:underline whitespace-nowrap">
                                    Ver Produto
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-end w-full">
                                    <span className="material-icons-outlined mr-2 text-gray-600" onClick={() => openModal(
										<form onSubmit={(e) => editStock(e, stock)}>
											<h1>Editar produto no estoque</h1>
											<label className="flex flex-col mt-4">
												Quantidade:
												<input type="number" name="quantity" defaultValue={stock.quantity} placeholder="Quantidade" />
											</label>
											<label className="flex flex-col mt-4">
												<b>Detalhes do absorvente</b>
                                            </label>

											<label className="flex flex-col mt-4">
												Nome:
												<input disabled type="text" name="quantity" defaultValue={stock.product?.name} placeholder="Nome do absorvente" />
                                            </label>
                                            <label className="flex flex-col mt-4">
                                                Tipo:
                                                <input disabled type="text" name="quantity" defaultValue={stock.product?.type === 'evening' ? 'Noturno' : (stock.product?.type === 'internal' ? 'Interno' : 'Diário')} placeholder="Tipo do absorvente" />
                                            </label>
                                            <label className="flex flex-col mt-4">
                                                Tamanho:
                                                <input disabled type="text" name="quantity" defaultValue={stock.product?.size} placeholder="Tamanho do absorvente" />
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
											<span>Deseja realmente excluir esse produto do estoque?</span>
											<div className="flex items-center justify-end mt-4">
												<button className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
												<button className="mr-2 btn" onClick={() => deleteStock(stock._id)}>Confirmar</button>
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

export default Stock;
