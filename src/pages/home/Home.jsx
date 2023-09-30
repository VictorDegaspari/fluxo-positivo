import { useNavigate } from "react-router-dom";
import "./index.scss";
import React, { useState, useEffect } from "react";

import LayoutPage from "../../components/LayoutPage/LayoutPage";

function Home() {
  const [breadcrumb, setBreadcrumb] = useState([
    {
      name: "Home",
    },
  ]);
  const [user_type, setUserType] = useState("");
  const [cards, setCards] = useState([]);
  const route = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setUserType(user.user_type);
    setCards([
      {
        name: "Minhas prescrições",
        icon: "menu_book",
        description:
          "Prescrições para seu paciente, você pode gerar receitas ou até anexar vídeos para ele assistir quando quiser!",
        active: true,
        route: "/prescriptions",
      },
      {
        name: "Agendamentos",
        icon: "edit_calendar",
        description:
          "Suas reuniões ou anotações ficam aqui, prontas para serem acessadas e podem ser vistas por você ou seu paciente",
        active: true,
        route: "/appointments",
      },
      {
        name:
          user_type === "nutritionist" ? "Meus pacientes" : "Meu nutricionista",
        icon: "settings_accessibility",
        description:
          "Aqui você controla todos seus pacientes, informações do perfil e muito mais!",
        active: true,
        route: "/patient",
      },
      {
        name: "Atalho do paciente",
        icon: "manage_accounts",
        description:
          "Escolha um paciente para deixar como padrão, caso tiver um entre automaticamente nas suas informações quando acessar alguma das opções do Home",
        active: user_type === "nutritionist",
        route: "",
      },
      {
        name: "Prescrições padrões",
        icon: "settings",
        description:
          "Crie prescrições padrões para facilitar a criação de prescrições!",
        active: user_type === "nutritionist",
        route: "",
      },
      {
        name: "Em breve...",
        icon: "hourglass_empty",
        description:
          "Em breve a FitFlow terá novidades e novas funcionalidades, fique por dentro!",
        active: true,
        route: "",
      },
    ]);
  }, [user_type]);

  // Assuming definePageMeta and useHead are custom hooks or functions

  return (
    

      <LayoutPage
        title="Dashboard"
        subtitle="Tudo que você precisa!"
        info="Aqui você encontra tudo que precisa!"
        bodyStyle="overflow: initial !important "
        background= "linear-gradient(180deg, #217AFF 0%, #217AFF 100%)"
        body={
          <div className="flex w-full flex-wrap justify-start items-center ">
            {cards.map(
              (card, index) =>
                card.active && (
                  <div
                    className="card cursor-pointer mr-3 mt-3 w-full"
                    key={index}
                    onClick={() => route.push(card.route)}
                  >
                    <div className="mb-3 icon flex items-center justify-center">
                      <span
                        className={`material-icons-outlined icon_color_${index}`}
                      >
                        {card.icon}
                      </span>
                    </div>
                    <h2>{card.name}</h2>
                    <p className="description">{card.description}</p>
                  </div>
                )
            )}
          </div>
        }
      ></LayoutPage>
  );
}

export default Home;
