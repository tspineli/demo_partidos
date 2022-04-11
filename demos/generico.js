const axios = require('axios');
const fs = require("fs");
const jwt = require('../jwt');
const configuracoes = require('../configuracoesDS');


async function newenv(id) {

    var fileURL = "./public/data/" + id + ".json";
    var arq = fs.readFileSync(fileURL);
    var obj = JSON.parse(arq);

    let token = await jwt.geratoken();
    const accountid = configuracoes.accountid;

    var tabs = '';
    Object.keys(obj).forEach(function(k){
      console.log(k + ' - ' + obj[k]);
      tabs = tabs+ ',{"tabLabel": "'+k+'","value": "'+obj[k]+'"}'
  });
    const body = '{"status": "sent","templateId": "c60c2de3-9de4-4759-a90c-acefcc5c2d47","templateRoles": [{"name": "'+obj.nome+' '+obj.sobrenome+'","roleName": "Apoiador","email": "'+obj.email+'","tabs": {"textTabs": [{"tabLabel": "campo1","value": "1234"}'+tabs+']}}]}';

    const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post('https://demo.docusign.net/restapi/v2.1/accounts/' + accountid + '/envelopes', body, {
            headers: headers
        });
    } catch (error) {
    }
}

async function gerapag(req, res) {
    const token = 'E5BF2366730F4902BEE1B955ED54F90E';
    const var_url = 'https://payment.safe2pay.com.br/v2/Payment';
    const callback_url = req.protocol + "://" + req.get("host") + "/callback";

    const headers = {
        'X-API-KEY': token
    }

    var customer = {
        "Name": req.body.nome + ' ' + req.body.sobrenome,
        "Identity": req.body.cpf, // CPF
        "Phone": req.body.telefone,
        "Email": req.body.email,
        "Address": {
            "ZipCode": "90670090",
            "Street": req.body.logradouro,
            "Number": "123",
            "Complement": "Complemento",
            "District": req.body.bairro,
            "CityName": req.body.cidade,
            "StateInitials": "RS",
            "CountryName": "Brasil"
        }
    };

    var json_body = {
        "IsSandbox": false,
        "Application": "Aplicação de teste",
        "Vendor": "Partido da Tecnologia do Brasil",
        "CallbackUrl": callback_url,
        "PaymentMethod": "6", // Pix com QR-Code dinamico
        "Reference": "TESTE",
        "Customer": customer,
        "Products": [{
            "Code": "001",
            "Description": "Doação para o partido",
            "UnitPrice": 0.03, // Alterar para o valor correto
            "Quantity": 01
        }],
        "Splits": [{
                "CodeTaxType": 2,
                "CodeReceiverType": 2,
                "IdReceiver": "109257",
                "Name": "CR MACIEL MEI TESTE 01",
                "IsPayTax": false,
                "Amount": 0.01 // Valor a ser splitado para a subaccount 109257
            },
            {
                "CodeTaxType": 2,
                "CodeReceiverType": 2,
                "IdReceiver": "109258",
                "Name": "CR MACIEL MEI TESTE 02",
                "IsPayTax": false,
                "Amount": 0.01 // Valor a ser splitado para a subaccount 109258
            }
        ]
    };



    try {
        const response = await axios.post(var_url, json_body, {
            headers: headers
        });
        console.log(response.data);
        res.render("pagamento", {
            qrcode: response.data.ResponseDetail.QrCode
        });
        console.log("continue");
        let texto = JSON.stringify(req.body);
        var fileURL = "./public/data/" + response.data.ResponseDetail.IdTransaction + ".json";
        fs.writeFileSync(fileURL, texto, function(err) {
            if (err) throw err;
        });


    } catch (error) {
        res.end(error);

    }

}

async function callback(req, res) {
    if (req.body.TransactionStatus.Code == '3') {
        res.status(200).send("recebido");
        newenv(req.body.IdTransaction);
    }
    if (req.body.TransactionStatus.Code == '1') {
        res.status(200).send("recebido");
    }


}

function teste(req, res) {
    console.log(req.body);
    res.end(JSON.stringify(req.body));
}


module.exports = {
    newenv,
    gerapag,
    teste,
    callback
};