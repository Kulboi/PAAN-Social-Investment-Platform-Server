import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GIF = 'GIF',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
}

@Entity({ name: 'post_media' })
@Index(['postId', 'mediaType'])
@Index(['mediaType', 'createdAt'])
export class PostMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @Column({ type: 'varchar', length: 512 })
  url: string; // URL to the media file

  @Column({ type: 'varchar', length: 512, nullable: true })
  thumbnailUrl: string; // Thumbnail URL for videos/images

  @Column({ type: 'varchar', length: 255, nullable: true })
  filename: string; // Original filename

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string; // MIME type of the file

  @Column({ type: 'bigint', nullable: true })
  fileSize: number; // File size in bytes

  @Column({ type: 'int', nullable: true })
  width: number; // Image/video width

  @Column({ type: 'int', nullable: true })
  height: number; // Image/video height

  @Column({ type: 'int', nullable: true })
  duration: number; // Video/audio duration in seconds

  @Column({ type: 'varchar', length: 255, nullable: true })
  altText: string; // Alt text for accessibility

  @Column({ type: 'text', nullable: true })
  caption: string; // Media caption

  @Column({ type: 'int', default: 0 })
  sortOrder: number; // Order of media in the post

  // Content moderation
  @Column({ type: 'boolean', default: false })
  isProcessed: boolean; // Whether media processing is complete

  @Column({ type: 'boolean', default: false })
  isBlurred: boolean; // For sensitive content

  @Column({ type: 'json', nullable: true })
  metadata: any; // Additional metadata (EXIF data, etc.)

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Column()
  postId: string;

  @ManyToOne(() => Post, (post) => post.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  // Computed fields
  get isImage(): boolean {
    return this.mediaType === MediaType.IMAGE || this.mediaType === MediaType.GIF;
  }

  get isVideo(): boolean {
    return this.mediaType === MediaType.VIDEO;
  }

  get isDocument(): boolean {
    return this.mediaType === MediaType.DOCUMENT;
  }

  get isAudio(): boolean {
    return this.mediaType === MediaType.AUDIO;
  }

  get formattedFileSize(): string {
    if (!this.fileSize) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
    return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  get aspectRatio(): number | null {
    if (!this.width || !this.height) return null;
    return this.width / this.height;
  }

  get formattedDuration(): string | null {
    if (!this.duration) return null;
    
    const hours = Math.floor(this.duration / 3600);
    const minutes = Math.floor((this.duration % 3600) / 60);
    const seconds = this.duration % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
