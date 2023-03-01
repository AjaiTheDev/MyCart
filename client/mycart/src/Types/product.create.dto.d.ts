declare interface ProductCreateDto {

    name: string;

    brand: string;

    description: string;

    categoryId: number | null;

    stock: number | null;

    retailPrice: number | null;

    offerPrice: number | null;
}