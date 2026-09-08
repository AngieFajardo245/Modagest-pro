const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

const verificarToken = require("../middlewares/authMiddleware");

const crearRespuesta = () => {
  const respuesta = {
    statusCode: 200,
    body: null,
  };

  respuesta.status = (codigo) => {
    respuesta.statusCode = codigo;
    return respuesta;
  };

  respuesta.json = (contenido) => {
    respuesta.body = contenido;
    return respuesta;
  };

  return respuesta;
};

test.beforeEach(() => {
  process.env.JWT_SECRET = "clave-secreta-de-pruebas";
});

test("rechaza una solicitud que no contiene token", () => {
  const req = { headers: {} };
  const res = crearRespuesta();
  let siguienteEjecutado = false;

  verificarToken(req, res, () => {
    siguienteEjecutado = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Token requerido");
  assert.equal(siguienteEjecutado, false);
});

test("rechaza un encabezado que no usa el formato Bearer", () => {
  const req = { headers: { authorization: "token-invalido" } };
  const res = crearRespuesta();

  verificarToken(req, res, () => {});

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Formato inválido. Use Bearer token");
});

test("acepta un token válido y agrega el usuario a la solicitud", () => {
  const token = jwt.sign({ id: 7, rol: "cliente" }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = crearRespuesta();
  let siguienteEjecutado = false;

  verificarToken(req, res, () => {
    siguienteEjecutado = true;
  });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(req.usuario, { id: 7, rol: "cliente" });
  assert.equal(siguienteEjecutado, true);
});

test("rechaza un token firmado con otra clave", () => {
  const token = jwt.sign({ id: 7, rol: "cliente" }, "otra-clave");
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = crearRespuesta();

  verificarToken(req, res, () => {});

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Token inválido");
});

test("rechaza un token vencido", () => {
  const token = jwt.sign({ id: 7, rol: "cliente" }, process.env.JWT_SECRET, {
    expiresIn: -1,
  });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = crearRespuesta();

  verificarToken(req, res, () => {});

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Sesión expirada");
});
