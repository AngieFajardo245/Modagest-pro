const test = require("node:test");
const assert = require("node:assert/strict");

const verificarRol = require("../middlewares/rolMiddleware");

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

test("rechaza una solicitud sin usuario autenticado", () => {
  const req = {};
  const res = crearRespuesta();

  verificarRol("administrador")(req, res, () => {});

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Usuario no autenticado");
});

test("permite el acceso cuando el usuario tiene el rol requerido", () => {
  const req = { usuario: { id: 1, rol: "administrador" } };
  const res = crearRespuesta();
  let siguienteEjecutado = false;

  verificarRol("administrador")(req, res, () => {
    siguienteEjecutado = true;
  });

  assert.equal(res.statusCode, 200);
  assert.equal(siguienteEjecutado, true);
});

test("normaliza mayúsculas y espacios al comparar el rol", () => {
  const req = { usuario: { id: 2, rol: " Cliente " } };
  const res = crearRespuesta();
  let siguienteEjecutado = false;

  verificarRol("cliente")(req, res, () => {
    siguienteEjecutado = true;
  });

  assert.equal(siguienteEjecutado, true);
});

test("rechaza el acceso cuando el rol no está autorizado", () => {
  const req = { usuario: { id: 3, rol: "empleado" } };
  const res = crearRespuesta();

  verificarRol("administrador")(req, res, () => {});

  assert.equal(res.statusCode, 403);
  assert.match(res.body.message, /Acceso denegado/);
});

test("permite configurar más de un rol autorizado", () => {
  const req = { usuario: { id: 4, rol: "empleado" } };
  const res = crearRespuesta();
  let siguienteEjecutado = false;

  verificarRol("administrador", "empleado")(req, res, () => {
    siguienteEjecutado = true;
  });

  assert.equal(siguienteEjecutado, true);
});
