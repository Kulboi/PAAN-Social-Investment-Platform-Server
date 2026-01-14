import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloudinaryService } from '../common/services/cloudinary.service';

import { Post, PostVisibility } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostComment } from './entities/post-comment.entity';
import { PostMedia } from './entities/post-media.entity';
import { PostShare } from './entities/post-share.entity';
import { PostReport } from './entities/post-report.entity';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto, UpdateCommentDto, CreateLikeDto, CreateShareDto, CreateReportDto, GetCommentsRequestDto } from './dto/feed-interactions.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { FetchPostRequestDto } from './dto/fetch-post.dto';


@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike) private readonly likeRepository: Repository<PostLike>,
    @InjectRepository(PostComment) private readonly commentRepository: Repository<PostComment>,
    @InjectRepository(PostMedia) private readonly mediaRepository: Repository<PostMedia>,
    @InjectRepository(PostShare) private readonly shareRepository: Repository<PostShare>,
    @InjectRepository(PostReport) private readonly reportRepository: Repository<PostReport>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto, 
    userId: string, 
  ): Promise<Post> {
    const { media, ...postData } = createPostDto;
    
    // Create the post first
    const post = this.postRepository.create({ ...postData, authorId: userId });
    const savedPost = await this.postRepository.save(post);
    
    // Create media from DTO if provided (for Cloudinary URLs)
    if (media && media.length > 0) {
      const mediaEntities = media.map(mediaItem => 
        this.mediaRepository.create({
          mediaType: mediaItem.mediaType,
          url: mediaItem.url,
          thumbnailUrl: mediaItem.thumbnailUrl,
          filename: mediaItem.filename,
          mimeType: mediaItem.mimeType,
          fileSize: mediaItem.fileSize,
          width: mediaItem.width,
          height: mediaItem.height,
          duration: mediaItem.duration,
          altText: mediaItem.altText,
          caption: mediaItem.caption,
          sortOrder: mediaItem.sortOrder,
          postId: savedPost.id,
        })
      );
      await this.mediaRepository.save(mediaEntities);
    }
    
    return savedPost;
  }

  async getFeed({ page = '1', limit = '20' }: FetchPostRequestDto): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      where: {
        visibility: PostVisibility.PUBLIC,
      },
      relations: ['author', 'media'],
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      order: { createdAt: 'DESC' },
    });

    return posts.map(post => this.transformPost(post));
  }

  async getPost(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'media'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    return this.transformPost(post);
  }

  private transformPost(post: Post): PostResponseDto {
    const authorInfo = post.author ? {
      firstName: post.author.first_name,
      lastName: post.author.last_name,
      profileImage: post.author.profile_image,
    } : {
      firstName: 'Unknown',
      lastName: 'User',
      profileImage: null,
    };

    const media = post.media?.map(mediaItem => ({
      id: mediaItem.id,
      mediaType: mediaItem.mediaType,
      url: mediaItem.url,
      thumbnailUrl: mediaItem.thumbnailUrl,
      filename: mediaItem.filename,
      mimeType: mediaItem.mimeType,
      fileSize: mediaItem.fileSize,
      width: mediaItem.width,
      height: mediaItem.height,
      duration: mediaItem.duration,
      altText: mediaItem.altText,
      caption: mediaItem.caption,
      sortOrder: mediaItem.sortOrder,
    }));
    
    return {
      id: post.id,
      content: post.content,
      postType: post.postType,
      visibility: post.visibility,
      // pollOptions: post.pollOptions,
      // pollExpiresAt: post.pollExpiresAt,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      sharesCount: post.sharesCount,
      viewsCount: post.viewsCount,
      isReported: post.isReported,
      isHidden: post.isHidden,
      // moderationNote: post.moderationNote,
      // hashtags: post.hashtags,
      // mentions: post.mentions,
      // location: post.location,
      // latitude: post.latitude,
      // longitude: post.longitude,
      // scheduledAt: post.scheduledAt,
      isPublished: post.isPublished,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      authorInfo,
      media,
    };
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async deletePost(postId: string): Promise<void> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    await this.postRepository.remove(post);
  }

  async createComment(createCommentDto: CreateCommentDto, postId: string, userId: string): Promise<PostComment> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const comment = this.commentRepository.create({ ...createCommentDto, postId, authorId: userId });
    return await this.commentRepository.save(comment);
  }

  async getComments(postId: string, query: GetCommentsRequestDto): Promise<PostComment[]> {
    return await this.commentRepository.find({
      where: { postId: postId },
      relations: ['author'],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: { createdAt: 'DESC' },
    });
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<PostComment> {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    await this.commentRepository.remove(comment);
  }

  async createLike(createLikeDto: CreateLikeDto, postId: string, userId: string): Promise<PostLike> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const existingLike = await this.likeRepository.findOneBy({ postId, userId });
    if (existingLike) {
      throw new BadRequestException('User has already liked this post');
    }
    const like = this.likeRepository.create({ ...createLikeDto, postId, userId });
    await this.likeRepository.save(like);

    post.likesCount += 1;
    await this.postRepository.save(post);

    return like;
  }

  async removeLike(postId: string, userId: string): Promise<PostLike> {
    const like = await this.likeRepository.findOneBy({ postId, userId });
    if (!like) {
      throw new NotFoundException(`Like not found for post ID ${postId} and user ID ${userId}`);
    }
    const unlike = await this.likeRepository.remove(like);

    const post = await this.postRepository.findOneBy({ id: postId });
    if (post) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      await this.postRepository.save(post);
    }
  
    return unlike;
  }

  async isPostLikedByUser(postId: string, userId: string): Promise<boolean> {
    const like = await this.likeRepository.findOneBy({ postId, userId });
    return !!like;
  }

  async createShare(createShareDto: CreateShareDto, postId: string, userId: string): Promise<PostShare> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const share = this.shareRepository.create({ ...createShareDto, postId, userId });
    return await this.shareRepository.save(share);
  }

  async createReport(createReportDto: CreateReportDto, postId: string, userId: string): Promise<PostReport> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const report = this.reportRepository.create({ ...createReportDto, postId, reporterId: userId });
    return await this.reportRepository.save(report);
  }

  // Additional methods for handling likes, comments, shares, etc.
}
