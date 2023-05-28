"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_zod2 = require("zod");
var import_cors = __toESM(require("@fastify/cors"));

// src/services/api.ts
var import_axios = __toESM(require("axios"));
var brasilApi = import_axios.default.create({
  baseURL: "http://brasilapi.simplescontrole.com.br"
});

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "tst", "prd"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cors.default, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost") {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed"), false);
  }
});
app.post("/category", async (request, reply) => {
  const { body = {} } = request;
  const categoryBodySchema = import_zod2.z.object({
    title: import_zod2.z.string(),
    slug: import_zod2.z.string()
  });
  const { title = "", slug = "" } = categoryBodySchema.parse(body);
  await prisma.category.create({
    data: {
      title,
      slug
    }
  });
  return reply.status(201).send();
});
app.post("/collect", async (request, reply) => {
  const { body = {} } = request;
  const collectBodySchema = import_zod2.z.object({
    title: import_zod2.z.string()
  });
  const { title = "" } = collectBodySchema.parse(body);
  const data = await prisma.collect.findFirst({
    where: {
      finished: false
    }
  });
  if (!data) {
    console.log(data);
    const { id } = await prisma.collect.create({
      data: {
        title
      }
    });
    return reply.status(201).send({ id });
  }
  return reply.status(400).send(data);
});
app.post("/product", async (request, reply) => {
  const { body = {} } = request;
  const productBodySchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    ean: import_zod2.z.string(),
    quantity: import_zod2.z.number(),
    collectId: import_zod2.z.string()
  });
  const {
    name = "",
    ean = "",
    quantity = "",
    collectId = ""
  } = productBodySchema.parse(body);
  await prisma.product.create({
    data: {
      name,
      ean,
      quantity,
      collectId
    }
  });
  return reply.status(200).send();
});
app.get("/verify-collect", async (request, reply) => {
  const data = await prisma.collect.findFirst({
    where: {
      finished: false
    }
  });
  if (data) {
    return reply.status(400).send({ data });
  }
  return reply.status(200).send();
});
app.put("/collect/:collectId", async (request, reply) => {
  const { params = "" } = request;
  const collectParamsSchema = import_zod2.z.object({
    collectId: import_zod2.z.string()
  });
  const { collectId } = collectParamsSchema.parse(params);
  await prisma.collect.update({
    where: {
      id: collectId
    },
    data: {
      finished: true
    }
  });
  return reply.status(200).send();
});
app.get("/collect", async (request, reply) => {
  const data = await prisma.collect.findMany();
  return reply.status(200).send({ data });
});
app.get("/collect/:collectId", async (request, reply) => {
  const { params = "" } = request;
  const collectParamsSchema = import_zod2.z.object({
    collectId: import_zod2.z.string()
  });
  const { collectId } = collectParamsSchema.parse(params);
  const data = await prisma.collect.findUnique({
    where: {
      id: collectId
    }
  }).Product();
  return reply.status(200).send({ data });
});
app.get("/category", async (request, reply) => {
  const data = await prisma.category.findMany();
  return reply.status(200).send(data);
});
app.get("/productinfo", async (request, reply) => {
  const data = await brasilApi.get(
    "/mercadoria/consulta/?ean=7894900700046&access-token=Pw0B1C5BGn-0qdmU0_c1qHCaRD5yPqyD&_format=json"
  );
  return reply.status(200).send(data);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
