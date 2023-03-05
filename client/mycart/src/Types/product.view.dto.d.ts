declare interface ProductViewDto {

    id: number;

    name: string;

    brand: string;

    description: string;

    categoryId: string

    stock: number;

    price: PriceViewDto;

    category: CategoryViewDto;

    image: string;
}