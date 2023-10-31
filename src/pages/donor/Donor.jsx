import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get, post, remove, update } from '../../api';
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import "./index.scss";

function Donor() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [modalContent, setModalContent] = useState(null);
    const baseUrl = process.env.REACT_APP_API_URL;
	
	useEffect(() => {
		setLoading(true);
		async function getDonors() {
			const { donors } = await get(baseUrl + '/donors/get/');
			setLoading(false);
			if (!donors) return;
			setData(donors);
		}
		getDonors();
	}, [baseUrl]);

	function openModal(modalContent) {
		setModalContent(modalContent)
		setModalOpened(true);
	}

	async function deleteDonor(stockId) {
		setData(data.filter(product => product._id !== stockId));
		setModalOpened(false);
		try {
			await remove(baseUrl + '/donors/remove/' + encodeURI(stockId));
			toast.success("Doador removido com sucesso!");
		} catch (error) {
			toast.error("Erro ao deletar Doador");
            console.error(error);
		}
	}

	async function editDonor(e, donor) {
        e.preventDefault();
		const editedData = new FormData(e.target);
		const jsonData = {};
	
		editedData.forEach((value, key) => {
			jsonData[key] = value;	
		});

        try {
            const response = await update(baseUrl + '/donors/update/' + encodeURI(donor._id), jsonData);
            if (response.info?.type === 'Error') throw new Error();
			const index = data.findIndex(item => item._id === response.updatedDonor._id);
			const updatedItems = data;
			updatedItems[index] = response.updatedDonor;
			toast.success("Doador atualizado com sucesso!");
			setData(updatedItems);
            setLoading(false);
			setModalOpened(false);
        } catch (error) {
			toast.error("Erro ao atualizar Doador");
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
			const response = await post(baseUrl + '/donors/post/', jsonData);
            setLoading(false);
            if (response.info?.type === 'Error') return toast.error("Doador com esse email já existe");
			const { donor } = response;
			const oldData = data;
			oldData.push(donor);
			setData(oldData);
			toast.success("Doador adicionado com sucesso!");
			setModalOpened(false);
        } catch (error) {
			toast.error("Erro ao adicionar Doador");
            console.error(error);
            setLoading(false);
        }
    };

  	return (
	<>
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
							<input required name="name" type="text" placeholder="Nome do parceiro/doador"/>
						</label>
						<label className="flex flex-col mt-4">
							E-mail:
							<input name="email" type="email" placeholder="E-mail do parceiro/doador"/>
						</label>
                        <label className="flex flex-col mt-4">
							Telefone:
							<input name="phone" type="text" placeholder="Telefone do parceiro/doador"/>
						</label>
						<label className="flex flex-col mt-4">
							Tipo:
							<select required name="type" defaultValue={""}>
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
						Tipo
					</th>
                    <th className="px-6 py-3" scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 && data.map((donor, index) => (
                        <tr
                            key={index}
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
								<span className="font-normal text-gray-900 whitespace-nowrap">{ donor.name }</span>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
								<div className="flex flex-col">
									<span className="font-normal text-gray-900 whitespace-nowrap">
										{ donor.email }
									</span>
									<span className="font-normal text-gray-900 whitespace-nowrap">
										{ donor.phone }
									</span>
								</div>
							</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
								{ donor.type === 'partner' ? 'Parceiro' : 'Doador'  }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-normal text-gray-900 cursor-pointer hover:underline whitespace-nowrap">
                                    Ver doador
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-end w-full">
                                    <span className="material-icons-outlined mr-2 text-gray-600" onClick={() => openModal(
										<form onSubmit={(e) => editDonor(e, donor)}>
											<h1>Editar parceiro/doador</h1>
											<label className="flex flex-col mt-4">
												Nome:
												<input required name="name" defaultValue={ donor.name } type="text" placeholder="Nome do doador"/>
											</label>
											<label className="flex flex-col mt-4">
												E-mail:
												<input name="email" type="email" defaultValue={ donor.email } placeholder="E-mail do doador"/>
											</label>
											<label className="flex flex-col mt-4">
												Telefone:
												<input name="phone" type="text" defaultValue={ donor.phone } placeholder="Telefone do doador"/>
											</label>
											<label className="flex flex-col mt-4">
												Tipo:
												<select required name="type" defaultValue={donor.type}>
													<option value="" hidden>Selecione</option>
													<option value="donor">Doador</option>
													<option value="partner">Parceiro</option>
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
												<button className="mr-2 btn" onClick={() => deleteDonor(donor._id)}>Confirmar</button>
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

export default Donor;
