import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { Category, CategoryPaginatedResult } from '../entities/category.entity';
import {
  deleteFileAndDirectory,
  uploadFileStream,
} from 'utils/file-upload.util';
import { join } from 'path';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaPageBuilderService) {}
  private logger = new Logger('Category Service');

  private uploadDir = join(process.env.UPLOAD_DIR, `Category`, 'files');

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const imagePaths = createCategoryDto?.photoUpload.map(
        async (image, index) => {
          const imageFile: any = await image;
          const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
          const filePath = await uploadFileStream(
            imageFile.createReadStream,
            this.uploadDir,
            fileName,
          );
          return filePath;
        },
      );
      const propertyImage = await Promise.all(imagePaths);

      delete createCategoryDto.photoUpload;

      const createdCategory = await this.prisma.category.create({
        data: {
          ...createCategoryDto,
          photo: propertyImage.length > 0 ? propertyImage[0] : '',
        },
      });
      this.logger.log(`Created Category: ${JSON.stringify(createdCategory)}`);
      return createdCategory;
    } catch (e) {
      throw new HttpException(`Error Creating Category: ${e.message}`, 500);
    }
  }

  async findAll(page = 1, limit = 10): Promise<CategoryPaginatedResult> {
    const skip = (page - 1) * limit;

    const [category, totalCount] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        include: { PropertyData: true },
      }),
      this.prisma.category.count(),
    ]);

    return {
      category,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        PropertyData: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!existingCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      let uploadedImages: string[] = [];

      if (updateCategoryDto.photoUpload?.length) {
        uploadedImages = await Promise.all(
          updateCategoryDto.photoUpload.map(async (image, index) => {
            const imageFile: any = await image;
            const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
            return await uploadFileStream(
              imageFile.createReadStream,
              this.uploadDir,
              fileName,
            );
          }),
        );
      }

      if (uploadedImages.length > 0) {
        if (uploadedImages.length > 0 && existingCategory.photo.length > 0) {
          const prevFilePath = existingCategory.photo.replace(
            `${process.env.BASE_URL}/`,
            '',
          );
          deleteFileAndDirectory(prevFilePath);
        }
      }

      delete updateCategoryDto.photoUpload;

      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: {
          ...updateCategoryDto,
          photo: uploadedImages.length > 0 ? uploadedImages[0] : '',
        },
      });

      return updatedCategory;
    } catch (error) {
      throw new HttpException(`Error Updating Category: ${error.message}`, 500);
    }
  }

  async remove(id: number): Promise<Category> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return await this.prisma.category.delete({ where: { id } });
  }

  async search(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<CategoryPaginatedResult> {
    if (!query.trim()) {
      return new CategoryPaginatedResult([], 0, page, 0);
    }

    const skip = (page - 1) * limit;

    const [categories, totalCount] = await Promise.all([
      this.prisma.category.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        skip,
        take: limit,
      }),
      this.prisma.category.count({
        where: { name: { contains: query, mode: 'insensitive' } },
      }),
    ]);

    return new CategoryPaginatedResult(
      categories,
      Math.ceil(totalCount / limit),
      page,
      totalCount,
    );
  }
}
