import { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { toast } from "sonner"

export type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    messages: string[]
  }[]
}

export type HttpErrorPayload = {
  message: string
  [key: string]: unknown
}

export class HttpError extends Error {
  status: number
  payload: HttpErrorPayload
  constructor({ status, payload }: { status: number; payload: HttpErrorPayload }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload
  constructor({
    status,
    payload
  }: {
    status: 422
    payload: EntityErrorPayload
  }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

export interface ApiErrorResponse {
  message: string
  statusCode?: number
  errors?: Array<{
    field: string
    message: string
  }>
}

export const handleErrorApi = <T extends FieldValues>({
  error,
  setError,
  duration
}: {
  error: Error | HttpError | EntityError | ApiErrorResponse 
  setError?: UseFormSetError<T>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field as Path<T>, {
        type: 'server',
        message: item.messages[0]
      })
    })
  } else if (error instanceof HttpError) {
    toast.error('Lỗi', {
      description: error.payload.message,
      duration: duration ?? 5000
    })
  } else if (error && 'message' in error) {
    toast.error('Lỗi', {
      description: error.message,
      duration: duration ?? 5000
    })
  } else {
    toast.error('Lỗi', {
      description: 'Lỗi không xác định',
      duration: duration ?? 5000
    })
  }
}