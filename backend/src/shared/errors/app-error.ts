export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly detail?: unknown,
  ) {
    super(message);
  }
}

export class InsufficientTokenError extends AppError {
  constructor() {
    super('INSUFFICIENT_TOKENS', 'ยอด token ไม่เพียงพอ', 400);
  }
}

export class SlotFullError extends AppError {
  constructor() {
    super('SLOT_FULL', 'คลาสนี้เต็มแล้ว', 409);
  }
}

export class SlotUnavailableError extends AppError {
  constructor() {
    super('SLOT_UNAVAILABLE', 'slot นี้ไม่พร้อมให้จอง', 409);
  }
}

export class InvalidBookingTransitionError extends AppError {
  constructor(from: string, to: string) {
    super('INVALID_TRANSITION', `ไม่สามารถเปลี่ยนสถานะจาก ${from} เป็น ${to}`, 422);
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('UNAUTHORIZED', 'ไม่มีสิทธิ์เข้าถึง', 403);
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super('NOT_FOUND', `ไม่พบข้อมูล ${entity}`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, detail?: unknown) {
    super('CONFLICT', message, 409, detail);
  }
}

export class ValidationAppError extends AppError {
  constructor(detail: unknown) {
    super('VALIDATION_ERROR', 'ข้อมูลไม่ถูกต้อง', 400, detail);
  }
}
