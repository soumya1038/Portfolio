import { useEffect, useRef, useState } from 'react';
import { FiX, FiImage, FiFileText, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { isPdfAsset } from '../../utils/media';

function ImageUploader({ value, onChange, label = 'Image', allowPdf = false }) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(value || '');
    if (!value && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [value]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = allowPdf && file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      toast.error(allowPdf ? 'Please select an image or PDF file' : 'Please select an image file');
      return;
    }

    const sizeLimit = isPdf ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > sizeLimit) {
      toast.error(isPdf ? 'PDF size must be less than 15MB' : 'Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for deferred upload
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onChange(base64);
      toast.success(isPdf ? 'PDF ready. Save to upload.' : 'Image ready. Save to upload.');
    } catch (error) {
      toast.error(error.message || 'Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isPdfPreview = isPdfAsset(preview);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {preview ? (
        <div className="relative inline-block">
          {allowPdf && isPdfPreview ? (
            <div className="w-32 h-32 rounded-2xl border border-line shadow-soft bg-white/80 p-3 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <FiFileText className="h-7 w-7 text-primary-600" />
                <span className="text-xs font-semibold text-gray-700">PDF</span>
              </div>
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary-700 font-semibold"
              >
                <FiExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-2xl border border-line shadow-soft"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-32 h-32 border-2 border-dashed border-line rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors ${
            isUploading ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          ) : (
            <>
              <FiImage className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">{allowPdf ? 'Image or PDF' : 'Image'}</span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={allowPdf ? 'image/*,application/pdf' : 'image/*'}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* URL Input Alternative */}
      <div className="mt-3">
        <input
          type="url"
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={allowPdf ? 'Or paste image/PDF URL' : 'Or paste image URL'}
          className="input-field text-sm"
        />
      </div>
    </div>
  );
}

export default ImageUploader;
