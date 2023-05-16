const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearProducto,
    obtenerProductos,
    obtenerProducto,
    borrarProducto,
    actualizarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias -> publico
router.get('/', obtenerProductos)

// Obtener todas una producto por ID -> publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Crear producto -> privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),    
    validarCampos
], crearProducto);

// Actualizar producto -> privado - cualquier persona con un token válido
router.put('/:id',[
    validarJWT,
    check('categoria', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto)

// Borrar producto -> privado - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto)

module.exports = router;