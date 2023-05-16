const { request, response } = require("express");
const { Producto } = require("../models");


// TODO Obtener Productos - Paginado - total - populate (publico)
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number( desde ))
            .limit(Number( limite ))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}
// TODO Obtener Producto por ID - (Publico)
const obtenerProducto = async( req, res = response ) => {
    const { id } = req.params;
    const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    
    res.json( producto );
}

// TODO Crear Producto (token valido)
const crearProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const existeProducto = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if( existeProducto ) {
        return res.status(400).json({
            msg: `El producto ${ existeProducto.nombre } ya existe en la BD`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    await producto.save();

    res.status(200).json(producto);
}

// TODO Actualizar producto
const actualizarProducto = async (req, res = response)=> {
    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    // Validar nombre
    const existeProducto = await Producto.findOne({ nombre: data.nombre.toUpperCase() });

    if( existeProducto ) {
        return res.status(400).json({
            msg: `El producto ${ data.nombre} ya existe`
        })
    }

    const producto = await Producto.findByIdAndUpdate( id, data, {
        new: true
    });

    res.json( producto );
}

// TODO Borrar Producto
const borrarProducto = async( req, res = response ) => {
    const {id} = req.params;
    const { estado, nombre } = await Producto.findById( id )

    if( !estado ){
        return res.status(400).json({
            msg: `El producto ${nombre} ya se encuentra inactivo en la BD`
        })
    }

    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json( productoBorrado );
}

module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProducto,
    obtenerProductos
}