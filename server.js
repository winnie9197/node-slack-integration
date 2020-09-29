import dotenv from 'dotenv';
import https from 'https';

// Prerequisite: Provide WEBHOOK_URL in .env file. 
// If any step in the process fails, an error message will be logged.
// Otherwise, output message reponse (ok).

dotenv.config();

// // Message Body: Where image url and title is provided
const messageBody = {
    "attachments": [
        {
            "title": "pomeranian",
            "image_url": "https://www.puppydogger.com/wp-content/uploads/2019/03/pomeranian.jpg"
        }
    ]
};

// Post Method
function sendMessage(webhookURL, messageBody) {

    // try parsing messageBody to JSON
    try {
        messageBody = JSON.stringify(messageBody);
    } catch (e) {
        throw new Error('Failed to stringify messageBody', e);
    }

    // wrap https.request in a promise
    return new Promise((resolve, reject) => {
        // request options: POST request and content is JSON
        const requestOptions = {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }
        };

        // post request
        const req = https.request(webhookURL, requestOptions, (res) => {
            let response = '';

            // store data to reponse
            res.on('data', (d) => {
                response += d;
            });

            // response finished, resolve the promise with data
            res.on('end', () => {
                resolve(response);
            })
            });

            // reject promise if there's an error
            req.on('error', (e) => {
                reject(e);
            });

            // send our parsed JSON message body 
            req.write(messageBody);
            req.end();
        });
}

(async () => {
    if (!process.env.WEBHOOK_URL) {
        console.error('Webhook URL missing!');
    }

    console.log('Sending slack message');
    try {
        const post_message = await sendMessage(process.env.WEBHOOK_URL, messageBody);
        console.log('Message response', post_message);
    } catch (error) {
        console.log(error);
    }
})();



// Preprequisites: 
// i) 
// ii) optional channel membership
// iii) add proper validation for event type(?), request success/failure
