const express = require('express');
const ngrok = require('ngrok');
const rp = require('request-promise-native');

const covid_api = require("./covid-api");

const app = express();
const port = process.env.PORT;

app.use(express.json());

const INSTANCE_URL = process.env.INSTANCE_URL;
const PRODUCT_ID = process.env.PRODUCT_ID;
const PHONE_ID = process.env.PHONE_ID;
const API_TOKEN = process.env.API_TOKEN;

const optionsMessage = `
	Hi,
	Covid-19 update assistant here.
	How may i help you?

	1. Covid-19 Statistics (Pakistan)
	2. Precautions
	3. Symptoms
	4. Remedies

	Please type a desired number from above.
`;

if (!PRODUCT_ID || !PHONE_ID || !API_TOKEN) throw Error('You need to change PRODUCT_ID, PHONE_ID and API_KEY values in app.js file.');

async function send_message(body) {
	console.log(`Request Body:${JSON.stringify(body)}`);
	let url = `${INSTANCE_URL}/${PRODUCT_ID}/${PHONE_ID}/sendMessage`;
	let response = await rp(url, {
		method: 'post',
		json: true,
		body,
		headers: {
			'Content-Type': 'application/json',
			'x-maytapi-key': API_TOKEN,
		},
	});
	console.log(`Response: ${JSON.stringify(response)}`);
	return response;
}

async function setup_network() {
	let public_url = await ngrok.connect(process.env.PORT);
	console.log(`Public Url:${public_url}`);
	let webhook_url = `${public_url}/webhook`;
	let url = `${INSTANCE_URL}/${PRODUCT_ID}/setWebhook`;
	let response = await rp(url, {
		method: 'POST',
		body: { webhook: webhook_url },
		headers: {
			'x-maytapi-key': API_TOKEN,
			'Content-Type': 'application/json',
		},
		json: true,
	});
	console.log(`Response: ${JSON.stringify(response)}`);
}

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/sendMessage', async (req, res) => {
	let { message, to_number } = req.body;
	let response = await send_message({ type: 'text', message, to_number });
	res.send({ response });
});

app.post('/webhook', async (req, res) => {
	res.sendStatus(200);
	let { message, conversation } = req.body;
	let { type, text, fromMe } = message;
	if (fromMe) return;
	if (type === 'text') {
		let body = {};
		let lower = text.toLowerCase();
		if (lower == '1') {
			let message = await covid_api.getStats();
			console.log(message);
			body = { message, type: 'text' };
		} else if (lower == '2') {
			let message = await covid_api.getPrecautions();
			body = { message, type: 'text' };
		} else if (lower == '3') {
			let message = await covid_api.getSymptoms();
			body = { message, type: 'text' };
		} else if (lower == '4') {
			let message = await covid_api.getRemedies();
			body = { message, type: 'text' };
		}
		else if (lower == "c?" || lower == "0") {
			body = { message: optionsMessage, type: 'text' };
		}
		body.to_number = conversation;
		await send_message(body);
	} else {
		console.log(`Ignored Message Type:${type}`);
	}
});

app.listen(port, async () => {
	console.log(`Example app listening at http://localhost:${port}`);
	await setup_network();
});
