export const welcomeEmail = () => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Received - Borhan Uddin</title>
    <style>
        /* Base Styles - Using Pure Black for maximum contrast */
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: #000000 !important; 
            color: #FFFFFF !important; 
            margin: 0; 
            padding: 0; 
        }
        .wrapper { 
            width: 100%; 
            background-color: #000000; 
            padding: 40px 0; 
        }
        .main { 
            background-color: #0a0a0a; 
            margin: 0 auto; 
            width: 100%; 
            max-width: 600px; 
            border: 1px solid #10b981; /* Emerald border for high visibility */
            border-radius: 4px; 
            overflow: hidden; 
        }
        .header { 
            background-color: #10b981; 
            padding: 25px; 
            text-align: center; 
        }
        .header h1 { 
            color: #000000; 
            margin: 0; 
            font-family: 'Courier New', Courier, monospace;
            font-size: 18px; 
            letter-spacing: 3px; 
            font-weight: 800;
        }
        .content { 
            padding: 40px 35px; 
            line-height: 1.8; 
        }
        .content h2 { 
            color: #ffffff; 
            font-size: 26px; 
            margin-bottom: 20px; 
            font-weight: 700;
        }
        /* High Contrast Terminal Box */
        .terminal-box { 
            background-color: #000000; 
            border: 1px solid #10b981; 
            padding: 20px; 
            border-radius: 4px; 
            margin: 30px 0; 
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px; 
            color: #10b981 !important; 
            font-weight: bold;
        }
        .footer { 
            padding: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #a1a1aa; /* High contrast grey */
            border-top: 1px solid #10b981; 
            font-family: 'Courier New', Courier, monospace;
        }
        .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background-color: #10b981; 
            color: #000000 !important; 
            text-decoration: none; 
            font-weight: bold; 
            border-radius: 4px; 
            margin-top: 25px; 
            font-family: sans-serif;
        }
        p {
            color: #ffffff !important;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" cellpadding="0" cellspacing="0" border="0" align="center">
            <tr>
                <td class="header">
                    <h1>BORHAN_UDDIN // INBOUND_SIGNAL</h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h2>Connection Established.</h2>
                    <p>This is an automated confirmation that your transmission has been successfully processed by my backend systems.</p>
                    
                    <div class="terminal-box">
                        &gt; STATUS: 200_OK<br>
                        &gt; ENCRYPTION: TLS_1.3<br>
                        &gt; QUEUE_STATE: PROCESSING_RESPONSE
                    </div>

                    <p>Thank you for reaching out. As a software engineer dedicated to building high-performance, robust systems, I ensure every message is reviewed with technical precision.</p>
                    
                    <p>I will analyze the details you provided and respond with a full payload shortly—usually within 24 hours.</p>

                    <div style="text-align: center;">
                        <a href="https://linkedin.com/in/codernex" class="button">VIEW_SYSTEM_PROJECTS</a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>BORHAN UDDIN | FULL-STACK ENGINEER | KHULNA, BD</p>
                    <p>Stack: TS, Node.js, Nest.js, Go, PostgreSQL</p>
                    <p>© 2025 CODERNEX. ALL RIGHTS RESERVED.</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
};
