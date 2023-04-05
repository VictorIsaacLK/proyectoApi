import { Request } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Event from '@ioc:Adonis/Core/Event'

import Led from 'App/Models/Led'

export default class LedsController {
  public async encenderled({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const led = await Led.find(id)
    led?.merge({ status: true })
    await led?.save()
    response.redirect().back()
  }

  public async apagarled({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const led = await Led.find(id)
    led?.merge({ status: false })
    await led?.save()
    response.redirect().back()
  }
  public async getStatus({ request, response }) {
    const id = request.param('id')
    const led = await Led.find(id)
    response.json({ status: led?.status })
  }
  public async updateStatus({ request, response }) {
    const id = request.param('id')
    const led = await Led.find(id)
    if (led?.status == true) {
      led?.merge({ status: false })
    } else {
      led?.merge({ status: true })
    }

    await led?.save()
    Event.emit('Led', led)

    response.json({ status: led?.status })
  }
  public async streamLed({ response }) {
    const stream = response.response
    stream.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    Event.on('Led', () => {
      stream.write(`event: Led\n`)
      console.log('Se actualizo el estado del led')
    })
  }
}
