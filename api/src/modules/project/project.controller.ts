import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { Public } from 'src/core/decorator/auth.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: QueryProjectDto) {
    return this.projectService.findAll(query);
  }

  @Public()
  @Get('all')
  getAll() {
    return this.projectService.getAll();
  }

  @Public()
  @Get('featured')
  findFeatured() {
    console.log('Getting featured projects');
    return this.projectService.getFeatured();
  }

  @Public()
  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.projectService.findOne({ slug });
  }

  // @Public()
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.projectService.findOne(+id);
  // }

  @Patch(':id/featured')
  toggleFeatured(@Param('id') id: string, @Body('featured') featured: boolean) {
    return this.projectService.update(id, { featured });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
