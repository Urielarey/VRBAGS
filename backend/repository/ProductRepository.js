const ProductDAO = require('../dao/ProductDAO');
const ProductDTO = require('../dto/ProductDTO');

/**
 * Repository Pattern para Productos
 * Capa de lógica de negocio sobre el DAO
 */
class ProductRepository {
  /**
   * Crear producto
   */
  async create(productData) {
    const product = await ProductDAO.create(productData);
    return new ProductDTO(product);
  }

  /**
   * Obtener producto por ID
   */
  async findById(id) {
    const product = await ProductDAO.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return new ProductDTO(product);
  }

  /**
   * Obtener productos con paginación y filtros
   */
  async findAll(options = {}) {
    const result = await ProductDAO.findAll(options);
    
    return {
      status: 'success',
      payload: ProductDTO.fromArray(result.products),
      totalPages: result.pagination.totalPages,
      prevPage: result.pagination.prevPage,
      nextPage: result.pagination.nextPage,
      page: result.pagination.page,
      hasPrevPage: result.pagination.hasPrevPage,
      hasNextPage: result.pagination.hasNextPage,
      prevLink: this._buildLink(options, result.pagination.prevPage),
      nextLink: this._buildLink(options, result.pagination.nextPage)
    };
  }

  /**
   * Actualizar producto
   */
  async update(id, updateData) {
    const product = await ProductDAO.update(id, updateData);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return new ProductDTO(product);
  }

  /**
   * Eliminar producto
   */
  async delete(id) {
    const product = await ProductDAO.delete(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return new ProductDTO(product);
  }

  /**
   * Actualizar stock
   */
  async updateStock(id, quantity) {
    const product = await ProductDAO.updateStock(id, quantity);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return new ProductDTO(product);
  }

  /**
   * Construir link de paginación
   */
  _buildLink(options, page) {
    if (!page) return null;
    
    const { limit = 10, query = {}, sort } = options;
    const params = new URLSearchParams();
    
    params.append('limit', limit);
    params.append('page', page);
    
    if (query.category) params.append('query', `category:${query.category}`);
    if (query.status !== undefined) params.append('query', `status:${query.status}`);
    if (query.availability !== undefined) params.append('query', `availability:${query.availability}`);
    if (sort) params.append('sort', sort);
    
    return `/api/products?${params.toString()}`;
  }
}

module.exports = new ProductRepository();
