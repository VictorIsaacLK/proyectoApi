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

  public async update({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      id: schema.number([rules.required()]),
      nombre: schema.string({ trim: true, escape: true }, [rules.required(), rules.maxLength(255)]),
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
          'id.required': 'El id es requerido',
          'nombre.required': 'El nombre es requerido',
          'nombre.maxLength': 'El nombre no puede tener mas de 255 caracteres',
          'medidas.required': 'Las medidas son requeridas',
          'medidas.maxLength': 'Las medidas no pueden tener mas de 255 caracteres',
          'ubicacion.required': 'La ubicacion es requerida',
          'ubicacion.maxLength': 'La ubicacion no puede tener mas de 255 caracteres',
          'telefono.required': 'El telefono es requerido',
          'telefono.maxLength': 'El telefono no puede tener mas de 255 caracteres',
        },
      })
      const { id, nombre, medidas, ubicacion, telefono } = data
      const parque = await Parque.find(id)
      parque?.merge({ nombre, medidas, ubicacion, telefono })
      await parque?.save()
      return response.status(200).json({
        message: 'Parque actualizado correctamente',
        data: parque,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error al actualizar el parque',
        data: error,
      })
    }
  }
  public async delete({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      id: schema.number([rules.required()]),
    })
    try {
      const data = await request.validate({
        schema: validationSchema,
        messages: {
          'id.required': 'El id es requerido',
        },
      })
      const { id } = data
      const parque = await Parque.find(id)
      await parque?.delete()
      return response.status(200).json({
        message: 'Parque eliminado correctamente',
        data: parque,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error al eliminar el parque',
        data: error,
      })
    }
  }
  public async index({ response }: HttpContextContract) {
    const parques = await Database.query()
      .select('parques.*', 'users.nombre as user')
      .from('parques')
      .innerJoin('users', 'users.id', 'parques.user_id')
    return response.status(200).json({
      message: 'Parques',
      data: parques,
    })
  }
  public async show({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      id: schema.number([rules.required()]),
    })
    try {
      const data = await request.validate({
        schema: validationSchema,
        messages: {
          'id.required': 'El id es requerido',
        },
      })
      const { id } = data
      const parque = await Database.query()
        .select('parques.*', 'users.nombre as user')
        .from('parques')
        .innerJoin('users', 'users.id', 'parques.user_id')
        .where('parques.id', id)
      return response.status(200).json({
        message: 'Parque',
        data: parque,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error al mostrar el parque',
        data: error,
      })
    }
  }
  public async showByUser({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      user: schema.number([rules.required()]),
    })
    try {
      const data = await request.validate({
        schema: validationSchema,
        messages: {
          'user.required': 'El usuario es requerido',
        },
      })
      const { user } = data
      const parque = await Database.query()
        .select('parques.*', 'users.nombre as user')
        .from('parques')
        .innerJoin('users', 'users.id', 'parques.user_id')
        .where('parques.user_id', user)
      return response.status(200).json({
        message: 'Parque',
        data: parque,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error al mostrar el parque',
        data: error,
      })
    }
}
}
