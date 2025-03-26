import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { CreatePropertyDto, UpdatePropertyDto } from '../dto/property.dto';
import {
  PropertyData,
  PropertyPaginatedResult,
} from '../entities/property.entity';

import {
  deleteFileAndDirectory,
  uploadFileStream,
} from 'utils/file-upload.util';
import { join } from 'path';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaPageBuilderService) {}
  private logger = new Logger('Latest Property  service');

  private uploadDir = join(process.env.UPLOAD_DIR, `Property`, 'files');

  async create(createPropertyDto: CreatePropertyDto): Promise<PropertyData> {
    try {
      const imagePaths = createPropertyDto?.photoUpload.map(
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

      delete createPropertyDto.photoUpload;

      const createdProperty = await this.prisma.propertyData.create({
        data: {
          ...createPropertyDto,
          otherItem: createPropertyDto.otherItem,
          propertyImage: {
            create: propertyImage.map((url) => ({ url })),
          },
        },
        include: { propertyImage: true },
      });

      this.logger.log(`Latest createdProperty Data: ${createdProperty}`);
      return createdProperty;
    } catch (e) {
      throw new HttpException(`Error Creating Latest Property: ${e}`, 500);
    }
  }

  async findAll(page = 1, limit = 10): Promise<PropertyPaginatedResult> {
    const skip = (page - 1) * limit;

    const [properties, totalCount] = await Promise.all([
      this.prisma.propertyData.findMany({
        skip,
        take: limit,
        include: { propertyImage: true },
      }) || [], // Ensure it's always an array
      this.prisma.propertyData.count(),
    ]);

    return {
      properties: Array.isArray(properties) ? properties : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<PropertyData> {
    const property = await this.prisma.propertyData.findUnique({
      where: { id },
      include: { propertyImage: true },
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(
    id: number,
    updatePropertyInput: UpdatePropertyDto,
  ): Promise<PropertyData> {
    try {
      const existingProperty: PropertyData =
        await this.prisma.propertyData.findUnique({
          where: { id },
          include: { propertyImage: true }, // Include images for deletion check
        });

      if (!existingProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }

      let propertyUpdateData = {
        ...updatePropertyInput,
      };

      // ✅ DELETE OLD IMAGES FROM STORAGE & DATABASE
      if (updatePropertyInput.photoUpload?.length) {
        if (existingProperty?.propertyImage?.length) {
          // Remove old image files
          for (const image of existingProperty.propertyImage) {
            const prevFilePath = image.url.replace(
              `${process.env.BASE_URL}/`,
              '',
            );
            deleteFileAndDirectory(prevFilePath);
          }

          // ✅ Delete old images from the database
          await this.prisma.propertyPhotos.deleteMany({
            where: { propertyId: id },
          });
        }

        // ✅ UPLOAD NEW IMAGES
        const imagePaths = await Promise.all(
          updatePropertyInput.photoUpload.map(async (image, index) => {
            const imageFile: any = image;
            const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
            const filePath = await uploadFileStream(
              imageFile.createReadStream,
              this.uploadDir,
              fileName,
            );
            return { url: filePath, propertyId: id };
          }),
        );

        // ✅ INSERT NEW IMAGES INTO DATABASE
        await this.prisma.propertyPhotos.createMany({
          data: imagePaths,
        });
      }

      // ✅ ENSURE `others` FIELD UPDATES PROPERLY
      if (updatePropertyInput.otherItem) {
        propertyUpdateData = {
          ...propertyUpdateData,
          otherItem: updatePropertyInput.otherItem,
        };
      }

      // ✅ UPDATE PROPERTY IN DATABASE
      return await this.prisma.propertyData.update({
        where: { id },
        data: propertyUpdateData,
        include: { propertyImage: true }, // Ensure updated images are returned
      });
    } catch (error) {
      throw new HttpException(`Error Updating Property: ${error.message}`, 500);
    }
  }

  async remove(id: number): Promise<PropertyData> {
    // ✅ Check if the property exists
    const existingProperty = await this.prisma.propertyData.findUnique({
      where: { id },
      include: { propertyImage: true }, // ✅ Include images for deletion
    });

    if (!existingProperty) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // ✅ Delete associated images from storage
    for (const image of existingProperty.propertyImage) {
      const prevFilePath = image.url.replace(`${process.env.BASE_URL}/`, '');
      deleteFileAndDirectory(prevFilePath);
    }

    // ✅ Delete related property images first
    await this.prisma.propertyPhotos.deleteMany({
      where: { propertyId: id },
    });

    // ✅ Delete the property (this step doesn't require the propertyImage field)
    return existingProperty;
  }

  async search(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<PropertyPaginatedResult> {
    if (!query.trim()) {
      return new PropertyPaginatedResult([], 0, page, 0);
    }

    const skip = (page - 1) * limit;

    const [properties, totalCount] = await Promise.all([
      this.prisma.propertyData.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } }, // ✅ Search by category too
            { city: { contains: query, mode: 'insensitive' } }, // ✅ Search by city
          ],
        },
        skip,
        take: limit,
        include: { propertyImage: true },
      }),
      this.prisma.propertyData.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return new PropertyPaginatedResult(
      properties,
      Math.ceil(totalCount / limit),
      page,
      totalCount,
    );
  }
}
