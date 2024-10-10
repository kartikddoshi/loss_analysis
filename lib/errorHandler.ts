export class AppError extends Error {
  statusCode: number
  
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export const handleError = (error: unknown) => {
  console.error('Error:', error)
  if (error instanceof AppError) {
    return { error: error.message, statusCode: error.statusCode }
  }
  return { error: 'An unexpected error occurred', statusCode: 500 }
}