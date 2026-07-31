import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { ApiKey } from 'src/modules/api-key/entities/api-key.entitity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Experience } from 'src/modules/experience/entities/experience.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { Setting } from 'src/modules/setting/entities/setting.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { Media } from 'src/modules/upload/entities/media.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
config();
const configService = new ConfigService();

export const dbConfig: DataSourceOptions = {
  url: configService.get<string>('DB_URL'),
  type: 'postgres',
  entities: [Setting, User, Blog, Tag, Experience, Project, Media, ApiKey],
  synchronize: false,
  logging: true,
  migrations: ['dist/db/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dbConfig);
export default dataSource;
