import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responceBody = (responce: AxiosResponse) => responce.data;

const sleep = (ms: number) => (responce: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(()=> resolve(responce), ms));

const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responceBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responceBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responceBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responceBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}
export default {
Activities
}