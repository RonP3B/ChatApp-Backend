export function activationMail(email: string, username: string) {
  return {
    from: 'ChatApp',
    to: email,
    subject: 'Activate your account',
    html: `
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Activation</title>
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

                h1, h2, a {
                    color: #ff647c;
                }

                p {
                    color: #555;
                }

                a {
                    text-decoration: none;
                    font-weight: bold;
                }

                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="activation-container">
                <h1>Welcome to ChatApp</h1>
                <hr>
                <h2>Account Activation</h2>
                <p>Hi <strong>${username}</strong>, welcome to the ChatApp community! Click the button below to activate your account.</p>
                <a href="${process.env.ORIGIN1}/user-activation/${username}">Activate Now</a>
            </div>
        </body>
    </html>`,
  };
}
