import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostComment } from './entities/post-comment.entity';
import { PostMedia } from './entities/post-media.entity';
import { PostShare } from './entities/post-share.entity';
import { PostReport } from './entities/post-report.entity';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostLike,
      PostComment,
      PostMedia,
      PostShare,
      PostReport,
    ]),
  ],
  controllers: [FeedController],
  providers: [FeedService, CloudinaryService],
  exports: [FeedService],
})
export class FeedModule {}
