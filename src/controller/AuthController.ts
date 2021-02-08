import {getRepository} from 'typeorm';
import {Request, Response} from 'express';
import {User} from '../entity/User';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';

class AuthController {
    static login = async (req: Request, res: Response) => {
        const {email, password} = req.body;

        if(!(email && password)){
            return res.status(400).json({message: 'Email and password are required!'});
        }

        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail({ where: { email} });
        }
        catch(e){
            return res.status(400).json({mesage: 'email or password incorrect'})
        }

        if(!user.checkPassword(password)){
            return res.status(400).json({ message: 'email or password are incorrect!' });
        }

        const token = jwt.sign({userId: user.id, email: user.email}, config.jwtSecret, {expiresIn: '1h'});
        res.json({ message: 'OK', token });
    };

    static changePassword= async (req: Request, res: Response) =>{
        const {userId} = res.locals.jwtPayload;
        const {oldPassword, newPassword} = req.body;

        if(!(oldPassword && newPassword) ){
            res.status(400).json({ message: 'Old password && new password are required' });
        }

        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail(userId);
        }
        catch(e){
            res.status(400).json({ message: 'Something goes wrong!!' });
        }

        if(!user.checkPassword(oldPassword)){
            return res.status(401).json({ message: 'Check your old Pasword' });
        }
        user.password = newPassword;
        const validationOps = {validationError: {target: false, value: false}};
        const errors = await validate(user, validationOps);

        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        user.hashPassword();
        userRepository.save(user);

        res.json({ message: 'Password change!' })
    };
}

export default AuthController;