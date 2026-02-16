const Product = require('../models/Product');

/**
 * Data Access Object para Productos
 * Maneja todas las operaciones de base de datos relacionadas con productos
 */
class ProductDAO {
  /**
   * Crear un nuevo producto
   */
  async create(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Error creando producto: ${error.message}`);
    }
  }

  /**
   * Obtener producto por ID
   */
  async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(`Error obteniendo producto: ${error.message}`);
    }
  }

  /**
   * Obtener producto por código
   */
  async findByCode(code) {
    try {
      return await Product.findOne({ code });
    } catch (error) {
      throw new Error(`Error obteniendo producto por código: ${error.message}`);
    }
  }

  /**
   * Obtener todos los productos con filtros y paginación
   */
  async findAll(options = {}) {
    try {
      const {
        limit = 10,
        page = 1,
        query = {},
        sort = {}
      } = options;

      const skip = (page - 1) * limit;

      // Construir query de filtrado
      const filter = {};
      
      if (query.category) {
        filter.category = query.category;
      }
      
      if (query.status !== undefined) {
        filter.status = query.status === 'true' || query.status === true;
      }
      
      if (query.availability !== undefined) {
        if (query.availability === 'true' || query.availability === true) {
          filter.stock = { $gt: 0 };
        } else {
          filter.stock = { $lte: 0 };
        }
      }

      // Construir sort
      let sortOption = {};
      if (sort === 'asc' || sort === 'desc') {
        sortOption.price = sort === 'asc' ? 1 : -1;
      }

      const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Product.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      return {
        products,
        pagination: {
          total,
          limit: parseInt(limit),
          page: parseInt(page),
          totalPages,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null
        }
      };
    } catch (error) {
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }
  }

  /**
   * Actualizar producto
   */
  async update(id, updateData) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error actualizando producto: ${error.message}`);
    }
  }

  /**
   * Eliminar producto
   */
  async delete(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }

  /**
   * Actualizar stock de un producto
   */
  async updateStock(id, quantity) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: -quantity } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error actualizando stock: ${error.message}`);
    }
  }
}

module.exports = new ProductDAO();
