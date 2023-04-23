import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Parque from 'App/Models/Parque'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class ParquesController {
  public async create({ request, response, auth }: HttpContextContract) {
    const validationSchema = schema.create({
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
      const { nombre, medidas, ubicacion, telefono } = data
      const user = auth.user!
      const parque = new Parque()
      parque.nombre = nombre
      parque.user_id = auth.user!.id
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

  public async update({ request, response, params }: HttpContextContract) {
    const parque = await Parque.find(params.id)
    if (parque) {
      const validationSchema = schema.create({
        nombre: schema.string({ trim: true, escape: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
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
            'medidas.required': 'Las medidas son requeridas',
            'medidas.maxLength': 'Las medidas no pueden tener mas de 255 caracteres',
            'ubicacion.required': 'La ubicacion es requerida',
            'ubicacion.maxLength': 'La ubicacion no puede tener mas de 255 caracteres',
            'telefono.required': 'El telefono es requerido',
            'telefono.maxLength': 'El telefono no puede tener mas de 255 caracteres',
          },
        })
        const parque = await Parque.findOrFail(params.id)
        parque.merge(data)
        await parque.save()

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
  }

  public async delete({ response, params }: HttpContextContract) {
    const parque = await Parque.find(params.id)

    if (!parque) {
      return response.status(404).json({
        status: 404,
        msg: 'Parque no encontrado',
        error: null,
        data: null,
      })
    }

    parque.delete()

    return response.status(200).json({
      status: 200,
      msg: 'Se ha eliminado correctamente',
      error: null,
      data: parque,
    })
  }
 
 public async parquebyuser({ response, auth }: HttpContextContract) {
    const user = auth.user!
    const parque = await Database.query().select('*').from('parques').where('user_id', user.id)

    if (!parque) {
      return response.status(404).json({
        status: 404,
        msg: 'Parque no encontrado',
        error: null,
        data: null,
      })
    }
    else{
      return response.status(200).json({
        data: parque})
    }
  }
  public async getParque ({ response, params }: HttpContextContract) {
    const parque = await Parque.find(params.id)
    if (parque) {
      return response.status(200).json({parque})
    }
    return response.status(404).json({
      status: 404,
      msg: 'Parque no encontrado',
      error: null,
      data: null,
    })
  }


}


