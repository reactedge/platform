import {createApp} from './app';
import {config} from './config';

const app = createApp();
app.listen(config.port, () => {
    console.log(`Golf course service listening on port ${config.port}`);
});
