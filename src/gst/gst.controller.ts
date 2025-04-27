import { Controller, Post, Patch, Body, Query, BadRequestException, Param } from '@nestjs/common';
import { GstService } from './gst.service';
import { CreateGstDto, UpdateGstDto } from './dto/gst.dto';
import { Gst } from './gst.entity';

@Controller('gst')
export class GstController {
  constructor(private readonly gstService: GstService) {}

  // ✅ Create GST Entry
  @Post('/create')
  async createGst(@Body() createGstDto: CreateGstDto) {
    const { category_id, shop_id } = createGstDto;

    if (!category_id || !shop_id) {
      throw new BadRequestException('category_id and shop_id are required');
    }

    return this.gstService.createGst(createGstDto);
  }


// ✅ Get all GST entries for a specific shop — with pagination (optional)
@Post('/list')
async getGstsByShop(
  @Body('shop_id') shop_id: number,
  @Query('page') page = 1,
  @Query('limit') limit = 10
): Promise<{ gsts: Gst[]; totalPages: number }> {
  if (!shop_id) {
    throw new BadRequestException('shop_id is required');
  }

  return this.gstService.getGstsByShop(shop_id, +page, +limit);
}


  // ✅ Get a single GST entry by category ID and shop ID
  @Post('/single')
  async getGstByCategoryAndShop(@Body() body: { category_id: number; shop_id: number }) {
    const { category_id, shop_id } = body;

    if (!category_id || !shop_id) {
      throw new BadRequestException('category_id and shop_id are required');
    }

    return this.gstService.getGstByCategoryAndShop(category_id, shop_id);
  }

  // ✅ Update GST Entry
  @Patch('/update')
  async updateGst(
    @Body() updateGstDto: UpdateGstDto & { category_id: number; shop_id: number }
  ) {
    const { category_id, shop_id } = updateGstDto;

    if (!category_id || !shop_id) {
      throw new BadRequestException('category_id and shop_id are required');
    }

    return this.gstService.updateGst(category_id, shop_id, updateGstDto);
  }

  // ✅ Soft Delete GST Entry — using the GST entry ID
  @Patch('/soft-delete/:id')
  async softDeleteGst(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    return this.gstService.softDeleteGst(id);
  }

  // ✅ Hard Delete GST Entry — using the GST entry ID
  @Patch('/hard-delete/:id')
  async hardDeleteGst(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    return this.gstService.hardDeleteGst(id);
  }
}
