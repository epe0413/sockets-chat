const { response } = require("express");
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async( req = request, res = response ) =>{
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number( desde ))
            .limit(Number( limite ))
            .populate('usuario', 'nombre')
    ])

    res.json({
        total,
        categorias
    })
}

// obtenerCategoria - populate {}
const obtenerCategoria = async( req, res = response ) => {
    const { id } = req.params;
    const categoria = await Categoria.findById( id )
        .populate('usuario', 'nombre');
    
    res.json( categoria );
}

// crearCategoria
const crearCategoria = async (req, res = response)=> {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    const categoria = new Categoria( data );

    //Guardar DB
    await categoria.save();

    res.status(200).json(categoria);

}

// actualizarCategoria
const actualizarCategoria = async (req, res = response)=> {
    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const nombre = data.nombre

    // Validar nombre
    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        })
    }

    const categoria = await Categoria.findByIdAndUpdate( id, data, {
        new: true
    });

    res.json( categoria );
}

// BorrarCategoria
const borrarCategoria = async (req, res = response) => {
    const {id} = req.params;
    const { estado, nombre } = await Categoria.findById( id )

    if( !estado ){
        return res.status(400).json({
            msg: `La categoria ${nombre} ya se encuentra inactiva en la BD`
        })
    }

    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json( categoriaBorrada );
}

module.exports = {
    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
}