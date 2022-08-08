const express = require("express");
const { randomUUID } = require("crypto");
const app = express();
var path = require('path')
const expressLayouts = require('express-ejs-layouts');


// Database
const connectToDb = require('./db.js')
connectToDb();
const Org = require('./models/org.js')


// Settings
app.use(expressLayouts);
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded());

const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })

const upload = multer({ storage: storage });


const __PORT = 4040;


let orgs = [
    {
        id: 1,
        name: 'Associação Vaga Lume',
        mission: 'Conheça a ONG que empodera crianças de comunidades rurais da Amazônia a partir da promoção da leitura e da gestão de bibliotecas comunitárias.',
        desc: 'Há 20 anos a Vaga Lume promove a leitura por meio da implementação de bibliotecas comunitárias na Amazônia. <br />Com o propósito de empoderar crianças e jovens, a instituição trabalha com base em 5 pilares estratégicos: acesso à literatura e infraestrutura de biblioteca; formação de mediadores de leitura; apoio ao engajamento comunitário; valorização da cultura local; e intercâmbio cultural.',
        image: 'https://pqdassets.nyc3.digitaloceanspaces.com/647/imagem.png'
    },
    {
        id: 2,
        name: 'APAE Brasil',
        mission: 'Com a missão de educar, prestar atendimento em saúde e lutar pela inclusão social, a Apae dedica atenção integral à pessoa com deficiência',
        desc: 'De acordo com o Censo IBGE 2010, o Brasil tem 45.606.048 de pessoas com deficiência, o que equivale a 23,9% da população do País. <br />18,60% foram declaradas pessoas com deficiência visual, 7% com deficiência motora, 5,10% com deficiência auditiva e 1,40% com deficiência mental. <br />Em um país historicamente marcado por forte rejeição, discriminação e preconceito, as famílias dessas pessoas, empenhadas em buscar soluções alternativas para que seus filhos alcancem condições de serem incluídos na sociedade, com garantia de direitos como qualquer outro cidadão, criaram as primeiras associações de apoio. <br />A Apae - Associação de Pais e Amigos dos Excepcionais nasceu em 1954, no Rio de Janeiro e caracteriza-se por ser uma organização social, cujo objetivo principal é promover a atenção integral à pessoa com deficiência, prioritariamente aquela com deficiência intelectual e múltipla. A Rede Apae destaca-se por seu pioneirismo e capilaridade, estando presente, atualmente, em mais de 2.227 mil municípios em todo o território nacional. Apae Brasil é a maior rede de apoio às Pessoas com Deficiência Intelectual ou Deficiência Múltipla, com mais de vinte e quatro milhões de atendimentos por ano e um milhão e trezentos mil assistidos. A rede Apae Brasil, tem como política de qualidade realizar gestão de captação de recursos para viabilizar a sustentabilidade das ações da Rede Apae Brasil, a sua doação muda para melhor a vida de todos os assistidos.',
        image: 'https://pqdassets.nyc3.digitaloceanspaces.com/403/WhatsApp-Image-2022-04-25-at-14.38.53.jpeg'
    },
    {
        id: 3,
        name: 'SOS Pantanal',
        mission: 'Um dos biomas mais importantes do mundo conta com a mobilização coletiva para resistir. O SOS Pantanal direciona esse apoio, fortaleça esse movimento e doe!',
        desc: 'Já passou da hora de investirmos na mãe natureza, de aplicarmos na recuperação dos biomas que sustentam a vida em nosso planeta. É pensando num cenário futuro que o Instituto SOS Pantanal promove a conservação e desenvolvimento sustentável do bioma Pantanal através da gestão do conhecimento e a disseminação de informações do bioma. <br />O Instituto SOS Pantanal é uma instituição sem fins lucrativos fundada em 2009, que promove a conservação e desenvolvimento sustentável do bioma Pantanal. Eles têm como principais ações a prevenção e combate a incêndios florestais, através do programa Brigadas Pantaneiras, a restauração de áreas degradadas, o acompanhamento e incidência em políticas públicas e a produção e divulgação de conhecimento sobre o bioma.',
        image: 'https://pqdassets.nyc3.digitaloceanspaces.com/289/5a23254e-0b1f-4d9b-81af-f3a376713123.jpg'
    },
    {
        id: 4,
        name: 'Onçafari',
        mission: 'Um dos biomas mais importantes do mundo conta com a mobilização coletiva para resistir. O SOS Pantanal direciona esse apoio, fortaleça esse movimento e doe!',
        desc: 'O Meio Ambiente pode sim andar de mãos dadas com o desenvolvimento e crescimento econômico! É urgente treinar e capacitar profissionais que atuem na proteção da biodiversidade brasileira e a Onçafari surge com esse objetivo: promover a conservação do meio ambiente e contribuir para o desenvolvimento socioeconômico das regiões onde atua. <br />As ações são voltadas para a preservação da biodiversidade com ênfase em onças-pintadas, lobos-guarás e onças-pardas em 9 bases espalhadas nos 4 biomas que atuamos: Pantanal (90mil ha), Amazônia (15mil ha), Cerrado (50mil ha) e Mata Atlântica (31mil ha).',
        image: 'https://pqdassets.nyc3.digitaloceanspaces.com/710/Apresenta%C3%A7%C3%A3o-sem-t%C3%ADtulo-%2814%29.png'
    },
    {
        id: 5,
        name: 'SAS Brasil',
        mission: 'Levar atendimento médico de qualidade forma itinerante aos diversos cantos do país. Essa é a missão da SAS Brasil!',
        desc: '"Existimos porque acreditamos que o acesso à saúde especializada deve ser universal no Brasil. Em muitos dos lugares que visitamos, não há médicos especialistas. Mulheres com vários filhos nunca estiveram em uma consulta ginecológica. Crianças com baixo desempenho escolar nunca passaram por um oftalmologista para verificar sua visão. <br />O câncer de pele é uma realidade entre pessoas expostas ao sol no trabalho rural. O país com a maior concentração de dentistas tem também um número altíssimo de desdentados, pessoas excluídas do mercado de trabalho e da sociedade."',
        image: 'https://pqdassets.nyc3.digitaloceanspaces.com/757/imagem-%2824%29.png'
    },
    {
        id: 6,
        name: 'Arquitetura na Periferia',
        mission: 'Mulheres independentes! Conheça o projeto que capacita mulheres para a independência do reformar e construir sua própria casa.',
        desc: 'A Arquitetura na Periferia é uma iniciativa sem fins lucrativos que promove a melhoria da moradia por meio do fortalecimento e protagonismo das mulheres. <br />O planejamento das obras funciona como um grande aprendizado. As mulheres aprendem a medir, desenhar, calcular, planejar e executar alguns serviços de construção, para que conduzam com autonomia e sem desperdícios as reformas de suas casas. <br />Esse processo contribui para a autoestima e autoconfiança das participantes, promovendo transformações que vão muito além da melhoria dos espaços. O projeto teve início em 2013 e em 2018 se institucionalizou com a fundação do IAMÍ – Instituto de Assessoria a Mulheres e Inovação. Desde então, tem atuado de forma contínua em três comunidades de Belo Horizonte, e já capacitou mais 80 mulheres e reformou mais de 50 casas, impactando diretamente mais de 400 pessoas. As participantes são mulheres que vivem em contextos de vulnerabilidade social, em sua maioria negras e mães solo.',
        image: 'https://pqdassets.nyc3.digitaloceanspaces.com/701/imagem-%2813%29.png'
    },  
    {
        id: 7,
        name: 'GoodTruck Brasil',
        mission: 'Mudando o mundo, um prato por vez. Conheça a ONG que busca alimentos onde sobra e distribui onde falta.',
        desc: 'Mais de 690 milhões de pessoas estavam subnutridas em 2019 no mundo, segundo o índice de perda de alimentos da FAO. Em contrapartida, mais de 931 milhões de toneladas de alimentos são perdidos por ano no mundo.<br />No Brasil, dados de pesquisa da Fundação José Luiz Egydio Setúbal, em 2022, mostram que o país desperdiça 26 milhões de toneladas de alimentos em alguma etapa da cadeia produtiva, o que corresponde a 35% da produção. O GoodTruck Brasil é uma organização sem fins lucrativos que atua nas cidades de Belo Horizonte, Campinas, Curitiba e São Paulo. Fundada em 2016, ela tem como objetivo levar comida de onde sobra para onde falta. Ou seja, as áreas de atuação da ONG são alimentação, combate à fome e ao desperdício de comida. Para isso, é feito o resgate de alimentos, que seriam desperdiçados, e feita a destinação de refeições e kits alimentares a comunidades vulneráveis.',
        image: 'https://pqdassets.nyc3.digitaloceanspaces.com/746/imagem-%2821%29.png'
    }
]


app.get("/", (req, res) =>{
    res.render('partials/home', { orgs })
})

app.get("/organization/search", (req, res) => {
    const term = req.query;
    res.render('partials/search', { orgs, term });
})

app.get("/organization/:id", (req, res) => {
    const id = req.params.id;
    res.render('partials/organization', { orgs, id });
})

app.get("/sign", (req, res) => {
    let imageId = randomUUID()
    res.render('partials/sign', { imageId })
})

app.post("/register", upload.single('image'), async (req, res) => {
    Org.create(req.body)
    
    res.redirect('/')
})

app.get("/about", (req, res) => {
    res.render('partials/about')
})

app.listen(__PORT, () => {
    console.log('Rodando na porta: ' + __PORT)
});