import {Router} from 'express';

import auth from './auth';
import user from './user';
import repository from './repository';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/repository', repository);

export default routes;