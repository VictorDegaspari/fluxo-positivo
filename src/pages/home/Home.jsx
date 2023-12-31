import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";

import LayoutPage from "../../components/LayoutPage/LayoutPage";

function Home() {
  const [user_type, setUserType] = useState("");
  const [cards, setCards] = useState([]);
  const route = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setUserType(user.user_type);
    setCards([
      {
        name: "Estoque de absorventes",
        icon: "inventory",
        description: "Absorventes para seu paciente, você pode gerar controlar o estoque de produtos quando quiser!",
        active: true,
        route: "/stock",
      },
      {
        name: "Produtos",
        icon: "inventory_2",
        description: "Seus produtos ficam aqui e podem ser editados, excluídos ou criados por você",
        active: true,
        route: "/products",
      },
      {
        name: "Doadores e Parceiros",
        icon: "settings_accessibility",
        description: "Aqui você controla todos seus doadores e parceiros, informações deles e muito mais!",
        active: true,
        route: "/donor",
      },
      {
        name: "Marcas",
        icon: "manage_accounts",
        description: "Gerencie as marcas para conseguir cadastrar produtos e gerencia-los",
        active: true,
        route: "/brand",
      },
      {
        name: "Meu Perfil",
        icon: "settings",
        description: "Edite seu perfil e configurações do mesmo",
        active: true,
        route: "/profile",
      },
      {
        name: "Em breve...",
        icon: "hourglass_empty",
        description: "Em breve a Fluxo Positivo terá novidades e novas funcionalidades, fique por dentro!",
        active: true,
        route: "",
      },
    ]);
  }, [user_type]);

  return (
    <LayoutPage
      title="Fluxo Positivo"
      subtitle="Dashboard com tudo que você precisa!"
      icon="bloodtype"
      bodyStyle="overflow: initial !important "
      background="linear-gradient(45deg, #800020, #FF0000)"
      body={
        <div className="flex w-full flex-wrap justify-start items-center ">
          {cards.map(
            (card, index) => card.active && (
              <div
                className={`card cursor-pointer mr-3 mt-3`}
                key={ index }
                onClick={() => route(card.route)}
              >
                <div className={`mb-3 icon flex items-center justify-center icon_${index}`}>
                  <span className={`material-icons-outlined icon_color_${index}`}>
                    { card.icon }
                  </span>
                </div>
                <h2>{ card.name }</h2>
                <p className="description">{ card.description }</p>
              </div>
            )
          )}
        </div>
      }
    ></LayoutPage>
  );
}

export default Home;
