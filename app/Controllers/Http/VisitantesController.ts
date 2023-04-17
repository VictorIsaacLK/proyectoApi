 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
 import { schema, rules } from '@ioc:Adonis/Core/Validator'
    import Visitante from 'App/Models/Visitante'
   
    import Database from '@ioc:Adonis/Lucid/Database'

export default class VisitantesController {
    public async create({ request, response }: HttpContextContract) {
        const validationSchema = schema.create({
            parque: schema.number([rules.required()]),
            tarjeta: schema.number([rules.required()]),
            status: schema.boolean([rules.required()]),
        })
        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'parque.required': 'El parque es requerido',
                    'tarjeta.required': 'La tarjeta es requerida',
                    'status.required': 'El status es requerido',
                },
            })
            const { parque, tarjeta, status } = data
            const visitante = new Visitante()
            visitante.parque_id = parque
            visitante.tarjeta = tarjeta
            visitante.status = status
            await visitante.save()
            return response.status(200).json({
                message: 'Visitante creado correctamente',
                data: visitante,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al crear el visitante',
                data: error,
            })
        }
    }
    public async update({ request, response }: HttpContextContract) {
        const validationSchema = schema.create({
            id: schema.number([rules.required()]),
            parque: schema.number([rules.required()]),
            tarjeta: schema.number([rules.required()]),
            status: schema.boolean([rules.required()]),
        })
        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'id.required': 'El id es requerido',
                    'parque.required': 'El parque es requerido',
                    'tarjeta.required': 'La tarjeta es requerida',
                    'status.required': 'El status es requerido',
                },
            })
            const { id, parque, tarjeta, status } = data
            const visitante = await Visitante.findOrFail(id)
            visitante.parque_id = parque
            visitante.tarjeta = tarjeta
            visitante.status = status
            await visitante.save()
            return response.status(200).json({
                message: 'Visitante actualizado correctamente',
                data: visitante,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al actualizar el visitante',
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
            const visitante = await Visitante.findOrFail(id)
            await visitante.delete()
            return response.status(200).json({
                message: 'Visitante eliminado correctamente',
                data: visitante,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al eliminar el visitante',
                data: error,
            })
        }
    }
    public async index({ request, response }: HttpContextContract) {
        try {
            const visitantes = await Visitante.all()
            return response.status(200).json({
                message: 'Visitantes obtenidos correctamente',
                data: visitantes,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al obtener los visitantes',
                data: error,
            })
        }
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
            const visitante = await Visitante.findOrFail(id)
            return response.status(200).json({
                message: 'Visitante obtenido correctamente',
                data: visitante,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al obtener el visitante',
                data: error,
            })
        }
    }
    public async showByParque({ request, response }: HttpContextContract) {
        const validationSchema = schema.create({
            parque: schema.number([rules.required()]),
        })
        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'parque.required': 'El parque es requerido',
                },
            })
            const { parque } = data
            const visitantes = await Database.from('visitantes').where('parque_id', parque)
            return response.status(200).json({
                message: 'Visitantes obtenidos correctamente',
                data: visitantes,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al obtener los visitantes',
                data: error,
            })
        }
    }
    public async showByTarjeta({ request, response }: HttpContextContract) {
        const validationSchema = schema.create({
            tarjeta: schema.number([rules.required()]),
        })
        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'tarjeta.required': 'La tarjeta es requerida',
                },
            })
            const { tarjeta } = data
            const visitantes = await Database.from('visitantes').where('tarjeta', tarjeta)
            return response.status(200).json({
                message: 'Visitantes obtenidos correctamente',
                data: visitantes,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al obtener los visitantes',
                data: error,
            })
        }
    }
    public async showByStatus({ request, response }: HttpContextContract) {
        const validationSchema = schema.create({
            status: schema.boolean([rules.required()]),
        })
        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'status.required': 'El status es requerido',
                },
            })
            const { status } = data
            const visitantes = await Database.from('visitantes').where('status', status)
            return response.status(200).json({
                message: 'Visitantes obtenidos correctamente',
                data: visitantes,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al obtener los visitantes',
                data: error,
            })
        }
    }
    public async showByParqueAndTarjeta({ request, response }: HttpContextContract) {
        const validationSchema = schema.create({
            parque: schema.number([rules.required()]),
            tarjeta: schema.number([rules.required()]),
        })
        try {
            const data = await request.validate({
                schema: validationSchema,
                messages: {
                    'parque.required': 'El parque es requerido',
                    'tarjeta.required': 'La tarjeta es requerida',
                },
            })
            const { parque, tarjeta } = data
            const visitantes = await Database.from('visitantes').where('parque_id', parque).where('tarjeta', tarjeta)
            return response.status(200).json({
                message: 'Visitantes obtenidos correctamente',
                data: visitantes,
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Error al obtener los visitantes',
                data: error,
            })
        }
    }
}
