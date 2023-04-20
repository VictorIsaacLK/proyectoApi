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

Route.group(() => {
  Route.post('/registrar', 'UsersController.registrar')
  Route.post('/login', 'UsersController.login')
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

}

)

Route.group(() => {
  Route.post('/parque/create', 'ParquesController.create')
  Route.get('/parque/list', 'ParquesController.list')
  Route.get('/parque/:id', 'ParquesController.info')
  Route.put('/parque/update/:id', 'ParquesController.update');

}).middleware('auth')

