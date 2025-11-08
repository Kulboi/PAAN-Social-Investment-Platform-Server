import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserService } from './user.service';

import {
  CloudinaryService,
  SignedUploadParams,
} from '../common/services/cloudinary.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description:
      "Retrieves the authenticated user's profile information including personal details, verification status, and credentials.",
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  getProfile(@Req() req): Promise<UserResponseDto> {
    return this.userService.getUser(req.user.userId);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description:
      "Updates the authenticated user's profile information. All fields are optional and only provided fields will be updated.",
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(req.user.userId, dto);
  }

  @Get('me/image-upload-params')
  @ApiOperation({ summary: 'Get media upload parameters for user image uploads' })
  @ApiResponse({
    status: 200,
    description: 'Upload parameters retrieved successfully',
  })
  async getPostsUploadParams(): Promise<SignedUploadParams> {
    return this.cloudinaryService.generateSignedUploadParams('paan-user-images');
  }

  @Patch('me/change-password')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change user password',
    description:
      "Changes the authenticated user's password. Requires current password for verification and a new password that meets minimum length requirements.",
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password changed successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data, current password incorrect, or new password validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, dto);
  }

  @Delete('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user account',
    description:
      "Permanently deletes the authenticated user's account and all associated data. This action cannot be undone.",
  })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User account deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  deleteAccount(@Req() req) {
    return this.userService.deleteUser(req.user.userId);
  }
}
