import { Router } from 'express';
import multer from 'multer';

import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailuserController } from './controllers/user/DetailUserController'

import { isAuthenticated } from './middlewares/isAuthenticated'

import uploadConfig from './config/multer'

import { CreateTeamController } from './controllers/team/CreateTeamController';
import { ListTeamController } from './controllers/team/ListTeamController';

import { CreatePlayerController } from './controllers/player/CreatePlayerController';
import { ListByTeamController } from './controllers/player/ListByTeamController';

import { AddGameDetailController } from './controllers/game/AddGameDetailController';
import { CreateGameController } from './controllers/game/CreateGameController';
import { DetailGameController } from './controllers/game/DetailGameController';
import { RemoveGameController } from './controllers/game/RemoveGameController';
import { RemoveGameDetailController } from './controllers/game/RemoveGameDetailController';
import { SendGameController } from './controllers/game/SendGameController';
import { ListGamesController } from './controllers/game/ListGamesController';

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

//-- ROTAS USER --
router.post('/users', new CreateUserController().handle)

router.post('/session', new AuthUserController().handle)

router.get('/me', isAuthenticated,  new DetailuserController().handle )

//-- ROTAS TEAM
router.post('/team', isAuthenticated, upload.single('file'), new CreateTeamController().handle )

router.get('/team', isAuthenticated, new ListTeamController().handle )

//-- ROTAS PLAYER
router.post('/player', isAuthenticated, upload.single('file'), new CreatePlayerController().handle )

router.get('/team/player', isAuthenticated, new ListByTeamController().handle )

//-- ROTAS GAME
router.post('/game', isAuthenticated, new CreateGameController().handle )
router.delete('/game', isAuthenticated, new RemoveGameController().handle )

router.post('/game/add', isAuthenticated, new AddGameDetailController().handle )
router.delete('/game/remove', isAuthenticated, new RemoveGameDetailController().handle )

router.put('/game/send', isAuthenticated, new SendGameController().handle )

router.get('/games', isAuthenticated, new ListGamesController().handle )
router.get('/game/detail', isAuthenticated, new DetailGameController().handle )

export { router }; 