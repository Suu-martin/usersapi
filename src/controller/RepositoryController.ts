import {getRepository, TreeRepository} from "typeorm";
import {Request, Response} from "express";
import {Repository} from "../entity/Repository";
import {validate} from 'class-validator';

export class RepositoryController {
    static getAll = async (req: Request, res: Response) => {
        const repositoryRepository = getRepository(Repository);
        let repositories;
        try{
            const repositories = await repositoryRepository.find();
        }
        catch(e){
            res.status(404).json({ message: 'Something goes wrong!' });
        }

        if(repositories.length > 0 ){
            res.send(repositories);
        } else {
            res.status(404).json({message: 'Not result'});
        }
    };

    static getById = async (req: Request, res: Response) => {
        const {id} = req.params;
        const repositoryRepository = getRepository(Repository);
        try{
            const repository = await repositoryRepository.findOneOrFail(id);
            res.send(repository);
        }
        catch(e){
            res.status(404).json({ message: 'Not result' });
        }
    };

    static newRepository = async (req: Request, res: Response) => {
        const {projectname, description} = req.body;
        const repository = new Repository();

        repository.projectname = projectname;
        repository.description = description;

        const validationOpt = {validationError:{target:false, value:false}};
        const errors = await validate(repository, validationOpt);
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        const repositoryRepository = getRepository(Repository);
        try{
            await repositoryRepository.save(repository);
        }
        catch(e){
            return res.status(409).json({ message: 'Projectname already exist' });
        }

        res.send('Repository created');
    };

    static editRepository = async (req: Request, res: Response) => {
        let repository;
        const {id} = req.params;
        const {projectname, description} = req.body;

        const repositoryRepository = getRepository(Repository);

        try{
            repository = await repositoryRepository.findOneOrFail(id);
            repository.projectname = projectname;
            repository.description = description;
        }
        catch(e){
            return res.status(404).json({ message: 'Repository not found' });
        }

        const validationOpt = {validationError:{target:false, value:false}};
        const errors = await validate(repository, validationOpt);
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        try{
            await repositoryRepository.save(repository);
        }
        catch(e){
            return res.status(409).json({ message: 'Projectname already in use' });
        }

        res.status(201).json({ message: 'Repository update' });
    };

    static deleteRepository = async (req: Request, res: Response) => {
        const {id} = req.params;
        const repositoryRepository = getRepository(Repository);
        let repository: Repository; 

        try{
            repository = await repositoryRepository.findOneOrFail(id);
        }
        catch(e){
            return res.status(404).json({ message: 'Repository not found' });
        }

        repositoryRepository.delete(id);
        res.status(201).json({ message: 'Repository delete' });
    };
}

export default RepositoryController;