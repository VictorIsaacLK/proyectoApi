import { HttpContext } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import VerifyEmail2 from 'App/Mailers/VerifyEmail2'
import Sms from 'App/Mailers/Sms'

export default class UsersController {
  public async numerodeverificacionmovil({ request, response }: HttpContext) {
    const numeroiddelaurl = request.param('url')
    console.log(numeroiddelaurl)

    const user = await Database.from('users').where('id', numeroiddelaurl).first()
    const correo = user.correo

    await new VerifyEmail2(user).sendLater()

    await new Sms(user).sendLater()

    const domain = correo.substring(correo.lastIndexOf('@') + 1)
    response.redirect(`https://${domain}`)
  }

  public async registrar({ request, response }: HttpContext) {
    const validationSchema = schema.create({
      nombre_completo: schema.string({ trim: true, escape: true }, [
        rules.required(),
        rules.maxLength(255),
      ]),
      correo: schema.string({ trim: true, escape: true }, [
        rules.required(),
        rules.minLength(8),
        rules.maxLength(255),
        rules.email(),
        rules.unique({ table: 'users', column: 'correo' }),
      ]),
      password: schema.string({}, [rules.required(), rules.minLength(8)]),

      telefono: schema.string([
        rules.required(),
        rules.unique({ table: 'users', column: 'telefono' }),
        rules.minLength(10),
        rules.maxLength(10),
      ]),
    })
    try {
      const data = await request.validate({
        schema: validationSchema,
        messages: {
          'nombre_completo.required': 'El nombre es requerido',
          'nombre_completo.maxLength': 'El nombre no puede tener mas de 255 caracteres',
          'correo.required': 'El correo es requerido',
          'correo.minLength': 'El correo no puede tener menos de 3 caracteres',
          'correo.maxLength': 'El correo no puede tener mas de 255 caracteres',
          'correo.email': 'El correo no es valido',
          'correo.unique': 'El correo ya esta registrado',
          'contraseña.required': 'La contraseña es requerida',
          'contraseña.minLength': 'La contraseña no puede tener menos de 8 caracteres',
          'telefono.required': 'El telefono es requerido',
          'telefono.unique': 'El telefono ya esta registrado',
          'telefono.minLength': 'El telefono no puede tener menos de 10 caracteres',
          'telefono.maxLength': 'El telefono no puede tener mas de 10 caracteres',
        },
      })
      const numeroAleatorio = Math.round(Math.random() * (9000 - 5000) + 5000)
      const { nombre_completo, correo, password, telefono } = data
      const user = new User()
      user.nombre_completo = nombre_completo
      user.correo = correo
      user.password = await Hash.make(password)
      user.telefono = telefono
      user.no_verificacion = numeroAleatorio
      await user.save()
      const HOST = process.env.HOST
      const PORT = process.env.PORT
      const url =
        'http://' +
        HOST +
        ':' +
        PORT +
        Route.makeSignedUrl(
          'validarnumero',
          {
            url: user.id,
          },
          {
            expiresIn: '5m',
          }
        )

      await new VerifyEmail(user, url).sendLater()

      return response.status(201).json({
        message: 'Usuario registrado correctamente',
        usuario: user,
        correo: user.correo,
      })
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Error al registrar el usuario',
        data: error,
      })
    }
  }

  public async registrarsms({ request, response }: HttpContext) {
    const validationSchema = schema.create({
      codigo: schema.string({ trim: true, escape: true }, [rules.minLength(4), rules.maxLength(4)]),
    })

    const data = await request.validate({
      schema: validationSchema,
      messages: {
        'codigo.required': 'El codigo es requerido',
        'codigo.minLength': 'El codigo debe tener al menos 4 caracteres',
        'codigo.maxLength': 'El codigo debe tener como máximo 4 caracteres',
      },
    })

    const user = await Database.from('users').where('no_verificacion', data.codigo).first()

    if (user) {
      await Database.from('users')
        .where('no_verificacion', data.codigo)
        .update({ status: 1, id: user.id })

      return response.status(200).json({ message: 'Usuario actualizado correctamente'})
    } else {
      return response.status(404).json({ message: 'Usuario no encontrado' })
    }
  }
  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { correo, password } = await request.validate({
        schema: schema.create({
          correo: schema.string({}, [rules.required(), rules.email()]),
          password: schema.string({}, [rules.required(), rules.minLength(8), rules.maxLength(180)]),
        }),
        messages: {
          'correo.required': 'El email es requerido',
          'correo.email': 'El email debe ser un email válido',

          'password.required': 'La contraseña es requerida',
          'password.minLength': 'La contraseña debe tener al menos 8 caracteres',
          'password.maxLength': 'La contraseña debe tener como máximo 180 caracteres',
        },
      })

      const user = await User.findByOrFail('correo', correo)

      const isPasswordValid = await Hash.verify(user.password, password)
      if (!isPasswordValid) {
        return response.status(401).json({
          response: 'error',
          error: 'Email o contraseña incorrectos',
        })
      }

      const token = await auth.use('api').generate(user)

      return response.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: user,
        token: token.token,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error al iniciar sesión',
        data: error,
      })
    }
  }
  public async logout({ response, auth }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return response.status(200).json({
        message: 'Sesión cerrada correctamente',
        data: null,
        revoked: true,
      })
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Error al cerrar sesión',
        data: error,
      })
    }
  }
  public async info({ response, params }) {
    try {
      const user = await Database.from('users').where('id', params.id).firstOrFail()
      return response.status(200).json(user)
    } catch (error) {
      return response.status(404).json({
        error: 'Usuario no encontrado',
      })
    }
  }
  public async getUsers({ response }) {
    const users = await User.all()
    return response.json(users)
  }
  public async getRole({ auth, response }) {
    try {
      const user = await auth.authenticate()
      const rol_id = user.rol_id
      return response.json({ rol_id })
    } catch (error) {
      return response.status(401).json({ message: 'Usuario no autenticado' })
    }
  }
  public async getStatus({ auth, response }) {
    try {
      const user = await auth.authenticate()
      const status = user.status
      return response.json({ status })
    } catch (error) {
      return response.status(401).json({ message: 'Usuario no autenticado' })
    }
  }

  public async updateStatus({ request, response, params }) {
    const { id } = params
    const user = await User.findOrFail(id)
    user.status = request.input('status')
    await user.save()
    return response.status(200).json({
      message: 'Estado actualizado con éxito',
      user: user,
    })
  }

  public async destroy({ params, response }) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.status(200).json({
        message: 'Usuario eliminado con éxito',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Ocurrió un error al eliminar el usuario',
      })
    }
  }
  public async obtenerUsuario({ auth, response }) {
    try {
      const user = await auth.authenticate()
      return response.json({ nombre: user.nombre_completo, correo:user.correo,telefono: user.telefono })
    } catch (error) {
      return response.status(401).json({ message: 'Usuario no autenticado' })
    }
  }
}
