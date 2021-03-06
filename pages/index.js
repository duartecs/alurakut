import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import { useEffect, useState } from "react";
import nookies from "nookies";
import jwt from "jsonwebtoken";

function ProfileSidebar(props) {
  return (
    <Box className="profileArea" as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <span>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
        <hr />
      </span>

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      {/* <ul>
        {pessoasFavoritas.map((item) => {
          return (
            <li key={item}>
              <a href={`/users/${item}`}>
                <img src={`https://github.com/${item}.png`} />
                <span>{item}</span>
              </a>
            </li>
          );
        })}
      </ul> */}
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = useState([]);
  const pessoasFavoritas = [
    "juunegreiros",
    "omariosouto",
    "peas",
    "rafaballerini",
    "marcobrunodev",
    "felipefialho",
  ];

  const [seguidores, setSeguidores] = useState([]);
  useEffect(function () {
    fetch("https://api.github.com/users/peas/followers")
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      });

    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "4e5e5af66deae8547de317bca2c53c",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query{
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`,
      }),
    })
      .then((response) => response.json())
      .then((repostaCompleta) => {
        const comunidadesDato = repostaCompleta.data.allCommunities;
        console.log(repostaCompleta);
        setComunidades(comunidadesDato);
      });
  }, []);
  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div style={{ gridArea: "welcomeArea" }}>
          <Box className="welcomeArea">
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que voc?? deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(ev) {
                ev.preventDefault();
                const dadosForm = new FormData(ev.target);
                const comunidade = {
                  title: dadosForm.get("title"),
                  imageUrl: dadosForm.get("image"),
                  creatorSlug: "duartecs",
                };

                fetch("/api/comunidades", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (res) => {
                  const dados = await res.json();
                  console.log(dados);
                  setComunidades([...comunidades, dados.registroCriado]);
                });
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div style={{ gridArea: "profileRelationsArea" }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`/users/${item.title}`}>
                      <img src={item.imageUrl} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((item) => {
                return (
                  <li key={item}>
                    <a href={`/users/${item}`}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((resposta) => resposta.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser,
    },
  };
}
