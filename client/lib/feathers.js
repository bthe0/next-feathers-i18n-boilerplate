import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import { API_URL } from '../../shared/constants';

const app = feathers();

app.configure(rest(API_URL).axios(axios));
app.configure(feathers.authentication({
    path: '/api/auth',
    storageKey: '_token'
}));

export default app;