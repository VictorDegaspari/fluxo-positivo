import React, { useEffect, useState } from "react";
import LayoutPage from "../../components/LayoutPage/LayoutPage";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import "./index.scss";

function Products() {
	const [user_type, setUserType] = useState("");
	const [searchQuery, setSearchQuery] = useState('');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);

	useEffect(() => {
		setLoading(true);

		// FIXME Chamar com a API
		setTimeout(() => {
			setLoading(false);
			setData([
				{ title: 'Absorvax', description: '', size: 'P', type: 'internal'},
				{ title: 'ABSDOT', description: '', size: 'P', type: 'evening'},
				{ title: 'Tertax', description: '', size: 'XG', type: 'external'}
			]);
		}, 3000);

		const user = JSON.parse(localStorage.getItem("user")) || {};
		setUserType(user.user_type);

	}, [user_type]);

	function openModal() {
		setModalOpened(true);
	}

  	return (
    <LayoutPage
		title="Absorventes disponíveis"
		subtitle="Gerencie os seus absorventes aqui"
		icon="female"
		backButton={true}
		bodyStyle="overflow: initial !important "
		background="linear-gradient(to right, #22c55e, #1a9e4b)"
		header={
			<div className="table-header w-full flex items-center justify-end">
				<button className="btn mr-2 flex items-center" onClick={() => openModal()}>
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
                    <th className="p-4" scope="col"></th>
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
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.length && data.map((product, index) => (
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
								{ product.type === 'evening' ? 'Noturno' : (product.type === 'internal' ? 'Interno' : 'Diário')  }
							</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-normal text-gray-900 cursor-pointer hover:underline whitespace-nowrap">
                                    Ver Produto
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <span className="material-icons-outlined mr-2 text-gray-600" onClick={() => openModal()}>
                                        edit
                                    </span>
                                    <span className="material-icons-outlined mr-2 text-red-500" onClick={() => openModal()}>
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

			{ modalOpened && <Modal opened={(e) => setModalOpened(e)} body={
				<div>
					<span>Deseja realmente excluir esse produto?</span>
					<div className="flex items-center justify-end mt-4">
						<button className="mr-2 btn error" onClick={() => setModalOpened(false)}>Cancelar</button>
						<button className="mr-2 btn">Confirmar</button>
					</div>
				</div>
			}/>}
        </div>
	}></LayoutPage>);
}

export default Products;
