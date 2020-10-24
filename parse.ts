import { SAXParser } from 'https://deno.land/x/xmlp/mod.ts';

const parser = new SAXParser();

type Jogada = {
    nome: string,
    paradaDeDados: string,
    detalhe: string,
    custo: string,
    dificuldade: string
};

const array: Jogada[] = [];

let jogada: Jogada = {
    nome: "",
    paradaDeDados: "",
    detalhe: "",
    custo: "",
    dificuldade: ""
}

let index = 1;

parser.on('start_prefix_mapping', (ns, uri) => {
    console.log(`mapping start ${ns}: ${uri}`);
}).on('text', (text, element) => {
    if (element.qName === "td") {
        if (index > 5) {
            index = 1;
            array.push(jogada);
            jogada = {
                nome: "",
                paradaDeDados: "",
                detalhe: "",
                custo: "",
                dificuldade: ""
            };
        }

        switch (index) {
            case 1:
                jogada.nome = text;       
            break;
            case 2:
                jogada.paradaDeDados = text;       
            break;
            case 3:
                jogada.dificuldade = text;       
            break;
            case 4:
                jogada.detalhe = text;       
            break;
            case 5:
                jogada.custo = text;       
            break;
        }

        index++;      
    }
});

if (index != 1) {
    array.push(jogada);
}

const reader = await Deno.open(Deno.args[0]);
await parser.parse(reader);
reader.close();

let sb = "<dl>";

array.forEach(element => {
    sb += `<dt>${element.nome}</dt>
    <dd><span>Parada de Dados:</span><span>${element.paradaDeDados}</span></dd>
    <dd><span>Dificuldade:</span><span>${element.dificuldade}</span></dd>
    <dd><span>Custo:</span><span>${element.custo}</span></dd>
    <dd><span>Detalhe:</span><span>${element.detalhe}</span></dd>`;
});

sb += "</dl>";

console.log(sb);