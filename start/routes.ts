/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.get('/users/info', 'UsersController.getUserToken')

Route.get('/verifyToken', ({ response }) => {return response.json({ message: 'Token válido' })}).middleware(['auth'])

Route.group(() => {
  Route.post('/registrar', 'UsersController.registrar')
  Route.post('/login', 'UsersController.login')
  Route.delete('/user/logout', 'UsersController.logout').middleware('auth')
  Route.get('/user/:id', 'UsersController.info')
  Route.get('/validarnumero/:url', 'UsersController.numerodeverificacionmovil').as('validarnumero');
  Route.post('/validaCode','UsersController.registrarsms')

  
})

Route.group(() => {
  Route.post('/led/encender/:id', 'LedsController.encenderled')
  Route.post('/led/apagar/:id', 'LedsController.apagarled')
  Route.get('led/status/:id', 'LedsController.getStatus')
  Route.put('led/update/:id', 'LedsController.updateStatus')
  Route.get('/led/stream', 'LedsController.streamLed');
})

Route.group(() => {
  Route.post('/parque/create', 'ParquesController.create')
  Route.put('/parque/update/:id', 'ParquesController.update');
  Route.delete('/parque/delete/:id', 'ParquesController.delete');
  Route.get('/parques', 'ParquesController.parquebyuser');
  Route.get('/parque/:id', 'ParquesController.getParque');
}).middleware('auth')



Route.get('/sensores', 'SensoresController.getLastSensorValues')




