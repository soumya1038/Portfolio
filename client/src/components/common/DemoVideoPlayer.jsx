import { useRef, useState } from 'react';
import { FiPlay, FiMaximize2, FiExternalLink } from 'react-icons/fi';
import { parseVideoLink } from '../../utils/videoLinks';

function DemoVideoPlayer({ videoUrl, title = 'Demo video', heightClass = 'h-56 md:h-64', showHelper = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const playerRef = useRef(null);

  if (!videoUrl) return null;

  const videoMeta = parseVideoLink(videoUrl);

  if (videoMeta.type === 'unknown') {
    return (
      <div className="demo-video-fallback rounded-2xl border border-dashed border-line p-4 text-sm shadow-soft">
        <p className="demo-video-fallback__title font-semibold mb-2">Demo Video</p>
        <p className="demo-video-fallback__desc">Inline preview supports Google Drive and YouTube links.</p>
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 mt-3"
          >
            <FiExternalLink className="h-4 w-4" />
            Open Demo Video
          </a>
        )}
      </div>
    );
  }

  const previewUrl = videoMeta.embedUrl;
  const thumbnailUrl = videoMeta.thumbnailUrl;

  const handleFullscreen = () => {
    if (!playerRef.current?.requestFullscreen) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      playerRef.current.requestFullscreen();
    }
  };

  const wrapperClass = showHelper ? 'space-y-3' : 'h-full';
  const frameClass = `demo-video-frame relative overflow-hidden rounded-2xl border shadow-soft ${showHelper ? '' : 'h-full'}`;

  return (
    <div className={wrapperClass}>
      <div
        ref={playerRef}
        className={frameClass}
      >
        {isPlaying ? (
          <div className="relative w-full pb-[56.25%]">
            <iframe
              src={previewUrl}
              title={title}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
            />
            <button
              type="button"
              onClick={handleFullscreen}
              className="demo-video-action absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-soft"
            >
              <FiMaximize2 className="h-4 w-4" />
              Full screen
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className={`group block w-full ${showHelper ? '' : 'h-full'} text-left`}
            aria-label={`Play ${title}`}
          >
            <div className={`relative ${showHelper ? '' : 'h-full'}`}>
              {thumbError ? (
                <div className={`demo-video-thumb-fallback w-full ${showHelper ? heightClass : 'h-full'} flex items-center justify-center`}>
                  <span className="demo-video-thumb-fallback__text font-semibold">Demo preview unavailable</span>
                </div>
              ) : (
                <img
                  src={thumbnailUrl}
                  alt={`${title} preview`}
                  className={`w-full ${showHelper ? heightClass : 'h-full'} object-cover group-hover:scale-105 transition-transform duration-500`}
                  loading="lazy"
                  onError={() => setThumbError(true)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="demo-video-cta inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow-soft ring-1 backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.02]">
                  <FiPlay className="h-4 w-4" />
                  Play Demo
                </span>
              </div>
            </div>
          </button>
        )}
      </div>

      {showHelper && (
        <p className="demo-video-helper text-xs">
          If the thumbnail does not appear, confirm the Drive link is public or the YouTube video is available.
        </p>
      )}
    </div>
  );
}

export default DemoVideoPlayer;
