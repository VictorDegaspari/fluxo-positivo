import React, { useEffect, useState } from "react";
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import "./index.scss";

function Donor() {
	const [user_type, setUserType] = useState("");
	const [searchQuery, setSearchQuery] = useState('');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [formData, setFormData] = useState({});
    const baseUrl = process.env.REACT_APP_API_URL;
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
	
	useEffect(() => {
		setLoading(true);


	}, []);

	function openModal(modalContent) {
		setModalContent(modalContent)
		setModalOpened(true);
	}

	async function deleteProduct(productId) {
		setData(data.filter(product => product.id !== productId));
		// FIXME chamar api
		setModalOpened(false);
	}

	async function addProduct() {
		setData([ ...data, { id: Math.random(), ...formData }]);
		// FIXME chamar api
		setModalOpened(false);
	}

    const handleSubmit = (event) => {
        event.preventDefault();
        addProduct();
    };

  	return (
    <LayoutPage
		title="Doadores"
		subtitle="Gerencie seus doadores aqui"
		icon="settings_accessibility"
		backButton={true}
		bodyStyle="overflow: initial !important "
		background="linear-gradient(to right, #ef4444, #fa5c5c)"
		header={
			<div className="table-header w-full flex items-center justify-between">
                <div className="relative">
					<input
						className="block w-full py-2 px-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						type="text"
						placeholder="Buscar doador"
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
						<h1>Criar parceiro/doador</h1>
						<label className="flex flex-col mt-4">
							Nome:
							<input required name="name" type="text" placeholder="Nome do parceiro/doador" onChange={handleInputChange}/>
						</label>
						<label className="flex flex-col mt-4">
							E-mail:
							<input required name="email" type="email" placeholder="E-mail do parceiro/doador" onChange={handleInputChange}/>
						</label>
                        <label className="flex flex-col mt-4">
							Telefone:
							<input required name="phone" type="text" placeholder="Telefone do parceiro/doador" onChange={handleInputChange}/>
						</label>
						<label className="flex flex-col mt-4">
							Tipo:
							<select required name="size" defaultValue={""} onChange={handleInputChange}>
								<option value="" hidden>Selecione</option>
								<option value="partner">Parceiro</option>
								<option value="donor">Doador</option>
							</select>
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
					Criar doador
				</button>
			</div>
      	}
      	body={
        <div className="w-full">
            <div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                    <th className="p-4" scope="col"></th>
                    <th className="px-6 py-3" scope="col">
                        Nome do parceiro/doador
                    </th>
                    <th className="px-6 py-3" scope="col">
                        Contato
                    </th>
                    <th className="px-6 py-3" scope="col">
						Data da conexão
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
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </td>
                            <th className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap" scope="row">
								<span className="font-normal text-gray-900 whitespace-nowrap">{ product.title }</span>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
								{ product.size }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
								{ product.type === 'partner' ? 'Parceiro' : 'Doador'  }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-normal text-gray-900 cursor-pointer hover:underline whitespace-nowrap">
                                    Ver doador
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-end w-full">
                                    <span className="material-icons-outlined mr-2 text-gray-600" onClick={() => openModal(
										<form onSubmit={() => {}}>
											<h1>Editar parceiro</h1>
											<label className="flex flex-col mt-4">
												Título:
												<input name="title" value={ product.title } type="text" placeholder="Título do absorvente"/>
											</label>
											<label className="flex flex-col mt-4">
												Descrição:
												<input name="description" type="text" value={ product.description } placeholder="Título do absorvente"/>
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
												<button className="mr-2 btn" onClick={() => deleteProduct(product.id)}>Confirmar</button>
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
	}></LayoutPage>);
}

export default Donor;
