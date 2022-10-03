import { removeImageCahce, removeMarkdownCache } from "../utils/cache";

class UploaderService {
  // 删除图片
  removeImage = async (filename: string) => removeImageCahce(filename);
  // 删除文件
  removeMarkdown = (id: string) => removeMarkdownCache(id);
}

const uploaderService = new UploaderService();
export { uploaderService };
