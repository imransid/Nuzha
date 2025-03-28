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
      // 🔹 Step 1: Find existing property
      const existingProperty = await this.prisma.propertyData.findUnique({
        where: { id },
        include: { propertyImage: true },
      });

      if (!existingProperty) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }

      // 🔹 Step 2: Upload new images if provided
      let uploadedImages: string[] = [];

      if (updatePropertyInput.photoUpload?.length) {
        uploadedImages = await Promise.all(
          updatePropertyInput.photoUpload.map(async (image, index) => {
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

      const { photoUpload, ...updateData } = updatePropertyInput;

      // 🔹 Step 3: Prisma Transaction for Atomic Updates
      return await this.prisma.$transaction(async (prisma) => {
        // ✅ Step 3.1: Update PropertyData
        const updatedProperty = await prisma.propertyData.update({
          where: { id },
          data: {
            ...updateData,
          },
        });

        // ✅ Step 3.2: Delete Old Images (if new images uploaded)
        if (
          uploadedImages.length > 0 &&
          existingProperty.propertyImage.length > 0
        ) {
          await prisma.propertyPhotos.deleteMany({ where: { propertyId: id } });

          existingProperty.propertyImage.forEach((img) => {
            const prevFilePath = img.url.replace(
              `${process.env.BASE_URL}/`,
              '',
            );
            deleteFileAndDirectory(prevFilePath);
          });
        }

        // ✅ Step 3.3: Insert New Images (if provided)
        if (uploadedImages.length > 0) {
          await prisma.propertyPhotos.createMany({
            data: uploadedImages.map((url) => ({
              propertyId: id,
              url,
            })),
          });
        }

        return updatedProperty;
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
