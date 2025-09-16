/**
 * 统一错误处理工具函数
 */

/**
 * 错误类型枚举
 */
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  DATA_ERROR: 'DATA_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

/**
 * 错误消息映射
 */
const ErrorMessages = {
  [ErrorTypes.NETWORK_ERROR]: '网络连接失败，请检查网络设置',
  [ErrorTypes.API_ERROR]: '服务器响应异常，请稍后重试',
  [ErrorTypes.DATA_ERROR]: '数据格式错误，请联系管理员',
  [ErrorTypes.UNKNOWN_ERROR]: '未知错误，请稍后重试'
}

/**
 * 判断错误类型
 * @param {Error} error - 错误对象
 * @returns {string} 错误类型
 */
export function getErrorType(error) {
  if (!error) return ErrorTypes.UNKNOWN_ERROR
  
  // 网络错误
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return ErrorTypes.NETWORK_ERROR
  }
  
  // API错误
  if (error.response) {
    return ErrorTypes.API_ERROR
  }
  
  // 数据错误
  if (error.message?.includes('data') || error.message?.includes('parse')) {
    return ErrorTypes.DATA_ERROR
  }
  
  return ErrorTypes.UNKNOWN_ERROR
}

/**
 * 获取用户友好的错误消息
 * @param {Error} error - 错误对象
 * @returns {string} 用户友好的错误消息
 */
export function getUserFriendlyMessage(error) {
  const errorType = getErrorType(error)
  return ErrorMessages[errorType] || ErrorMessages[ErrorTypes.UNKNOWN_ERROR]
}

/**
 * 统一错误处理函数
 * @param {Error} error - 错误对象
 * @param {string} context - 错误上下文（可选）
 * @returns {Object} 处理后的错误信息
 */
export function handleError(error, context = '') {
  const errorType = getErrorType(error)
  const userMessage = getUserFriendlyMessage(error)
  
  // 开发环境下打印详细错误信息
  if (import.meta.env.DEV) {
    console.group(`🚨 Error in ${context || 'Unknown Context'}`)
    console.error('Error Type:', errorType)
    console.error('Original Error:', error)
    console.error('User Message:', userMessage)
    console.groupEnd()
  }
  
  return {
    type: errorType,
    message: userMessage,
    originalError: error,
    context
  }
}

/**
 * 创建错误处理装饰器
 * @param {string} context - 错误上下文
 * @returns {Function} 装饰器函数
 */
export function withErrorHandling(context) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function(...args) {
      try {
        return await originalMethod.apply(this, args)
      } catch (error) {
        const handledError = handleError(error, context)
        throw handledError
      }
    }
    
    return descriptor
  }
}