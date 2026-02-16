/**
 * Data Transfer Object para Productos
 */
class ProductDTO {
  constructor(product) {
    this._id = product._id || product.id;
    this.title = product.title;
    this.description = product.description || '';
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    
    // Asegurar que thumbnails sea siempre un array
    if (Array.isArray(product.thumbnails)) {
      this.thumbnails = product.thumbnails.length > 0 ? product.thumbnails : ['/assets/VR BAGS.png'];
    } else if (product.thumbnails && typeof product.thumbnails === 'string' && product.thumbnails.trim() !== '') {
      this.thumbnails = [product.thumbnails];
    } else {
      this.thumbnails = ['/assets/VR BAGS.png'];
    }
    
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }

  /**
   * Convierte un array de productos a DTOs (devuelve objetos planos)
   */
  static fromArray(products) {
    return products.map(product => {
      const dto = new ProductDTO(product);
      // Convertir a objeto plano para que se serialice correctamente a JSON
      return {
        _id: dto._id,
        title: dto.title,
        description: dto.description,
        code: dto.code,
        price: dto.price,
        status: dto.status,
        stock: dto.stock,
        category: dto.category,
        thumbnails: dto.thumbnails,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt
      };
    });
  }
}

module.exports = ProductDTO;
