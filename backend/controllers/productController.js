const ProductRepository = require('../repository/ProductRepository');

/**
 * Controlador de Productos
 */
class ProductController {
  /**
   * GET /api/products
   * Obtener productos con paginación y filtros
   */
  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, query, sort } = req.query;

      // Parsear query params
      const queryOptions = {
        limit: parseInt(limit),
        page: parseInt(page),
        query: {},
        sort
      };

      // Parsear filtros de query
      if (query) {
        const queryParts = query.split(',');
        queryParts.forEach(part => {
          const [key, value] = part.split(':');
          if (key === 'category') {
            queryOptions.query.category = value;
          } else if (key === 'status') {
            queryOptions.query.status = value === 'true';
          } else if (key === 'availability') {
            queryOptions.query.availability = value === 'true';
          }
        });
      }

      const result = await ProductRepository.findAll(queryOptions);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/products/:pid
   * Obtener producto por ID
   */
  async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await ProductRepository.findById(pid);
      
      res.json({
        status: 'success',
        payload: product
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/products
   * Crear nuevo producto (solo admin)
   */
  async createProduct(req, res) {
    try {
      const product = await ProductRepository.create(req.body);
      
      res.status(201).json({
        status: 'success',
        payload: product
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * PUT /api/products/:pid
   * Actualizar producto (solo admin)
   */
  async updateProduct(req, res) {
    try {
      const { pid } = req.params;
      const product = await ProductRepository.update(pid, req.body);
      
      res.json({
        status: 'success',
        payload: product
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/products/:pid
   * Eliminar producto (solo admin)
   */
  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      await ProductRepository.delete(pid);
      
      res.json({
        status: 'success',
        message: 'Producto eliminado correctamente'
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new ProductController();
