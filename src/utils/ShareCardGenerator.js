/**
 * 分享卡片生成器 - 优化版本
 * 解决Canvas性能问题：对象池、图片缓存、内存管理
 */

export class ShareCardGenerator {
  constructor() {
    // Canvas对象池
    this.canvasPool = [];
    this.activeCanvas = null;
    
    // 图片缓存
    this.imageCache = new Map();
    
    // 配置
    this.config = {
      width: 400,
      height: 600,
      cardPadding: 20,
      imageHeight: 200,
      timeout: 10000 // 10秒超时
    };
    
    // 预加载常用图片
    this.preloadCommonImages();
  }

  /**
   * 预加载常用图片
   */
  async preloadCommonImages() {
    const commonImages = [
      '/assets/images/avatar-border.png',
      '/assets/images/icons/share.png',
      '/assets/images/icons/heart.png',
      '/assets/images/icons/message.png',
      '/assets/images/icons/send.png',
      '/assets/images/icons/bookmark.png'
    ];

    for (const src of commonImages) {
      try {
        await this.loadImage(src);
      } catch (error) {
        console.warn(`预加载图片失败: ${src}`, error);
      }
    }
  }

  /**
   * 获取Canvas对象（复用机制）
   */
  getCanvas() {
    if (this.canvasPool.length > 0) {
      return this.canvasPool.pop();
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = this.config.width;
    canvas.height = this.config.height;
    return canvas;
  }

  /**
   * 回收Canvas对象
   */
  recycleCanvas(canvas) {
    if (canvas && this.canvasPool.length < 3) { // 最多缓存3个Canvas
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.canvasPool.push(canvas);
    }
  }

  /**
   * 带缓存的图片加载
   */
  loadImage(src) {
    // 检查缓存
    if (this.imageCache.has(src)) {
      const cached = this.imageCache.get(src);
      if (cached.status === 'loaded') {
        return Promise.resolve(cached.image);
      } else if (cached.status === 'loading') {
        return cached.promise;
      }
    }

    // 创建加载Promise
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      // 设置超时
      const timeoutId = setTimeout(() => {
        reject(new Error(`图片加载超时: ${src}`));
      }, this.config.timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        // 更新缓存
        this.imageCache.set(src, {
          status: 'loaded',
          image: img,
          timestamp: Date.now()
        });
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        // 标记为失败
        this.imageCache.set(src, {
          status: 'failed',
          timestamp: Date.now()
        });
        reject(new Error(`图片加载失败: ${src}`));
      };

      // 处理跨域
      if (src.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.src = src;
    });

    // 缓存加载中的Promise
    this.imageCache.set(src, {
      status: 'loading',
      promise: promise,
      timestamp: Date.now()
    });

    return promise;
  }

  /**
   * 清理过期缓存
   */
  cleanExpiredCache() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30分钟

    for (const [key, value] of this.imageCache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.imageCache.delete(key);
      }
    }
  }

  /**
   * 文字换行辅助函数
   */
  wrapText(ctx, text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  /**
   * 绘制圆角矩形
   */
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
  }

  /**
   * 绘制图片占位符
   */
  drawImagePlaceholder(ctx, x, y, width, height, title) {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, x + width / 2, y + height / 2);
    ctx.textAlign = 'left';
  }

  /**
   * 生成分享卡片
   */
  async generateShareCard(exhibitInfo, hallInfo) {
    if (!exhibitInfo) {
      throw new Error('展品信息不能为空');
    }

    // 获取Canvas
    const canvas = this.getCanvas();
    this.activeCanvas = canvas;
    const ctx = canvas.getContext('2d');

    try {
      // 清理过期缓存
      this.cleanExpiredCache();

      const { width, height, cardPadding } = this.config;
      const cardX = cardPadding;
      const cardY = cardPadding;
      const cardWidth = width - cardPadding * 2;
      const cardHeight = height - cardPadding * 2;

      // 绘制背景
      ctx.fillStyle = '#f5e6e8';
      ctx.fillRect(0, 0, width, height);

      // 绘制卡片背景
      ctx.fillStyle = '#ffffff';
      this.drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);

      // 绘制头部区域
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillText('天津大学第11届设计年展', cardX + 60, cardY + 35);

      // 绘制三个点
      ctx.fillStyle = '#999999';
      ctx.font = '20px Arial';
      ctx.fillText('⋯', cardX + cardWidth - 30, cardY + 35);

      // 绘制头部图标
      try {
        const iconImg = await this.loadImage('/assets/images/avatar-border.png');
        ctx.drawImage(iconImg, cardX + 15, cardY + 10, 40, 40);
      } catch {
        // 绘制占位符
        ctx.fillStyle = hallInfo?.color || '#2FA3B0';
        ctx.beginPath();
        ctx.arc(cardX + 35, cardY + 30, 20, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LOGO', cardX + 35, cardY + 35);
        ctx.textAlign = 'left';
      }

      // 绘制主图片区域
      const imageY = cardY + 60;
      const imageHeight = this.config.imageHeight;

      if (exhibitInfo.imageUrl) {
        try {
          const img = await this.loadImage(exhibitInfo.imageUrl);
          ctx.drawImage(img, cardX, imageY, cardWidth, imageHeight);
        } catch {
          this.drawImagePlaceholder(ctx, cardX, imageY, cardWidth, imageHeight, exhibitInfo.title);
        }
      } else {
        this.drawImagePlaceholder(ctx, cardX, imageY, cardWidth, imageHeight, exhibitInfo.title);
      }

      // 绘制底部内容
      const bottomY = imageY + imageHeight + 20;

      // 绘制图标行
      try {
        const shareIcon = await this.loadImage('/assets/images/icons/share.png');
        const iconSize = 20;
        const iconY = bottomY + 5;
        const iconSpacing = 50;

        // 绘制四个图标
        ctx.drawImage(shareIcon, cardX + 30, iconY, iconSize, iconSize);
        ctx.drawImage(shareIcon, cardX + 30 + iconSpacing, iconY, iconSize, iconSize);
        ctx.drawImage(shareIcon, cardX + 30 + iconSpacing * 2, iconY, iconSize, iconSize);
        ctx.drawImage(shareIcon, cardX + cardWidth - 50, iconY, iconSize, iconSize);
      } catch (error) {
        console.warn('图标加载失败，跳过绘制', error);
      }

      // 绘制作品标题
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(exhibitInfo.title, cardX + 20, bottomY + 50);

      // 绘制标签
      ctx.fillStyle = '#4a90e2';
      ctx.font = '14px Arial';
      const tags = `#${hallInfo?.name || ''} #${exhibitInfo.details.authors
        .map(a => a.zh_names)
        .join(' #')}`;
      ctx.fillText(tags, cardX + 20, bottomY + 75);

      // 绘制描述
      ctx.fillStyle = '#333333';
      ctx.font = '12px Arial';
      const description = exhibitInfo.description || '';
      const lines = this.wrapText(ctx, description, cardWidth - 40);
      lines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line, cardX + 20, bottomY + 100 + index * 18);
      });

      // 绘制底部信息
      ctx.fillStyle = '#999999';
      ctx.font = '11px Arial';
      ctx.fillText('1分钟', cardX + 20, bottomY + 170);
      ctx.fillText('查看翻译', cardX + cardWidth - 60, bottomY + 170);

      return canvas;
    } catch (error) {
      // 回收Canvas
      this.recycleCanvas(canvas);
      this.activeCanvas = null;
      throw error;
    }
  }

  /**
   * 下载分享卡片
   */
  async downloadShareCard(exhibitInfo, hallInfo) {
    try {
      const canvas = await this.generateShareCard(exhibitInfo, hallInfo);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `${exhibitInfo.title}-分享卡片.png`;
      link.href = canvas.toDataURL('image/png', 0.9);
      link.click();
      
      // 回收Canvas
      this.recycleCanvas(canvas);
      this.activeCanvas = null;
    } catch (error) {
      console.error('下载分享卡片失败:', error);
      throw error;
    }
  }

  /**
   * 获取分享卡片的DataURL
   */
  async getShareCardDataURL(exhibitInfo, hallInfo, format = 'image/png', quality = 0.9) {
    try {
      const canvas = await this.generateShareCard(exhibitInfo, hallInfo);
      const dataURL = canvas.toDataURL(format, quality);
      
      // 回收Canvas
      this.recycleCanvas(canvas);
      this.activeCanvas = null;
      
      return dataURL;
    } catch (error) {
      console.error('生成分享卡片DataURL失败:', error);
      throw error;
    }
  }

  /**
   * 清理资源
   */
  dispose() {
    // 清理Canvas池
    this.canvasPool = [];
    this.activeCanvas = null;
    
    // 清理图片缓存
    this.imageCache.clear();
  }
}

// 创建单例实例
export const shareCardGenerator = new ShareCardGenerator();
