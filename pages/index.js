import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'

function ProfileSidebar(props){
  return(
    <Box className="profileArea">
      <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}}/>
    </Box>
  )
}

export default function Home() {

  const githubUser = 'duartecs';
  const pessoasFavoritas = ['juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobrunodev', 'felipefialho']

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div style={{gridArea: "profileArea"}}>
          <ProfileSidebar githubUser={githubUser}/>
        </div>
        <div style={{gridArea: "welcomeArea"}}>
          <Box className="welcomeArea">
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
        </div>
        <div style={{gridArea: "profileRelationsArea"}}> 
          <ProfileRelationsBoxWrapper>

            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((item)=>{
                return (
                  <li key={item}>
                    <a href={`/users/${item}`}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box className="profileRelationsArea">
            Comunidades
          </Box>
        </div>
      </MainGrid>
    </>
  )
}
