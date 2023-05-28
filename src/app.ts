import fastify from 'fastify'
import { z } from 'zod'
import cors from '@fastify/cors'
import { prisma } from './lib/prisma'
export const app = fastify()

app.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname
    if (hostname === 'localhost') {
      cb(null, true)
      return
    }
    cb(new Error('Not allowed'), false)
  },
})

app.post('/category', async (request, reply) => {
  const { body = {} } = request

  const categoryBodySchema = z.object({
    title: z.string(),
    slug: z.string(),
  })

  const { title = '', slug = '' } = categoryBodySchema.parse(body)

  await prisma.category.create({
    data: {
      title,
      slug,
    },
  })

  return reply.status(201).send()
})

app.post('/collect', async (request, reply) => {
  const { body = {} } = request

  const collectBodySchema = z.object({
    title: z.string(),
  })

  const { title = '' } = collectBodySchema.parse(body)

  const data = await prisma.collect.findFirst({
    where: {
      finished: false,
    },
  })

  if (!data) {
    console.log(data)

    const { id } = await prisma.collect.create({
      data: {
        title,
      },
    })
    return reply.status(201).send({ id })
  }

  return reply.status(400).send(data)
})

app.post('/product', async (request, reply) => {
  const { body = {} } = request

  const productBodySchema = z.object({
    name: z.string(),
    ean: z.string(),
    quantity: z.number(),
    collectId: z.string(),
  })

  const {
    name = '',
    ean = '',
    quantity = '',
    collectId = '',
  } = productBodySchema.parse(body)

  await prisma.product.create({
    data: {
      name,
      ean,
      quantity,
      collectId,
    },
  })

  return reply.status(200).send()
})

app.get('/verify-collect', async (request, reply) => {
  const data = await prisma.collect.findFirst({
    where: {
      finished: false,
    },
  })

  if (data) {
    return reply.status(400).send({ data })
  }

  return reply.status(200).send()
})

app.put('/collect/:collectId', async (request, reply) => {
  const { params = '' } = request

  const collectParamsSchema = z.object({
    collectId: z.string(),
  })

  const { collectId } = collectParamsSchema.parse(params)

  await prisma.collect.update({
    where: {
      id: collectId,
    },
    data: {
      finished: true,
    },
  })

  return reply.status(200).send()
})

app.get('/collect', async (request, reply) => {
  const data = await prisma.collect.findMany()
  return reply.status(200).send({ data })
})

app.get('/collect/:collectId', async (request, reply) => {
  const { params = '' } = request

  const collectParamsSchema = z.object({
    collectId: z.string(),
  })

  const { collectId } = collectParamsSchema.parse(params)

  const data = await prisma.collect
    .findUnique({
      where: {
        id: collectId,
      },
    })
    .Product()
  return reply.status(200).send({ data })
})

app.get('/category', async (request, reply) => {
  const data = await prisma.category.findMany()

  return reply.status(200).send(data)
})
