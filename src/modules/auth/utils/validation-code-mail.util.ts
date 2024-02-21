export function validationCodeMail(
  email: string,
  username: string,
  code: string,
) {
  return {
    from: 'ChatApp',
    to: email,
    subject: 'Account recovery code',
    html: `
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account recovery code</title>
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .activation-container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    width: 85%;
                }

                .code-container {
                    text-align: center;
                    padding: 16px;
                    margin: 5px 0;
                    background-color: #dbe9ee;
                    border-radius: 9px;
                }

                .code {
                    font-size: 1.35rem;
                    letter-spacing: 2px;
                    font-weight: 800;
                    font-family: monospace;
                }

                .username {
                    text-transform: capitalize;
                }

                h1, h2{
                    color: #ff647c;
                }

                p {
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="activation-container">
                <h1>ChatApp</h1>
                <hr>
                <h2>Account Recovery</h2>
                <p>Hi <strong class="username">${username}</strong>.</p>
                <p>We received a request to recover your ChatApp account. To proceed with the recovery process, please use the following verification code:</p>
                <div class="code-container">
                    <span class="code">${code}</span>
                </div>
                <p><small>This verification code will only be valid for the next 5 minutes.</small></p>
            </div>
        </body>
    </html>`,
  };
}
