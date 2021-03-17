import { Router, json } from 'express';
import * as dataBase from '../db/database';
import * as bcrypt from 'bcryptjs'; 
import * as jwt from 'jsonwebtoken';
import authMiddlewear from '../middlewear/auth.middlewear';

type DecodedType = {
  id: string
}

const router = Router();
router.get('/', async (req, res, next) => {
  res.json({message: 'route /'});
});

router.post('/login', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { login, password } = req.body;
    const user = await dataBase.getUser(login);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const isValidPassword = await bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({message: 'Invalid password'});
    }

    const token = jwt.sign({id: user._id}, 'key', {expiresIn: '1h'});
    return res.json({
      token,
      _id: user._id,
      login: user.login
    })
  } catch {

  }
});

router.post('/reg', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { login, password, avatar } = req.body;
    const candidate = await dataBase.getUser(login);

    if (candidate) {
      res.status(400).json({message: 'User with this login already exist'});
    }
    const hashPassword = await bcrypt.hash(password, 1);
    const user = {
      'login': login,
      'password': hashPassword,
      'avatar': avatar
    };

    const newUser = await dataBase.createUser(user);
    return res.json({message: 'User was created'});
  } catch (e){
    return res.send({ message: 'Server error' });
  }
});

router.post('/auth', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
  const { token } = req.body;
  const decoded : DecodedType = jwt.verify(token, 'key') as DecodedType;
  const user = await dataBase.getUserById(decoded.id);
  res.json({
    login: user.login,
    avatar: user.avatar
  });
  } catch (e){
    return res.send({ message: 'Server error' });
  }
});

export default router;
