import {checkJwt} from './../middlewares/jwt';
import {RepositoryController} from './../controller/RepositoryController';
import {Router} from 'express';

const router = Router();

//Get all repositories
router.get('/', [checkJwt], RepositoryController.getAll);

//Get one repositories
router.get('/:id', [checkJwt], RepositoryController.getById);

//Create a new repositories
router.post('/', [checkJwt], RepositoryController.newRepository);

//Edit repositories
router.patch('/:id', [checkJwt], RepositoryController.editRepository);

//Delete repositories
router.delete('/:id', [checkJwt], RepositoryController.deleteRepository);

export default router;
