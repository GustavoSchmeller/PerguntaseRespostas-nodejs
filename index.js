const express = require("express");
const app = express(); 
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');
//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com banco de dados.");
    })
    .catch((msgError) => {
        console.log(msgError);
    })


//Express usando ejs como view engine
//Desenho html
app.set('view engine','ejs');
app.use(express.static('public'));

//bodyParser

app.use(bodyParser.urlencoded({ extended: false }));

//Rotas

app.get("/",(req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id','desc'],
    ]}).then(perguntas =>{
        console.log(perguntas);
        res.render("index", { 
            perguntas:perguntas, 
        });
    });
});

app.get("/perguntar", (req, res) =>{
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var nomeUsuario = req.body.nomeUsuario;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
        nomeUsuario: nomeUsuario,
    }).then(()=>{
        res.redirect('/');
    });
});


app.get('/pergunta/:id',(req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id},
    }).then(pergunta=>{
        if(pergunta != undefined){ //pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                    ['id','desc'],
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else { //pergunta nao encontrada
            res.redirect("/");
        }
    });
});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    if(corpo != ""){
        Resposta.create({
            corpo: corpo,
            perguntaId: perguntaId,
        }).then(()=>{
            res.redirect("/pergunta/"+perguntaId);
        });
    };
});

app.listen(4400, (error)=>{
    if (error){
        console.log("erro na inicialização...")
    } else {    
        console.log("app rodando...");
    }
});
