import fs from 'fs/promises';
import { renderHtml } from "../vite_project/src/ssr/entry.tsx";
import 'dotenv/config';

const run = async () => {
    const contractPath = process.argv[2];

    if (!contractPath) {
        throw new Error('Missing contract path');
    }

    const config = JSON.parse(
        await fs.readFile(contractPath, 'utf8')
    );

    const finalHtml = renderHtml(config);

    const page = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://widgets-cdn.co.uk:8459/banner/styles/banner.css">
</head>
<body>
${finalHtml}
</body>
</html>
`;

    await fs.writeFile('./debug.html', page, 'utf8');

    console.log('debug.html generated');
};

run();