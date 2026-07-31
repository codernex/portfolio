import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public } from 'src/core/decorator/auth.decorator';
import { AuthUser } from 'src/core/decorator/user.decorator';
import { type JwtPayload } from 'src/core/strategies/jwt.strategy';
import { PaginationQueryDto } from 'src/core/dto/paginated-query.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @AuthUser() user: JwtPayload) {
    return this.blogService.create({
      ...createBlogDto,
      authorId: user.sub,
    });
  }

  @Public()
  @Get()
  findAll(@Query() q: PaginationQueryDto) {
    return this.blogService.findAll(q);
  }
  @Public()
  @Get('all')
  getAll() {
    return this.blogService.getAll();
  }

  @Public()
  @Get('recent')
  async getRecent() {
    const articles = await this.blogService.getRecentArticles(5);
    return articles;
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string, @Ip() ip: string) {
    console.log('TCL: BlogController -> findOne -> ip', ip);
    return this.blogService.findOne({ slug }, ip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update({ id }, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
