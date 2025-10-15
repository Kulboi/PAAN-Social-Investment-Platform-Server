# Investment Management API

This module provides comprehensive endpoints for managing investment opportunities in the Paan platform.

## Overview

The Investment API allows users to:
- Create new investment opportunities
- View and search investments with advanced filtering
- Update investment details and status
- Delete investments (with restrictions)
- Manage investment ownership and permissions

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Investment
**POST** `/investments`

Creates a new investment opportunity. The authenticated user becomes the owner.

**Request Body:**
```json
{
  "title": "Real Estate Development Project",
  "description": "A luxury residential development in the heart of the city",
  "category": "Real Estate",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "country": "Nigeria",
  "state": "Lagos",
  "city": "Victoria Island",
  "address": "123 Victoria Island, Lagos",
  "targeted_amount": 1000000,
  "expected_return": 15,
  "duration": 12,
  "minimum_investment": 10000,
  "riskLevel": "medium",
  "images": ["https://example.com/image1.jpg"]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Real Estate Development Project",
  "description": "A luxury residential development in the heart of the city",
  "owner": 123,
  "images": ["https://example.com/image1.jpg"],
  "category": "Real Estate",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "status": "pending",
  "country": "Nigeria",
  "state": "Lagos",
  "city": "Victoria Island",
  "address": "123 Victoria Island, Lagos",
  "targeted_amount": 1000000,
  "expected_return": 15,
  "duration": 12,
  "minimum_investment": 10000,
  "riskLevel": "medium",
  "totalRaised": 0,
  "percentageRaised": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get All Investments
**GET** `/investments`

Retrieves a paginated list of investments with optional filtering and search.

**Query Parameters:**
- `search` (optional): Search in title and description
- `category` (optional): Filter by category
- `status` (optional): Filter by status (pending, active, inactive, completed)
- `riskLevel` (optional): Filter by risk level (low, medium, high)
- `country` (optional): Filter by country
- `state` (optional): Filter by state
- `city` (optional): Filter by city
- `minAmount` (optional): Minimum targeted amount
- `maxAmount` (optional): Maximum targeted amount
- `minReturn` (optional): Minimum expected return percentage
- `maxReturn` (optional): Maximum expected return percentage
- `ownerId` (optional): Filter by owner ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order - ASC or DESC (default: DESC)

**Example Request:**
```
GET /investments?category=Real%20Estate&status=active&page=1&limit=5
```

**Response:** `200 OK`
```json
{
  "investments": [...],
  "total": 100,
  "page": 1,
  "limit": 5,
  "totalPages": 20
}
```

### 3. Get Featured Investments
**GET** `/investments/featured`

Retrieves featured investments (active investments with highest expected returns).

**Query Parameters:**
- `limit` (optional): Number of featured investments (default: 5)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Featured Investment 1",
    "expected_return": 25,
    ...
  }
]
```

### 4. Get My Investments
**GET** `/investments/my-investments`

Retrieves all investments owned by the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "My Investment 1",
    ...
  }
]
```

### 5. Get Investment by ID
**GET** `/investments/:id`

Retrieves detailed information about a specific investment.

**Path Parameters:**
- `id`: Investment ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Investment Title",
  ...
}
```

### 6. Update Investment
**PATCH** `/investments/:id`

Updates an existing investment. Only the owner can update their investments.

**Path Parameters:**
- `id`: Investment ID

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "expected_return": 20
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "expected_return": 20,
  ...
}
```

### 7. Update Investment Status
**PATCH** `/investments/:id/status`

Updates the status of an investment. Only the owner can update the status.

**Path Parameters:**
- `id`: Investment ID

**Request Body:**
```json
{
  "status": "active"
}
```

**Valid Status Values:**
- `pending`: Investment is pending approval
- `active`: Investment is active and accepting investments
- `inactive`: Investment is temporarily inactive
- `completed`: Investment has reached its target

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "active",
  ...
}
```

### 8. Delete Investment
**DELETE** `/investments/:id`

Deletes an investment. Only the owner can delete their investments. Investments with active investments cannot be deleted.

**Path Parameters:**
- `id`: Investment ID

**Response:** `200 OK`
```json
{
  "message": "Investment deleted successfully"
}
```

## Data Models

### Investment Entity
```typescript
{
  id: number;
  title: string;
  description: string;
  owner: User;
  images: string[];
  category: string;
  start_date: string;
  end_date: string;
  status: InvestmentStatus;
  country: string;
  state: string;
  lga?: string;
  city: string;
  address: string;
  targeted_amount: number;
  expected_return: number;
  duration: number;
  minimum_investment: number;
  riskLevel: InvestmentRiskLevel;
  totalRaised: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Enums

#### InvestmentStatus
- `pending`: Investment is pending approval
- `active`: Investment is active and accepting investments
- `inactive`: Investment is temporarily inactive
- `completed`: Investment has reached its target

#### InvestmentRiskLevel
- `low`: Low risk investment
- `medium`: Medium risk investment
- `high`: High risk investment

## Business Rules

1. **Ownership**: Users can only modify (update/delete) investments they own
2. **Date Validation**: End date must be after start date, start date cannot be in the past
3. **Deletion Restrictions**: Investments with active investments cannot be deleted
4. **Status Transitions**: Status can be updated by the owner at any time
5. **Amount Validation**: Targeted amount and minimum investment must be positive numbers
6. **Return Validation**: Expected return must be between 1% and 100%

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data or business rule violations
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have permission to perform the action
- `404 Not Found`: Investment not found
- `500 Internal Server Error`: Server-side errors

## Rate Limiting

To be implemented based on platform requirements.

## Security Considerations

1. **Authentication**: JWT-based authentication for protected endpoints
2. **Authorization**: Owner-only access for modification operations
3. **Input Validation**: Comprehensive validation of all input data
4. **SQL Injection Protection**: TypeORM parameterized queries
5. **XSS Protection**: Input sanitization and output encoding

## Testing

The module includes comprehensive test coverage:
- Unit tests for service methods
- Integration tests for API endpoints
- E2E tests for complete workflows

## Future Enhancements

1. **Investment Analytics**: Advanced reporting and analytics
2. **Investment Categories**: Hierarchical category management
3. **Geolocation**: Location-based investment discovery
4. **Investment Matching**: AI-powered investment recommendations
5. **Social Features**: Comments, ratings, and social sharing
6. **Investment Tracking**: Real-time investment progress tracking
