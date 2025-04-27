import { Module } from '@nestjs/common';
import { GstController } from './gst.controller';
import { GstService } from './gst.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
import { Gst } from './gst.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([Category, User, Gst]), 
      ],
  controllers: [GstController],
  providers: [GstService]
})
export class GstModule {}
