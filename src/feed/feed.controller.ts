import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CreateLikeDto,
  CreateShareDto,
  CreateReportDto,
  GetFeedDto,
  GetCommentsDto,
} from './dto/feed-interactions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Feed')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // POST ENDPOINTS
  @Post('posts')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.feedService.createPost(createPostDto, req.user.id);
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get feed posts with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Feed posts retrieved successfully' })
  async getFeed(@Request() req) {
    return this.feedService.getFeed(req.user.id);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get a specific post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  async getPost(@Param('id') id: string) {
    return this.feedService.getPost(id);
  }

  @Patch('posts/:id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.feedService.updatePost(id, updatePostDto);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  async deletePost(@Param('id') id: string) {
    await this.feedService.deletePost(id);
    return { message: 'Post deleted successfully' };
  }

  // COMMENT ENDPOINTS
  @Post('posts/:postId/comments')
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.feedService.createComment(createCommentDto, postId, req.user.id);
  }

  @Get('posts/:postId/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getComments(
    @Param('postId') postId: string,
    @Query() getCommentsDto: GetCommentsDto,
  ) {
    // Implementation for getting comments
    return { message: `Get comments for post ${postId} - to be implemented` };
  }

  @Patch('comments/:id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.feedService.updateComment(id, updateCommentDto);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async deleteComment(@Param('id') id: string) {
    await this.feedService.deleteComment(id);
    return { message: 'Comment deleted successfully' };
  }

  // LIKE ENDPOINTS
  @Post('posts/:postId/like')
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 201, description: 'Post liked successfully' })
  async likePost(
    @Param('postId') postId: string,
    @Body() createLikeDto: CreateLikeDto,
    @Request() req,
  ) {
    return this.feedService.createLike(createLikeDto, postId, req.user.id);
  }

  @Delete('posts/:postId/like')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 200, description: 'Post unliked successfully' })
  async unlikePost(@Param('postId') postId: string, @Request() req) {
    await this.feedService.removeLike(postId, req.user.id);
    return { message: 'Post unliked successfully' };
  }

  // SHARE ENDPOINTS
  @Post('posts/:postId/share')
  @ApiOperation({ summary: 'Share a post' })
  @ApiResponse({ status: 201, description: 'Post shared successfully' })
  async sharePost(
    @Param('postId') postId: string,
    @Body() createShareDto: CreateShareDto,
    @Request() req,
  ) {
    return this.feedService.createShare(createShareDto, postId, req.user.id);
  }

  // REPORT ENDPOINTS
  @Post('posts/:postId/report')
  @ApiOperation({ summary: 'Report a post' })
  @ApiResponse({ status: 201, description: 'Post reported successfully' })
  async reportPost(
    @Param('postId') postId: string,
    @Body() createReportDto: CreateReportDto,
    @Request() req,
  ) {
    return this.feedService.createReport(createReportDto, postId, req.user.id);
  }

  // ANALYTICS ENDPOINTS
  @Get('posts/:postId/stats')
  @ApiOperation({ summary: 'Get post statistics' })
  @ApiResponse({ status: 200, description: 'Post statistics retrieved successfully' })
  async getPostStats(@Param('postId') postId: string) {
    // Implementation for getting post statistics
    return { message: `Get stats for post ${postId} - to be implemented` };
  }

  // USER FEED ENDPOINTS
  @Get('user/:userId/posts')
  @ApiOperation({ summary: 'Get posts by a specific user' })
  @ApiResponse({ status: 200, description: 'User posts retrieved successfully' })
  async getUserPosts(@Param('userId') userId: string, @Query() getFeedDto: GetFeedDto) {
    // Implementation for getting user-specific posts
    return { message: `Get posts for user ${userId} - to be implemented` };
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending posts' })
  @ApiResponse({ status: 200, description: 'Trending posts retrieved successfully' })
  async getTrendingPosts(@Query() getFeedDto: GetFeedDto) {
    // Implementation for getting trending posts
    return { message: 'Get trending posts - to be implemented' };
  }

  @Get('hashtag/:hashtag')
  @ApiOperation({ summary: 'Get posts by hashtag' })
  @ApiResponse({ status: 200, description: 'Hashtag posts retrieved successfully' })
  async getPostsByHashtag(@Param('hashtag') hashtag: string, @Query() getFeedDto: GetFeedDto) {
    // Implementation for getting posts by hashtag
    return { message: `Get posts for hashtag ${hashtag} - to be implemented` };
  }
}
