import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Visitante from 'App/Models/Visitante'
import Parque from 'App/Models/Parque'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ParquesController {
  public async create({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nombre: schema.string({ trim: true, escape: true }, [rules.required(), rules.maxLength(255)]),
      user: schema.number([rules.required()]),
      medidas: schema.string({ trim: true, escape: true }, [
        rules.required(),
        rules.maxLength(255),
      ]),
      ubicacion: schema.string({ trim: true, escape: true }, [
        rules.required(),
        rules.maxLength(255),
      ]),
      telefono: schema.string({ trim: true, escape: true }, [
        rules.required(),
        rules.maxLength(255),
      ]),
    })
    try {
      const data = await request.validate({
        schema: validationSchema,
        messages: {
          'nombre.required': 'El nombre es requerido',
          'nombre.maxLength': 'El nombre no puede tener mas de 255 caracteres',
          'user.required': 'El usuario es requerido',
          'medidas.required': 'Las medidas son requeridas',
          'medidas.maxLength': 'Las medidas no pueden tener mas de 255 caracteres',
          'ubicacion.required': 'La ubicacion es requerida',
          'ubicacion.maxLength': 'La ubicacion no puede tener mas de 255 caracteres',
          'telefono.required': 'El telefono es requerido',
          'telefono.maxLength': 'El telefono no puede tener mas de 255 caracteres',
        },
      })
      const { nombre, user, medidas, ubicacion, telefono } = data
      const parque = new Parque()
      parque.nombre = nombre
      parque.user_id = user
      parque.medidas = medidas
      parque.ubicacion = ubicacion
      parque.telefono = telefono
      await parque.save()
      return response.status(200).json({
        message: 'Parque creado correctamente',
        data: parque,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error al crear el parque',
        data: error,
      })
    }
  }
}
