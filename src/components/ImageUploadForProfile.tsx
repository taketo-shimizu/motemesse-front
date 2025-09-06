'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { FiUpload, FiImage, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ProfileData } from '@/types/profile';

interface ImageUploadForProfileProps {
  onImageAnalyzed: (data: ProfileData) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
}

export default function ImageUploadForProfile({
  onImageAnalyzed,
  isAnalyzing,
  setIsAnalyzing
}: ImageUploadForProfileProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    let errorOccurred = false;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルのみ選択してください');
        errorOccurred = true;
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('各ファイルサイズは10MB以下にしてください');
        errorOccurred = true;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          if (newImages.length === files.length && !errorOccurred) {
            setSelectedImages(prev => [...prev, ...newImages]);
            setError(null);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (currentImageIndex >= newImages.length && newImages.length > 0) {
        setCurrentImageIndex(newImages.length - 1);
      } else if (newImages.length === 0) {
        setCurrentImageIndex(0);
      }
      return newImages;
    });
  };

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-profile-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: selectedImages
        }),
      });

      if (!response.ok) {
        throw new Error('画像の解析に失敗しました');
      }

      const data = await response.json();
      onImageAnalyzed(data.profile);
      setSelectedImages([]);
      setCurrentImageIndex(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析中にエラーが発生しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCancel = () => {
    setSelectedImages([]);
    setCurrentImageIndex(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < selectedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FiImage className="text-lg" />
        <h3 className="font-semibold">スクリーンショットから自動入力</h3>
      </div>

      {/*<p className="text-sm text-base-content/70 mb-4">
        マッチングアプリのプロフィール画面のスクリーンショットをアップロードすると、自動的に情報を抽出します。
        複数の画像をアップロードして、より完全な情報を取得できます。
      </p>*/}

      {selectedImages.length === 0 ? (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            id="profile-image-upload"
          />
          <label
            htmlFor="profile-image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-base-300/20 transition-colors"
          >
            <FiUpload className="text-3xl mb-2" />
            <span className="text-sm">クリックして画像を選択</span>
            <span className="text-xs text-base-content/50 mt-1">
              複数選択可能・ドラッグ＆ドロップも対応
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {selectedImages.length > 1 && (
              <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center">
                <button
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                  className="btn btn-circle btn-sm btn-ghost bg-base-100 disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>
                <span className="bg-base-100 px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {selectedImages.length}
                </span>
                <button
                  onClick={handleNextImage}
                  disabled={currentImageIndex === selectedImages.length - 1}
                  className="btn btn-circle btn-sm btn-ghost bg-base-100 disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}

            <img
              src={selectedImages[currentImageIndex]}
              alt={`Screenshot ${currentImageIndex + 1}`}
              className="w-full max-h-64 object-contain rounded-lg border border-base-300"
            />

            <button
              onClick={() => handleRemoveImage(currentImageIndex)}
              className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-base-100"
            >
              <FiX />
            </button>
          </div>

          {selectedImages.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto py-2">
              {selectedImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all cursor-pointer ${index === currentImageIndex
                    ? 'border-primary ring-2 ring-primary/50'
                    : 'border-base-300 hover:border-base-content/30'
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-0 right-0 bg-error text-error-content rounded-bl p-0.5 hover:bg-error/80"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              id="add-more-images"
            />
            <label
              htmlFor="add-more-images"
              className="btn btn-outline btn-sm"
            >
              画像を追加
            </label>
            <span className="text-xs text-base-content/50">
              合計 {selectedImages.length} 枚の画像
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn btn-primary btn-sm flex-1"
            >
              {isAnalyzing ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  解析中...
                </>
              ) : (
                `${selectedImages.length}枚の画像を解析して自動入力`
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isAnalyzing}
              className="btn btn-ghost btn-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error mt-4">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}